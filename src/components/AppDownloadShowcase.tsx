import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Download, 
  Apple, 
  Share, 
  PlusSquare, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  ArrowRight, 
  QrCode,
  SmartphoneCharging,
  Wifi,
  Battery,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AppDownloadShowcase() {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('0 MB/s');
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [isDownloadComplete, setIsDownloadComplete] = useState(false);
  const downloadTimerRef = useRef<any>(null);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsPwaInstalled(isStandalone);

    // Listen for the native browser install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) {
      alert("PWA installer is already active in your system or your browser has pre-registered it. Use our direct APK download below for full instant access!");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const startSimulatedApkDownload = () => {
    if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
    setIsDownloadComplete(false);
    setDownloadProgress(0);
    setDownloadSpeed('1.2 MB/s');
    setDownloadStatus('Resolving secure CDN mirror in Mumbai...');

    let currentProgress = 0;
    const stages = [
      { threshold: 10, msg: 'Handshaking SSL certificates with core repo...' },
      { threshold: 30, msg: 'Downloading Recruit_v2.4_Stable.apk [14.2 MB]...' },
      { threshold: 55, msg: 'Caching visual assets and offline databases...' },
      { threshold: 75, msg: 'Injecting AROHI AI local audio drivers...' },
      { threshold: 90, msg: 'Verifying integrity checksum (SHA-256)...' },
      { threshold: 100, msg: 'Finalizing security package clearance...' }
    ];

    downloadTimerRef.current = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setDownloadProgress(100);
        setIsDownloadComplete(true);
        setDownloadStatus('Package ready! Tap APK to install.');
        clearInterval(downloadTimerRef.current);
        
        // Trigger a fake real download of a dummy/readme text file renamed as .apk or just simulated complete
        const element = document.createElement("a");
        const file = new Blob(["Recruit.org.in - Direct PWA APK Installer package wrapper. Please proceed to add to home screen or use standard PWA installation."], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "Recruit_v2.4_Stable.apk";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        setDownloadProgress(currentProgress);
        // Vary download speed realistically
        const speed = (Math.random() * 6 + 4).toFixed(1) + ' MB/s';
        setDownloadSpeed(speed);
        
        // Update stage message
        const currentStage = stages.find(s => currentProgress <= s.threshold);
        if (currentStage) {
          setDownloadStatus(currentStage.msg);
        }
      }
    }, 150);
  };

  // Simulated notification list inside mock phone
  const [phoneNotification, setPhoneNotification] = useState<string>('🔔 New Sarkari Alert: RRB JE positions opened!');
  useEffect(() => {
    const notifications = [
      '🔔 New Sarkari Alert: RRB JE positions opened!',
      '🤖 AROHI: "Your customized resume scored 94%!"',
      '📈 Trend: Cybersecurity skills up 45% in Bengaluru',
      '💼 Elite Job: Sr. Software Engineer in Noida [₹24LPA]',
      '💬 Recruiter Meera viewed your profile 2m ago',
      '🎖️ Skill Unlocked: Advanced React State Models'
    ];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % notifications.length;
      setPhoneNotification(notifications[i]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="app-download-visual-showcase" className="w-full relative z-10 mb-12 mt-16 px-0 select-none">
      
      {/* Container Card */}
      <div className="bg-gradient-to-br from-[#0e0a26] via-[#070417] to-[#140b2f] border border-[#2b1b54]/80 rounded-[2.5rem] shadow-[0_15px_45px_rgba(124,58,237,0.15)] overflow-hidden p-6 sm:p-10 lg:p-12 relative">
        
        {/* Glowing background meshes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Block: Information & Platform value */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#00e676]/10 border border-[#00e676]/30 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00e676] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>INSTALL RECRUIT.ORG.IN SECURE ENGINE</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Get <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">India’s Smartest Career App</span> Directly on Your Device
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
                Experience high-speed, instant-access job pipelines, real-time feedback with AROHI AI coaching, offline state resume caching, and instant notification triggers without ever launching your browser.
              </p>
            </div>

            {/* Quick Benefits list */}
            <div className="grid grid-cols-2 gap-3 pb-2">
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-white block uppercase">⚡ Ultra-Lightweight</span>
                  <span className="text-[9px] text-slate-400 font-bold">Takes less than 14MB space</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-white block uppercase">🤖 Arohi Voice AI</span>
                  <span className="text-[9px] text-slate-400 font-bold">Guided interview prep inside</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-white block uppercase">🔒 SSL Protected</span>
                  <span className="text-[9px] text-slate-400 font-bold">100% Secure offline cache</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2.5 rounded-xl">
                <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-white block uppercase">🔔 Realtime Sync</span>
                  <span className="text-[9px] text-slate-400 font-bold">Instant updates on jobs</span>
                </div>
              </div>
            </div>

            {/* Platform Tab Switchers */}
            <div className="bg-[#0b081f]/90 border border-[#231749] p-1.5 rounded-2xl flex gap-1 max-w-xs">
              <button
                onClick={() => {
                  setActivePlatform('android');
                  setDownloadProgress(null);
                  setIsDownloadComplete(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activePlatform === 'android' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                Android Version
              </button>
              <button
                onClick={() => {
                  setActivePlatform('ios');
                  setDownloadProgress(null);
                  setIsDownloadComplete(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activePlatform === 'ios' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/40' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Apple className="w-4 h-4 shrink-0" />
                Apple iOS
              </button>
            </div>

            {/* Platform Content Wrapper */}
            <div className="bg-[#0b081e]/60 border border-[#221644]/80 p-5 rounded-3xl min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <AnimatePresence mode="wait">
                {activePlatform === 'android' ? (
                  <motion.div
                    key="android-panel"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                        Android Direct Deployment Engine
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Download and deploy the Android executable directly on your phone to start applying.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Option A: Quick PWA Native install */}
                      <button
                        onClick={handleNativeInstall}
                        className="flex-1 bg-[#1a143f] hover:bg-[#251e59] text-white font-extrabold text-[11px] uppercase tracking-wider py-3.5 px-4 rounded-xl border border-[#3b2d7d]/80 hover:border-[#4d3ca3] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-inner group active:scale-95"
                      >
                        <SmartphoneCharging className="w-4 h-4 text-[#00e676] group-hover:scale-110 transition-transform" />
                        <div className="text-left leading-tight">
                          <span className="block text-[11px] font-black">Native App Prompt</span>
                          <span className="block text-[8px] text-slate-400 font-bold">Standard PWA setup</span>
                        </div>
                      </button>

                      {/* Option B: Direct Offline APK download */}
                      <button
                        onClick={startSimulatedApkDownload}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] uppercase tracking-wider py-3.5 px-4 rounded-xl border border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-950/40 group active:scale-95"
                      >
                        <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                        <div className="text-left leading-tight">
                          <span className="block text-[11px] font-black">Direct APK Package</span>
                          <span className="block text-[8px] text-emerald-200 font-bold">Safe Local download [14.2MB]</span>
                        </div>
                      </button>
                    </div>

                    {/* Progress tracking display */}
                    {downloadProgress !== null && (
                      <div className="bg-[#05030f] border border-[#1f153a] rounded-xl p-3.5 space-y-2 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                          <span className="text-purple-400 uppercase tracking-widest animate-pulse">{downloadStatus}</span>
                          <span className="text-emerald-400">{downloadProgress}%</span>
                        </div>
                        <div className="w-full bg-purple-950/40 rounded-full h-2.5 overflow-hidden border border-purple-900/30">
                          <div 
                            className="bg-gradient-to-r from-purple-500 via-indigo-400 to-[#00e676] h-full rounded-full transition-all duration-150"
                            style={{ width: `${downloadProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold font-mono">
                          <span>Speed: {downloadSpeed}</span>
                          <span>Progress: {((downloadProgress / 100) * 14.2).toFixed(1)} MB / 14.2 MB</span>
                        </div>

                        {isDownloadComplete && (
                          <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-emerald-400 animate-in slide-in-from-top-1 duration-200">
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 animate-bounce" />
                            <div>
                              <p className="text-[10px] font-black uppercase">Download Completed Successfully!</p>
                              <p className="text-[9px] text-slate-400 leading-normal font-medium mt-0.5">
                                If installer does not boot automatically, click <span className="text-emerald-400 font-bold font-mono">Recruit_v2.4_Stable.apk</span> in your notification panel to initiate setup. Allow "Install from Unknown Sources" if prompted.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="ios-panel"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Apple className="w-4 h-4 text-purple-400 shrink-0" />
                        iOS Safari Fast-Track Deployment
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Apple guidelines do not require the App Store. Setup our high-performance client shell instantly using Safari in just 3 steps.
                      </p>
                    </div>

                    {/* Stepper with visualization inside app */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5">
                      <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-left space-y-1 relative">
                        <span className="text-[8px] bg-purple-600/35 px-1.5 py-0.5 rounded text-purple-200 font-mono font-bold absolute top-2 right-2">STEP 1</span>
                        <Share className="w-4 h-4 text-blue-400" />
                        <h4 className="text-[10px] font-bold text-slate-200 mt-1 uppercase">Tap Share</h4>
                        <p className="text-[9px] text-slate-400 leading-tight">Press Safari’s share button in the bottom menu rail.</p>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-left space-y-1 relative">
                        <span className="text-[8px] bg-purple-600/35 px-1.5 py-0.5 rounded text-purple-200 font-mono font-bold absolute top-2 right-2">STEP 2</span>
                        <PlusSquare className="w-4 h-4 text-purple-400" />
                        <h4 className="text-[10px] font-bold text-slate-200 mt-1 uppercase">Add to Screen</h4>
                        <p className="text-[9px] text-slate-400 leading-tight">Scroll down the menu list &amp; select "Add to Home Screen".</p>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-left space-y-1 relative">
                        <span className="text-[8px] bg-emerald-600/35 px-1.5 py-0.5 rounded text-emerald-200 font-mono font-bold absolute top-2 right-2">STEP 3</span>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-[10px] font-bold text-slate-200 mt-1 uppercase">Launch App</h4>
                        <p className="text-[9px] text-slate-400 leading-tight">Tap "Add" in the top corner. Enjoy full native dashboard!</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Block: Live Interactive 3D Phone Mockup & QR Scan Center */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
            
            {/* 1. Phone Bezel container */}
            <div className="relative w-[210px] h-[410px] bg-[#0c0924] rounded-[2.5rem] border-4 border-slate-700/60 p-2.5 shadow-[0_25px_60px_rgba(124,58,237,0.25)] flex flex-col justify-between overflow-hidden group shrink-0 select-none">
              
              {/* Dynamic light refraction reflection effect across glass */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-30" />
              
              {/* Speaker Bar & Camera Hole Dot */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-10 h-1.5 bg-slate-850 rounded-full ml-1.5" />
              </div>

              {/* Top status bar inside phone */}
              <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-400 pt-3 px-2.5">
                <div className="flex items-center gap-1">
                  <span>9:41</span>
                  <Wifi className="w-2.5 h-2.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <Battery className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* Main screen live preview container */}
              <div className="flex-1 bg-[#090616] rounded-[2rem] border border-[#2b1f5a] mt-1 mb-1 p-2.5 flex flex-col justify-between overflow-hidden relative">
                
                {/* Simulated App Logo Header */}
                <div className="flex items-center justify-between border-b border-[#211746] pb-1.5 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">🎓</span>
                    <span className="text-[9px] font-black text-white uppercase tracking-tight">Recruit India</span>
                  </div>
                  <span className="text-[7px] font-black bg-[#00e676]/10 text-[#00e676] px-1 py-0.5 rounded border border-[#00e676]/25">LIVE v2.4</span>
                </div>

                {/* Simulated content panel */}
                <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-2 relative">
                  
                  {/* Rotating Live notification alert panel */}
                  <div className="w-full bg-[#1c1240]/80 border border-[#482c8b]/60 p-2 rounded-xl text-left space-y-1 relative shadow-lg">
                    <span className="text-[7px] font-black text-purple-300 uppercase tracking-widest block font-mono">AROHI CORE UPDATE</span>
                    <p className="text-[9px] font-bold text-white leading-normal line-clamp-2">
                      {phoneNotification}
                    </p>
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                  </div>

                  {/* Pulsing visual core inside phone */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Ring animations */}
                    <div className="absolute inset-0 border-2 border-dashed border-purple-500/20 rounded-full animate-spin [animation-duration:15s]" />
                    <div className="absolute inset-1.5 border border-cyan-500/35 rounded-full animate-pulse" />
                    
                    {/* AROHI Avatar sphere */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-[#7c3aed] to-cyan-400 flex items-center justify-center shadow-lg border border-purple-300/20">
                      <span className="text-xs font-black text-white animate-bounce">🤖</span>
                    </div>
                  </div>

                  {/* Simulated App metrics */}
                  <div className="grid grid-cols-2 gap-1.5 w-full">
                    <div className="bg-[#120a28] p-1.5 rounded-lg text-center border border-white/5">
                      <span className="text-[7px] text-slate-400 block font-bold uppercase">MATCHING SCORE</span>
                      <span className="text-[11px] font-black text-[#00e676]">98%</span>
                    </div>
                    <div className="bg-[#120a28] p-1.5 rounded-lg text-center border border-white/5">
                      <span className="text-[7px] text-slate-400 block font-bold uppercase">MOCK RECORDED</span>
                      <span className="text-[11px] font-black text-cyan-400">4 / 4 OK</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Bottom Tab icons */}
                <div className="border-t border-[#1a113a] pt-1.5 flex justify-between items-center px-1.5 text-slate-500 text-[8px] font-bold font-mono">
                  <span className="text-purple-400 font-extrabold flex flex-col items-center gap-0.5"><Smartphone className="w-3.5 h-3.5" />Home</span>
                  <span className="flex flex-col items-center gap-0.5"><Layers className="w-3.5 h-3.5" />Jobs</span>
                  <span className="flex flex-col items-center gap-0.5"><Zap className="w-3.5 h-3.5" />Skills</span>
                </div>
              </div>

              {/* Screen Home Notch Button at the bottom */}
              <div className="w-20 h-1 bg-slate-600/70 rounded-full mx-auto mb-1" />
            </div>

            {/* 2. QR Code Scanner Visual Card */}
            <div className="backdrop-blur-xl bg-[#09051d]/85 border border-[#301b63]/80 p-5 rounded-3xl shadow-xl space-y-4 max-w-[200px] text-center relative shrink-0">
              
              {/* Scan laser animation overlay */}
              <div className="absolute top-0 left-0 w-full h-[220px] pointer-events-none overflow-hidden rounded-t-3xl">
                <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] absolute animate-bounce" style={{ top: '35%', animationDuration: '4s' }} />
              </div>

              <div className="w-[140px] h-[140px] mx-auto bg-gradient-to-br from-purple-950/40 to-slate-950/60 p-2.5 rounded-2xl border border-[#3b2184] flex items-center justify-center relative">
                {/* Real look stylized pixel QR code block */}
                <QrCode className="w-full h-full text-purple-400 stroke-[1.25]" />
                
                {/* Small central brand icon inside QR code */}
                <div className="absolute w-8 h-8 rounded-lg bg-[#070417] border border-cyan-400 flex items-center justify-center shadow-lg">
                  <span className="text-xs">🎓</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-slate-200 uppercase tracking-wider">Fast-Scan QR code</h4>
                <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                  Point your smartphone camera to load standard installer instantly on iOS/Android
                </p>
              </div>

              <div className="flex justify-center items-center gap-1.5 pt-1 text-[8px] font-mono text-[#00e676] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-ping" />
                Verified SECURE PACKAGE
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
