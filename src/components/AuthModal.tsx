import React, { useState, useEffect } from 'react';
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
  Phone,
  Smartphone,
  ChevronLeft,
  Fingerprint
} from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier } from 'firebase/auth';
import { isBiometricSupported } from '../lib/webauthn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signInWithApple, 
    signInWithPhone, 
    resetPassword,
    signInWithBiometrics,
    userData,
    updateUserProfile
  } = useAuth();

  const [activeMode, setActiveMode] = useState<'signin' | 'signup' | 'forgot' | 'phone' | 'onboarding'>('signin');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [onboardName, setOnboardName] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');

  const checkProfileCompleteness = (uData: any) => {
    if (!uData) return true; // Default to incomplete if no user data
    const phone = uData.profile?.phone || '';
    const nameVal = uData.profile?.name || uData.displayName || '';
    
    const isPhoneDefault = phone === '+91 98765 43210' || phone === '9876543210' || phone === '' || !phone;
    const isNameDefault = nameVal === 'Honored Guest' || nameVal.trim() === '' || !nameVal;
    
    return isPhoneDefault || isNameDefault;
  };

  useEffect(() => {
    if (activeMode === 'onboarding' && userData) {
      if (!onboardName) {
        if (userData.profile?.name && userData.profile.name !== 'Honored Guest') {
          setOnboardName(userData.profile.name);
        } else if (userData.displayName && userData.displayName !== 'Honored Guest') {
          setOnboardName(userData.displayName);
        }
      }
      
      if (!onboardPhone) {
        const currentPhone = userData.profile?.phone || '';
        const isPhoneDefault = currentPhone === '+91 98765 43210' || currentPhone === '9876543210' || currentPhone === '';
        if (!isPhoneDefault) {
          setOnboardPhone(currentPhone.replace(/^\+91\s*/, '').replace(/\s+/g, ''));
        }
      }
    }
  }, [activeMode, userData, onboardName, onboardPhone]);

  // Biometric Auth Support States
  const [isBioSupported, setIsBioSupported] = useState(false);
  const [hasEnrolledKey, setHasEnrolledKey] = useState(false);

  // Check biometric support when the modal is active
  useEffect(() => {
    async function checkSupport() {
      const supported = await isBiometricSupported();
      setIsBioSupported(supported);
    }
    if (isOpen) {
      checkSupport();
    }
  }, [isOpen]);

  // Check if a passkey has been registered for the input email address
  useEffect(() => {
    if (email) {
      const enrolled = !!localStorage.getItem(`recruit_biometric_${email.trim().toLowerCase()}`);
      setHasEnrolledKey(enrolled);
    } else {
      setHasEnrolledKey(false);
    }
  }, [email]);

  const handleBiometricLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please input your email address first to login using biometric scanners.");
      return;
    }
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      await signInWithBiometrics(trimmedEmail);
      setSuccess("⚡ Cryptographic signature matched! Logging in securely...");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Fingerprint / Face ID verification was rejected or cancelled.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Phone sign-in states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear Recaptcha Verifier on unmount or mode change
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {
          console.warn('Error clearing recaptcha', e);
        }
      }
    };
  }, [recaptchaVerifier]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const uData = await signInWithGoogle(role);
      if (checkProfileCompleteness(uData)) {
        setSuccess('Successfully authenticated! Please complete your mandatory profile details next...');
        setTimeout(() => {
          setSuccess(null);
          setActiveMode('onboarding');
        }, 1500);
      } else {
        setSuccess(`Successfully authenticated as ${role === 'recruiter' ? 'Startup Aspirant' : 'Student & Seeker'}! Syncing...`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = err?.message || '';
      const isPopupClosed = 
        errCode === 'auth/popup-closed-by-user' || 
        errMsg.includes('popup-closed-by-user') || 
        errCode === 'auth/cancelled-popup-request' ||
        errMsg.includes('cancelled-popup-request');

      if (isPopupClosed) {
        console.info('Google Sign-In pop-up was closed by user.');
        setError('Google Sign-In was cancelled because the pop-up was closed. If pop-ups are blocked in the preview, click "Open in New Tab" at the top-right to sign in easily!');
      } else {
        console.error('Google Sign-In error:', err);
        let displayMsg = errMsg || 'An error occurred during Google sign-in.';
        if (errCode === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
          displayMsg = 'Google Sign-In pop-up was blocked by your browser. Please allow pop-ups, or click "Open in New Tab" at the top-right.';
        }
        setError(displayMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const uData = await signInWithApple(role);
      if (checkProfileCompleteness(uData)) {
        setSuccess('Successfully authenticated! Please complete your mandatory profile details next...');
        setTimeout(() => {
          setSuccess(null);
          setActiveMode('onboarding');
        }, 1500);
      } else {
        setSuccess(`Successfully authenticated as ${role === 'recruiter' ? 'Startup Aspirant' : 'Student & Seeker'}! Syncing...`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = err?.message || '';
      const isPopupClosed = 
        errCode === 'auth/popup-closed-by-user' || 
        errMsg.includes('popup-closed-by-user') || 
        errCode === 'auth/cancelled-popup-request' ||
        errMsg.includes('cancelled-popup-request');

      if (isPopupClosed) {
        console.info('Apple Sign-In pop-up was closed by user.');
        setError('Apple Sign-In was cancelled because the pop-up was closed. If pop-ups are blocked in the preview, click "Open in New Tab" at the top-right to sign in easily!');
      } else {
        console.error('Apple Sign-In error:', err);
        let displayMsg = errMsg || 'An error occurred during Apple sign-in.';
        if (errCode === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
          displayMsg = 'Apple Sign-In pop-up was blocked by your browser. Please allow pop-ups, or click "Open in New Tab" at the top-right.';
        }
        setError(displayMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!phoneNumber) {
        throw new Error('Please enter a valid phone number.');
      }

      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.length === 10) {
          formattedPhone = `+91${formattedPhone}`;
        } else {
          throw new Error('Please include your country code (e.g., +91 for India).');
        }
      }

      // Initialize Recaptcha Verifier
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        });
        setRecaptchaVerifier(verifier);
      }

      const confirmation = await signInWithPhone(formattedPhone, verifier, role);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setSuccess(`Verification code sent successfully to ${formattedPhone}!`);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Failed to send verification code.';
      if (err.code === 'auth/invalid-phone-number') {
        errMsg = 'Invalid phone number format. Please check the number and country code.';
      } else if (err.code === 'auth/too-many-requests') {
        errMsg = 'Too many requests. Please try again later or add billing info to Firebase for higher SMS limits.';
      }
      setError(errMsg);
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
          setRecaptchaVerifier(null);
        } catch (e) {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!otp) {
        throw new Error('Please enter the 6-digit OTP code.');
      }
      if (!confirmationResult) {
        throw new Error('No OTP session found. Please request another code.');
      }

      await confirmationResult.confirm(otp);
      setSuccess('Successfully signed in with Phone! Let\'s complete your mandatory profile details...');
      setTimeout(() => {
        setSuccess(null);
        setActiveMode('onboarding');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Invalid OTP code. Please try again.';
      if (err.code === 'auth/invalid-verification-code') {
        errMsg = 'Incorrect verification code. Please try again.';
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
        const uData = await signIn(email, password);
        if (checkProfileCompleteness(uData)) {
          setSuccess('Successfully signed in! Please complete your mandatory profile details...');
          setTimeout(() => {
            setSuccess(null);
            setActiveMode('onboarding');
          }, 1500);
        } else {
          setSuccess('Successfully signed in! Syncing data...');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else if (activeMode === 'signup') {
        if (!email || !password || !name) {
          throw new Error('Please fill in all fields.');
        }
        if (!signupPhone || signupPhone.trim().length !== 10) {
          throw new Error('Please enter your valid 10-digit mobile number.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const formattedPhone = `+91 ${signupPhone.trim().slice(0, 5)} ${signupPhone.trim().slice(5)}`;
        await signUp(email, password, name, role, formattedPhone);
        setSuccess(`Account created successfully as ${role === 'recruiter' ? 'Startup Aspirant' : 'Student & Seeker'}! Welcome to Arohi AI.`);
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
        errMsg = 'Email/Password sign-in is not enabled in your Firebase project yet. Please go to your Firebase Console -> Authentication -> Sign-in method, and enable "Email/Password".';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
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

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!onboardName.trim()) {
        throw new Error('Please enter your Full Name.');
      }
      if (!onboardPhone || onboardPhone.replace(/\D/g, '').length !== 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }

      const cleanPhone = onboardPhone.replace(/\D/g, '');
      const formattedPhone = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;

      await updateUserProfile({
        name: onboardName.trim(),
        phone: formattedPhone
      });

      setSuccess('Mandatory details updated successfully! Welcome back.');
      setTimeout(() => {
        onClose();
        setActiveMode('signin');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update mandatory details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04020b]/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Central Card Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#140e34] to-[#0a061b] border-2 border-[#3b218f] rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(124,58,237,0.45)] my-8">
        
        {/* Invisible Recaptcha Anchor */}
        <div id="recaptcha-container"></div>

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
            Arohi AI Auth Portal
          </h2>
          <p className="text-xs text-slate-400 max-w-[320px] mx-auto leading-normal">
            Sign in securely to save your progress, bookmark courses, track job application statuses, and unlock all interactive dashboards.
          </p>
        </div>

        {/* Account Type Selector */}
        {activeMode !== 'forgot' && activeMode !== 'onboarding' && (
          <div className="space-y-1.5 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block text-center">
              Select Your Profile Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#070414] p-1 rounded-xl border border-[#231a4c]">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  role === 'candidate'
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-[#7c3aed] text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span className="text-base">🧑‍🎓</span>
                <span className="text-[10px] font-black uppercase tracking-wider">Student &amp; Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  role === 'recruiter'
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-[#7c3aed] text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span className="text-base">🚀</span>
                <span className="text-[10px] font-black uppercase tracking-wider">Startup Aspirant</span>
              </button>
            </div>
          </div>
        )}

        {/* Mode-specific content */}
        {activeMode === 'onboarding' ? (
          /* MANDATORY PROFILE ONBOARDING */
          <div className="space-y-4">
            <div className="p-4 bg-[#08051a] border border-[#231a4c] rounded-2xl mb-4 text-center">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
              <h3 className="text-sm font-black text-white mb-1 uppercase tracking-wider">
                Complete Your Profile Setup
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                Name and Mobile number are mandatory to access the Arohi AI platform dashboards, courses, and job boards.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                <span className="font-semibold leading-relaxed">{success}</span>
              </div>
            )}

            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    className="w-full bg-[#070414] border border-[#231a4c] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Mobile Number</label>
                <div className="relative flex">
                  <div className="flex items-center justify-center bg-[#070414] border border-[#231a4c] border-r-0 rounded-l-xl px-3 text-xs font-bold text-slate-300">
                    +91
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={onboardPhone}
                      onChange={(e) => setOnboardPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full bg-[#070414] border border-[#231a4c] rounded-r-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save &amp; Enter Dashboard</span>
                )}
              </button>
            </form>
          </div>
        ) : activeMode === 'phone' ? (
          /* PHONE SIGN-IN FLOW */
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => {
                  setActiveMode('signin');
                  setOtpSent(false);
                  setPhoneNumber('');
                  setOtp('');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Email Sign In</span>
              </button>
            </div>

            <div className="p-4 bg-[#08051a] border border-[#231a4c] rounded-2xl mb-4 text-center">
              <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
              <h3 className="text-sm font-bold text-white mb-1">
                {otpSent ? 'Enter 6-Digit OTP' : 'OTP Verification'}
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                {otpSent 
                  ? `Please enter the verification code sent to ${phoneNumber}.` 
                  : 'Fast, secure phone validation via secure SMS authentication.'}
              </p>
            </div>

            {/* OTP Form */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative flex">
                    <div className="flex items-center justify-center bg-[#070414] border border-[#231a4c] border-r-0 rounded-l-xl px-3 text-xs font-bold text-slate-300">
                      +91
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phoneNumber.replace(/^\+91/, '')}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-[#070414] border border-[#231a4c] rounded-r-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                        required
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 block">Enter your 10-digit mobile number. Country code +91 will be added automatically.</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending SMS...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Verification Code (OTP)</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full bg-[#070414] border border-[#231a4c] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 tracking-[0.5em] text-center focus:outline-none focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Verify & Sign In</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="w-full py-2 text-center text-xs text-purple-400 hover:text-purple-300 font-bold transition-all cursor-pointer"
                >
                  Change Phone Number
                </button>
              </form>
            )}
          </div>
        ) : (
          /* EMAIL/PASSWORD SIGN IN OR SIGN UP FLOW */
          <>
            {/* Tab Selection */}
            {activeMode !== 'forgot' && (
              <div className="flex bg-[#070414] p-1 rounded-xl border border-[#231a4c] mb-6">
                <button
                  onClick={() => {
                    setActiveMode('signin');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeMode === 'signin' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => {
                    setActiveMode('signup');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeMode === 'signup' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>
            )}

            {/* Error/Success alerts */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                <span className="font-semibold leading-relaxed">{success}</span>
              </div>
            )}

            {/* Active Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Full Name field (for Signup only) */}
              {activeMode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#070414] border border-[#231a4c] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Mobile Number</label>
                    <div className="relative flex">
                      <div className="flex items-center justify-center bg-[#070414] border border-[#231a4c] border-r-0 rounded-l-xl px-3 text-xs font-bold text-slate-300">
                        +91
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full bg-[#070414] border border-[#231a4c] rounded-r-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                          required
                          pattern="[0-9]{10}"
                        />
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 block">Enter your 10-digit mobile number for mandatory verification.</span>
                  </div>
                </>
              )}

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070414] border border-[#231a4c] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              {activeMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Password</label>
                    {activeMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode('forgot');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#070414] border border-[#231a4c] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {activeMode === 'signin' && 'Sign In'}
                    {activeMode === 'signup' && 'Create Account'}
                    {activeMode === 'forgot' && 'Send Reset Link'}
                  </span>
                )}
              </button>

              {/* Biometric login shortcut */}
              {activeMode === 'signin' && isBioSupported && hasEnrolledKey && (
                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#a78bfa] bg-[#120a2e] hover:bg-[#1a0e3f] border border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>SIGN IN WITH TOUCH ID / FACE ID</span>
                </button>
              )}

              {/* Back to sign in link for Forgot Password mode */}
              {activeMode === 'forgot' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('signin');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </form>

            {/* Divider */}
            {activeMode !== 'forgot' && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[#231a4c]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 bg-[#0c0820] text-[9px] font-black text-slate-500 tracking-widest">OR</span>
                </div>
              </div>
            )}

            {/* Auth Provider Selection (Social Sign-in methods stack) */}
            {activeMode !== 'forgot' && (
              <div className="space-y-2.5">
                
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-[#100a2d] hover:bg-[#1a1142] text-white font-extrabold text-xs uppercase tracking-widest py-3 px-4 rounded-xl border border-[#2e1c59] hover:border-purple-500/50 cursor-pointer flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-md"
                >
                  <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.56,11.43 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.62c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.9,0.6 -2.08,0.97 -3.3,0.97 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66C4.38,18.73 7.97,20.62 12,20.62z" fill="#34A853" />
                      <path d="M6.96,13.14a5.2,5.2 0 0 1 0,-3.28V7.2H2.9a8.96,8.96 0 0 0 0,7.9l4.06,-3.26z" fill="#FBBC05" />
                      <path d="M12,5.38c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.73 14.43,1.9 12,1.9 7.97,1.9 4.38,3.79 2.9,6.54L6.96,9.8C7.67,7.68 9.66,5.38 12,5.38z" fill="#EA4335" />
                    </g>
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={isLoading}
                  className="w-full bg-[#100a2d] hover:bg-[#1a1142] text-white font-extrabold text-xs uppercase tracking-widest py-3 px-4 rounded-xl border border-[#2e1c59] hover:border-[#3b218f] cursor-pointer flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-md"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
                  </svg>
                  <span>CONTINUE WITH APPLE</span>
                </button>

                {/* Phone Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('phone');
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#100a2d] hover:bg-[#1a1142] text-white font-extrabold text-xs uppercase tracking-widest py-3 px-4 rounded-xl border border-[#2e1c59] hover:border-cyan-500/50 cursor-pointer flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-md"
                >
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>CONTINUE WITH PHONE</span>
                </button>

              </div>
            )}
          </>
        )}

        {/* Footnote information assurance */}
        <div className="mt-8 pt-4 border-t border-purple-950/80 flex items-center justify-center gap-1.5 text-[8px] font-mono text-slate-500 tracking-wider">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>ZERO-TRUST SECURE GOOGLE, PHONE & EMAIL AUTHENTICATION</span>
        </div>

      </div>
    </div>
  );
}
