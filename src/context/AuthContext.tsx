import React, { createContext, useContext, useEffect, useState } from 'react';
import { Application } from '../types';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { authenticateBiometricDevice } from '../lib/webauthn';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  activeGoal: string;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role?: 'candidate' | 'recruiter';
  profile: UserProfile;
  enrolledCourses: string[];
  completedModules: Record<string, string[]>;
  checkedChecklist: Record<string, boolean>;
  earnedCertificates: string[];
  savedItems: Array<{ id: string; title: string; type: string; desc: string }>;
  applications: Application[];
  arohiChats?: Array<{
    id: string;
    title: string;
    date: string;
    messages: Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
  }>;
  arohiCalls?: Array<{
    id: string;
    duration: number;
    turns: any[];
    date: string;
    summaryText: string;
    isCareerRelated: boolean;
  }>;
  diagnostics?: {
    atsScore: number;
    interviewScore: number;
    businessScore: number;
  };
  activities?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string, role?: 'candidate' | 'recruiter', phone?: string) => Promise<void>;
  signInWithGoogle: (role?: 'candidate' | 'recruiter') => Promise<any>;
  signInWithApple: (role?: 'candidate' | 'recruiter') => Promise<any>;
  signInWithPhone: (phoneNumber: string, recaptchaVerifier: any, role?: 'candidate' | 'recruiter') => Promise<any>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateCareerProgress: (progress: {
    enrolledCourses?: string[];
    completedModules?: Record<string, string[]>;
    checkedChecklist?: Record<string, boolean>;
    earnedCertificates?: Record<string, any> | string[];
  }) => Promise<void>;
  updateBookmarks: (savedItems: Array<{ id: string; title: string; type: string; desc: string }>) => Promise<void>;
  updateApplications: (applications: Application[]) => Promise<void>;
  updateArohiChats: (arohiChats: any[]) => Promise<void>;
  updateArohiCalls: (arohiCalls: any[]) => Promise<void>;
  updateDiagnostics: (diagnostics: {
    atsScore?: number;
    interviewScore?: number;
    businessScore?: number;
  }) => Promise<void>;
  updateActivities: (activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>) => Promise<void>;
  signInWithBiometrics: (email: string) => Promise<void>;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch or create user data with multiple fallback layers
  const loadAndSyncUserData = async (firebaseUser: any, role?: 'candidate' | 'recruiter'): Promise<UserData> => {
    const uid = firebaseUser.uid;
    const email = firebaseUser.email || '';
    const displayName = firebaseUser.displayName || 'Honored Guest';

    // Layer 1: Server-side API proxy (fast, server-to-server, 100% immune to iframe/browser WebSocket blocks)
    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData?.success && resData?.userData) {
          const uData = resData.userData as UserData;
          localStorage.setItem(`recruit_user_data_${uid}`, JSON.stringify(uData));
          return uData;
        }
      }
    } catch (err) {
      console.warn("Resilient Auth: Server-side '/api/auth/me' call failed. Trying next layer.", err);
    }

    // Layer 2: Server-side google-sync / signup API proxy (makes sure user is initialized)
    try {
      const response = await fetch('/api/auth/google-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email, displayName, role })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData?.success && resData?.userData) {
          const uData = resData.userData as UserData;
          localStorage.setItem(`recruit_user_data_${uid}`, JSON.stringify(uData));
          return uData;
        }
      }
    } catch (err) {
      console.warn("Resilient Auth: Server-side '/api/auth/google-sync' call failed. Trying next layer.", err);
    }

    // Layer 3: Direct Client-side Firestore SDK (sometimes works if browser has no iframe security block)
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap && docSnap.exists()) {
        const uData = docSnap.data() as UserData;
        localStorage.setItem(`recruit_user_data_${uid}`, JSON.stringify(uData));
        return uData;
      } else {
        // Create initial user doc client-side if missing
        const initialData: UserData = {
          uid,
          email,
          displayName,
          role: role || 'candidate',
          profile: {
            name: displayName,
            email: email,
            phone: '+91 98765 43210',
            location: 'Delhi NCR',
            education: (role || 'candidate') === 'recruiter' ? 'Business Owner' : 'Graduate',
            activeGoal: (role || 'candidate') === 'recruiter' ? 'Mudra Loan Business & Franchise Setup' : 'Skills, Courses & Career Preparation'
          },
          enrolledCourses: [],
          completedModules: {},
          checkedChecklist: {},
          earnedCertificates: [],
          savedItems: [
            { id: '1', title: 'PM Mudra Loan Scheme', type: 'Scheme', desc: 'Collateral free funding' },
            { id: '2', title: 'Full-Stack JavaScript certification', type: 'Course', desc: '12 Weeks upskilling path' }
          ],
          applications: [],
          diagnostics: {
            atsScore: 74,
            interviewScore: 0,
            businessScore: 84
          },
          activities: []
        };
        await setDoc(docRef, initialData);
        localStorage.setItem(`recruit_user_data_${uid}`, JSON.stringify(initialData));
        return initialData;
      }
    } catch (err) {
      console.warn("Resilient Auth: Client-side Firestore direct SDK call failed. Trying cache fallback.", err);
    }

    // Layer 4: Local Storage Cached Data (Ultimate robust offline operation)
    const cached = localStorage.getItem(`recruit_user_data_${uid}`);
    if (cached) {
      try {
        return JSON.parse(cached) as UserData;
      } catch (e) {
        console.error("Failed to parse cached user data:", e);
      }
    }

    // Layer 5: Fallback default object (never let the UI crash or spinner spin forever)
    const fallbackData: UserData = {
      uid,
      email,
      displayName,
      role: role || 'candidate',
      profile: {
        name: displayName,
        email: email,
        phone: '+91 98765 43210',
        location: 'Delhi NCR',
        education: (role || 'candidate') === 'recruiter' ? 'Business Owner' : 'Graduate',
        activeGoal: (role || 'candidate') === 'recruiter' ? 'Mudra Loan Business & Franchise Setup' : 'Skills, Courses & Career Preparation'
      },
      enrolledCourses: [],
      completedModules: {},
      checkedChecklist: {},
      earnedCertificates: [],
      savedItems: [
        { id: '1', title: 'PM Mudra Loan Scheme', type: 'Scheme', desc: 'Collateral free funding' },
        { id: '2', title: 'Full-Stack JavaScript certification', type: 'Course', desc: '12 Weeks upskilling path' }
      ],
      applications: [],
      diagnostics: {
        atsScore: 74,
        interviewScore: 0,
        businessScore: 84
      },
      activities: []
    };
    localStorage.setItem(`recruit_user_data_${uid}`, JSON.stringify(fallbackData));
    return fallbackData;
  };

  // Monitor auth state from Firebase client SDK
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const loggedUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          };
          setUser(loggedUser);
          localStorage.setItem('recruit_user', JSON.stringify(loggedUser));

          const storedRole = sessionStorage.getItem('recruit_phone_signup_role') as 'candidate' | 'recruiter' | null;
          if (storedRole) {
            sessionStorage.removeItem('recruit_phone_signup_role');
          }

          // Fetch up-to-date userData through our multi-layer resilient function
          const data = await loadAndSyncUserData(firebaseUser, storedRole || undefined);
          setUserData(data);
        } else {
          setUser(null);
          setUserData(null);
          localStorage.removeItem('recruit_user');
        }
      } catch (err) {
        console.error("Error inside onAuthStateChanged:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const loggedUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      };
      setUser(loggedUser);
      localStorage.setItem('recruit_user', JSON.stringify(loggedUser));

      // Fetch user document
      const data = await loadAndSyncUserData(firebaseUser);
      setUserData(data);
      return data;
    } catch (clientErr: any) {
      console.warn("Client sign-in failed. Trying server-side proxy fallback...", clientErr);
      
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const resData = await response.json();
        if (response.ok && resData?.success && resData?.user) {
          const loggedUser: User = {
            uid: resData.user.uid,
            email: resData.user.email,
            displayName: resData.user.displayName
          };
          setUser(loggedUser);
          localStorage.setItem('recruit_user', JSON.stringify(loggedUser));
          setUserData(resData.userData);
          return resData.userData;
        } else {
          throw new Error(resData?.error || 'Server-side sign-in failed.');
        }
      } catch (serverErr: any) {
        console.error("Server-side proxy fallback failed:", serverErr);
        // Highlight the possible API Key restriction in Google Cloud Console
        let customMessage = clientErr.message || 'Authentication failed.';
        if (customMessage.includes('api-key-not-valid')) {
          customMessage = 'Firebase Client Error: (auth/api-key-not-valid). Please check if your Google Cloud API Key is restricted to select domains/APIs in your GCP Console -> Credentials, or let us assist you!';
        }
        throw new Error(customMessage);
      }
    }
  };

  const signUp = async (email: string, password: string, name: string, role?: 'candidate' | 'recruiter', phone?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name in Firebase Auth
      await updateProfile(firebaseUser, { displayName: name });

      const initialData: UserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: name,
        role: role || 'candidate',
        profile: {
          name: name,
          email: firebaseUser.email || '',
          phone: phone || '+91 98765 43210',
          location: 'Delhi NCR',
          education: (role || 'candidate') === 'recruiter' ? 'Business Owner' : 'Graduate',
          activeGoal: (role || 'candidate') === 'recruiter' ? 'Mudra Loan Business & Franchise Setup' : 'Skills, Courses & Career Preparation'
        },
        enrolledCourses: [],
        completedModules: {},
        checkedChecklist: {},
        earnedCertificates: [],
        savedItems: [
          { id: '1', title: 'PM Mudra Loan Scheme', type: 'Scheme', desc: 'Collateral free funding' },
          { id: '2', title: 'Full-Stack JavaScript certification', type: 'Course', desc: '12 Weeks upskilling path' }
        ],
        applications: [],
        diagnostics: {
          atsScore: 74,
          interviewScore: 0,
          businessScore: 84
        },
        activities: []
      };

      // Attempt registration/sync via server-side first
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: name,
            role: role || 'candidate',
            mobile: phone || ''
          })
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData?.success && resData?.userData) {
            setUserData(resData.userData);
            localStorage.setItem(`recruit_user_data_${firebaseUser.uid}`, JSON.stringify(resData.userData));
            return;
          }
        }
      } catch (err) {
        console.warn("Server signup endpoint failed, using client fallback", err);
      }

      // Direct Client-side Firestore write fallback
      const docRef = doc(db, 'users', firebaseUser.uid);
      try {
        await setDoc(docRef, initialData);
      } catch (err) {
        console.warn("Client-side setDoc on signup failed, continuing offline", err);
      }

      const loggedUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name
      };
      setUser(loggedUser);
      setUserData(initialData);
      localStorage.setItem('recruit_user', JSON.stringify(loggedUser));
      localStorage.setItem(`recruit_user_data_${firebaseUser.uid}`, JSON.stringify(initialData));
    } catch (clientErr: any) {
      console.warn("Client sign-up failed. Trying server-side proxy fallback...", clientErr);
      
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role: role || 'candidate', mobile: phone || '' })
        });
        
        const resData = await response.json();
        if (response.ok && resData?.success && resData?.user) {
          const loggedUser: User = {
            uid: resData.user.uid,
            email: resData.user.email,
            displayName: resData.user.displayName
          };
          setUser(loggedUser);
          localStorage.setItem('recruit_user', JSON.stringify(loggedUser));
          setUserData(resData.userData);
          return;
        } else {
          throw new Error(resData?.error || 'Server-side registration failed.');
        }
      } catch (serverErr: any) {
        console.error("Server-side proxy fallback failed:", serverErr);
        let customMessage = clientErr.message || 'Registration failed.';
        if (customMessage.includes('api-key-not-valid')) {
          customMessage = 'Firebase Client Error: (auth/api-key-not-valid). Please check if your Google Cloud API Key is restricted in your GCP Console -> Credentials!';
        }
        throw new Error(customMessage);
      }
    }
  };

  const signInWithGoogle = async (role?: 'candidate' | 'recruiter') => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const loggedUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName
    };
    setUser(loggedUser);
    localStorage.setItem('recruit_user', JSON.stringify(loggedUser));

    // Fetch user document
    const data = await loadAndSyncUserData(firebaseUser, role);
    setUserData(data);
    return data;
  };

  const signInWithApple = async (role?: 'candidate' | 'recruiter') => {
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const loggedUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || 'Apple User'
    };
    setUser(loggedUser);
    localStorage.setItem('recruit_user', JSON.stringify(loggedUser));

    // Fetch user document
    const data = await loadAndSyncUserData(firebaseUser, role);
    setUserData(data);
    return data;
  };

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: any, role?: 'candidate' | 'recruiter') => {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    
    // Store the desired role in session storage/local storage so we can associate it when confirmation finishes (if needed)
    if (role) {
      sessionStorage.setItem('recruit_phone_signup_role', role);
    }
    return confirmationResult;
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    localStorage.removeItem('recruit_user');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signInWithBiometrics = async (email: string) => {
    const emailKey = email.trim().toLowerCase();
    const rawRecord = localStorage.getItem(`recruit_biometric_${emailKey}`);
    if (!rawRecord) {
      throw new Error("No enrolled biometric credentials found on this device for this email. Please sign in with email/password first, then enroll this device in your Profile.");
    }

    const verified = await authenticateBiometricDevice(emailKey);
    if (!verified) {
      throw new Error("Biometric verification was rejected.");
    }

    const storedUserStr = localStorage.getItem(`recruit_biometric_user_${emailKey}`);
    if (!storedUserStr) {
      throw new Error("Biometric association context not found. Please sign in with email/password once to sync.");
    }

    const cachedUser = JSON.parse(storedUserStr);
    const loggedUser: User = {
      uid: cachedUser.uid,
      email: cachedUser.email,
      displayName: cachedUser.displayName || email.split('@')[0]
    };

    setUser(loggedUser);
    localStorage.setItem('recruit_user', JSON.stringify(loggedUser));

    try {
      const data = await loadAndSyncUserData({ uid: cachedUser.uid, email: cachedUser.email } as any);
      setUserData(data);
    } catch (err) {
      console.warn("Could not load real-time Firestore user data during biometric login. Loading local cache...", err);
      const localDataStr = localStorage.getItem(`recruit_user_data_${cachedUser.uid}`);
      if (localDataStr) {
        setUserData(JSON.parse(localDataStr));
      }
    }
  };

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;
    const currentProfile = userData?.profile || {};
    const updatedProfile = { ...currentProfile, ...profileUpdate };
    const updatedUserData = userData ? { 
      ...userData, 
      profile: updatedProfile as UserProfile,
      displayName: profileUpdate.name || userData.displayName
    } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API (preferred, robust)
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, profile: profileUpdate })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side profile update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      const updatePayload: any = {
        profile: updatedProfile,
        updatedAt: new Date().toISOString()
      };
      if (profileUpdate.name) {
        updatePayload.displayName = profileUpdate.name;
      }
      await updateDoc(docRef, updatePayload);
    } catch (err) {
      console.warn("Both server-side and client-side Firestore profile updates failed. Changes saved locally.", err);
    }
  };

  const updateCareerProgress = async (progress: {
    enrolledCourses?: string[];
    completedModules?: Record<string, string[]>;
    checkedChecklist?: Record<string, boolean>;
    earnedCertificates?: string[];
  }) => {
    if (!user) return;
    const updatedUserData = userData ? { ...userData, ...progress } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, progress })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side career progress update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      const updatePayload: any = {};
      if (progress.enrolledCourses) updatePayload.enrolledCourses = progress.enrolledCourses;
      if (progress.completedModules) updatePayload.completedModules = progress.completedModules;
      if (progress.checkedChecklist) updatePayload.checkedChecklist = progress.checkedChecklist;
      if (progress.earnedCertificates) updatePayload.earnedCertificates = progress.earnedCertificates;
      updatePayload.updatedAt = new Date().toISOString();
      await updateDoc(docRef, updatePayload);
    } catch (err) {
      console.warn("Both server-side and client-side Firestore career updates failed. Changes saved locally.", err);
    }
  };

  const updateBookmarks = async (savedItems: Array<{ id: string; title: string; type: string; desc: string }>) => {
    if (!user) return;
    const updatedUserData = userData ? { ...userData, savedItems } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, savedItems })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side bookmarks update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        savedItems,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Both server-side and client-side Firestore bookmarks updates failed. Changes saved locally.", err);
    }
  };

  const updateApplications = async (applications: Application[]) => {
    if (!user) return;
    const updatedUserData = userData ? { ...userData, applications } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, applications })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side applications update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        applications,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Both server-side and client-side Firestore applications updates failed. Changes saved locally.", err);
    }
  };

  const updateArohiChats = async (arohiChats: any[]) => {
    if (!user) return;
    const updatedUserData = userData ? { ...userData, arohiChats } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-arohi-chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, arohiChats })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side arohi-chats update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        arohiChats,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Both server-side and client-side Firestore arohi-chats updates failed. Changes saved locally.", err);
    }
  };

  const updateArohiCalls = async (arohiCalls: any[]) => {
    if (!user) return;
    const updatedUserData = userData ? { ...userData, arohiCalls } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-arohi-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, arohiCalls })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side arohi-calls update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        arohiCalls,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Both server-side and client-side Firestore arohi-calls updates failed. Changes saved locally.", err);
    }
  };

  const updateDiagnostics = async (diagnosticsUpdate: {
    atsScore?: number;
    interviewScore?: number;
    businessScore?: number;
  }) => {
    if (!user) return;
    const currentDiagnostics = userData?.diagnostics || { atsScore: 74, interviewScore: 0, businessScore: 84 };
    const updatedDiagnostics = { ...currentDiagnostics, ...diagnosticsUpdate };
    const updatedUserData = userData ? { ...userData, diagnostics: updatedDiagnostics } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, diagnostics: updatedDiagnostics })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side diagnostics update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        diagnostics: updatedDiagnostics,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Both server-side and client-side Firestore diagnostics updates failed. Changes saved locally.", err);
    }
  };

  const updateActivities = async (activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>) => {
    if (!user) return;
    const updatedUserData = userData ? { ...userData, activities } : null;

    // Optimistically update local state & cache
    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(updatedUserData));
    }

    // Layer 1: Server-side API
    try {
      const response = await fetch('/api/auth/update-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, activities })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userData) {
          setUserData(data.userData);
          localStorage.setItem(`recruit_user_data_${user.uid}`, JSON.stringify(data.userData));
          return;
        }
      }
    } catch (err) {
      console.warn("Server-side activities update failed, attempting direct client-side Firestore SDK:", err);
    }

    // Layer 2: Client-side Firestore SDK fallback
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        activities,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Both server-side and client-side Firestore activities updates failed. Changes saved locally.", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithApple,
      signInWithPhone,
      signOutUser,
      resetPassword,
      signInWithBiometrics,
      updateUserProfile,
      updateCareerProgress,
      updateBookmarks,
      updateApplications,
      updateArohiChats,
      updateArohiCalls,
      updateDiagnostics,
      updateActivities
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
