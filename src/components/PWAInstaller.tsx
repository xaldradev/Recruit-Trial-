import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Sparkles, Smartphone, Share, PlusSquare, CheckCircle } from 'lucide-react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(() => {
    return localStorage.getItem('pwa_install_prompt_dismissed') === 'true';
  });

  useEffect(() => {
    // 1. Check if already installed / running standalone
    const standaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMode);

    if (standaloneMode) return;

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // 3. Handle Chrome/Android install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!wasDismissed) {
        // Show install prompt with a slight delay
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Handle iOS explicit check (Safari often doesn't fire beforeinstallprompt)
    if (ios && !wasDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // 5. Track successful installation
    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setIsVisible(false);
      localStorage.setItem('pwa_installed_successfully', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [wasDismissed]);

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, we display manual instructions in a modal or within the dialog
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA Installation outcome: ${outcome}`);
    if (outcome === 'accepted') {
      setIsStandalone(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setWasDismissed(true);
    localStorage.setItem('pwa_install_prompt_dismissed', 'true');
  };

  // If already installed or dismissed, do not render
  if (isStandalone || wasDismissed || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[80]">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-[#120b29] to-[#090518] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/40 p-5 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Ambient background glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
            title="Dismiss installation suggestion"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4">
            {/* App Icon Circle */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center shrink-0 border border-purple-400/20 shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 pr-6">
              <span className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5">
                <Sparkles className="w-3 h-3 animate-pulse text-amber-400" /> Mobile PWA App
              </span>
              
              <h4 className="text-sm font-extrabold text-white leading-snug tracking-tight">
                Install Recruit.org.in App
              </h4>
              
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Add to your home screen for real-time AI mentorship from AROHI, offline resume building, & instant Sarkari job updates!
              </p>

              {isIOS ? (
                /* iOS Installation Guide */
                <div className="mt-3 bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
                  <p className="text-[10px] font-bold text-amber-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-white" /> For iPhone & iPad (Safari):
                  </p>
                  <div className="text-[10px] text-slate-300 space-y-1">
                    <p className="flex items-center gap-1">
                      1. Tap the Share button <Share className="w-3 h-3 inline text-purple-400" /> at the bottom.
                    </p>
                    <p className="flex items-center gap-1">
                      2. Scroll down & tap <PlusSquare className="w-3 h-3 inline text-purple-400" /> <span className="font-extrabold text-white">"Add to Home Screen"</span>.
                    </p>
                  </div>
                </div>
              ) : (
                /* Android / Desktop Install Button */
                <div className="mt-3.5 flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-extrabold text-[11px] tracking-wider uppercase py-2 px-3 rounded-xl border border-purple-400/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-purple-900/40"
                  >
                    <Download className="w-3.5 h-3.5" /> Install App
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-extrabold text-[11px] py-2 px-3 rounded-xl transition-all"
                  >
                    Not Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
