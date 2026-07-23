import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Plus, RefreshCw, Trash2, Mic, Paperclip, CheckCircle, ArrowRight, Lightbulb, MapPin, Briefcase, Landmark, Award, Minus, X, Globe, Phone, History } from 'lucide-react';
import ArohiAvatar from './ArohiAvatar';
import { Language, getTranslation, getWelcomeContent, getSuggestedPrompts } from '../translations';
import ArohiVoiceCall from './ArohiVoiceCall';
import { generateCallSummaryPDF, generateResumePDF, analyzeTurns } from '../lib/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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

interface SavedChat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
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

function parseMessageCallSummary(content: string) {
  const startIndex = content.indexOf('[CALL_SUMMARY_DATA_START]');
  const endIndex = content.indexOf('[CALL_SUMMARY_DATA_END]');
  
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const rawJson = content.substring(startIndex + '[CALL_SUMMARY_DATA_START]'.length, endIndex);
    const textWithoutJson = content.substring(0, startIndex) + content.substring(endIndex + '[CALL_SUMMARY_DATA_END]'.length);
    try {
      const parsedData = JSON.parse(rawJson);
      return {
        cleanedContent: textWithoutJson.trim(),
        summaryData: parsedData
      };
    } catch (e) {
      console.error("Failed to parse call summary JSON in message", e);
    }
  }
  return {
    cleanedContent: content,
    summaryData: null
  };
}

export default function ArohiChat({ initialPrompt, onNavigateTab, onMinimize, onClose, language = 'en' }: ArohiChatProps) {
  const { user, userData } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
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

  const logActivity = (type: string, title: string, description: string) => {
    try {
      const stored = localStorage.getItem('recruit_activities');
      let list = [];
      if (stored) {
        list = JSON.parse(stored);
      }
      const newAct = {
        id: `act-${Date.now()}`,
        type,
        title,
        description,
        timestamp: new Date().toISOString()
      };
      list = [newAct, ...list].slice(0, 15);
      localStorage.setItem('recruit_activities', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('recruit_activities_update'));
    } catch (e) {
      console.error('Error logging activity locally:', e);
    }
  };

  const handleVoiceCallComplete = (summaryData: {
    duration: number;
    turns: any[];
    date: string;
    summaryText: string;
    analysis?: any;
  }) => {
    const analysis = summaryData.analysis || analyzeTurns(summaryData.turns);
    const summaryJson = JSON.stringify(summaryData);
    
    // Construct dynamic bullet points for the discussion log
    const discussionBullets = analysis.priorities.map((prio: string) => `* **Key Focus:** ${prio}`).join('\n');
    const completedTasksList = analysis.completedTasks.map((task: string) => `* **Completed Task:** ${task}`).join('\n');
    
    const title = analysis.topics.business ? "AROHI Live Voice Business Consultation Summary" : "AROHI Live Voice Career Consultation Summary";
    const reportName = analysis.topics.business ? "Custom Entrepreneurial Briefing & Business Action Plan" : "Custom Career Blueprint";
    
    const newMsg: Message = {
      id: `call-summary-${Date.now()}`,
      role: 'assistant',
      content: `### 📞 ${title}
      
Thank you for connecting with AROHI over the secure live voice link. I have captured your objectives and prepared your **${reportName}**.

**Call Metadata:**
* **Session Date:** ${summaryData.date}
* **Active Duration:** ${summaryData.duration > 0 ? Math.floor(summaryData.duration / 60).toString().padStart(2, '0') + ':' + (summaryData.duration % 60).toString().padStart(2, '0') : '00:00'}
* **Voice Channel:** Zephyr (Fidelity Codec Link)

**Discussion Summary:**
${analysis.summary}

**Identified Task Completions:**
${completedTasksList}

**Action Plan & Strategic Priorities:**
${discussionBullets}

[CALL_SUMMARY_DATA_START]${summaryJson}[CALL_SUMMARY_DATA_END]`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    // Save and sync the updated chat with the new call summary directly to Firestore/localStorage
    let targetChatId = activeChatId;
    let currentSavedChats = [...savedChats];
    if (!targetChatId || currentSavedChats.length === 0) {
      targetChatId = 'chat-' + Date.now();
      const newChatContainer = {
        id: targetChatId,
        title: analysis.topics.business ? 'Voice Business Session' : 'Voice Career Session',
        date: 'Today',
        messages: [
          {
            id: 'welcome',
            role: 'assistant' as const,
            content: getWelcomeContent(language),
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          },
          newMsg
        ]
      };
      currentSavedChats = [newChatContainer, ...currentSavedChats];
      setActiveChatId(targetChatId);
      setMessages(newChatContainer.messages);
    } else {
      currentSavedChats = currentSavedChats.map(chat => {
        if (chat.id === targetChatId) {
          let title = chat.title;
          if (title === 'New Conversation' || title === 'New Discussion' || title === 'New Chat') {
            title = analysis.topics.business ? 'Voice Business Session' : 'Voice Career Session';
          }
          return {
            ...chat,
            title,
            messages: updatedMessages
          };
        }
        return chat;
      });
    }

    setSavedChats(currentSavedChats);
    if (user) {
      updateArohiChats(currentSavedChats);
    } else {
      localStorage.setItem('guest_arohi_chats', JSON.stringify(currentSavedChats));
    }

    // Sync call summary to saved calls
    const newCallItem = {
      id: `call-${Date.now()}`,
      duration: summaryData.duration,
      turns: summaryData.turns,
      date: summaryData.date,
      summaryText: summaryData.summaryText || analysis.summary,
      isCareerRelated: !analysis.topics.business,
      analysis: analysis
    };

    const updatedCalls = [newCallItem, ...savedCalls];
    setSavedCalls(updatedCalls);
    if (user) {
      updateArohiCalls(updatedCalls);
    } else {
      localStorage.setItem('guest_arohi_calls', JSON.stringify(updatedCalls));
    }

    // Track voice call completion in User Panel activities
    const uEmail = user?.email || localStorage.getItem('recruit_user_email') || 'guest@recruitindia.org';
    const uName = userData?.profile?.name || user?.displayName || localStorage.getItem('recruit_user_name') || 'Honored Guest';
    const activeTopic = analysis.topics.business ? "Bakery Business Plan" : "General Consultation";

    logActivity(
      analysis.topics.business ? 'business' : 'chat',
      analysis.topics.business ? 'Arohi Business Briefing Finished' : 'Arohi Voice Consultation Finished',
      `Completed a secure ${Math.floor(summaryData.duration / 60)}m ${summaryData.duration % 60}s live voice call. ${analysis.summary.substring(0, 140)}...`
    );

    // Sync turns to Admin panel live
    summaryData.turns.forEach(async (turn) => {
      try {
        await fetch('/api/admin/sync-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: uEmail,
            userName: uName,
            sender: turn.speaker === 'user' ? 'user' : 'arohi',
            text: turn.text,
            topic: activeTopic
          })
        });
      } catch (e) {
        console.error("Failed to sync call turn to admin portal:", e);
      }
    });

    // Also sync overall summary message
    try {
      fetch('/api/admin/sync-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: uEmail,
          userName: uName,
          sender: 'arohi',
          text: `[Call Summary Generated] ${analysis.summary}`,
          topic: activeTopic
        })
      });
    } catch (e) {
      // ignore
    }
  };

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

  const { updateArohiChats, updateArohiCalls } = useAuth();
  const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [savedCalls, setSavedCalls] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [selectedCallDetail, setSelectedCallDetail] = useState<any | null>(null);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [hasFetchedLatest, setHasFetchedLatest] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Hydration effect
  useEffect(() => {
    if (user) {
      if (userData?.arohiChats && userData.arohiChats.length > 0) {
        setSavedChats(userData.arohiChats);
      } else {
        const initialMock: SavedChat[] = [
          {
            id: '1',
            title: 'Full Stack Career Roadmap',
            date: 'Today',
            messages: [
              {
                id: '1-1',
                role: 'user',
                content: 'Give me a roadmap for transitioning to full stack development in India.',
                timestamp: '10:00 AM'
              },
              {
                id: '1-2',
                role: 'assistant',
                content: `### 🚀 Full Stack Web Development Transition Blueprint
Here is your customized learning journey:
1. **Frontend Fundamentals:** HTML5, CSS3, and JavaScript (ES6+). Focus on modern responsive grids and utility frameworks like **Tailwind CSS**.
2. **Component Frameworks:** React 18+ with Vite. Build structured modular user interfaces and state models.
3. **Backend Stack:** Node.js, Express, and Firestore/SQL databases. Design lightweight REST proxy layers to secure private secrets.
4. **Cloud Execution:** Deploy static assets on host buckets, and full-stack servers on Cloud Run using container configurations.`,
                timestamp: '10:01 AM'
              }
            ]
          },
          {
            id: '2',
            title: 'MSME Mudra Loan Eligibility',
            date: 'Yesterday',
            messages: [
              {
                id: '2-1',
                role: 'user',
                content: 'Am I eligible for a Mudra Loan of 3 Lakhs for a bakery shop?',
                timestamp: 'Yesterday'
              },
              {
                id: '2-2',
                role: 'assistant',
                content: `### 🏛️ Mudra Loan (Kishor Category) Eligibility Guide
Yes! For an investment of ₹3 Lakhs, you qualify under the **Kishor Category** (loans from ₹50,000 to ₹5 Lakhs).
* **Collateral Requirement:** Zero collateral needed!
* **Key Checklist:**
  1. Valid **Udyam MSME Certificate**.
  2. Last 6 months bank statement.
  3. Simple project business brief.
  4. Proof of address & identity.`,
                timestamp: 'Yesterday'
              }
            ]
          }
        ];
        setSavedChats(initialMock);
        updateArohiChats(initialMock);
      }

      if (userData?.arohiCalls) {
        setSavedCalls(userData.arohiCalls);
      } else {
        setSavedCalls([]);
      }
    } else {
      const localChats = localStorage.getItem('guest_arohi_chats');
      const localCalls = localStorage.getItem('guest_arohi_calls');
      if (localChats) {
        setSavedChats(JSON.parse(localChats));
      } else {
        const initialMock: SavedChat[] = [
          {
            id: '1',
            title: 'Full Stack Career Roadmap',
            date: 'Today',
            messages: [
              {
                id: '1-1',
                role: 'user',
                content: 'Give me a roadmap for transitioning to full stack development in India.',
                timestamp: '10:00 AM'
              },
              {
                id: '1-2',
                role: 'assistant',
                content: `### 🚀 Full Stack Web Development Transition Blueprint
Here is your customized learning journey:
1. **Frontend Fundamentals:** HTML5, CSS3, and JavaScript (ES6+). Focus on modern responsive grids and utility frameworks like **Tailwind CSS**.
2. **Component Frameworks:** React 18+ with Vite. Build structured modular user interfaces and state models.
3. **Backend Stack:** Node.js, Express, and Firestore/SQL databases. Design lightweight REST proxy layers to secure private secrets.
4. **Cloud Execution:** Deploy static assets on host buckets, and full-stack servers on Cloud Run using container configurations.`,
                timestamp: '10:01 AM'
              }
            ]
          }
        ];
        setSavedChats(initialMock);
        localStorage.setItem('guest_arohi_chats', JSON.stringify(initialMock));
      }

      if (localCalls) {
        setSavedCalls(JSON.parse(localCalls));
      } else {
        setSavedCalls([]);
      }
    }
  }, [user, userData]);

  // Fetch and restore the last conversation history from Firestore when starting a session
  useEffect(() => {
    if (!user || hasFetchedLatest) return;

    const fetchLatestHistory = async () => {
      setIsFetchingHistory(true);
      try {
        // Layer 1: Secure Server-side API to fetch freshest database profile
        const response = await fetch('/api/auth/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid })
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData?.success && resData?.userData) {
            const freshData = resData.userData;
            if (freshData.arohiChats && freshData.arohiChats.length > 0) {
              setSavedChats(freshData.arohiChats);
              // Select the absolute latest chat session (first in array)
              const latestChat = freshData.arohiChats[0];
              setActiveChatId(latestChat.id);
              setMessages(latestChat.messages);
            }
            if (freshData.arohiCalls) {
              setSavedCalls(freshData.arohiCalls);
            }
            setHasFetchedLatest(true);
            setIsFetchingHistory(false);
            return;
          }
        }
      } catch (err) {
        console.warn("REST fetch for latest conversation memory failed, falling back to direct Firestore SDK:", err);
      }

      // Layer 2: Fallback to direct client-side Firestore SDK
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const freshData = docSnap.data();
          if (freshData.arohiChats && freshData.arohiChats.length > 0) {
            setSavedChats(freshData.arohiChats);
            const latestChat = freshData.arohiChats[0];
            setActiveChatId(latestChat.id);
            setMessages(latestChat.messages);
          }
          if (freshData.arohiCalls) {
            setSavedCalls(freshData.arohiCalls);
          }
        }
      } catch (err) {
        console.error("Direct Firestore memory load failed:", err);
      } finally {
        setHasFetchedLatest(true);
        setIsFetchingHistory(false);
      }
    };

    fetchLatestHistory();
  }, [user, hasFetchedLatest]);

  // Synchronize messages with the active chat
  useEffect(() => {
    if (savedChats.length > 0) {
      const currentChat = savedChats.find(c => c.id === activeChatId) || savedChats[0];
      if (currentChat) {
        // Always dynamically update the content of the welcome message to match the latest universal version
        const processedMessages = currentChat.messages.map(m => {
          if (m.id === 'welcome') {
            return { ...m, content: getWelcomeContent(language) };
          }
          return m;
        });
        setMessages(processedMessages);
        if (activeChatId !== currentChat.id) {
          setActiveChatId(currentChat.id);
        }
      }
    } else {
      const starterId = 'starter-' + Date.now();
      const starterChat: SavedChat = {
        id: starterId,
        title: 'New Conversation',
        date: 'Today',
        messages: [
          {
            id: 'welcome',
            role: 'assistant',
            content: getWelcomeContent(language),
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setSavedChats([starterChat]);
      setActiveChatId(starterId);
      setMessages(starterChat.messages);
      if (user) {
        updateArohiChats([starterChat]);
      } else {
        localStorage.setItem('guest_arohi_chats', JSON.stringify([starterChat]));
      }
    }
  }, [activeChatId, savedChats.length]);

  // Save changes effect whenever active chat messages state updates
  const isSyncingRef = useRef(false);
  useEffect(() => {
    if (!activeChatId || isSyncingRef.current || savedChats.length === 0) return;
    
    const currentChat = savedChats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    if (JSON.stringify(currentChat.messages) === JSON.stringify(messages)) return;

    isSyncingRef.current = true;
    const updatedChats = savedChats.map(chat => {
      if (chat.id === activeChatId) {
        let title = chat.title;
        if (title === 'New Conversation' || title === 'New Discussion' || title === 'New Chat') {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            const cleaned = firstUserMsg.content.replace(/\[File Uploaded:.*?\]/g, '').trim();
            title = cleaned.length > 32 ? cleaned.substring(0, 30) + '...' : cleaned;
          }
        }
        return {
          ...chat,
          title,
          messages
        };
      }
      return chat;
    });

    setSavedChats(updatedChats);
    if (user) {
      updateArohiChats(updatedChats);
    } else {
      localStorage.setItem('guest_arohi_chats', JSON.stringify(updatedChats));
    }
    isSyncingRef.current = false;
  }, [messages, activeChatId, savedChats, user]);

  const deleteChat = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChats = savedChats.filter(c => c.id !== idToDelete);
    setSavedChats(updatedChats);
    
    if (activeChatId === idToDelete) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
      } else {
        setActiveChatId('');
        setMessages([]);
      }
    }

    if (user) {
      updateArohiChats(updatedChats);
    } else {
      localStorage.setItem('guest_arohi_chats', JSON.stringify(updatedChats));
    }
  };

  const deleteCall = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCalls = savedCalls.filter(c => c.id !== idToDelete);
    setSavedCalls(updatedCalls);
    if (user) {
      updateArohiCalls(updatedCalls);
    } else {
      localStorage.setItem('guest_arohi_calls', JSON.stringify(updatedCalls));
    }
  };

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

    const uEmail = user?.email || localStorage.getItem('recruit_user_email') || 'guest@recruitindia.org';
    const uName = userData?.profile?.name || user?.displayName || localStorage.getItem('recruit_user_name') || 'Honored Guest';
    const isBus = /bakery|bake|bread|cake|business|entrepreneur|shop|mudra|loan|startup|venture|funding|finance|retail/.test(text.toLowerCase());
    const activeTopic = isBus ? "Bakery Business Plan" : "General Consultation";

    // Track sending message in User Panel activities
    logActivity('chat', 'Chat message sent', text.substring(0, 100));

    // Sync user message to admin portal
    try {
      fetch('/api/admin/sync-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: uEmail,
          userName: uName,
          sender: 'user',
          text: userMsgText,
          topic: activeTopic
        })
      });
    } catch (e) {
      console.error('Error syncing user message to admin:', e);
    }

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
          language: language,
          uid: user?.uid
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

      // Sync assistant response to admin portal
      try {
        fetch('/api/admin/sync-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: uEmail,
            userName: uName,
            sender: 'arohi',
            text: data.response,
            topic: activeTopic
          })
        });
      } catch (e) {
        console.error('Error syncing assistant response to admin:', e);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback
      setTimeout(() => {
        const fallbackText = `I apologize, but I had trouble connecting to my server. Please ensure your \`GEMINI_API_KEY\` is loaded in the settings.

As **AROHI**, your opportunity advisor, let me recommend checking out our **Jobs board** or **Government Schemes** section to explore the latest live options for your educational background!`;

        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }]);

        // Sync fallback response to admin portal
        try {
          fetch('/api/admin/sync-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail: uEmail,
              userName: uName,
              sender: 'arohi',
              text: fallbackText,
              topic: activeTopic
            })
          });
        } catch (e) {
          // ignore
        }
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
    const newChatId = 'chat-' + Date.now();
    const newChat: SavedChat = {
      id: newChatId,
      title: 'New Discussion',
      date: 'Today',
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeContent(language),
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const updatedChats = [newChat, ...savedChats];
    setSavedChats(updatedChats);
    setActiveChatId(newChatId);
    setMessages(newChat.messages);

    if (user) {
      updateArohiChats(updatedChats);
    } else {
      localStorage.setItem('guest_arohi_chats', JSON.stringify(updatedChats));
    }
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

        <div className="flex bg-[#120c2d] p-1 rounded-xl mb-4 border border-[#2d2163] shrink-0">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-1.5 text-center text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chats 💬
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`flex-1 py-1.5 text-center text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
              activeTab === 'calls'
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Calls 📞
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {activeTab === 'chats' ? (
            savedChats.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveChatId(item.id);
                  setMessages(item.messages);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between group transition-all cursor-pointer ${
                  activeChatId === item.id
                    ? 'bg-[#1b143c] text-violet-300 font-bold border border-[#4c34a3]'
                    : 'text-slate-300 hover:bg-[#181236]/60'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="block truncate">{item.title}</span>
                  <span className="text-[9px] text-slate-400 font-normal">{item.date}</span>
                </div>
                <Trash2 
                  onClick={(e) => deleteChat(item.id, e)}
                  className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 shrink-0 transition-opacity" 
                />
              </button>
            ))
          ) : (
            savedCalls.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-medium">
                No voice summaries yet. Click the 📞 icon above to start your first call!
              </div>
            ) : (
              savedCalls.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCallDetail(item)}
                  className="w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between group transition-all text-slate-300 hover:bg-[#181236]/60 cursor-pointer"
                >
                  <div className="truncate pr-2 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <span className="block truncate font-bold text-slate-200">
                        {item.isCareerRelated ? 'Career Call' : 'Business Call'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-normal">
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <Trash2 
                    onClick={(e) => deleteCall(item.id, e)}
                    className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 shrink-0 transition-opacity" 
                  />
                </button>
              ))
            )
          )}
        </div>

        <div className="pt-4 border-t border-[#231a4f] space-y-3.5">
          <div className="bg-gradient-to-tr from-[#7c3aed] to-[#3b218d] text-white p-3 rounded-xl shadow-inner text-center">
            <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-75">AROHI Status</span>
            {isFetchingHistory ? (
              <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-xs text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Syncing with Firestore...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-xs text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Core AI Engine Online
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* CENTER: Main Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090714] relative">
        
        {/* Sliding History Drawer overlay (for mobile, tablet, and responsive embedding) */}
        {isHistoryDrawerOpen && (
          <div className="absolute inset-y-0 left-0 z-40 w-72 bg-[#0d091e]/98 backdrop-blur-xl border-r border-[#2d2163] shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-4 border-b border-[#2d2163] pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <History className="w-4 h-4 text-violet-400" /> Chat History
              </h4>
              <button 
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                startNewChat();
                setIsHistoryDrawerOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer mb-4"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              New Discussion
            </button>

            <div className="flex bg-[#120c2d] p-1 rounded-xl mb-4 border border-[#2d2163] shrink-0">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'chats'
                    ? 'bg-[#7c3aed] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chats 💬
              </button>
              <button
                onClick={() => setActiveTab('calls')}
                className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'calls'
                    ? 'bg-[#7c3aed] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Calls 📞
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {activeTab === 'chats' ? (
                savedChats.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 font-medium">
                    No active chat discussions.
                  </div>
                ) : (
                  savedChats.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveChatId(item.id);
                        setMessages(item.messages);
                        setIsHistoryDrawerOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between group transition-all cursor-pointer ${
                        activeChatId === item.id
                          ? 'bg-[#1b143c] text-violet-300 font-bold border border-[#4c34a3]'
                          : 'text-slate-300 hover:bg-[#181236]/60'
                      }`}
                    >
                      <div className="truncate pr-2 flex-1">
                        <span className="block truncate text-slate-200">{item.title}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{item.date}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(item.id, e);
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-500/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )
              ) : (
                savedCalls.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 font-medium">
                    No voice summaries yet. Click the 📞 icon above to start your first call!
                  </div>
                ) : (
                  savedCalls.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedCallDetail(item);
                        setIsHistoryDrawerOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between group transition-all text-slate-300 hover:bg-[#181236]/60 cursor-pointer"
                    >
                      <div className="truncate pr-2 flex items-center gap-2 flex-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <span className="block truncate font-bold text-slate-200">
                            {item.isCareerRelated ? 'Career Call' : 'Business Call'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-normal">
                            {item.date}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCall(item.id, e);
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-500/10 transition-colors shrink-0 animate-in fade-in"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )
              )}
            </div>

            <div className="pt-4 border-t border-[#231a4f] mt-4">
              <div className="bg-[#120c2d] p-3 rounded-xl border border-[#2d2163]">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Active User Profile</div>
                <div className="text-xs font-extrabold text-indigo-300 truncate">{user?.email || 'Guest Session'}</div>
              </div>
            </div>
          </div>
        )}

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
              onClick={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
              title="Conversation History"
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border mr-1 ${
                isHistoryDrawerOpen
                  ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                  : 'bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#c084fc] hover:text-[#d8b4fe] border-[#7c3aed]/20'
              }`}
            >
              <History className="w-3.5 h-3.5 text-violet-300" />
              <span className="text-[10px] font-extrabold uppercase tracking-wide hidden xs:inline">History</span>
            </button>
            <button
              onClick={() => setIsVoiceCallOpen(true)}
              title="Live Voice Call"
              className="p-1.5 sm:p-2 rounded-xl bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#c084fc] hover:text-[#d8b4fe] transition-all cursor-pointer flex items-center gap-1.5 border border-[#7c3aed]/20 mr-1"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wide hidden xs:inline">Live Call</span>
            </button>
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
            const summaryParsed = msg.role === 'assistant'
              ? parseMessageCallSummary(msg.content)
              : { cleanedContent: msg.content, summaryData: null };

            const parsed = msg.role === 'assistant' 
              ? parseMessageResume(summaryParsed.cleanedContent) 
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

                  {summaryParsed.summaryData && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#0c0a21] to-[#1a123a] border border-[#7c3aed]/40 shadow-lg flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-3 border-b border-[#2d1b5a] pb-3">
                        <div className="p-2 bg-[#7c3aed]/25 rounded-lg text-[#a78bfa] border border-[#7c3aed]/45">
                          <Phone className="w-4.5 h-4.5 text-indigo-300 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">AROHI Voice Consultation</h4>
                          <p className="text-[9px] text-emerald-400 font-black mt-0.5 uppercase tracking-wide">Ready for Export • 100% Secure</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-slate-300">
                        <div className="bg-[#120c35]/40 p-2 rounded-lg border border-[#2d1f65]">
                          <span className="text-[8px] text-slate-400 uppercase font-extrabold tracking-wider">Duration</span>
                          <p className="font-extrabold text-white mt-0.5">
                            {summaryParsed.summaryData.duration > 0 
                              ? Math.floor(summaryParsed.summaryData.duration / 60).toString().padStart(2, '0') + ':' + (summaryParsed.summaryData.duration % 60).toString().padStart(2, '0') 
                              : '02:45'}
                          </p>
                        </div>
                        <div className="bg-[#120c35]/40 p-2 rounded-lg border border-[#2d1f65]">
                          <span className="text-[8px] text-slate-400 uppercase font-extrabold tracking-wider">Format</span>
                          <p className="font-extrabold text-white mt-0.5">PDF Document</p>
                        </div>
                      </div>

                      {/* Summary Actions List */}
                      {(() => {
                        const chatAnalysis = summaryParsed.summaryData.analysis || analyzeTurns(summaryParsed.summaryData.turns);
                        return (
                          <div className="space-y-2 pt-1">
                            {/* Download PDF call summary - Always shown */}
                            <button
                              onClick={() => generateCallSummaryPDF(summaryParsed.summaryData.turns, summaryParsed.summaryData.duration, chatAnalysis)}
                              className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg font-extrabold text-[10px] uppercase tracking-wider text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> Download Call Summary (PDF)
                            </button>

                            {/* Export Professional Resume PDF - Only if resume discussed */}
                            {chatAnalysis.topics.resume && (
                              <button
                                onClick={generateResumePDF}
                                className="w-full py-2.5 px-3 bg-[#17103a] hover:bg-[#20164e] border border-[#442c94] rounded-lg font-extrabold text-[10px] uppercase tracking-wider text-slate-200 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Briefcase className="w-3.5 h-3.5 text-violet-400" /> Export Professional Resume (PDF)
                              </button>
                            )}

                            {/* Apply to Matched Jobs - Only if jobs discussed */}
                            {chatAnalysis.topics.jobs && (
                              <button
                                onClick={() => {
                                  if (onNavigateTab) {
                                    onNavigateTab('jobs');
                                  }
                                }}
                                className="w-full py-2.5 px-3 bg-[#17103a] hover:bg-[#20164e] border border-[#442c94] rounded-lg font-extrabold text-[10px] uppercase tracking-wider text-slate-200 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> Apply to Matched Jobs
                              </button>
                            )}

                            {/* Save Bakery Business Plan - Only if business discussed */}
                            {chatAnalysis.topics.business && (
                              <button
                                onClick={() => {
                                  localStorage.setItem('arohi_business_plan', JSON.stringify({
                                    savedAt: new Date().toISOString(),
                                    model: 'Bakery Business Model',
                                    priorities: chatAnalysis.priorities
                                  }));
                                }}
                                className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-extrabold text-[10px] uppercase tracking-wider text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-amber-200 animate-pulse" /> Save Bakery Business Plan
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

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
                AROHI Listening... Speak in Odia (ଓଡ଼ିଆ), Hindi, English, or any language.
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

      {isVoiceCallOpen && (
        <ArohiVoiceCall 
          onClose={() => setIsVoiceCallOpen(false)} 
          language={language} 
          onNavigateTab={onNavigateTab}
          uid={user?.uid}
          onCallComplete={handleVoiceCallComplete}
        />
      )}

      {selectedCallDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#120e2e] border border-[#3b2a80] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Header */}
            <div className="bg-[#1a143f] px-6 py-4 flex items-center justify-between border-b border-[#2d2163]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                    {selectedCallDetail.isCareerRelated ? 'Arohi AI Voice Career Consultation Summary' : 'Arohi AI Voice Business Consultation Summary'}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{selectedCallDetail.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCallDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Call Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#0b0821] border border-[#2d2163] p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Call Duration</span>
                  <span className="text-sm font-black text-white mt-1 block">
                    {Math.floor(selectedCallDetail.duration / 60)}m {selectedCallDetail.duration % 60}s
                  </span>
                </div>
                <div className="bg-[#0b0821] border border-[#2d2163] p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Voice Channel</span>
                  <span className="text-sm font-black text-white mt-1 block">Zephyr Link</span>
                </div>
                <div className="bg-[#0b0821] border border-[#2d2163] p-3.5 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Focus Mode</span>
                  <span className="text-sm font-black text-white mt-1 block">
                    {selectedCallDetail.isCareerRelated ? '💡 Career / Jobs' : '🚀 Business / MSME'}
                  </span>
                </div>
              </div>

              {/* Discussion Summary Report */}
              <div className="bg-[#18123c]/50 border border-[#302170]/70 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-violet-400/10 pointer-events-none">
                  <Sparkles className="w-16 h-16" />
                </div>
                <h5 className="text-xs uppercase tracking-wider text-violet-300 font-extrabold mb-3 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Discussion Summary Report
                </h5>
                <p className="text-sm text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedCallDetail.summaryText}
                </p>
              </div>

              {/* Speech Turns / Verbatim Transcript */}
              {selectedCallDetail.turns && selectedCallDetail.turns.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1.5">
                    <Mic className="w-4 h-4" /> Verbatim Audio Transcript Log
                  </h5>
                  <div className="bg-[#09071a] border border-[#231a4f] rounded-2xl p-4 max-h-48 overflow-y-auto space-y-3 divide-y divide-[#231a4f]/40">
                    {selectedCallDetail.turns.map((turn: any, idx: number) => (
                      <div key={idx} className="pt-2.5 first:pt-0 flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${turn.speaker === 'user' ? 'text-violet-400' : 'text-emerald-400'}`}>
                          {turn.speaker === 'user' ? 'You' : 'AROHI'}
                        </span>
                        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                          {turn.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-[#140e2b] px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-[#2d2163]">
              <button
                onClick={() => {
                  try {
                    generateCallSummaryPDF(selectedCallDetail.turns || [], selectedCallDetail.duration || 0, selectedCallDetail.analysis);
                  } catch (err) {
                    console.error("PDF generation failed:", err);
                    alert("PDF Generation Failed");
                  }
                }}
                className="w-full sm:w-auto bg-[#1b153c] hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider py-3 px-5 rounded-2xl border border-[#3b2a80] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Award className="w-4 h-4 text-amber-400" /> Export Summary PDF
              </button>

              <button
                onClick={() => {
                  const discussChatId = 'discuss-call-' + Date.now();
                  const discussionChat: SavedChat = {
                    id: discussChatId,
                    title: `Ref: Call ${selectedCallDetail.date}`,
                    date: 'Today',
                    messages: [
                      {
                        id: 'ref-msg',
                        role: 'assistant',
                        content: `### 📞 Continuing from Voice Call: ${selectedCallDetail.date}
                        
Here is the core summary report we are carrying forward:
* **Focus Category:** ${selectedCallDetail.isCareerRelated ? 'Career Transition & Upskilling' : 'Entrepreneurial MSME Launch'}
* **Call Duration:** ${Math.floor(selectedCallDetail.duration / 60)} minutes and ${selectedCallDetail.duration % 60} seconds

**Advisement Brief:**
${selectedCallDetail.summaryText}

---

How would you like to build on this call summary? Ask me to detail any step, create a custom roadmap, or check matching government schemes!`,
                        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]
                  };

                  const updatedChats = [discussionChat, ...savedChats];
                  setSavedChats(updatedChats);
                  setActiveChatId(discussChatId);
                  setMessages(discussionChat.messages);
                  setSelectedCallDetail(null);
                  setActiveTab('chats');

                  if (user) {
                    updateArohiChats(updatedChats);
                  } else {
                    localStorage.setItem('guest_arohi_chats', JSON.stringify(updatedChats));
                  }
                }}
                className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-black uppercase tracking-wider py-3 px-5 rounded-2xl shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" /> Discuss with Arohi AI
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
