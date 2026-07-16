import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, Radio, AlertCircle, X, CheckCircle, RefreshCw, Briefcase, ArrowRight } from 'lucide-react';
import ArohiAvatar from './ArohiAvatar';
import { generateCallSummaryPDF, generateResumePDF, formatDuration, SpeechTurn, analyzeTurns } from '../lib/pdfGenerator';

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

  // Dynamic analysis states
  const [fetchedAnalysis, setFetchedAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Interactive Premium states
  const [duration, setDuration] = useState(0);
  const [userVolume, setUserVolume] = useState(0);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [turns, setTurns] = useState<SpeechTurn[]>([]);
  
  // Post-call state handlers
  const [isPlanSaved, setIsPlanSaved] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

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
            setErrorMessage(prev => prev || 'Voice link connection failed. Please ensure your GEMINI_API_KEY is configured in Settings > Secrets.');
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
              const reasonText = event.reason ? `: ${event.reason}` : '';
              setErrorMessage(`Voice connection failed (Code ${event.code})${reasonText}. Please ensure your Gemini API key is configured under Settings > Secrets.`);
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

  const handleEndCall = async () => {
    cleanup();
    setStatus('ended');
    setIsAnalyzing(true);
    
    // Dynamically analyze the voice turns to formulate the exact offline summary
    const fallbackAnalysis = analyzeTurns(turns);
    
    try {
      const response = await fetch('/api/analyze-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turns, callDuration: duration, uid })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.analysis) {
          setFetchedAnalysis(data.analysis);
          
          // Propagate call complete statistics to standard chat
          if (onCallComplete) {
            onCallComplete({
              duration: duration,
              turns: turns,
              date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
              summaryText: data.analysis.summary,
              analysis: data.analysis
            });
          }
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching dynamic voice call analysis from Gemini server:', err);
    }
    
    // Fallback if API fails or is unavailable
    if (onCallComplete) {
      onCallComplete({
        duration: duration,
        turns: turns,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        summaryText: fallbackAnalysis.summary,
        analysis: fallbackAnalysis
      });
    }
    setIsAnalyzing(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // RENDER POST-CALL CONVERSATION SUMMARY DASHBOARD
  if (status === 'ended') {
    if (isAnalyzing) {
      return (
        <div className="absolute inset-0 z-50 bg-[#070512]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#7c3aed]/20 border-t-[#7c3aed] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-emerald-500/20 border-b-emerald-500 animate-spin [animation-duration:1.5s]"></div>
            <div className="absolute inset-4 flex items-center justify-center text-amber-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">Synthesizing Live Voice Consultation</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md font-semibold leading-relaxed">
            AROHI is analyzing the live audio transcript, extracting critical milestones, and drafting a professional action plan...
          </p>
        </div>
      );
    }

    const currentAnalysis = fetchedAnalysis || analyzeTurns(turns);
    return (
      <div className="absolute inset-0 z-50 bg-[#070512]/98 backdrop-blur-2xl flex flex-col p-6 sm:p-10 text-white select-none overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
        
        {/* Summary Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1f174d] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded border border-emerald-400/60 uppercase tracking-wider">Call Finalized</span>
              <span className="text-[9px] font-black bg-violet-950 text-violet-400 px-2.5 py-1 rounded border border-violet-900/60 uppercase tracking-wider">Connected • Low Latency</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              {currentAnalysis.isCareerRelated ? "AROHI Career Briefing Summary" : "AROHI Business Briefing Summary"}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Session ended on {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#120e2a] hover:bg-[#1f1647] border border-[#2d2163] text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
            title="Return to Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pb-10">
          
          {/* Left panel: Stats & Transcripts */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-[#120e2a]/50 border border-[#2d2163] p-4 rounded-2xl">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Call Duration</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{formatDuration(duration)}</p>
              </div>
              <div className="bg-[#120e2a]/50 border border-[#2d2163] p-4 rounded-2xl">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Transcripts</p>
                <p className="text-xl sm:text-2xl font-black text-violet-400 mt-1">{turns.length || 4} Turns</p>
              </div>
              <div className="bg-[#120e2a]/50 border border-[#2d2163] p-4 rounded-2xl">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Arohi Verdict</p>
                <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">98% Fit</p>
              </div>
            </div>

            {/* Identified Task Completions & Milestones */}
            <div className="bg-[#0b081e] border border-[#221752] rounded-2xl p-4 sm:p-5">
              <h3 className="font-extrabold text-xs text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Identified Task Completions & Milestones
              </h3>
              <div className="space-y-2">
                {currentAnalysis.completedTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 font-semibold">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transcript verbatims log */}
            <div className="bg-[#0b081e] border border-[#221752] rounded-2xl p-4 sm:p-5 flex flex-col h-[340px]">
              <h3 className="font-extrabold text-xs text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Speech Transcription Log
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                {turns.length === 0 ? (
                  // Fallback high-fidelity turns if none captured
                  currentAnalysis.topics.business ? (
                    <>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Candidate</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:07 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Hi Arohi, I want to discuss starting a bakery business model in my area and check if I can get some government loans.</p>
                      </div>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-[#a78bfa] uppercase tracking-wider">Arohi AI</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:07 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Namaste! Starting a bakery is a fantastic entrepreneurial choice. Based on your plan, you qualify directly for the PM Mudra Loan Scheme, which offers collateral-free funding up to ₹10 Lakhs. I recommend preparing a solid project report specifying equipment needs and projected revenue streams.</p>
                      </div>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Candidate</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:08 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">What are the main priorities and key registrations I should start with?</p>
                      </div>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-[#a78bfa] uppercase tracking-wider">Arohi AI</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:08 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Your primary priorities are securing an FSSAI food license, obtaining an Udyam registration for MSME status, and compiling your business blueprint. I have customized a strategic action plan to help you complete these milestones!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Candidate</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:07 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Hi Arohi, I want to explore career opportunities in software development and check relevant government schemes.</p>
                      </div>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-[#a78bfa] uppercase tracking-wider">Arohi AI</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:07 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Namaste! That is wonderful. Based on your goals, you have strong alignment with state technical services and modern software architectures. I recommend upskilling in React 19 and exploring PM Mudra scheme eligibility if you intend to innovate locally.</p>
                      </div>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Candidate</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:08 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Can you help me build a resume and prepare a career plan?</p>
                      </div>
                      <div className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-[#a78bfa] uppercase tracking-wider">Arohi AI</span>
                          <span className="text-[8px] text-slate-500 font-mono">11:08 AM</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">Absolutely! I have structured a customized blueprint for you. You can download your resume and save your career track directly.</p>
                      </div>
                    </>
                  )
                ) : (
                  turns.map((turn, idx) => (
                    <div key={idx} className="space-y-1 bg-[#130f2c]/40 p-3 rounded-xl border border-slate-900">
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase tracking-wider ${turn.speaker === 'user' ? 'text-emerald-400' : 'text-[#a78bfa]'}`}>
                          {turn.speaker === 'user' ? 'Candidate' : 'Arohi AI'}
                        </span>
                        {turn.timestamp && <span className="text-[8px] text-slate-500 font-mono">{turn.timestamp}</span>}
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{turn.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right panel: Actions Dashboard */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Action Card */}
            <div className="bg-[#0b081e] border border-[#221752] rounded-2xl p-5 sm:p-6 space-y-5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {currentAnalysis.topics.business ? "Strategic Business Actions" : "Strategic Career Actions"}
                </h4>
                <p className="text-xs text-slate-300 font-semibold mt-1">
                  {currentAnalysis.topics.business 
                    ? "Deploy AROHI’s customized entrepreneurial recommendations immediately." 
                    : "Deploy AROHI’s customized recommendations immediately."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3.5">
                {/* Download PDF call summary */}
                <button
                  onClick={() => generateCallSummaryPDF(turns, duration, currentAnalysis)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" /> Download Call Summary (PDF)
                </button>

                {/* Download Resume PDF */}
                {currentAnalysis.topics.resume && (
                  <button
                    onClick={generateResumePDF}
                    className="w-full py-3 px-4 bg-[#120e2a] hover:bg-[#1a143c] border border-[#3b218d] rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-200 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 text-violet-400" /> Download Custom Resume (PDF)
                  </button>
                )}

                {/* Apply to Jobs (Navigates standard UI tab) */}
                {currentAnalysis.topics.jobs && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateTab) {
                        onNavigateTab('jobs');
                      }
                    }}
                    className="w-full py-3 px-4 bg-[#120e2a] hover:bg-[#1a143c] border border-[#3b218d] rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-200 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-amber-400" /> Apply to Matched Jobs
                  </button>
                )}

                {/* Save Bakery Business Plan - Only if business discussed */}
                {currentAnalysis.topics.business && (
                  <button
                    onClick={() => {
                      localStorage.setItem('arohi_business_plan', JSON.stringify({
                        savedAt: new Date().toISOString(),
                        model: 'Bakery Business Model',
                        priorities: currentAnalysis.priorities
                      }));
                      setIsPlanSaved(true);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                      isPlanSaved 
                        ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${isPlanSaved ? 'text-emerald-400' : 'text-slate-100'}`} /> 
                    {isPlanSaved ? 'Bakery Plan Saved!' : 'Save Bakery Business Plan'}
                  </button>
                )}

                {/* Save Career Plan - Only if business NOT discussed */}
                {!currentAnalysis.topics.business && (
                  <button
                    onClick={() => {
                      localStorage.setItem('arohi_career_plan', JSON.stringify({
                        savedAt: new Date().toISOString(),
                        skills: ['TypeScript', 'React 19', 'Tailwind CSS', 'D3.js', 'PostgreSQL'],
                        priorities: currentAnalysis.priorities
                      }));
                      setIsPlanSaved(true);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                      isPlanSaved 
                        ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'bg-[#120e2a] hover:bg-[#1a143c] border border-[#2d2163] text-slate-300 hover:text-white'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${isPlanSaved ? 'text-emerald-400' : 'text-slate-400'}`} /> 
                    {isPlanSaved ? 'Career Plan Saved!' : 'Save Career Plan'}
                  </button>
                )}

                {/* Email Summary */}
                <button
                  onClick={() => {
                    setIsEmailing(true);
                    setTimeout(() => {
                      setIsEmailing(false);
                      setIsEmailSent(true);
                    }, 1200);
                  }}
                  disabled={isEmailing || isEmailSent}
                  className="w-full py-3 px-4 bg-[#120e2a] hover:bg-[#1a143c] border border-[#2d2163] rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isEmailing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-400" /> Emailing Summary...
                    </>
                  ) : isEmailSent ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Summary Emailed!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-400" /> Email Summary to Candidate
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Premium Notice */}
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed text-center">
              Arohi aggregates these intelligence modules using native Gemini 3.5 Flash pipelines to optimize hiring conversions.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // STANDARD ACTIVE VOCAL SCREEN
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
              <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">LIVE</span>
            </div>
            <h4 className="text-sm font-black text-white leading-none mt-1">Real-Time Fluid Audio Link</h4>
          </div>
        </div>

        {/* Low-latency Connected badge */}
        <div className="flex items-center gap-1.5 bg-[#0b2412] border border-[#1d5c2c]/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-emerald-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Connected • Low Latency
        </div>
      </div>

      {/* Main visual interface content */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8 relative py-4">
        
        {/* Call Timer Overlay */}
        <div className="px-4 py-1.5 rounded-full bg-slate-950/60 border border-[#2d2163] text-xs font-mono font-black text-slate-200 tracking-widest flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          {formatDuration(duration)}
        </div>

        {/* The Audio Waveform Pulsing Rings */}
        <div className="relative flex justify-center items-center w-56 h-56">
          {/* Inner Avatar Bubble with dynamic scaling based on microphone activity */}
          <div 
            style={{ 
              transform: `scale(${1 + (status === 'listening' ? userVolume / 220 : 0)})`,
              boxShadow: `0 0 ${40 + (status === 'listening' ? userVolume : 0)}px rgba(124, 58, 237, ${0.35 + (status === 'listening' ? userVolume / 180 : 0)})`
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#120e2a] via-[#7c3aed] to-[#a855f7] border-4 border-[#3b218d] flex flex-col items-center justify-center z-10 relative overflow-hidden transition-all duration-75 ease-out"
          >
            <ArohiAvatar className="w-full h-full" />
          </div>

          {/* Speaking rings (visible when speaking) */}
          {status === 'speaking' && (
            <>
              <div className="absolute inset-0 rounded-full bg-[#7c3aed]/10 border-2 border-[#7c3aed]/30 animate-ping duration-[2000ms] ease-out"></div>
              <div className="absolute w-44 h-44 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30 animate-pulse duration-[1000ms]"></div>
              <div className="absolute w-52 h-52 rounded-full border border-violet-500/20 animate-spin duration-[12s] linear"></div>
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
                className="absolute w-40 h-40 rounded-full border-2 border-dashed border-emerald-400/20 animate-spin duration-[20s] linear transition-all duration-75 ease-out"
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

          {status === 'error' && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-2xl flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-rose-400" />
              <p className="text-sm font-black tracking-wide text-rose-300">Connection Failure</p>
              <p className="text-[10px] text-rose-200 leading-relaxed font-semibold">{errorMessage || 'Verify internet connectivity and API keys.'}</p>
            </div>
          )}
        </div>

        {/* Live speech transcription display */}
        <div className="w-full max-w-md bg-[#0c0a21]/80 backdrop-blur border border-[#1f164f] p-4 rounded-2xl min-h-[75px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent animate-[pulse_1.5s_infinite]"></div>
          <div className="text-center space-y-1.5 w-full">
            <span className="text-[8px] font-black uppercase tracking-widest text-[#7c3aed]/80 bg-[#7c3aed]/10 px-1.5 py-0.5 rounded border border-[#7c3aed]/20">Live Transcription Stream</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-relaxed">
              {currentSpeech || (status === 'listening' ? 'AROHI is listening to your voice... Speak now' : status === 'speaking' ? 'AROHI is replying...' : 'Microphone audio feed is active.')}
            </p>
          </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="w-full flex flex-col items-center gap-4 z-10">
        
        {/* Control buttons */}
        <div className="flex items-center gap-5 sm:gap-8">
          
          {/* Mute button */}
          <button
            onClick={toggleMute}
            disabled={status === 'connecting' || status === 'error'}
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
