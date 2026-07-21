import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Radio, AlertCircle, X } from 'lucide-react';
import ArohiAvatar from './ArohiAvatar';
import { formatDuration, SpeechTurn } from '../lib/pdfGenerator';

interface ArohiVoiceCallProps {
  onClose: () => void;
  language?: string;
  onNavigateTab?: (tab: string) => void;
  uid?: string;
  onCallComplete?: (summary: {
    duration: number;
    turns: SpeechTurn[];
    date: string;
    summaryText: string;
    analysis?: any;
  }) => void;
}

export default function ArohiVoiceCall({ onClose, language = 'en', onNavigateTab, uid, onCallComplete }: ArohiVoiceCallProps) {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'muted' | 'error' | 'ended'>('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice] = useState<'Zephyr'>('Zephyr');

  // Interactive Premium states
  const [duration, setDuration] = useState(0);
  const [userVolume, setUserVolume] = useState(0);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [turns, setTurns] = useState<SpeechTurn[]>([]);

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
  const isNormalCloseRef = useRef<boolean>(false);

  // Sync mute state to ref
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      setStatus(prev => prev === 'listening' ? 'muted' : prev);
    } else {
      setStatus(prev => prev === 'muted' ? 'listening' : prev);
    }
  }, [isMuted]);

  // Handle call duration timer
  useEffect(() => {
    let timer: any = null;
    if (status === 'listening' || status === 'speaking' || status === 'muted') {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (status === 'connecting') {
      setDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

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

      // Convert 16-bit PCM to Float32 array for AudioBuffer
      const numSamples = bytes.length / 2;
      const float32Data = new Float32Array(numSamples);
      const dataView = new DataView(bytes.buffer);

      for (let i = 0; i < numSamples; i++) {
        const pcm16 = dataView.getInt16(i * 2, true);
        float32Data[i] = pcm16 / 32768;
      }

      // Create Buffer
      const audioBuffer = ctx.createBuffer(1, numSamples, 24000); // Model audio is natively 24kHz
      audioBuffer.getChannelData(0).set(float32Data);

      // Create BufferSourceNode
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Calculate execution start time
      const currentTime = ctx.currentTime;
      let startTime = nextStartTimeRef.current;

      if (startTime < currentTime) {
        // Queue was empty or lagged, reset schedule to play immediately
        startTime = currentTime + 0.05; // Short safety pad for system audio thread wakeup
      }

      source.start(startTime);
      audioQueueRef.current.push(source);

      // Advance next start time
      nextStartTimeRef.current = startTime + audioBuffer.duration;

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
    isNormalCloseRef.current = false;

    const startSession = async () => {
      try {
        setStatus('connecting');

        // 1. Establish the secure full-duplex WebSocket connection to our Express backend
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/live-ws?voice=${selectedVoice}${uid ? `&uid=${encodeURIComponent(uid)}` : ''}`;
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

            // Real-Time Transcript Streaming Handler
            if (data.transcript) {
              const text = data.transcript.trim();
              if (text) {
                // Set the current real-time speech fragment
                setCurrentSpeech(text);

                // Append to transcription log turns array
                setTurns(prev => {
                  const last = prev[prev.length - 1];
                  const currentSpeaker = data.speaker || 'arohi';
                  
                  if (last && last.speaker === currentSpeaker) {
                    return [
                      ...prev.slice(0, -1),
                      { 
                        speaker: currentSpeaker, 
                        text: (last.text + " " + text).replace(/\s+/g, " ").trim(),
                        timestamp: last.timestamp 
                      }
                    ];
                  } else {
                    return [
                      ...prev,
                      {
                        speaker: currentSpeaker,
                        text: text,
                        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                      }
                    ];
                  }
                });
              }
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (err) => {
          console.error('WebSocket error in live voice conversation:', err);
          if (active) {
            setErrorMessage('The live voice channel encountered an upgrade or protocol connection error. Please verify your internet connection and API key configuration, or close this panel and restart the call.');
            setStatus('error');
          }
        };

        ws.onclose = (event) => {
          console.log(`Voice call WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
          if (active) {
            // If we closed the socket intentionally, or if it closed cleanly (1000, 1001, 1005)
            if (isNormalCloseRef.current || event.code === 1000 || event.code === 1001 || event.code === 1005) {
              if (status !== 'error') {
                setStatus('ended');
              }
            } else {
              const reasonMsg = event.reason ? `: ${event.reason}` : '';
              setErrorMessage(`The live voice link disconnected${reasonMsg}. Please verify your API Key in Settings > Secrets or restart the call.`);
              setStatus('error');
            }
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
          
          // Calculate microphone volume levels for dynamic UX effects
          let sum = 0;
          for (let i = 0; i < float32Data.length; i++) {
            sum += float32Data[i] * float32Data[i];
          }
          const rms = Math.sqrt(sum / float32Data.length);
          const vol = Math.min(100, Math.floor(rms * 450));
          setUserVolume(vol);

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
    isNormalCloseRef.current = true;
    // 1. Close WebSocket
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
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
    if (onCallComplete) {
      onCallComplete({
        duration: duration,
        turns: turns,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        summaryText: ''
      });
    }
    onClose();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // RENDER POST-CALL CONVERSATION SUMMARY DASHBOARD (DISABLED)
  if (status === 'ended') {
    return null;
  }

  // STANDARD ACTIVE VOCAL SCREEN
  return (
    <div className="absolute inset-0 z-50 bg-[#070512]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-10 text-white select-none animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Header bar */}
      <div className="flex justify-between items-center w-full z-10 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-tr from-[#7c3aed] to-[#3b218d] p-1.5 sm:p-2 rounded-xl border border-[#7c3aed]/40 flex items-center justify-center shadow-lg">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase text-slate-400">AROHI LIVE VOICE</span>
              <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 text-[7px] sm:text-[8px] font-black px-1 py-0.2 rounded uppercase tracking-widest">LIVE</span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-white leading-none mt-0.5 sm:mt-1">Real-Time Fluid Audio Link</h4>
          </div>
        </div>

        {/* Low-latency Connected badge */}
        <div className="flex items-center gap-1 bg-[#0b2412] border border-[#1d5c2c]/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[8px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-wider shrink-0">
          <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Connected • Low Latency
        </div>
      </div>

      {/* Main visual interface content */}
      <div className="flex-1 flex flex-col justify-center items-center gap-4 sm:gap-8 relative py-2 sm:py-4">
        
        {/* Call Timer Overlay */}
        <div className="px-3 py-1 rounded-full bg-slate-950/60 border border-[#2d2163] text-[10px] sm:text-xs font-mono font-black text-slate-200 tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          {formatDuration(duration)}
        </div>

        {/* The Audio Waveform Pulsing Rings */}
        <div className="relative flex justify-center items-center w-36 h-36 xs:w-44 xs:h-44 sm:w-56 sm:h-56">
          {/* Inner Avatar Bubble with dynamic scaling based on microphone activity */}
          <div 
            style={{ 
              transform: `scale(${1 + (status === 'listening' ? userVolume / 220 : 0)})`,
              boxShadow: `0 0 ${30 + (status === 'listening' ? userVolume : 0)}px rgba(124, 58, 237, ${0.35 + (status === 'listening' ? userVolume / 180 : 0)})`
            }}
            className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#120e2a] via-[#7c3aed] to-[#a855f7] border-4 border-[#3b218d] flex flex-col items-center justify-center z-10 relative overflow-hidden transition-all duration-75 ease-out"
          >
            <ArohiAvatar className="w-full h-full" />
          </div>

          {/* Speaking rings (visible when speaking) */}
          {status === 'speaking' && (
            <>
              <div className="absolute inset-0 rounded-full bg-[#7c3aed]/10 border-2 border-[#7c3aed]/30 animate-ping duration-[2000ms] ease-out"></div>
              <div className="absolute inset-2 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 animate-pulse duration-[1000ms]"></div>
              <div className="absolute inset-1 rounded-full border border-violet-500/20 animate-spin duration-[12s] linear"></div>
            </>
          )}

          {/* Listening rings (visible when user is expected to talk, dynamically scaled by volume) */}
          {status === 'listening' && (
            <>
              <div 
                style={{ transform: `scale(${1 + userVolume / 100})`, opacity: 0.15 + userVolume / 150 }}
                className="absolute inset-0 rounded-full bg-emerald-500/5 border border-emerald-500/25 transition-all duration-75 ease-out"
              ></div>
              <div 
                style={{ transform: `scale(${1 + userVolume / 140})` }}
                className="absolute inset-2 rounded-full border-2 border-dashed border-emerald-400/20 animate-spin duration-[20s] linear transition-all duration-75 ease-out"
              ></div>
              {userVolume > 12 && (
                <div 
                  style={{ transform: `scale(${1 + userVolume / 75})`, opacity: userVolume / 100 }}
                  className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping duration-1000"
                ></div>
              )}
            </>
          )}

          {/* Connecting rings */}
          {status === 'connecting' && (
            <div className="absolute inset-0 rounded-full border-2 border-t-[#7c3aed] border-r-transparent border-b-[#a855f7] border-l-transparent animate-spin duration-[1500ms]"></div>
          )}
        </div>

        {/* Call Status Caption */}
        <div className="text-center max-w-xs sm:max-w-sm space-y-1 sm:space-y-2">
          {status === 'connecting' && (
            <div>
              <p className="text-sm sm:text-lg font-black tracking-wide text-violet-300 animate-pulse">Initializing Channel...</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5 sm:mt-1">Configuring secure bidirectional voice codec pipelines</p>
            </div>
          )}

          {status === 'listening' && (
            <div>
              <p className="text-sm sm:text-lg font-black tracking-wide text-emerald-400">AROHI is Listening...</p>
              <p className="text-[10px] sm:text-xs text-slate-300 font-bold mt-0.5 sm:mt-1">Speak in English, Hindi, Odia, and 150+ languages</p>
            </div>
          )}

          {status === 'speaking' && (
            <div>
              <p className="text-sm sm:text-lg font-black tracking-wide text-[#c084fc] animate-pulse">AROHI is Speaking</p>
              <p className="text-[10px] sm:text-xs text-slate-300 font-bold mt-0.5 sm:mt-1">Listen to live insights and assistance</p>
            </div>
          )}

          {status === 'muted' && (
            <div>
              <p className="text-sm sm:text-lg font-black tracking-wide text-rose-400">Microphone Muted</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5 sm:mt-1">Tap Unmute to continue speaking with Arohi</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-1.5 sm:gap-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
              <p className="text-xs sm:text-sm font-black tracking-wide text-rose-300">Connection Failure</p>
              <p className="text-[9px] sm:text-[10px] text-rose-200 leading-relaxed font-semibold">{errorMessage || 'Verify internet connectivity and API keys.'}</p>
            </div>
          )}
        </div>

        {/* Live speech transcription display */}
        <div className="w-full max-w-md bg-[#0c0a21]/80 backdrop-blur border border-[#1f164f] p-2.5 sm:p-4 rounded-2xl min-h-[60px] sm:min-h-[75px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent animate-[pulse_1.5s_infinite]"></div>
          <div className="text-center space-y-1 w-full">
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-[#7c3aed]/80 bg-[#7c3aed]/10 px-1.5 py-0.5 rounded border border-[#7c3aed]/20">Live Transcription Stream</span>
            <p className="text-[11px] sm:text-sm font-semibold text-slate-200 mt-1 leading-relaxed">
              {currentSpeech || (status === 'listening' ? 'AROHI is listening to your voice... Speak now' : status === 'speaking' ? 'AROHI is replying...' : 'Microphone audio feed is active.')}
            </p>
          </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="w-full flex flex-col items-center gap-2.5 sm:gap-4 z-10 shrink-0">
        
        {/* Control buttons */}
        <div className="flex items-center gap-4 sm:gap-8">
          
          {/* Mute button */}
          <button
            onClick={toggleMute}
            disabled={status === 'connecting' || status === 'error'}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md active:scale-90 ${
              isMuted 
                ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'bg-[#120e2a] border-[#2d2163] text-slate-200 hover:text-white hover:bg-[#1e1742]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Mic className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>

          {/* End Call button */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.45)] border border-red-500 cursor-pointer active:scale-90 hover:scale-105 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
          </button>

          {/* Toggle standard close modal */}
          <button
            onClick={onClose}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#120e2a] border border-[#2d2163] text-slate-300 hover:text-white hover:bg-[#1e1742] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Close voice panel"
          >
            <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>

        <p className="text-[9px] sm:text-[10px] text-slate-500 text-center font-semibold max-w-xs sm:max-w-none">
          Voice calls utilize high-fidelity 16kHz audio input and 24kHz outputs. Standard data rates may apply.
        </p>
      </div>

    </div>
  );
}
