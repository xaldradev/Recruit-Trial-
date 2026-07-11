import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, Radio, Settings, AlertCircle, X, ChevronDown } from 'lucide-react';

interface ArohiVoiceCallProps {
  onClose: () => void;
  language?: string;
}

export default function ArohiVoiceCall({ onClose, language = 'en' }: ArohiVoiceCallProps) {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'muted' | 'error' | 'ended'>('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir'>('Zephyr');
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);

  // Audio nodes and context refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  // Precise scheduling variables for gapless playback
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef<boolean>(false);

  // Sync mute state to ref
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      setStatus(prev => prev === 'listening' ? 'muted' : prev);
    } else {
      setStatus(prev => prev === 'muted' ? 'listening' : prev);
    }
  }, [isMuted]);

  // Convert Float32 array to 16-bit PCM little-endian
  const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Playback the incoming 24kHz raw audio chunk gaplessly
  const playAudioChunk = (base64Audio: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx) return;

    try {
      // Decode base64
      const binary = window.atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const buffer = bytes.buffer;

      // Convert 16-bit PCM to Float32
      const view = new DataView(buffer);
      const numSamples = buffer.byteLength / 2;
      const float32 = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        const intSample = view.getInt16(i * 2, true);
        float32[i] = intSample / 32768.0;
      }

      // Create AudioBuffer (24kHz, mono)
      const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
      audioBuffer.getChannelData(0).set(float32);

      // Create Buffer Source Node
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Schedule exact start time to prevent pops/clicks
      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + 0.05; // 50ms buffer
      }

      source.start(nextStartTimeRef.current);
      audioQueueRef.current.push(source);

      // Advance next start time
      nextStartTimeRef.current += audioBuffer.duration;

      // Automatically change status to speaking when audio is outputting
      setStatus('speaking');

      // Schedule resetting status to listening once the buffer finishes playing
      const durationMs = audioBuffer.duration * 1000;
      setTimeout(() => {
        // Only return to listening if we're not muted and there is no subsequent audio scheduled
        if (ctx.currentTime >= nextStartTimeRef.current - 0.05) {
          setStatus(isMutedRef.current ? 'muted' : 'listening');
        }
      }, durationMs);

    } catch (err) {
      console.error('Error decoding/playing model audio chunk:', err);
    }
  };

  // Interrupt and cancel any currently queued/playing audio
  const stopAllPlayback = () => {
    audioQueueRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    let active = true;

    const startSession = async () => {
      try {
        setStatus('connecting');

        // 1. Establish the secure full-duplex WebSocket connection to our Express backend
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/live-ws?voice=${selectedVoice}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Voice call WebSocket connected successfully.');
          if (active) {
            setStatus(isMutedRef.current ? 'muted' : 'listening');
          }
        };

        ws.onmessage = (event) => {
          if (!active) return;
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              setErrorMessage(data.error);
              setStatus('error');
              return;
            }
            if (data.audio) {
              playAudioChunk(data.audio);
            }
            if (data.interrupted) {
              console.log('AROHI response was interrupted. Stopping active playback queue.');
              stopAllPlayback();
              setStatus(isMutedRef.current ? 'muted' : 'listening');
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (err) => {
          console.error('WebSocket error in live voice conversation:', err);
          if (active) {
            setErrorMessage('Network connection lost. Please verify backend status.');
            setStatus('error');
          }
        };

        ws.onclose = () => {
          console.log('Voice call WebSocket connection closed.');
          if (active && status !== 'error') {
            setStatus('ended');
          }
        };

        // 2. Request user microphone and configure 16kHz capture AudioContext
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
        micStreamRef.current = stream;

        // Input sample context (forced to 16kHz per Gemini Live requirements)
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputCtx;

        // Output sample context (forced to 24kHz per Gemini output requirements)
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        outputAudioCtxRef.current = outputCtx;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (!active || isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;
          
          const float32Data = e.inputBuffer.getChannelData(0);
          
          // Detect simple voice input levels for UX visual effects
          const rawBuffer = floatTo16BitPCM(float32Data);
          const base64Pcm = arrayBufferToBase64(rawBuffer);

          ws.send(JSON.stringify({ audio: base64Pcm }));
        };

      } catch (err: any) {
        console.error('Error starting live voice session:', err);
        if (active) {
          setErrorMessage(err.message || 'Could not access microphone or configure sound channels.');
          setStatus('error');
        }
      }
    };

    startSession();

    return () => {
      active = false;
      cleanup();
    };
  }, [selectedVoice]);

  const cleanup = () => {
    // 1. Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // 2. Stop audio playback queues
    stopAllPlayback();

    // 3. Stop mic tracks
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    // 4. Disconnect ScriptProcessor
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (e) {}
      scriptProcessorRef.current = null;
    }

    // 5. Close audio contexts
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch (e) {}
      outputAudioCtxRef.current = null;
    }
  };

  const handleEndCall = () => {
    cleanup();
    setStatus('ended');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#070512]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 text-white select-none animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex justify-between items-center w-full z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-[#7c3aed] to-[#3b218d] p-2 rounded-xl border border-[#7c3aed]/40 flex items-center justify-center shadow-lg">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs tracking-wider uppercase text-slate-400">AROHI LIVE VOICE</span>
              <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">BETA</span>
            </div>
            <h4 className="text-sm font-black text-white leading-none mt-1">Real-Time Fluid Audio Link</h4>
          </div>
        </div>

        {/* Voice Selector Settings dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowVoiceSelect(!showVoiceSelect)}
            className="flex items-center gap-1.5 bg-[#120e2a] hover:bg-[#1f1945] border border-[#2d2163] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-violet-400" />
            <span>Voice: {selectedVoice}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showVoiceSelect && (
            <div className="absolute right-0 mt-2 w-40 bg-[#120e2a] border border-[#2d2163] rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="p-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2d2163] bg-[#090714]">Select Pitch</p>
              {(['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'] as const).map((voice) => (
                <button
                  key={voice}
                  onClick={() => {
                    setSelectedVoice(voice);
                    setShowVoiceSelect(false);
                    stopAllPlayback();
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors cursor-pointer flex justify-between items-center ${
                    selectedVoice === voice 
                      ? 'bg-[#7c3aed] text-white' 
                      : 'text-slate-300 hover:bg-[#1c1445]'
                  }`}
                >
                  <span>{voice}</span>
                  {voice === 'Zephyr' && <span className="text-[9px] opacity-80">(Recommended)</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main visual interface content */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8 relative py-4">
        
        {/* The Audio Waveform Pulsing Rings */}
        <div className="relative flex justify-center items-center w-56 h-56">
          {/* Inner Avatar Bubble */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#120e2a] via-[#7c3aed] to-[#a855f7] border-4 border-[#3b218d] shadow-[0_0_50px_rgba(124,58,237,0.4)] flex flex-col items-center justify-center z-10 relative overflow-hidden transition-all duration-300">
            <span className="text-4xl select-none animate-bounce duration-1000">👩</span>
            <span className="text-[10px] font-black tracking-widest uppercase mt-2 text-white/95">AROHI</span>
          </div>

          {/* Speaking rings (visible when speaking) */}
          {status === 'speaking' && (
            <>
              <div className="absolute inset-0 rounded-full bg-[#7c3aed]/10 border-2 border-[#7c3aed]/30 animate-ping duration-[2000ms] ease-out"></div>
              <div className="absolute w-44 h-44 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 animate-pulse duration-[1000ms]"></div>
              <div className="absolute w-52 h-52 rounded-full border border-violet-500/20 animate-spin duration-[12s] linear"></div>
            </>
          )}

          {/* Listening rings (visible when user is expected to talk) */}
          {status === 'listening' && (
            <>
              <div className="absolute inset-0 rounded-full bg-emerald-500/5 border border-emerald-500/20 animate-pulse duration-[2500ms]"></div>
              <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-emerald-400/20 animate-spin duration-[20s] linear"></div>
            </>
          )}

          {/* Connecting rings */}
          {status === 'connecting' && (
            <div className="absolute inset-0 rounded-full border-2 border-t-[#7c3aed] border-r-transparent border-b-[#a855f7] border-l-transparent animate-spin duration-[1500ms]"></div>
          )}
        </div>

        {/* Call Status Caption */}
        <div className="text-center max-w-sm space-y-2">
          {status === 'connecting' && (
            <div>
              <p className="text-lg font-black tracking-wide text-violet-300 animate-pulse">Initializing Channel...</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Configuring secure bidirectional voice codec pipelines</p>
            </div>
          )}

          {status === 'listening' && (
            <div>
              <p className="text-lg font-black tracking-wide text-emerald-400">AROHI is Listening...</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Speak in Hindi, English, Odia, or Hinglish</p>
            </div>
          )}

          {status === 'speaking' && (
            <div>
              <p className="text-lg font-black tracking-wide text-[#c084fc] animate-pulse">AROHI is Speaking</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Listen to live insights and assistance</p>
            </div>
          )}

          {status === 'muted' && (
            <div>
              <p className="text-lg font-black tracking-wide text-rose-400">Microphone Muted</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Tap Unmute to continue speaking with Arohi</p>
            </div>
          )}

          {status === 'ended' && (
            <div>
              <p className="text-lg font-black tracking-wide text-slate-400">Call Completed</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Standard chat session is still active</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-2xl flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-rose-400" />
              <p className="text-sm font-black tracking-wide text-rose-300">Connection Failure</p>
              <p className="text-[10px] text-rose-200 leading-relaxed font-semibold">{errorMessage || 'Verify internet connectivity and API keys.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="w-full flex flex-col items-center gap-4 z-10">
        
        {/* Control buttons */}
        <div className="flex items-center gap-5 sm:gap-8">
          
          {/* Mute button */}
          <button
            onClick={toggleMute}
            disabled={status === 'connecting' || status === 'error' || status === 'ended'}
            className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md active:scale-90 ${
              isMuted 
                ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'bg-[#120e2a] border-[#2d2163] text-slate-200 hover:text-white hover:bg-[#1e1742]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.45)] border border-red-500 cursor-pointer active:scale-90 hover:scale-105 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Toggle standard close modal */}
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-[#120e2a] border border-[#2d2163] text-slate-300 hover:text-white hover:bg-[#1e1742] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Close voice panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-slate-500 text-center font-semibold">
          Voice calls utilize high-fidelity 16kHz audio input and 24kHz outputs. Standard data rates may apply.
        </p>
      </div>

    </div>
  );
}
