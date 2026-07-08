import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [activeMode, setActiveMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      setSuccess('Successfully authenticated with Google! Syncing...');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'An error occurred during Google sign-in.';
      const isPopupClosed = 
        err.code === 'auth/popup-closed-by-user' || 
        errMsg.includes('popup-closed-by-user') || 
        err.code === 'auth/cancelled-popup-request' ||
        errMsg.includes('cancelled-popup-request');

      if (isPopupClosed) {
        errMsg = 'The Google Sign-In pop-up was closed or blocked. If you didn\'t close it yourself, please allow pop-ups for this site, or try clicking the "Open in New Tab" button at the top-right of the preview window to sign in easily!';
      } else if (err.code === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
        errMsg = 'Google Sign-In pop-up was blocked by your browser. Please allow pop-ups, or click the "Open in New Tab" button at the top-right of the preview window to bypass browser blocks.';
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (activeMode === 'signin') {
        if (!email || !password) {
          throw new Error('Please fill in all fields.');
        }
        await signIn(email, password);
        setSuccess('Successfully signed in! Syncing data...');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (activeMode === 'signup') {
        if (!email || !password || !name) {
          throw new Error('Please fill in all fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUp(email, password, name);
        setSuccess('Account created successfully! Welcome to Recruit India.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (!email) {
          throw new Error('Please enter your email address.');
        }
        await resetPassword(email);
        setSuccess('Password reset link sent to your email.');
        setActiveMode('signin');
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'An unexpected error occurred.';
      if (err.code === 'auth/operation-not-allowed' || errMsg.includes('operation-not-allowed')) {
        errMsg = 'Email/Password sign-in is not enabled in your Firebase project yet. Please go to your Firebase Console -> Authentication -> Sign-in method, and enable "Email/Password". In the meantime, you can sign in using Google!';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'The password is too weak. Must be at least 6 characters.';
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04020b]/80 backdrop-blur-md animate-fade-in">
      
      {/* Central Card Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#140e34] to-[#0a061b] border-2 border-[#3b218f] rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(124,58,237,0.45)] overflow-hidden">
        
        {/* Decorative background laser glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 hover:bg-[#1a1140] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo and Headings */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] rounded-2xl border border-purple-400/40 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {activeMode === 'signin' ? 'Sign In' : activeMode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-normal">
            {activeMode === 'signin' 
              ? 'Access your saved progress, bookmarks, and mock histories.' 
              : activeMode === 'signup' 
              ? 'Join Recruit India to sync your progress across devices.' 
              : 'Enter your registered email to receive a password recovery link.'
            }
          </p>
        </div>

        {/* Error/Success alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <span className="font-semibold leading-relaxed">{success}</span>
          </div>
        )}

        {/* Mode selection tabs */}
        {activeMode !== 'forgot' && (
          <div className="flex bg-[#05030d] p-1 border border-purple-950/80 rounded-xl mb-5 text-xs font-bold">
            <button
              onClick={() => {
                setActiveMode('signin');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'signin' 
                  ? 'bg-[#3b218f] text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'signup' 
                  ? 'bg-[#3b218f] text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {activeMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-1">
                Your Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#05030d] border border-purple-900/40 focus:border-cyan-400 text-white placeholder-slate-700 text-xs font-bold rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400/25 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="rajesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#05030d] border border-purple-900/40 focus:border-cyan-400 text-white placeholder-slate-700 text-xs font-bold rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400/25 transition-all"
              />
            </div>
          </div>

          {activeMode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Password
                </label>
                {activeMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('forgot');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-wider cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#05030d] border border-purple-900/40 focus:border-cyan-400 text-white placeholder-slate-700 text-xs font-bold rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400/25 transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-xl shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.45)] cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 transition-all mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>PROCESSING...</span>
              </>
            ) : activeMode === 'signin' ? (
              <span>SIGN IN TO ENGINE</span>
            ) : activeMode === 'signup' ? (
              <span>CREATE ACCOUNT</span>
            ) : (
              <span>SEND RESET LINK</span>
            )}
          </button>
        </form>

        {activeMode !== 'forgot' && (
          <>
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-950/80"></div>
              </div>
              <span className="relative px-3 bg-[#0d092c] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-[#05030d] hover:bg-[#0a061b] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-purple-900/40 hover:border-purple-500/50 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 disabled:opacity-55 disabled:pointer-events-none"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.56,11.43 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.62c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.08,0.97 -3.3,0.97 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66C4.38,18.73 7.97,20.62 12,20.62z" fill="#34A853" />
                  <path d="M6.96,13.14a5.2,5.2 0 0 1 0,-3.28V7.2H2.9a8.96,8.96 0 0 0 0,7.9l4.06,-3.26z" fill="#FBBC05" />
                  <path d="M12,5.38c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.73 14.43,1.9 12,1.9 7.97,1.9 4.38,3.79 2.9,6.54L6.96,9.8C7.67,7.68 9.66,5.38 12,5.38z" fill="#EA4335" />
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
            <p className="mt-3 text-center text-[10px] text-slate-400 font-medium leading-relaxed bg-[#05030d] p-2.5 rounded-xl border border-purple-950/50">
              💡 <span className="text-purple-300 font-bold">Pop-up Tip:</span> If Google Sign-In windows get blocked or closed automatically in preview, please use the <strong className="text-cyan-400">"Open in New Tab"</strong> button on the top-right of the screen to sign in perfectly.
            </p>
          </>
        )}

        {/* Back option for forgot password mode */}
        {activeMode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setActiveMode('signin');
                setError(null);
                setSuccess(null);
              }}
              className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

        {/* Footnote information assurance */}
        <div className="mt-6 pt-4 border-t border-purple-950/80 flex items-center justify-center gap-1 text-[8px] font-mono text-slate-500 tracking-wider">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>ZERO-TRUST SECURE AUTH SYSTEM</span>
        </div>

      </div>
    </div>
  );
}
