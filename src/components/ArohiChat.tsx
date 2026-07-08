import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Plus, RefreshCw, Trash2, Mic, Paperclip, CheckCircle, ArrowRight, Lightbulb, MapPin, Briefcase, Landmark, Award, Minus, X, Globe } from 'lucide-react';
import ArohiAvatar from './ArohiAvatar';
import { Language, getTranslation, getWelcomeContent, getSuggestedPrompts } from '../translations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
}

interface ArohiChatProps {
  initialPrompt?: string;
  onNavigateTab?: (tab: string) => void;
  onMinimize?: () => void;
  onClose?: () => void;
  language?: Language;
}

function renderMarkdown(content: string) {
  // Helper to parse inline styles: **bold**, *italic*, `code`
  const parseInline = (text: string): React.ReactNode[] => {
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const pieces = text.split(regex);
    
    return pieces.map((piece, idx) => {
      if (piece.startsWith('**') && piece.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-[#c084fc]">{piece.slice(2, -2)}</strong>;
      } else if (piece.startsWith('*') && piece.endsWith('*')) {
        return <em key={idx} className="italic text-slate-200">{piece.slice(1, -1)}</em>;
      } else if (piece.startsWith('`') && piece.endsWith('`')) {
        return <code key={idx} className="bg-slate-950/60 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-400 border border-slate-800">{piece.slice(1, -1)}</code>;
      }
      return piece;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const pushList = (key: number) => {
    if (currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1 text-slate-200">
            {...currentList}
          </ul>
        );
      } else if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 space-y-1 text-slate-200">
            {...currentList}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Check for Headers
    if (trimmed.startsWith('### ')) {
      pushList(index);
      elements.push(
        <h4 key={index} className="text-xs md:text-sm font-extrabold text-white mt-4 mb-2 tracking-tight">
          {parseInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      pushList(index);
      elements.push(
        <h3 key={index} className="text-sm md:text-base font-extrabold text-white mt-5 mb-2 tracking-tight border-b border-[#2d2163] pb-1">
          {parseInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      pushList(index);
      elements.push(
        <h2 key={index} className="text-base md:text-lg font-extrabold text-white mt-6 mb-3 tracking-tight">
          {parseInline(trimmed.slice(2))}
        </h2>
      );
    }
    // Check for bullet lists
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (listType !== 'ul') {
        pushList(index);
        listType = 'ul';
      }
      const bulletText = trimmed.startsWith('• ') ? trimmed.slice(2) : trimmed.slice(2);
      currentList.push(
        <li key={index} className="text-xs md:text-sm font-medium leading-relaxed">
          {parseInline(bulletText)}
        </li>
      );
    }
    // Check for numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== 'ol') {
        pushList(index);
        listType = 'ol';
      }
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      const listContent = match ? match[2] : trimmed;
      currentList.push(
        <li key={index} className="text-xs md:text-sm font-medium leading-relaxed">
          {parseInline(listContent)}
        </li>
      );
    }
    // Check for dividers
    else if (trimmed === '---') {
      pushList(index);
      elements.push(<hr key={index} className="my-3 border-[#2d2163]" />);
    } else if (trimmed === '') {
      pushList(index);
      if (elements.length > 0) {
        elements.push(<div key={index} className="h-1.5"></div>);
      }
    }
    // Default Paragraph line
    else {
      pushList(index);
      elements.push(
        <p key={index} className="text-xs md:text-sm font-medium leading-relaxed text-slate-200 mb-1">
          {parseInline(line)}
        </p>
      );
    }
  });

  pushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
}

function parseMessageResume(content: string) {
  const startIndex = content.indexOf('[RESUME_DOCX_DATA_START]');
  const endIndex = content.indexOf('[RESUME_DOCX_DATA_END]');
  
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const rawJson = content.substring(startIndex + '[RESUME_DOCX_DATA_START]'.length, endIndex);
    const textWithoutJson = content.substring(0, startIndex) + content.substring(endIndex + '[RESUME_DOCX_DATA_END]'.length);
    try {
      const parsedData = JSON.parse(rawJson);
      return {
        cleanedContent: textWithoutJson.trim(),
        resumeData: parsedData
      };
    } catch (e) {
      console.error("Failed to parse resume JSON in message", e);
    }
  }
  return {
    cleanedContent: content,
    resumeData: null
  };
}

export default function ArohiChat({ initialPrompt, onNavigateTab, onMinimize, onClose, language = 'en' }: ArohiChatProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeContent(language),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          ...prev[0],
          content: getWelcomeContent(language)
        }];
      }
      return prev;
    });
  }, [language]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; mimeType: string; base64: string } | null>(null);
  const [isDownloadingResume, setIsDownloadingResume] = useState<string | null>(null);

  const handleDownloadResumeDocx = async (resumeData: any, messageId: string) => {
    setIsDownloadingResume(messageId);
    try {
      const response = await fetch('/api/generate-resume-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate Word document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download Word resume. Please try again.');
    } finally {
      setIsDownloadingResume(null);
    }
  };

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Full Stack Career Roadmap', date: 'Today' },
    { id: '2', title: 'MSME Mudra Loan Eligibility', date: 'Yesterday' },
    { id: '3', title: 'SSC MTS Eligibility 2026', date: '21 June 2026' }
  ]);

  const [activeHistoryId, setActiveHistoryId] = useState('1');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const simulationIntervalRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Cleanup speech recognition and simulation on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  // Handle passed initial prompts
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() && !uploadedFileName) return;

    const userMsgText = uploadedFileName 
      ? `[File Uploaded: ${uploadedFileName}] ${text}` 
      : text;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    const fileToSend = uploadedFile;
    setUploadedFileName(null);
    setUploadedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          file: fileToSend,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('API server error');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I apologize, but I had trouble connecting to my server. Please ensure your \`GEMINI_API_KEY\` is loaded in the settings.

As **AROHI**, your opportunity advisor, let me recommend checking out our **Jobs board** or **Government Schemes** section to explore the latest live options for your educational background!`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Greetings! I am **AROHI**, back to help you conquer new opportunities! What are we focusing on today?
- Type **"Mudra loan"** to check startup funding options.
- Type **"Resume help"** to optimize your profile.
- Type **"Sarkari job"** to explore government exam dates!`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    const newHistId = Date.now().toString();
    setChatHistory([
      { id: newHistId, title: 'New Conversation', date: 'Just now' },
      ...chatHistory
    ]);
    setActiveHistoryId(newHistId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string;
        const base64String = resultString.split(',')[1] || '';
        setUploadedFile({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          base64: base64String
        });
        setUploadedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const startSimulation = () => {
    setRecording(true);
    setInput('');
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    const fullText = 'Show me government schemes for women entrepreneurs in India.';
    let currentIdx = 0;
    simulationIntervalRef.current = setInterval(() => {
      currentIdx++;
      setInput(fullText.slice(0, currentIdx));
      if (currentIdx >= fullText.length) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
        setRecording(false);
      }
    }, 45);
  };

  const toggleRecording = () => {
    if (recording) {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          
          // Set language dynamically to match the user's interface language selection
          const langMap = {
            en: 'en-IN',
            hi: 'hi-IN',
            or: 'or-IN'
          };
          rec.lang = langMap[language] || 'en-IN';

          // Inject custom career-related grammars to improve recognition of technical and scheme terms
          const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
          if (SpeechGrammarList) {
            try {
              const speechRecognitionList = new SpeechGrammarList();
              const terms = [
                'Mudra', 'PMEGP', 'CGTMSE', 'Sarkari', 'Arohi', 'MSME', 'validation',
                'entrepreneur', 'resume', 'skills', 'government schemes', 'startup', 'interview',
                'micro-business', 'career guide', 'Sarkari Jobs', 'Mudra Loans', 'Resume Guide', 'Mock Interview'
              ];
              const grammar = `#JSGF V1.0; grammar careerKeywords; public <keyword> = ${terms.join(' | ')} ;`;
              speechRecognitionList.addFromString(grammar, 1.0);
              rec.grammars = speechRecognitionList;
            } catch (grammarError) {
              console.warn('SpeechGrammarList registration ignored:', grammarError);
            }
          }

          rec.onstart = () => {
            setRecording(true);
          };

          rec.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullTranscript += event.results[i][0].transcript;
            }
            const cleanText = fullTranscript.trim();
            if (cleanText) {
              setInput(cleanText);
            }
          };

          rec.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'audio-capture' || event.error === 'service-not-allowed') {
              try {
                rec.abort();
              } catch (err) {}
              startSimulation();
            } else if (event.error !== 'no-speech') {
              setRecording(false);
            }
          };

          rec.onend = () => {
            if (!simulationIntervalRef.current) {
              setRecording(false);
            }
          };

          recognitionRef.current = rec;
          rec.start();
        } catch (e) {
          console.error('Speech recognition start failed, using fallback:', e);
          startSimulation();
        }
      } else {
        // Fallback simulation if browser doesn't support Web Speech API
        startSimulation();
      }
    }
  };

  // Quick Action Prompts
  const suggestedPrompts = getSuggestedPrompts(language);

  if (isMinimized) {
    return (
      <div className="bg-gradient-to-r from-[#120e2a] to-[#0a0715] border border-[#2d2163] rounded-3xl shadow-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl shadow-lg shrink-0 border border-[#a78bfa]/30 relative overflow-hidden">
            <ArohiAvatar className="w-full h-full" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#00e676] rounded-full border-2 border-[#120e2a] animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base leading-none">AROHI AI</h3>
              <span className="bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Minimized</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">
              Your career conversation is saved. Click Maximize to resume.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-2xl shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer flex items-center gap-2 shrink-0 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#fcd34d] animate-pulse" /> Maximize Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-[#090714] overflow-hidden h-full w-full">
      
      {/* LEFT SIDEBAR: Conversation History */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0d091e] border-r border-[#2d2163] p-4 shrink-0">
        <button
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer mb-6"
        >
          <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
          New Discussion
        </button>

        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-3 px-2">History</span>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {chatHistory.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveHistoryId(item.id);
                // Simulate switching chats
                setMessages((prev) => [
                  ...prev.slice(0, 1),
                  {
                    id: Date.now().toString(),
                    role: 'user',
                    content: `Opened saved discussion: "${item.title}"`,
                    timestamp: new Date().toLocaleTimeString()
                  },
                  {
                    id: (Date.now()+1).toString(),
                    role: 'assistant',
                    content: `Gladly continuing our chat regarding **"${item.title}"**. How should we proceed further on this topic?`,
                    timestamp: new Date().toLocaleTimeString()
                  }
                ]);
              }}
              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between group transition-all ${
                activeHistoryId === item.id
                  ? 'bg-[#1b143c] text-violet-300 font-bold border border-[#4c34a3]'
                  : 'text-slate-300 hover:bg-[#181236]/60'
              }`}
            >
              <div className="truncate pr-2">
                <span className="block truncate">{item.title}</span>
                <span className="text-[9px] text-slate-400 font-normal">{item.date}</span>
              </div>
              <Trash2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 shrink-0 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-[#231a4f]">
          <div className="bg-gradient-to-tr from-[#7c3aed] to-[#3b218d] text-white p-3 rounded-xl shadow-inner text-center">
            <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-75">AROHI Status</span>
            <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Core AI Engine Online
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER: Main Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090714]">
        
        {/* Chat Title bar */}
        <div className="bg-[#120d26] border-b border-[#2d2163] px-3 sm:px-6 py-2.5 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-sm border border-[#3b2a80] overflow-hidden relative shrink-0">
              <ArohiAvatar className="w-full h-full" />
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#00e676] rounded-full border border-[#120d26] animate-pulse"></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-white text-xs sm:text-sm md:text-base leading-none shrink-0">AROHI AI</h3>
                <span className="bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/30 text-[8px] xs:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase whitespace-nowrap hidden xs:inline-block">Your Career guide</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5 truncate max-w-[150px] sm:max-w-none">India's Unified Career & Business AI Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={() => {
                setMessages((prev) => [prev[0]]);
              }}
              title="Clear Chat"
              className="p-1.5 sm:p-2 rounded-lg hover:bg-[#1f1545] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => {
                if (onMinimize) {
                  onMinimize();
                } else {
                  setIsMinimized(true);
                }
              }}
              title="Minimize Chat"
              className="p-1.5 sm:p-2 rounded-lg hover:bg-[#1f1545] text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                title="Close Chat"
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[#1f1545] text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Messages Scrolling Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-[#090714]">
          {messages.map((msg) => {
            const parsed = msg.role === 'assistant' 
              ? parseMessageResume(msg.content) 
              : { cleanedContent: msg.content, resumeData: null };

            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md border border-[#3b2a80] shrink-0">
                    <ArohiAvatar className="w-full h-full" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md leading-relaxed text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-tr-none font-medium shadow-[0_4px_15px_rgba(124,58,237,0.2)]'
                    : 'bg-[#130f2c] text-slate-100 rounded-tl-none border border-[#2b1f5c]'
                }`}>
                  {/* Parse standard markdown formatting */}
                  <div className="prose prose-sm max-w-none text-xs md:text-sm">
                    {renderMarkdown(parsed.cleanedContent)}
                  </div>

                  {parsed.resumeData && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#1c1445] to-[#26165e] border border-[#a78bfa]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#7c3aed]/30 rounded-lg text-[#c084fc] border border-[#7c3aed]/50 shrink-0">
                          <Briefcase className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Download Word Resume</h4>
                          <p className="text-[10px] text-slate-300 mt-0.5 font-semibold">Professional Microsoft Word (.docx) layout ready for HR</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadResumeDocx(parsed.resumeData, msg.id)}
                        disabled={isDownloadingResume === msg.id}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-violet-950 disabled:text-slate-400 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {isDownloadingResume === msg.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-300" /> Download (.docx)
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 flex justify-end ${msg.role === 'user' ? 'text-violet-200' : 'text-slate-400'} font-semibold`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/20 text-[#c084fc] flex items-center justify-center shrink-0 shadow-md border border-[#7c3aed]/30 font-bold text-xs uppercase">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md border border-[#3b2a80]">
                <ArohiAvatar className="w-full h-full" />
              </div>
              <div className="bg-[#130f2c] border border-[#2b1f5c] max-w-[70%] rounded-2xl p-4 rounded-tl-none shadow-md text-sm text-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-bold">{getTranslation('loading', language)}</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-bounce delay-200"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggested quick inputs shown when only 1 welcome message exists */}
          {messages.length === 1 && (
            <div className="pt-6 border-t border-[#2d2163]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggested Prompt Starters</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.text)}
                    className="text-left p-3 rounded-xl border border-[#221b4a] hover:border-[#7c3aed]/50 hover:bg-[#1d1544] transition-all cursor-pointer flex gap-3 items-center group shadow-md bg-[#0f0b24]"
                  >
                    <div className="bg-[#18123c] p-1.5 rounded-lg border border-[#3b2a80] text-[#a78bfa] group-hover:bg-[#7c3aed] group-hover:text-white transition-colors shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white leading-snug">{p.text}</span>
                      <span className="block text-[10px] text-slate-300 font-medium leading-normal mt-0.5">{p.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box bottom bar */}
        <div className="border-t border-[#231a4f] p-3 sm:p-4 bg-[#120d26]">
          {/* Dynamic connected suggestion chips */}
          <div className="mb-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 select-none scrollbar-none">
              {[
                { label: "💼 Sarkari Jobs", prompt: "What are the latest active central and state Sarkari job openings?" },
                { label: "🏦 Mudra Loans", prompt: "Am I eligible for a Mudra Loan or PMEGP subsidy to start a business?" },
                { label: "📝 Resume Guide", prompt: "How can I check if my resume has a high ATS score or is optimized for jobs?" },
                { label: "🗣️ Mock Interview", prompt: "Let's do a mock interview practice. Ask me some standard questions." },
                { label: "🚀 Odia Schemes", prompt: "What are some specific government business subsidies and educational schemes for citizens in Odisha?" },
                { label: "🎓 PMKVY Skill", prompt: "Tell me about the PMKVY free upskilling courses and certifications?" },
                { label: "💡 Startup Guide", prompt: "Validate my startup idea and tell me how to get MSME registration." }
              ].map((chip, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="bg-[#1b143c] hover:bg-[#2c1d5e] text-slate-200 hover:text-white border border-[#3b2a80] hover:border-[#7c3aed] text-[10px] font-bold py-1.5 px-2.5 rounded-full shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0 active:scale-95 animate-in fade-in duration-350"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {uploadedFileName && (
            <div className="mb-2 px-3 py-1.5 bg-violet-950/40 text-violet-200 text-xs font-semibold rounded-lg flex items-center justify-between border border-[#4c31a5]">
              <span className="truncate flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-violet-400" /> Loaded file: **{uploadedFileName}**
              </span>
              <button 
                onClick={() => setUploadedFileName(null)}
                className="text-[10px] font-bold text-rose-400 hover:underline uppercase"
              >
                Remove
              </button>
            </div>
          )}

          {recording && (
            <div className="mb-2 px-4 py-2 bg-rose-950/40 text-rose-200 text-xs font-extrabold rounded-lg flex items-center justify-between border border-rose-900/60 animate-pulse">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                AROHI Listening... Speak clearly in Hindi/English.
              </span>
              <button 
                onClick={() => setRecording(false)} 
                className="text-[10px] uppercase font-black text-rose-400"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex gap-1 xs:gap-1.5 sm:gap-2.5 items-center">
            {/* Attachment icon */}
            <label className="p-2 xs:p-2.5 sm:p-3 bg-[#181236] hover:bg-[#241a4f] rounded-xl border border-[#3e2b85] text-slate-300 hover:text-white cursor-pointer shadow-sm transition-colors shrink-0">
              <Paperclip className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5" />
              <input 
                type="file" 
                accept=".pdf,.docx,.txt,image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>

            {/* Voice input */}
            <button
              onClick={toggleRecording}
              className={`p-2 xs:p-2.5 sm:p-3 rounded-xl border shadow-sm transition-colors shrink-0 cursor-pointer ${
                recording 
                  ? 'bg-rose-600 text-white border-rose-500' 
                  : 'bg-[#181236] hover:bg-[#241a4f] border-[#3e2b85] text-slate-300 hover:text-white'
              }`}
              title={getTranslation('speakWithArohi', language)}
            >
              <Mic className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Message input */}
            <input
              type="text"
              placeholder={getTranslation('typeMessage', language)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 min-w-0 bg-[#181236] border border-[#3e2b85] rounded-xl px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-white placeholder-slate-400 shadow-sm font-medium"
            />

            {/* Send button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={(!input.trim() && !uploadedFileName) || isLoading}
              className="p-2 xs:p-2.5 sm:p-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#1a1532] disabled:text-slate-500 text-white rounded-xl shadow-md cursor-pointer disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] text-slate-400 font-medium">
            AI responses are generated by AROHI to help guide your pathway. Verify major details before submission.
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR: Immersive contextual recommendations */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0d091e] border-l border-[#2d2163] p-4 shrink-0">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" /> AROHI Recommended
        </h4>

        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          
          {/* Box 1: Hot Opportunity */}
          <div className="bg-[#110c26] border border-[#231a4f] hover:border-[#3c2a82] p-3.5 rounded-xl shadow-sm transition-colors">
            <span className="text-[9px] bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-blue-800/40">Hot Job Alert</span>
            <h5 className="font-extrabold text-xs text-white mt-2">SSC MTS & Havaldar 2026</h5>
            <p className="text-[11px] text-slate-300 font-medium mt-1">11,439 government vacancies closing soon.</p>
            <button 
              onClick={() => onNavigateTab?.('jobs')}
              className="mt-3.5 text-xs font-extrabold text-[#a78bfa] flex items-center gap-1 hover:underline cursor-pointer"
            >
              View Eligibility <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Box 2: Schemes */}
          <div className="bg-[#110c26] border border-[#231a4f] hover:border-[#3c2a82] p-3.5 rounded-xl shadow-sm transition-colors">
            <span className="text-[9px] bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-emerald-800/40">Business Scheme</span>
            <h5 className="font-extrabold text-xs text-white mt-2">PM Mudra Loan Yojana</h5>
            <p className="text-[11px] text-slate-300 font-medium mt-1">Collateral free loans up to ₹10 Lakhs for young businesses.</p>
            <button 
              onClick={() => onNavigateTab?.('schemes')}
              className="mt-3.5 text-xs font-extrabold text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
            >
              Match Eligibility <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Box 3: Technical Skills */}
          <div className="bg-[#110c26] border border-[#231a4f] hover:border-[#3c2a82] p-3.5 rounded-xl shadow-sm transition-colors">
            <span className="text-[9px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-purple-800/40">Upskilling</span>
            <h5 className="font-extrabold text-xs text-white mt-2">Full-Stack Certification</h5>
            <p className="text-[11px] text-slate-300 font-medium mt-1">Master JavaScript, TypeScript, and modern database management.</p>
            <button 
              onClick={() => onNavigateTab?.('courses')}
              className="mt-3.5 text-xs font-extrabold text-[#a78bfa] flex items-center gap-1 hover:underline cursor-pointer"
            >
              Explore Course <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        <div className="mt-4 pt-4 border-t border-[#231a4f]">
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Verified Information Source
          </div>
        </div>
      </aside>

    </div>
  );
}
