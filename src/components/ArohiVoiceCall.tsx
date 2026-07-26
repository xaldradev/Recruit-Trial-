import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Radio, AlertCircle, X, MessageSquare, Maximize2, Minimize2, Copy, Check, Sparkles, User, Bot, Volume2, Bookmark, History, Download, Trash2, Save, Send } from 'lucide-react';
import ArohiAvatar from './ArohiAvatar';
import { formatDuration, SpeechTurn } from '../lib/pdfGenerator';

interface SavedSnapshot {
  id: string;
  timestamp: string;
  title: string;
  text: string;
  turnsCount: number;
}

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

  // Call duration & audio volume states
  const [duration, setDuration] = useState(0);
  const [userVolume, setUserVolume] = useState(0);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [textInput, setTextInput] = useState('');

  const DEFAULT_GREETING = "Namaste! Welcome to Arohi AI. I am Arohi, your AI Opportunity & Growth Guide. Whether you are a student, teacher, doctor, scientist, government aspirant, parent, entrepreneur, or running an MSME, organization, or enterprise—I am here to guide you in 150+ languages with voice calls. How can I empower you and fuel your journey today?";

  const [turns, setTurns] = useState<SpeechTurn[]>(() => [
    {
      speaker: 'arohi',
      text: DEFAULT_GREETING,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [liveUserSpeech, setLiveUserSpeech] = useState('');
  const [isExpandedTranscript, setIsExpandedTranscript] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  // Temporary Session History state
  const [savedSnapshots, setSavedSnapshots] = useState<SavedSnapshot[]>(() => {
    try {
      const stored = sessionStorage.getItem('arohi_session_history');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [copiedSnapshotId, setCopiedSnapshotId] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Sync savedSnapshots to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('arohi_session_history', JSON.stringify(savedSnapshots));
    } catch (e) {}
  }, [savedSnapshots]);

  // Audio nodes and context refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Handle continuous call duration timer
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Robust Browser Speech Recognition (Instant STT transcription as user speaks)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let isMounted = true;

    if (SpeechRecognition && (status as string) !== 'ended' && (status as string) !== 'error') {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Match chosen language
        const langMap: Record<string, string> = {
          hi: 'hi-IN',
          or: 'or-IN',
          bn: 'bn-IN',
          te: 'te-IN',
          ta: 'ta-IN',
          mr: 'mr-IN',
          gu: 'gu-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          pa: 'pa-IN',
          ur: 'ur-IN',
          en: 'en-IN'
        };
        recognition.lang = langMap[language] || 'en-IN';

        let silenceTimer: any = null;

        recognition.onresult = (event: any) => {
          if (!isMounted || isMutedRef.current) return;
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const activeText = (finalTranscript || interimTranscript).trim();
          if (activeText) {
            setLiveUserSpeech(activeText);

            if (silenceTimer) clearTimeout(silenceTimer);

            const textToCommit = (finalTranscript.trim() || activeText).trim();

            const commitUserTurn = (text: string) => {
              if (!text) return;
              setTurns(prev => {
                const last = prev[prev.length - 1];
                if (last && last.speaker === 'user') {
                  if (last.text === text || last.text.endsWith(text)) return prev;
                  if (text.startsWith(last.text)) {
                    return [
                      ...prev.slice(0, -1),
                      { speaker: 'user', text: text, timestamp: last.timestamp }
                    ];
                  }
                  const updated = (last.text + ' ' + text).replace(/\s+/g, ' ').trim();
                  return [
                    ...prev.slice(0, -1),
                    { speaker: 'user', text: updated, timestamp: last.timestamp }
                  ];
                } else {
                  return [
                    ...prev,
                    {
                      speaker: 'user',
                      text: text,
                      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    }
                  ];
                }
              });
            };

            if (finalTranscript.trim()) {
              commitUserTurn(finalTranscript.trim());
              setLiveUserSpeech('');
            } else {
              // Auto-commit interim transcript if user pauses for 1.2s
              silenceTimer = setTimeout(() => {
                if (isMounted && activeText) {
                  commitUserTurn(activeText);
                  setLiveUserSpeech('');
                }
              }, 1200);
            }
          }
        };

        recognition.onerror = (err: any) => {
          // Silent recovery on non-fatal speech errors
        };

        recognition.onend = () => {
          if (isMounted && speechRecognitionRef.current && !isMutedRef.current && (status as string) !== 'ended' && (status as string) !== 'error') {
            try { recognition.start(); } catch (e) {}
          }
        };

        try { recognition.start(); } catch (e) {}
        speechRecognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition notice:', err);
      }
    }

    return () => {
      isMounted = false;
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
        speechRecognitionRef.current = null;
      }
    };
  }, [language, status]);

  // Auto-scroll transcript log to bottom smoothly
  useEffect(() => {
    const scrollToBottom = () => {
      if (transcriptEndRef.current) {
        transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      if (transcriptContainerRef.current) {
        transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);

    return () => clearTimeout(timeoutId);
  }, [turns, currentSpeech, liveUserSpeech, isExpandedTranscript, status]);

  const handleCopyTranscript = () => {
    if (turns.length === 0) return;
    const fullText = turns.map(t => `[${t.timestamp}] ${t.speaker === 'user' ? 'You' : 'Arohi'}: ${t.text}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 2500);
  };

  // Save current conversation transcript snapshot
  const handleSaveSessionSnapshot = () => {
    if (turns.length === 0) {
      showToast('No speech transcript to save yet');
      return;
    }

    const fullText = turns.map(t => `[${t.timestamp}] ${t.speaker === 'user' ? 'You' : 'Arohi'}: ${t.text}`).join('\n\n');
    const newSnapshot: SavedSnapshot = {
      id: 'snap-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `Call Snapshot (${turns.length} turns)`,
      text: fullText,
      turnsCount: turns.length
    };

    setSavedSnapshots(prev => [newSnapshot, ...prev]);
    showToast('Saved snapshot to Session History!');
  };

  // Save individual turn
  const handleSaveTurnSnippet = (turn: SpeechTurn) => {
    const snippetText = `[${turn.timestamp}] ${turn.speaker === 'user' ? 'You' : 'Arohi'}: ${turn.text}`;
    const newSnapshot: SavedSnapshot = {
      id: 'turn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: turn.timestamp,
      title: `${turn.speaker === 'user' ? 'User Note' : 'Arohi Response'}`,
      text: snippetText,
      turnsCount: 1
    };

    setSavedSnapshots(prev => [newSnapshot, ...prev]);
    showToast(`Saved ${turn.speaker === 'user' ? 'your note' : "Arohi's response"} to history`);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSavedSnapshots(prev => prev.filter(s => s.id !== id));
    showToast('Removed item from history');
  };

  const handleCopySnapshotText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnapshotId(id);
    setTimeout(() => setCopiedSnapshotId(null), 2000);
  };

  // Convert Float32 array to 16-bit PCM
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

  // Play incoming audio chunks gaplessly
  const playAudioChunk = (base64Audio: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx) return;

    try {
      const binary = window.atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const numSamples = bytes.length / 2;
      const float32Data = new Float32Array(numSamples);
      const dataView = new DataView(bytes.buffer);

      for (let i = 0; i < numSamples; i++) {
        const pcm16 = dataView.getInt16(i * 2, true);
        float32Data[i] = pcm16 / 32768;
      }

      const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      let startTime = nextStartTimeRef.current;

      if (startTime < currentTime) {
        startTime = currentTime + 0.05;
      }

      source.start(startTime);
      audioQueueRef.current.push(source);

      nextStartTimeRef.current = startTime + audioBuffer.duration;
      setStatus('speaking');

      const durationMs = audioBuffer.duration * 1000;
      setTimeout(() => {
        if (ctx.currentTime >= nextStartTimeRef.current - 0.05) {
          setStatus(isMutedRef.current ? 'muted' : 'listening');
        }
      }, durationMs);

    } catch (err) {
      console.error('Error decoding/playing model audio chunk:', err);
    }
  };

  const stopAllPlayback = () => {
    audioQueueRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;
  };

  // Handle manual user text prompt inside voice call
  const handleSendTextPrompt = () => {
    if (!textInput.trim()) return;
    const msg = textInput.trim();

    // Append to turns as user speaker
    const newTurn: SpeechTurn = {
      speaker: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setTurns(prev => [...prev, newTurn]);

    // Send via WebSocket if open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ text: msg }));
      } catch (e) {
        console.error('Error sending text prompt over WebSocket:', e);
      }
    }
    setTextInput('');
  };

  useEffect(() => {
    let active = true;
    isNormalCloseRef.current = false;

    const startSession = async () => {
      try {
        setStatus('connecting');

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/live-ws?voice=${selectedVoice}&lang=${encodeURIComponent(language)}${uid ? `&uid=${encodeURIComponent(uid)}` : ''}`;
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
              stopAllPlayback();
              setStatus(isMutedRef.current ? 'muted' : 'listening');
            }

            // Real-Time Transcript Streaming Handler
            if (data.transcript) {
              const text = data.transcript.trim();
              if (text) {
                setCurrentSpeech(text);

                setTurns(prev => {
                  const last = prev[prev.length - 1];
                  const currentSpeaker = data.speaker || 'arohi';
                  
                  if (last && last.speaker === currentSpeaker) {
                    if (last.text === text || last.text.endsWith(text)) return prev;

                    if (text.startsWith(last.text)) {
                      return [
                        ...prev.slice(0, -1),
                        { speaker: currentSpeaker, text: text, timestamp: last.timestamp }
                      ];
                    }

                    if (last.text.startsWith(text)) return prev;

                    const updatedText = (last.text + " " + text).replace(/\s+/g, " ").trim();
                    return [
                      ...prev.slice(0, -1),
                      { 
                        speaker: currentSpeaker, 
                        text: updatedText,
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

        ws.onclose = (event) => {
          if (active) {
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

        // Microphones and Audio Context setup
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
        micStreamRef.current = stream;

        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputCtx;

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
          
          let sum = 0;
          for (let i = 0; i < float32Data.length; i++) {
            sum += float32Data[i] * float32Data[i];
          }
          const rms = Math.sqrt(sum / float32Data.length);
          const vol = Math.min(100, Math.floor(rms * 450));
          setUserVolume(vol);

          // Instant Client-side Barge-In: If user speaks into mic (vol > 16) while Arohi is playing audio, stop audio playback immediately so Arohi listens
          if (vol > 16 && audioQueueRef.current.length > 0) {
            stopAllPlayback();
            setStatus(isMutedRef.current ? 'muted' : 'listening');
          }

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
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }

    stopAllPlayback();

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (e) {}
      scriptProcessorRef.current = null;
    }

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

  if (status === 'ended') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#07060e] text-white flex flex-col justify-between p-3 sm:p-6 font-sans select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* Dynamic Atmospheric Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-700 opacity-25 ${
          status === 'speaking'
            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 scale-125'
            : status === 'listening' && userVolume > 10
            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 scale-110'
            : 'bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900'
        }`} />
      </div>

      {/* TOP HEADER BAR */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-4xl mx-auto pt-1 sm:pt-2 px-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-0.5 shadow-lg shadow-violet-500/20 flex items-center justify-center">
            <ArohiAvatar className="w-full h-full rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs tracking-wider uppercase text-white">AROHI LIVE</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Center Pill: Call Duration Timer */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-300 shadow-lg shadow-emerald-950/40">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{formatDuration(duration)}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSessionHistory(!showSessionHistory)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Session History"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">History</span>
            {savedSnapshots.length > 0 && (
              <span className="bg-cyan-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                {savedSnapshots.length}
              </span>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close voice panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* CENTER VISUALIZER ORB & STATUS */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center py-2">
        {/* Dynamic Gemini / ChatGPT Style Sound Orb with Radial Waveform Effect */}
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-48 sm:h-48 my-2">
          
          {/* Animated Glowing Outer Aura */}
          <div 
            style={{
              transform: `scale(${1 + (status === 'listening' ? userVolume / 180 : status === 'speaking' ? 0.15 : 0)})`,
              boxShadow: status === 'speaking'
                ? '0 0 60px rgba(168, 85, 247, 0.5), 0 0 100px rgba(124, 58, 237, 0.3)'
                : status === 'listening' && userVolume > 5
                ? `0 0 ${40 + userVolume}px rgba(16, 185, 129, 0.6), 0 0 80px rgba(6, 182, 212, 0.4)`
                : '0 0 30px rgba(139, 92, 246, 0.2)'
            }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 p-1 flex items-center justify-center z-10 relative transition-all duration-100 ease-out"
          >
            <div className="w-full h-full rounded-full bg-[#0a071a] p-1.5 flex items-center justify-center overflow-hidden">
              <ArohiAvatar className="w-full h-full rounded-full" />
            </div>
          </div>

          {/* Pulsing Concentric Rings */}
          {status === 'speaking' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/40 animate-ping duration-1000"></div>
              <div className="absolute -inset-4 rounded-full border border-fuchsia-500/20 animate-spin duration-[10s]"></div>
            </>
          )}

          {status === 'listening' && (
            <>
              <div 
                style={{ transform: `scale(${1 + userVolume / 100})`, opacity: 0.2 + userVolume / 200 }}
                className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-400/40 transition-all duration-75"
              />
              {userVolume > 10 && (
                <div 
                  style={{ transform: `scale(${1 + userVolume / 70})` }}
                  className="absolute -inset-4 rounded-full border border-cyan-400/40 animate-ping duration-700"
                />
              )}
            </>
          )}

          {status === 'connecting' && (
            <div className="absolute inset-0 rounded-full border-2 border-t-violet-400 border-r-transparent border-b-fuchsia-400 border-l-transparent animate-spin duration-700"></div>
          )}
        </div>

        {/* DYNAMIC ANIMATED AUDIO WAVEFORM VISUALIZATION */}
        <div className="w-full max-w-md sm:max-w-lg mx-auto my-3 flex flex-col items-center justify-center px-2">
          <div className="flex items-center justify-center gap-1 sm:gap-2 h-20 sm:h-24 px-4 sm:px-6 py-3 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 w-full">
            {[...Array(26)].map((_, i) => {
              // Calculate dynamic height for each bar based on userVolume, speaking state, and offset
              const centerMultiplier = 1 - Math.abs(i - 12.5) / 13; // Peak in middle
              const wavePhase = Math.sin((i * 0.5) + (Date.now() / 120)) * 0.5 + 0.5;
              
              let barHeight = 8; // default minimum resting height
              let barBgClass = 'bg-slate-700/60';

              if (status === 'listening') {
                if (userVolume > 3) {
                  // User is actively speaking into mic!
                  const volumeFactor = Math.min(1, userVolume / 60);
                  barHeight = Math.max(10, Math.min(68, (volumeFactor * 54 * centerMultiplier * (0.35 + wavePhase * 0.65)) + 10));
                  barBgClass = userVolume > 30 
                    ? 'bg-gradient-to-t from-cyan-500 via-emerald-400 to-teal-200 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                    : 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
                } else {
                  // Gentle idle pulse when waiting for speech
                  barHeight = 10 + (Math.sin((i * 0.4) + (Date.now() / 250)) * 5 + 5);
                  barBgClass = 'bg-emerald-500/50 shadow-[0_0_6px_rgba(16,185,129,0.3)]';
                }
              } else if (status === 'speaking') {
                // Arohi AI is speaking
                const modelPhase = Math.cos((i * 0.6) + (Date.now() / 100)) * 0.5 + 0.5;
                barHeight = 14 + (modelPhase * 48 * centerMultiplier);
                barBgClass = 'bg-gradient-to-t from-violet-600 via-fuchsia-500 to-pink-300 shadow-[0_0_10px_rgba(168,85,247,0.7)]';
              } else if (status === 'muted') {
                barHeight = 6;
                barBgClass = 'bg-rose-900/60';
              }

              return (
                <div
                  key={i}
                  style={{
                    height: `${barHeight}px`,
                    transition: status === 'listening' && userVolume > 3 ? 'height 60ms ease-out' : 'height 150ms ease-in-out'
                  }}
                  className={`w-1.5 sm:w-2.5 rounded-full transition-colors duration-150 ${barBgClass}`}
                />
              );
            })}
          </div>

          {/* Active Audio Detection Badge */}
          {status === 'listening' && (userVolume > 10 || liveUserSpeech.length > 0) && (
            <div className="mt-1.5 flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-cyan-950/50 animate-in fade-in duration-150">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Audio Input Detected ({userVolume}% Vol)</span>
            </div>
          )}
        </div>

        {/* Call Status Caption */}
        <div className="text-center mt-1 space-y-0.5">
          {status === 'connecting' && (
            <p className="text-xs sm:text-sm font-bold text-violet-300 animate-pulse">Connecting to Arohi Voice Link...</p>
          )}
          {status === 'listening' && (
            <div>
              <p className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
                <Volume2 className="w-4 h-4 animate-bounce" /> AROHI is Listening...
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Speak in English, Hindi, Odia, or 150+ languages</p>
            </div>
          )}
          {status === 'speaking' && (
            <div>
              <p className="text-sm font-extrabold text-violet-300 flex items-center justify-center gap-1.5 animate-pulse">
                <Sparkles className="w-4 h-4 text-fuchsia-400" /> AROHI is Speaking...
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Listening to live voice output</p>
            </div>
          )}
          {status === 'muted' && (
            <p className="text-xs sm:text-sm font-bold text-rose-400">Microphone Muted</p>
          )}
          {status === 'error' && (
            <div className="bg-rose-950/60 border border-rose-800/60 p-2 rounded-xl text-rose-200 text-xs max-w-xs mx-auto">
              {errorMessage || 'Connection failed. Check API keys or network.'}
            </div>
          )}
        </div>
      </main>

      {/* FLOATING CHATGPT / GEMINI STYLE ACTION DOCK */}
      <footer className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center gap-2 pb-1">
        
        {/* Main Floating Call Control Buttons */}
        <div className="flex items-center gap-6 pt-1">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            disabled={status === 'connecting' || status === 'error'}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-lg active:scale-95 ${
              isMuted
                ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500 shadow-rose-600/30'
                : 'bg-slate-900/90 border-white/10 text-slate-200 hover:bg-slate-800 hover:text-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-500 cursor-pointer active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-violet-500/50 text-slate-100 text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Session History Drawer */}
      {showSessionHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-950 border-l border-white/10 h-full flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Temporary Session History</h3>
              </div>
              <button
                onClick={() => setShowSessionHistory(false)}
                className="p-1 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              {savedSnapshots.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 my-auto">
                  <Bookmark className="w-8 h-8 mb-2 opacity-40" />
                  <p>No saved snippets yet</p>
                </div>
              ) : (
                savedSnapshots.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-violet-300">{item.title}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-white/5 text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {item.text}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleCopySnapshotText(item.text, item.id)}
                        className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        {copiedSnapshotId === item.id ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(item.id)}
                        className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
