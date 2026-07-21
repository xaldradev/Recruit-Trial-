import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { createResumeDocx } from './server-resume.ts';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

// Setup global error and console logging redirection to diagnose server runtime behavior
const errorLogPath = path.join(process.cwd(), 'server-errors.log');
function logServerOutput(type: string, ...args: any[]) {
  try {
    const time = new Date().toISOString();
    const message = args.map(arg => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack}`;
      }
      return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
    }).join(' ');
    fs.appendFileSync(errorLogPath, `[${time}] [${type}] ${message}\n`, 'utf8');
  } catch (err) {}
}

const originalConsoleError = console.error;
const originalConsoleLog = console.log;

console.error = (...args: any[]) => {
  logServerOutput('ERROR', ...args);
  originalConsoleError(...args);
};

console.log = (...args: any[]) => {
  logServerOutput('LOG', ...args);
  originalConsoleLog(...args);
};

process.on('uncaughtException', (err) => {
  logServerOutput('UNCAUGHT_EXCEPTION', err);
  originalConsoleError('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  logServerOutput('UNHANDLED_REJECTION', reason);
  originalConsoleError('Unhandled Rejection at:', promise, 'reason:', reason);
});


// Initialize Firebase Admin SDK
let adminApp: any = null;
let adminDb: any = null;
try {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountVar && serviceAccountVar.trim()) {
    const trimmed = serviceAccountVar.trim();
    if (trimmed.startsWith('{')) {
      try {
        const serviceAccount = JSON.parse(trimmed);
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: 'recruit-auth-515f9',
        });
        console.log('Firebase Admin SDK initialized successfully with service account credential.');
      } catch (parseErr: any) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', parseErr.message || parseErr);
        console.warn('Initializing Firebase Admin SDK without credentials as a fallback...');
        adminApp = initializeApp({
          projectId: 'recruit-auth-515f9',
        });
      }
    } else {
      console.warn('=========================================');
      console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is set but does not look like a JSON service account private key.');
      if (trimmed.startsWith('AIzaSy')) {
        console.warn('It appears you have pasted a Firebase client/Web API Key ("AIzaSy...") into FIREBASE_SERVICE_ACCOUNT instead of a Service Account key.');
        console.warn('A Firebase Service Account must be a full JSON object starting with "{" and ending with "}".');
        console.warn('To get one: Go to Firebase Console -> Project Settings -> Service Accounts -> "Generate new private key".');
      }
      console.warn('Initializing Firebase Admin SDK without credentials as a fallback...');
      console.warn('=========================================');
      adminApp = initializeApp({
        projectId: 'recruit-auth-515f9',
      });
    }
  } else {
    adminApp = initializeApp({
      projectId: 'recruit-auth-515f9',
    });
    console.log('Firebase Admin SDK initialized with default credentials.');
  }
  adminDb = getFirestore(adminApp);
} catch (err: any) {
  console.error('Failed to initialize Firebase Admin SDK:', err.message || err);
}

// Resilient persistent local database fallback for users
const inMemoryUsers = new Map<string, any>();
const LOCAL_DB_PATH = path.join(process.cwd(), 'users-local-db.json');

// Resilient persistent local database fallback for voice call logs
const inMemoryVoiceLogs: any[] = [];
const VOICE_LOGS_DB_PATH = path.join(process.cwd(), 'voice-logs-local-db.json');

function loadLocalVoiceLogs() {
  try {
    if (fs.existsSync(VOICE_LOGS_DB_PATH)) {
      const raw = fs.readFileSync(VOICE_LOGS_DB_PATH, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        inMemoryVoiceLogs.push(...data);
      }
      console.log(`[Resilient Db] Successfully loaded cached voice call logs from persistent store: ${inMemoryVoiceLogs.length} logs.`);
    }
  } catch (e: any) {
    console.warn('[Resilient Db] Failed to read local persistent voice logs DB:', e.message || e);
  }
}

function saveLocalVoiceLogs() {
  try {
    fs.writeFileSync(VOICE_LOGS_DB_PATH, JSON.stringify(inMemoryVoiceLogs, null, 2), 'utf8');
  } catch (e: any) {
    console.warn('[Resilient Db] Failed to write local persistent voice logs DB:', e.message || e);
  }
}

// Initial load
loadLocalVoiceLogs();

// Helper to load/save user cache locally
function loadLocalDb() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      const data = JSON.parse(raw);
      for (const [k, v] of Object.entries(data)) {
        inMemoryUsers.set(k, v);
      }
      console.log(`[Resilient Db] Successfully loaded cached users from persistent store: ${Object.keys(data).length} profiles.`);
    }
  } catch (e: any) {
    console.warn('[Resilient Db] Failed to read local persistent DB:', e.message || e);
  }
}

function saveLocalDb() {
  try {
    const obj = Object.fromEntries(inMemoryUsers.entries());
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e: any) {
    console.warn('[Resilient Db] Failed to write local persistent DB:', e.message || e);
  }
}

// Initial load
loadLocalDb();

const safeUserDb = {
  get: async (uid: string) => {
    if (adminDb) {
      try {
        const userDocRef = adminDb.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
          const data = docSnap.data();
          inMemoryUsers.set(uid, data);
          saveLocalDb();
          return { exists: true, data: () => data };
        }
      } catch (err: any) {
        const errMsg = err.message || String(err);
        if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('insufficient permissions')) {
          console.warn(`[Resilient Db] Firestore lacks permission for get() on UID ${uid}. Defaulting server to high-fidelity persistent local storage mode.`);
          adminDb = null; // Disable future calls to prevent error log spamming
        } else {
          console.warn(`[Resilient Db] Firestore get() failed for ${uid}:`, errMsg);
        }
      }
    }
    const memData = inMemoryUsers.get(uid);
    if (memData) {
      return { exists: true, data: () => memData };
    }
    return { exists: false, data: () => null };
  },

  set: async (uid: string, data: any) => {
    inMemoryUsers.set(uid, data);
    saveLocalDb();
    if (adminDb) {
      try {
        const userDocRef = adminDb.collection('users').doc(uid);
        await userDocRef.set(data);
        return true;
      } catch (err: any) {
        const errMsg = err.message || String(err);
        if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('insufficient permissions')) {
          console.warn(`[Resilient Db] Firestore lacks permission for set() on UID ${uid}. Defaulting server to high-fidelity persistent local storage mode.`);
          adminDb = null; // Disable future calls to prevent error log spamming
        } else {
          console.warn(`[Resilient Db] Firestore set() failed for ${uid}:`, errMsg);
        }
      }
    }
    return true;
  },

  update: async (uid: string, partialData: any) => {
    const existing = inMemoryUsers.get(uid) || {};
    const updated = { ...existing, ...partialData };
    inMemoryUsers.set(uid, updated);
    saveLocalDb();

    if (adminDb) {
      try {
        const userDocRef = adminDb.collection('users').doc(uid);
        await userDocRef.update(partialData);
        return true;
      } catch (err: any) {
        const errMsg = err.message || String(err);
        if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('insufficient permissions')) {
          console.warn(`[Resilient Db] Firestore lacks permission for update() on UID ${uid}. Defaulting server to high-fidelity persistent local storage mode.`);
          adminDb = null; // Disable future calls to prevent error log spamming
        } else {
          console.warn(`[Resilient Db] Firestore update() failed for ${uid}:`, errMsg);
          try {
            const userDocRef = adminDb.collection('users').doc(uid);
            await userDocRef.set(updated);
          } catch (setErr) {
            // Ignore secondary write failures
          }
        }
      }
    }
    return true;
  }
};

const app = express();

// Request logger middleware to diagnose connection and routing issues
app.use((req, res, next) => {
  console.log(`[Request Log] ${req.method} ${req.originalUrl} - IP: ${req.ip} - Headers: ${JSON.stringify(req.headers)}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy initializer helper for GoogleGenAI to handle dynamic API key configuration cleanly
let globalAiClient: GoogleGenAI | null = null;
let globalAiClientAlpha: GoogleGenAI | null = null;
function getAiClient(apiVersion: 'v1alpha' | 'v1beta' = 'v1beta'): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (apiVersion === 'v1alpha') {
    if (globalAiClientAlpha && (globalAiClientAlpha as any)._apiKey === currentKey) {
      return globalAiClientAlpha;
    }
    try {
      const client = new GoogleGenAI({
        apiKey: currentKey,
        httpOptions: {
          apiVersion: 'v1alpha',
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      (client as any)._apiKey = currentKey;
      globalAiClientAlpha = client;
      return client;
    } catch (err) {
      console.error('Error creating GoogleGenAI alpha client:', err);
      return null;
    }
  } else {
    if (globalAiClient && (globalAiClient as any)._apiKey === currentKey) {
      return globalAiClient;
    }
    try {
      const client = new GoogleGenAI({
        apiKey: currentKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      (client as any)._apiKey = currentKey;
      globalAiClient = client;
      return client;
    } catch (err) {
      console.error('Error creating GoogleGenAI client:', err);
      return null;
    }
  }
}

// Dynamically refresh the active client on every API request
let aiClient: GoogleGenAI | null = getAiClient();
app.use((req, res, next) => {
  aiClient = getAiClient();
  next();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

if (aiClient) {
  console.log('GoogleGenAI initialized successfully.');
} else {
  console.log('GEMINI_API_KEY not set or default. Running with intelligent fallbacks.');
}

interface SiteActivity {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  metadata?: any;
}

let siteActivities: SiteActivity[] = [
  {
    id: 'act-mock-1',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    type: 'visit',
    description: 'Anonymous visitor from Bhubaneswar, Odisha explored Jobs Board',
    metadata: { page: 'jobs' }
  },
  {
    id: 'act-mock-2',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'chat',
    description: 'User initiated conversation with AROHI AI about SSC MTS 2026 eligibility',
    metadata: { topic: 'SSC MTS' }
  },
  {
    id: 'act-mock-3',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    type: 'resume',
    description: 'ATS resume analysis performed for Senior React Developer profile (Score: 78%)',
    metadata: { score: 78 }
  },
  {
    id: 'act-mock-4',
    timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    type: 'apply',
    description: 'Candidate Rajesh Kumar Singh submitted verified application for SSC MTS & Havaldar 2026',
    metadata: { candidate: 'Rajesh Kumar Singh' }
  },
  {
    id: 'act-mock-5',
    timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString(),
    type: 'roadmap',
    description: 'Custom Career Roadmap generated for MSME Business & Mudra Funding eligibility',
    metadata: { target: 'Mudra Funding' }
  }
];

// Persistent telemetry statistics for Recruit.org.in
const STATS_FILE_PATH = path.join(process.cwd(), 'site-stats.json');
let cumulativeCounts = {
  visit: 154820,
  chat: 64291,
  resume: 18349,
  roadmap: 12482,
  apply: 8304,
  enroll: 1248,
  admin: 120
};

function loadStats() {
  try {
    if (fs.existsSync(STATS_FILE_PATH)) {
      const raw = fs.readFileSync(STATS_FILE_PATH, 'utf8');
      const data = JSON.parse(raw);
      cumulativeCounts = { ...cumulativeCounts, ...data };
      console.log('[Stats] Loaded cumulative site statistics successfully:', cumulativeCounts);
    } else {
      saveStats();
    }
  } catch (e: any) {
    console.warn('[Stats] Failed to load site stats:', e.message || e);
  }
}

function saveStats() {
  try {
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(cumulativeCounts, null, 2), 'utf8');
  } catch (e: any) {
    console.warn('[Stats] Failed to save site stats:', e.message || e);
  }
}

// Initial load of site stats
loadStats();

function logActivity(type: string, description: string, metadata?: any) {
  const newActivity: SiteActivity = {
    id: `act-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    type,
    description,
    metadata
  };
  siteActivities.unshift(newActivity);
  if (siteActivities.length > 150) {
    siteActivities = siteActivities.slice(0, 150);
  }

  // Auto-increment persistent stats mapping
  const normalizedType = type.toLowerCase();
  if (normalizedType in cumulativeCounts) {
    cumulativeCounts[normalizedType as keyof typeof cumulativeCounts]++;
  } else {
    (cumulativeCounts as any)[normalizedType] = ((cumulativeCounts as any)[normalizedType] || 0) + 1;
  }
  saveStats();

  if (adminDb) {
    try {
      adminDb.collection('site_activities').doc(newActivity.id).set(newActivity).catch((err: any) => {
        console.warn('[Firestore Log] Failed to save site activity async:', err.message || err);
      });
    } catch (err) {
      // Ignore silent errors
    }
  }
}

// 0. Firebase Authentication Reverse Proxy for Custom Domain Hosting on Railway VPS
app.all('/__/auth/*', async (req, res) => {
  const firebaseAuthUrl = `https://recruit-auth-515f9.firebaseapp.com${req.originalUrl}`;
  try {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headers[key] = value;
      } else if (Array.isArray(value)) {
        headers[key] = value.join(', ');
      }
    }
    
    // Override headers to avoid CORS/SSL/Origin mismatches with Google & Firebase
    delete headers['host'];
    delete headers['content-length'];
    delete headers['connection'];

    // Strip out all x-forwarded-* and platform/proxy headers to prevent Firebase Hosting routing confusion
    Object.keys(headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.startsWith('x-forwarded-') ||
        lowerKey === 'x-real-ip' ||
        lowerKey.startsWith('cf-') ||
        lowerKey.startsWith('x-railway-')
      ) {
        delete headers[key];
      }
    });

    if (headers['origin']) {
      headers['origin'] = 'https://recruit-auth-515f9.firebaseapp.com';
    }
    if (headers['referer']) {
      headers['referer'] = 'https://recruit-auth-515f9.firebaseapp.com/';
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        if (headers['content-type']?.includes('application/json')) {
          fetchOptions.body = JSON.stringify(req.body);
        } else {
          const params = new URLSearchParams();
          for (const [key, val] of Object.entries(req.body)) {
            params.append(key, String(val));
          }
          fetchOptions.body = params.toString();
        }
      }
    }

    const response = await fetch(firebaseAuthUrl, fetchOptions);
    
    // Set appropriate response headers, omitting chunked transfer-encoding
    response.headers.forEach((value, name) => {
      if (name.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(name, value);
      }
    });

    res.status(response.status);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error proxying firebase auth request:', error);
    res.status(500).send('Authentication proxy error');
  }
});

// Firebase Web API Key for client/auth REST API (from firebase-applet-config.json)
const FIREBASE_API_KEY = "AIzaSyBDzgG169KTE_IDXTZ3lnRQfgZW3Bu2xvM";

// API Endpoint to save custom Arohi avatar uploaded by the user to local storage and sync it to the workspace server-side
app.post('/api/save-arohi-avatar', (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    // Check if it's a data URL, and extract only the base64 part
    let base64Data = imageBase64;
    if (imageBase64.includes(';base64,')) {
      base64Data = imageBase64.split(';base64,')[1];
    }

    const buffer = Buffer.from(base64Data, 'base64');
    
    // We will save it as Arohi.jpg in the workspace root
    const rootDir = process.cwd();
    const filePath = path.join(rootDir, 'Arohi.jpg');
    fs.writeFileSync(filePath, buffer);
    console.log('[Server] Successfully saved Arohi.jpg to workspace root!');

    // Also write it directly to the dist folder if it exists, so it serves immediately in production without rebuild
    const distPath = path.join(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      const distFilePath = path.join(distPath, 'arohi.png');
      fs.writeFileSync(distFilePath, buffer);
      console.log('[Server] Successfully saved arohi.png to dist folder for immediate service!');
    }

    // Also save it to an assets folder if it exists
    const assetsDir = path.join(rootDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const assetsFilePath = path.join(assetsDir, 'Arohi.jpg');
      fs.writeFileSync(assetsFilePath, buffer);
      console.log('[Server] Successfully saved Arohi.jpg to assets folder!');
    }

    return res.json({ success: true, message: 'Arohi avatar successfully saved and synchronized on the server!' });
  } catch (err: any) {
    console.error('Failed to save Arohi avatar:', err);
    return res.status(500).json({ error: 'Failed to save avatar: ' + err.message });
  }
});

// API endpoints for Server-Side Auth Proxy
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, role, mobile, entrySource } = req.body;
  try {
    // 1. Call Firebase Auth REST API to create user
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    
    const data: any = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to sign up.');
    }
    
    const uid = data.localId;
    
    // 2. Create the user document in Firestore using the Resilient SDK
    const initialData = {
      uid: uid,
      email: email,
      displayName: name,
      role: role || 'candidate',
      entrySource: entrySource || 'Website Browser',
      profile: {
        name: name,
        email: email,
        phone: mobile || '+91 98765 43210',
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
      activities: [],
      updatedAt: new Date().toISOString()
    };
    await safeUserDb.set(uid, initialData);
    
    return res.json({
      success: true,
      user: {
        uid,
        email,
        displayName: name,
        idToken: data.idToken,
        refreshToken: data.refreshToken
      },
      userData: initialData
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password, entrySource } = req.body;
  try {
    // 1. Call Firebase Auth REST API to sign in
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    
    const data: any = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Invalid email or password.');
    }
    
    const uid = data.localId;
    
    // 2. Fetch the user document from Firestore using the Resilient SDK
    const docSnap = await safeUserDb.get(uid);
    let userData = null;
    
    if (docSnap.exists) {
      userData = docSnap.data();
      if (entrySource && userData.entrySource !== entrySource) {
        userData.entrySource = entrySource;
        await safeUserDb.set(uid, userData);
      }
    } else {
      // Create initial document if it didn't exist
      userData = {
        uid: uid,
        email: email,
        displayName: data.displayName || 'Honored Guest',
        entrySource: entrySource || 'Website Browser',
        profile: {
          name: data.displayName || 'Honored Guest',
          email: email,
          phone: '+91 98765 43210',
          location: 'Delhi NCR',
          education: 'Graduate',
          activeGoal: 'Skills, Courses & Career Preparation'
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
        activities: [],
        updatedAt: new Date().toISOString()
      };
      await safeUserDb.set(uid, userData);
    }
    
    return res.json({
      success: true,
      user: {
        uid,
        email,
        displayName: userData.displayName || data.displayName,
        idToken: data.idToken,
        refreshToken: data.refreshToken
      },
      userData
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/google-sync', async (req, res) => {
  const { uid, email, displayName, role, entrySource } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    const docSnap = await safeUserDb.get(uid);
    let userData = null;

    if (docSnap.exists) {
      userData = docSnap.data();
      if (entrySource && userData.entrySource !== entrySource) {
        userData.entrySource = entrySource;
        await safeUserDb.set(uid, userData);
      }
    } else {
      // Create initial document for Google signed-in user
      userData = {
        uid: uid,
        email: email || '',
        displayName: displayName || 'Honored Guest',
        role: role || 'candidate',
        entrySource: entrySource || 'Website Browser',
        profile: {
          name: displayName || 'Honored Guest',
          email: email || '',
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
        activities: [],
        updatedAt: new Date().toISOString()
      };
      await safeUserDb.set(uid, userData);
    }

    logActivity('visit', `User ${displayName || email || uid} signed in via Google`);

    return res.json({
      success: true,
      user: {
        uid,
        email,
        displayName: displayName || userData.displayName || email,
      },
      userData
    });
  } catch (error: any) {
    console.error('Google sync error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestType: 'PASSWORD_RESET', email })
    });
    
    const data: any = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send password reset email.');
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-profile', async (req, res) => {
  const { uid, profile } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    const docSnap = await safeUserDb.get(uid);
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    const currentData = docSnap.data();
    const currentProfile = currentData.profile || {};
    const updatedProfile = { ...currentProfile, ...profile };
    
    const updatePayload: any = {
      profile: updatedProfile,
      updatedAt: new Date().toISOString()
    };
    if (profile.name) {
      updatePayload.displayName = profile.name;
    }
    await safeUserDb.update(uid, updatePayload);
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-career', async (req, res) => {
  const { uid, progress } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    const updatePayload: any = {};
    if (progress.enrolledCourses) updatePayload.enrolledCourses = progress.enrolledCourses;
    if (progress.completedModules) updatePayload.completedModules = progress.completedModules;
    if (progress.checkedChecklist) updatePayload.checkedChecklist = progress.checkedChecklist;
    if (progress.earnedCertificates) updatePayload.earnedCertificates = progress.earnedCertificates;
    updatePayload.updatedAt = new Date().toISOString();
    
    await safeUserDb.update(uid, updatePayload);
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-bookmarks', async (req, res) => {
  const { uid, savedItems } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    await safeUserDb.update(uid, {
      savedItems,
      updatedAt: new Date().toISOString()
    });
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-applications', async (req, res) => {
  const { uid, applications } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    await safeUserDb.update(uid, {
      applications,
      updatedAt: new Date().toISOString()
    });
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-arohi-chats', async (req, res) => {
  const { uid, arohiChats } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    await safeUserDb.update(uid, {
      arohiChats,
      updatedAt: new Date().toISOString()
    });
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-arohi-calls', async (req, res) => {
  const { uid, arohiCalls } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    await safeUserDb.update(uid, {
      arohiCalls,
      updatedAt: new Date().toISOString()
    });
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-diagnostics', async (req, res) => {
  const { uid, diagnostics } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    await safeUserDb.update(uid, {
      diagnostics,
      updatedAt: new Date().toISOString()
    });
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/update-activities', async (req, res) => {
  const { uid, activities } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    await safeUserDb.update(uid, {
      activities,
      updatedAt: new Date().toISOString()
    });
    const updatedSnap = await safeUserDb.get(uid);
    res.json({ success: true, userData: updatedSnap.data() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/me', async (req, res) => {
  const { uid, entrySource } = req.body;
  try {
    if (!uid) return res.status(400).json({ error: 'UID is required.' });
    const docSnap = await safeUserDb.get(uid);
    if (docSnap.exists) {
      const userData = docSnap.data();
      if (entrySource && userData.entrySource !== entrySource) {
        userData.entrySource = entrySource;
        await safeUserDb.set(uid, userData);
      }
      res.json({ success: true, userData });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 0. Site Tracking & Admin Security Endpoints
app.post('/api/track-event', (req, res) => {
  const { type, description, metadata } = req.body;
  if (!type || !description) {
    return res.status(400).json({ error: 'type and description are required' });
  }
  logActivity(type, description, metadata);
  return res.json({ success: true });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'recruit_admin_2026') {
    logActivity('admin', 'Admin logged in successfully', { username });
    return res.json({ success: true, token: 'recruit_admin_authorized_token_2026' });
  }
  logActivity('admin', `Failed admin login attempt with username: ${username}`, { username });
  return res.status(401).json({ error: 'Invalid ID or Password' });
});

app.get('/api/admin/stats', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer recruit_admin_authorized_token_2026') {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }

  let combinedActivities = [...siteActivities];
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('site_activities').get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        const existingIdx = combinedActivities.findIndex(a => a.id === doc.id);
        if (existingIdx !== -1) {
          combinedActivities[existingIdx] = {
            ...combinedActivities[existingIdx],
            ...data
          };
        } else {
          combinedActivities.unshift(data);
        }
      });
      // Sort newest first
      combinedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      if (combinedActivities.length > 150) {
        combinedActivities = combinedActivities.slice(0, 150);
      }
    } catch (err: any) {
      console.warn('Failed to load site activities from Firestore:', err.message || err);
    }
  }

  // Count types
  const counts = {
    visit: combinedActivities.filter(a => a.type === 'visit').length,
    chat: combinedActivities.filter(a => a.type === 'chat').length,
    resume: combinedActivities.filter(a => a.type === 'resume').length,
    roadmap: combinedActivities.filter(a => a.type === 'roadmap').length,
    apply: combinedActivities.filter(a => a.type === 'apply').length,
    enroll: combinedActivities.filter(a => a.type === 'enroll').length,
    admin: combinedActivities.filter(a => a.type === 'admin').length,
  };

  return res.json({
    activities: combinedActivities,
    counts,
    cumulativeCounts
  });
});

// Server-Side Real Persistence for Admin Panel
let serverAdminUsers = [
  {
    id: 'user-001',
    email: 'elitetraderjunoon@gmail.com',
    name: 'Commander Junoon',
    role: 'Super Administrator',
    status: 'VIP',
    entrySource: 'Installed PWA (Desktop)',
    permissions: {
      canEditJobs: true,
      canApproveApps: true,
      canViewFinance: true
    },
    services: {
      path1: true,
      path2: true,
      path3: true
    },
    takenCourses: ['MSME Business Fundamentals', 'Drone Piloting & Agri-Spraying'],
    usage: {
      chatsWithArohi: 142,
      resumeScans: 28,
      mockInterviews: 12
    },
    customizedSettings: {
      tutoringSlot: 'Every Tuesday 18:00 IST',
      priorityLevel: 'Critical',
      assignedMentor: 'Dr. Debasish Mohanty (Senior Fellow)'
    }
  },
  {
    id: 'user-002',
    email: 'rajesh.kumar@example.com',
    name: 'Rajesh Kumar Singh',
    role: 'Premium Candidate',
    status: 'Active',
    entrySource: 'Installed PWA (Android Mobile)',
    permissions: {
      canEditJobs: false,
      canApproveApps: false,
      canViewFinance: false
    },
    services: {
      path1: true,
      path2: false,
      path3: false
    },
    takenCourses: ['Drone Piloting & Agri-Spraying'],
    usage: {
      chatsWithArohi: 45,
      resumeScans: 6,
      mockInterviews: 4
    },
    customizedSettings: {
      tutoringSlot: 'Every Saturday 10:00 IST',
      priorityLevel: 'High',
      assignedMentor: 'Meera Patnaik (Aviation Expert)'
    }
  },
  {
    id: 'user-003',
    email: 'amit.patil@example.com',
    name: 'Amit Suresh Patil',
    role: 'Standard Applicant',
    status: 'Active',
    entrySource: 'Mobile Safari (iOS)',
    permissions: {
      canEditJobs: false,
      canApproveApps: false,
      canViewFinance: false
    },
    services: {
      path1: false,
      path2: false,
      path3: false
    },
    takenCourses: [],
    usage: {
      chatsWithArohi: 12,
      resumeScans: 2,
      mockInterviews: 1
    },
    customizedSettings: {
      tutoringSlot: 'None Scheduled',
      priorityLevel: 'Standard',
      assignedMentor: 'Automated AI Guide'
    }
  },
  {
    id: 'user-004',
    email: 'subhasish.sen@example.com',
    name: 'Subhasish Sen',
    role: 'MSME Entrepreneur',
    status: 'Active',
    entrySource: 'Mobile Browser (Chrome Android)',
    permissions: {
      canEditJobs: false,
      canApproveApps: false,
      canViewFinance: false
    },
    services: {
      path1: false,
      path2: false,
      path3: true
    },
    takenCourses: ['MSME Business Fundamentals'],
    usage: {
      chatsWithArohi: 68,
      resumeScans: 0,
      mockInterviews: 0
    },
    customizedSettings: {
      tutoringSlot: 'Every Monday 14:00 IST',
      priorityLevel: 'High',
      assignedMentor: 'Subrata Sahoo (Business Advisor)'
    }
  },
  {
    id: 'user-005',
    email: 'meera.patnaik@example.com',
    name: 'Meera Patnaik',
    role: 'VIP Member',
    status: 'VIP',
    entrySource: 'Desktop Browser (macOS Safari/Chrome)',
    permissions: {
      canEditJobs: false,
      canApproveApps: true,
      canViewFinance: false
    },
    services: {
      path1: true,
      path2: true,
      path3: false
    },
    takenCourses: ['Drone Piloting & Agri-Spraying'],
    usage: {
      chatsWithArohi: 110,
      resumeScans: 15,
      mockInterviews: 9
    },
    customizedSettings: {
      tutoringSlot: 'Every Thursday 11:00 IST',
      priorityLevel: 'Critical',
      assignedMentor: 'Dr. Debasish Mohanty (Senior Fellow)'
    }
  }
];

let activeUpiMerchant = {
  upiId: 'elitetraderjunoon@oksbi',
  merchantName: 'Recruit India Portal',
  bankName: 'Airtel Payments Bank / PhonePe'
};

let serverPayments = [
  {
    id: 'TXN-984102',
    userEmail: 'elitetraderjunoon@gmail.com',
    amount: 399,
    planName: 'Path 3: Udyam Business Assistance Plan',
    method: 'UPI',
    date: '29/06/2026',
    status: 'Verified'
  },
  {
    id: 'TXN-894103',
    userEmail: 'rajesh.kumar@example.com',
    amount: 399,
    planName: 'Path 1: Career, Jobs & Resume Plan',
    method: 'GooglePlay',
    date: '28/06/2026',
    status: 'Verified'
  },
  {
    id: 'TXN-150492',
    userEmail: 'meera.patnaik@example.com',
    amount: 399,
    planName: 'Path 1: Career, Jobs & Resume Plan',
    method: 'UPI',
    date: '28/06/2026',
    status: 'Verified'
  },
  {
    id: 'TXN-385012',
    userEmail: 'subhasish.sen@example.com',
    amount: 399,
    planName: 'Path 3: Udyam Business Assistance Plan',
    method: 'GooglePlay',
    date: '26/06/2026',
    status: 'Pending'
  },
  {
    id: 'TXN-492104',
    userEmail: 'amit.patil@example.com',
    amount: 99,
    planName: 'Professional ATS Resume Builder',
    method: 'UPI',
    date: '24/06/2026',
    status: 'Verified'
  }
];

let serverChatLogs = [
  {
    id: 'chat-001',
    userEmail: 'rajesh.kumar@example.com',
    userName: 'Rajesh Kumar Singh',
    topic: 'SSC MTS Eligibility',
    sentiment: 'Neutral',
    messages: [
      { sender: 'user', text: 'Am I eligible for SSC MTS and Havaldar exam if I am 26 years old?', time: '28/06 14:10' },
      { sender: 'arohi', text: 'Yes, Rajesh! The maximum age limit for SSC MTS general posts is 25 years, but for certain posts like Havaldar inside CBIC & CBN and specific departments, it is 27 years. Since you are 26, you can definitely apply for those posts! Would you like me to share the educational criteria?', time: '28/06 14:11' },
      { sender: 'user', text: 'Yes, please share the eligibility too.', time: '28/06 14:12' },
      { sender: 'arohi', text: 'Excellent! The minimum educational qualification is Matriculation (Class 10th pass) or equivalent from a recognized board inside India. Since you hold a Graduate Degree from Patna University, you are fully over-qualified and highly eligible!', time: '28/06 14:12' }
    ]
  },
  {
    id: 'chat-002',
    userEmail: 'subhasish.sen@example.com',
    userName: 'Subhasish Sen',
    topic: 'Mudra Loan Kishor Category',
    sentiment: 'Urgent',
    messages: [
      { sender: 'user', text: 'I want to apply for a Mudra loan of 4 Lakhs to purchase inventory for my handloom retail shop. Which category is best?', time: '27/06 10:15' },
      { sender: 'arohi', text: 'Hello Subhasish! For a capital loan of ₹4 Lakhs, the **Kishor Category** is the perfect fit. Mudra Kishor covers loans from ₹50,000 up to ₹5 Lakhs. It requires basic business registration (like Udyam MSME) and a simple project report. Would you like me to map out the required documents?', time: '27/06 10:16' },
      { sender: 'user', text: 'Yes, please list the documents. I have my Udyam cert.', time: '27/06 10:17' },
      { sender: 'arohi', text: 'Wonderful! Having your Udyam Certificate is a massive headstart. You will also need: 1) Last 6 months bank statements, 2) Identity and address proof, 3) Business address proof, and 4) Quotation for the inventory you wish to purchase. Since it is collateral-free, you do not need to pledge any property!', time: '27/06 10:18' }
    ]
  },
  {
    id: 'chat-003',
    userEmail: 'elitetraderjunoon@gmail.com',
    userName: 'Commander Junoon',
    topic: 'Custom Preparation Strategy',
    sentiment: 'Positive',
    messages: [
      { sender: 'user', text: 'Generate an intensive daily study roadmap for cracking civil service banking exams.', time: '29/06 09:30' },
      { sender: 'arohi', text: 'Pranam, Commander Junoon! To crack prestigious examinations like IBPS PO or RBI Assistant, here is your high-impact daily study block:\n\n* **Morning Block (2 Hours):** Quantitative Aptitude & Data Interpretation formulas.\n* **Noon Block (1.5 Hours):** Logical Reasoning puzzles and blood-relation drills.\n* **Evening Block (2 Hours):** General Awareness & Financial Current Affairs.\n* **Night Block (1 Hour):** Speed-reading English comprehension practice.\n\nI have locked this custom schedule to your dashboard tracker. Shall we perform a mock aptitude evaluation now?', time: '29/06 09:31' }
    ]
  }
];

// Helper to check authorization
function checkAdminAuth(req: express.Request) {
  const authHeader = req.headers.authorization;
  return authHeader === 'Bearer recruit_admin_authorized_token_2026';
}

// 1. Users list
app.get('/api/admin/users', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }

  let combinedUsers = [...serverAdminUsers];
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('users').get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        const email = data.email || data.profile?.email;
        if (!email) return;

        // Check if this user already exists to avoid duplicates
        const existingIdx = combinedUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

        const mappedUser = {
          id: data.uid || doc.id,
          email: email,
          name: data.displayName || data.profile?.name || email.split('@')[0],
          role: data.role === 'recruiter' ? 'Business Owner/Recruiter' : 'Premium Candidate',
          status: data.status || 'Active',
          entrySource: data.entrySource || 'Website Browser',
          permissions: data.permissions || {
            canEditJobs: data.role === 'recruiter' || email === 'elitetraderjunoon@gmail.com',
            canApproveApps: data.role === 'recruiter' || email === 'elitetraderjunoon@gmail.com',
            canViewFinance: email === 'elitetraderjunoon@gmail.com'
          },
          services: data.services || {
            path1: (data.enrolledCourses && data.enrolledCourses.length > 0) || (data.profile?.activeGoal && data.profile.activeGoal.includes('Career')) || false,
            path2: data.completedModules ? Object.keys(data.completedModules).length > 0 : false,
            path3: (data.profile?.activeGoal && data.profile.activeGoal.includes('Mudra')) || false,
            path4: false
          },
          takenCourses: data.enrolledCourses || [],
          usage: data.usage || {
            chatsWithArohi: data.arohiChats?.reduce((acc: number, c: any) => acc + (c.messages?.length || 0), 0) || 0,
            resumeScans: data.diagnostics?.atsScore ? 1 : 0,
            mockInterviews: data.diagnostics?.interviewScore ? 1 : 0
          },
          customizedSettings: data.customizedSettings || {
            tutoringSlot: data.profile?.location || 'Not scheduled',
            priorityLevel: email === 'elitetraderjunoon@gmail.com' ? 'Critical' : 'Standard',
            assignedMentor: 'Automated AI Guide'
          }
        };

        if (existingIdx !== -1) {
          combinedUsers[existingIdx] = {
            ...combinedUsers[existingIdx],
            ...mappedUser
          };
        } else {
          combinedUsers.push(mappedUser);
        }
      });
    } catch (err: any) {
      console.warn('Failed to load real-time users from Firestore:', err.message || err);
    }
  }

  return res.json({ users: combinedUsers });
});

// 2. Add or Update User
app.post('/api/admin/update-user', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }
  const updatedUser = req.body;
  if (!updatedUser || !updatedUser.email) {
    return res.status(400).json({ error: 'User data and email are required' });
  }

  let finalUser: any = null;
  const idx = serverAdminUsers.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
  if (idx !== -1) {
    // Update existing user properties
    serverAdminUsers[idx] = {
      ...serverAdminUsers[idx],
      ...updatedUser,
      id: updatedUser.id || serverAdminUsers[idx].id
    };
    finalUser = serverAdminUsers[idx];
    logActivity('admin', `Admin updated profile for user: ${updatedUser.email}`, { email: updatedUser.email });
  } else {
    // Add new user
    const newUser = {
      id: updatedUser.id || `user-${Math.random().toString(36).substring(2, 9)}`,
      email: updatedUser.email,
      name: updatedUser.name || updatedUser.email.split('@')[0],
      role: updatedUser.role || 'Standard Applicant',
      status: updatedUser.status || 'Active',
      entrySource: updatedUser.entrySource || 'Website Browser',
      permissions: updatedUser.permissions || { canEditJobs: false, canApproveApps: false, canViewFinance: false },
      services: updatedUser.services || { path1: false, path2: false, path3: false },
      takenCourses: updatedUser.takenCourses || [],
      usage: updatedUser.usage || { chatsWithArohi: 0, resumeScans: 0, mockInterviews: 0 },
      customizedSettings: updatedUser.customizedSettings || { tutoringSlot: 'None Scheduled', priorityLevel: 'Standard', assignedMentor: 'Automated AI Guide' }
    };
    serverAdminUsers.push(newUser);
    finalUser = newUser;
    logActivity('admin', `Admin added new user profile: ${newUser.email}`, { email: newUser.email });
  }

  // Sync back to Firestore if adminDb is available
  if (adminDb && finalUser) {
    try {
      const uid = finalUser.id;
      let userDocRef = adminDb.collection('users').doc(uid);
      let userDocSnap = await userDocRef.get();

      if (!userDocSnap.exists) {
        // Find by email to avoid creating multiple docs for same user
        const userSnap = await adminDb.collection('users').where('email', '==', finalUser.email.toLowerCase()).get();
        if (!userSnap.empty) {
          userDocRef = userSnap.docs[0].ref;
        }
      }

      // Convert from serverAdminUsers format back to UserData Firestore format
      const isRecruiter = finalUser.role?.toLowerCase()?.includes('recruiter') || finalUser.role?.toLowerCase()?.includes('owner');
      const docData = {
        uid: uid,
        email: finalUser.email.toLowerCase(),
        displayName: finalUser.name,
        role: isRecruiter ? 'recruiter' as const : 'candidate' as const,
        status: finalUser.status,
        permissions: finalUser.permissions,
        services: finalUser.services,
        enrolledCourses: finalUser.takenCourses || [],
        usage: finalUser.usage,
        customizedSettings: finalUser.customizedSettings,
        updatedAt: new Date().toISOString()
      };

      await userDocRef.set(docData, { merge: true });
    } catch (err: any) {
      console.warn('Failed to save updated user to Firestore:', err.message || err);
    }
  }

  return res.json({ success: true, user: finalUser });
});

// 3. Delete user
app.post('/api/admin/delete-user', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const initialLength = serverAdminUsers.length;
  serverAdminUsers = serverAdminUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  
  if (serverAdminUsers.length < initialLength) {
    if (adminDb) {
      try {
        const userSnap = await adminDb.collection('users').where('email', '==', email.toLowerCase()).get();
        if (!userSnap.empty) {
          await userSnap.docs[0].ref.delete();
        }
      } catch (err: any) {
        console.warn('Failed to delete user from Firestore:', err.message || err);
      }
    }

    logActivity('admin', `Admin deleted user profile: ${email}`, { email });
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'User not found' });
});

// 4. Payments list
app.get('/api/admin/payments', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }

  let combinedPayments = [...serverPayments];
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('payments').get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        const existingIdx = combinedPayments.findIndex(p => p.id === doc.id);
        if (existingIdx !== -1) {
          combinedPayments[existingIdx] = {
            ...combinedPayments[existingIdx],
            ...data
          };
        } else {
          combinedPayments.unshift(data);
        }
      });
      // Sort newest transactions first
      combinedPayments.sort((a, b) => b.id.localeCompare(a.id));
    } catch (err: any) {
      console.warn('Failed to fetch payments from Firestore:', err.message || err);
    }
  }

  return res.json({ payments: combinedPayments });
});

// GET active merchant settings (anyone can access, but specifically for candidates checkouts)
app.get('/api/admin/payment-settings', (req, res) => {
  return res.json(activeUpiMerchant);
});

// UPDATE active merchant settings
app.post('/api/admin/payment-settings', (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }
  const { upiId, merchantName, bankName } = req.body;
  if (!upiId || !merchantName) {
    return res.status(400).json({ error: 'upiId and merchantName are required' });
  }
  activeUpiMerchant = { 
    upiId, 
    merchantName, 
    bankName: bankName || 'Airtel Payments Bank / PhonePe' 
  };
  logActivity('admin', `Admin updated UPI merchant settings: ${upiId} (${merchantName})`, activeUpiMerchant);
  return res.json({ success: true, settings: activeUpiMerchant });
});

// SUBMIT PENDING UPI / QR PAYMENT
app.post('/api/admin/submit-pending-payment', async (req, res) => {
  const { userEmail, amount, planName, utr, screenshotUrl } = req.body;
  if (!userEmail || !amount || !planName || !utr) {
    return res.status(400).json({ error: 'userEmail, amount, planName and transaction reference (UTR) are required' });
  }

  const newTxn = {
    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    userEmail: userEmail.toLowerCase(),
    amount: Number(amount),
    planName,
    method: 'UPI Scan',
    date: new Date().toLocaleDateString('en-GB'),
    status: 'Pending' as const,
    utr,
    screenshotUrl: screenshotUrl || ''
  };

  serverPayments.unshift(newTxn);

  if (adminDb) {
    try {
      await adminDb.collection('payments').doc(newTxn.id).set(newTxn);
    } catch (err: any) {
      console.warn('Failed to save pending payment to Firestore:', err.message || err);
    }
  }

  logActivity('enroll', `Candidate ${userEmail} scanned QR & submitted transaction ref (UTR): ${utr}`, newTxn);
  return res.json({ success: true, transaction: newTxn });
});

// VERIFY / APPROVE PAYMENT
app.post('/api/admin/verify-payment', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const paymentIdx = serverPayments.findIndex(p => p.id === id);
  if (paymentIdx === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  serverPayments[paymentIdx].status = 'Verified';
  const payment = serverPayments[paymentIdx];

  // Sync to server users list as well!
  const userIdx = serverAdminUsers.findIndex(u => u.email.toLowerCase() === payment.userEmail.toLowerCase());
  if (userIdx !== -1) {
    const lowerPlan = payment.planName.toLowerCase();
    if (lowerPlan.includes('path 1') || lowerPlan.includes('career') || lowerPlan.includes('resume')) {
      serverAdminUsers[userIdx].services.path1 = true;
    } else if (lowerPlan.includes('path 2') || lowerPlan.includes('skill')) {
      serverAdminUsers[userIdx].services.path2 = true;
    } else if (lowerPlan.includes('path 3') || lowerPlan.includes('udyam') || lowerPlan.includes('business')) {
      serverAdminUsers[userIdx].services.path3 = true;
    }
    if (lowerPlan.includes('resume')) {
      serverAdminUsers[userIdx].usage.resumeScans += 1;
    }
  } else {
    const lowerPlan = payment.planName.toLowerCase();
    const services = {
      path1: lowerPlan.includes('path 1') || lowerPlan.includes('career') || lowerPlan.includes('resume'),
      path2: lowerPlan.includes('path 2') || lowerPlan.includes('skill'),
      path3: lowerPlan.includes('path 3') || lowerPlan.includes('udyam') || lowerPlan.includes('business')
    };

    serverAdminUsers.push({
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: payment.userEmail.toLowerCase(),
      name: payment.userEmail.split('@')[0],
      role: 'Premium Candidate',
      status: 'Active',
      entrySource: 'Website Browser',
      permissions: { canEditJobs: false, canApproveApps: false, canViewFinance: false },
      services,
      takenCourses: [],
      usage: { chatsWithArohi: 1, resumeScans: lowerPlan.includes('resume') ? 1 : 0, mockInterviews: 0 },
      customizedSettings: { tutoringSlot: 'None Scheduled', priorityLevel: 'High', assignedMentor: 'Automated AI Guide' }
    });
  }

  // Update payment in Firestore and sync to users document
  if (adminDb) {
    try {
      await adminDb.collection('payments').doc(id).set(payment, { merge: true });

      const userSnap = await adminDb.collection('users').where('email', '==', payment.userEmail.toLowerCase()).get();
      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();
        const lowerPlan = payment.planName.toLowerCase();

        const services = userData.services || { path1: false, path2: false, path3: false, path4: false };
        if (lowerPlan.includes('path 1') || lowerPlan.includes('career') || lowerPlan.includes('resume')) {
          services.path1 = true;
        } else if (lowerPlan.includes('path 2') || lowerPlan.includes('skill')) {
          services.path2 = true;
        } else if (lowerPlan.includes('path 3') || lowerPlan.includes('udyam') || lowerPlan.includes('business')) {
          services.path3 = true;
        }

        let diagnostics = userData.diagnostics || { atsScore: 74, interviewScore: 0, businessScore: 84 };
        if (lowerPlan.includes('resume')) {
          diagnostics.atsScore = Math.max(diagnostics.atsScore, 75);
        }

        await userDoc.ref.update({
          services,
          diagnostics,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.warn('Failed to sync verified payment to Firestore:', err.message || err);
    }
  }

  logActivity('admin', `Admin manually verified payment voucher ${id} for ${payment.userEmail}`, { id });
  return res.json({ success: true, payment });
});

// 5. Add payment
app.post('/api/admin/add-payment', async (req, res) => {
  const { userEmail, amount, planName, method } = req.body;
  if (!userEmail || !amount || !planName) {
    return res.status(400).json({ error: 'userEmail, amount and planName are required' });
  }

  const newTxn = {
    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    userEmail: userEmail.toLowerCase(),
    amount: Number(amount),
    planName,
    method: method || 'UPI',
    date: new Date().toLocaleDateString('en-GB'),
    status: 'Verified' as const
  };

  serverPayments.unshift(newTxn);

  // Sync to server users list as well!
  const userIdx = serverAdminUsers.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());
  if (userIdx !== -1) {
    const lowerPlan = planName.toLowerCase();
    if (lowerPlan.includes('path 1') || lowerPlan.includes('career') || lowerPlan.includes('resume')) {
      serverAdminUsers[userIdx].services.path1 = true;
    } else if (lowerPlan.includes('path 2') || lowerPlan.includes('skill')) {
      serverAdminUsers[userIdx].services.path2 = true;
    } else if (lowerPlan.includes('path 3') || lowerPlan.includes('udyam') || lowerPlan.includes('business')) {
      serverAdminUsers[userIdx].services.path3 = true;
    }
    if (lowerPlan.includes('resume')) {
      serverAdminUsers[userIdx].usage.resumeScans += 1;
    }
  } else {
    const lowerPlan = planName.toLowerCase();
    const services = {
      path1: lowerPlan.includes('path 1') || lowerPlan.includes('career') || lowerPlan.includes('resume'),
      path2: lowerPlan.includes('path 2') || lowerPlan.includes('skill'),
      path3: lowerPlan.includes('path 3') || lowerPlan.includes('udyam') || lowerPlan.includes('business')
    };

    serverAdminUsers.push({
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email: userEmail.toLowerCase(),
      name: userEmail.split('@')[0],
      role: 'Premium Candidate',
      status: 'Active',
      entrySource: 'Website Browser',
      permissions: { canEditJobs: false, canApproveApps: false, canViewFinance: false },
      services,
      takenCourses: [],
      usage: { chatsWithArohi: 1, resumeScans: lowerPlan.includes('resume') ? 1 : 0, mockInterviews: 0 },
      customizedSettings: { tutoringSlot: 'None Scheduled', priorityLevel: 'High', assignedMentor: 'Automated AI Guide' }
    });
  }

  if (adminDb) {
    try {
      await adminDb.collection('payments').doc(newTxn.id).set(newTxn);

      const userSnap = await adminDb.collection('users').where('email', '==', userEmail.toLowerCase()).get();
      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();
        const lowerPlan = planName.toLowerCase();

        const services = userData.services || { path1: false, path2: false, path3: false, path4: false };
        if (lowerPlan.includes('path 1') || lowerPlan.includes('career') || lowerPlan.includes('resume')) {
          services.path1 = true;
        } else if (lowerPlan.includes('path 2') || lowerPlan.includes('skill')) {
          services.path2 = true;
        } else if (lowerPlan.includes('path 3') || lowerPlan.includes('udyam') || lowerPlan.includes('business')) {
          services.path3 = true;
        }

        await userDoc.ref.update({
          services,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.warn('Failed to save manual payment to Firestore:', err.message || err);
    }
  }

  logActivity('enroll', `Subscription payment of ₹${amount} received for "${planName}" from ${userEmail}`, { userEmail, amount, planName });
  return res.json({ success: true, transaction: newTxn });
});

// 6. Sync / Add to user Chat logs
app.post('/api/admin/sync-chat', async (req, res) => {
  const { userEmail, userName, sender, text, topic } = req.body;
  if (!userEmail || !sender || !text) {
    return res.status(400).json({ error: 'userEmail, sender and text are required' });
  }

  const cleanEmail = userEmail.toLowerCase();
  const msgTime = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  let log = serverChatLogs.find(l => l.userEmail && l.userEmail.toLowerCase() === cleanEmail);
  if (log) {
    log.messages.push({ sender, text, time: msgTime });
    if (topic) log.topic = topic;
  } else {
    log = {
      id: `chat-${Math.random().toString(36).substring(2, 9)}`,
      userEmail: cleanEmail,
      userName: userName || cleanEmail.split('@')[0],
      topic: topic || 'General Consultation',
      sentiment: text.toLowerCase().includes('help') || text.toLowerCase().includes('urgent') ? 'Urgent' : 'Neutral',
      messages: [{ sender, text, time: msgTime }]
    };
    serverChatLogs.unshift(log);
  }

  const userIdx = serverAdminUsers.findIndex(u => u && u.email && u.email.toLowerCase() === cleanEmail);
  if (userIdx !== -1) {
    if (sender === 'user') {
      serverAdminUsers[userIdx].usage.chatsWithArohi += 1;
    }
  }

  // Sync back to Firestore / Local DB using safeUserDb where possible
  let targetUid: string | null = null;
  for (const [uid, uData] of inMemoryUsers.entries()) {
    if (uData.email && uData.email.toLowerCase() === cleanEmail) {
      targetUid = uid;
      break;
    }
  }

  const updateChatsInDoc = async (uid: string, userData: any) => {
    let arohiChats = userData.arohiChats || [];

    // Try to find the chat session by title/topic or use the latest one
    let existingChatIdx = arohiChats.findIndex((c: any) => c.title === (topic || 'General Consultation') || c.title === 'Arohi AI Consultation');
    if (existingChatIdx === -1 && arohiChats.length > 0) {
      existingChatIdx = arohiChats.length - 1; // Fallback to last chat
    }

    const newMsg = {
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      role: sender === 'user' ? 'user' as const : 'assistant' as const,
      content: text,
      timestamp: msgTime
    };

    if (existingChatIdx !== -1) {
      arohiChats[existingChatIdx].messages = arohiChats[existingChatIdx].messages || [];
      arohiChats[existingChatIdx].messages.push(newMsg);
    } else {
      arohiChats.push({
        id: log.id,
        title: topic || 'General Consultation',
        date: new Date().toLocaleDateString('en-GB'),
        messages: [newMsg]
      });
    }

    await safeUserDb.update(uid, {
      arohiChats,
      updatedAt: new Date().toISOString()
    });
  };

  if (targetUid) {
    try {
      const userSnap = await safeUserDb.get(targetUid);
      if (userSnap.exists) {
        await updateChatsInDoc(targetUid, userSnap.data());
      }
    } catch (err: any) {
      console.warn('Failed to sync chat message via safeUserDb:', err.message || err);
    }
  } else if (adminDb) {
    try {
      const userSnap = await adminDb.collection('users').where('email', '==', cleanEmail).get();
      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const uid = userDoc.id;
        const userData = userDoc.data();
        await updateChatsInDoc(uid, userData);
      }
    } catch (err: any) {
      const errMsg = err.message || String(err);
      if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('insufficient permissions')) {
        console.warn(`[Resilient Db] Firestore lacks permission for sync-chat query. Defaulting server to high-fidelity persistent local storage mode.`);
        adminDb = null;
      } else {
        console.warn('Failed to sync chat message to Firestore user doc:', errMsg);
      }
    }
  }

  return res.json({ success: true, chatLog: log });
});

// 7. Chats list
app.get('/api/admin/chats', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }

  let combinedChats = [...serverChatLogs];
  if (adminDb) {
    try {
      const snapshot = await adminDb.collection('users').get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data.arohiChats && data.arohiChats.length > 0) {
          data.arohiChats.forEach((c: any) => {
            const userEmail = data.email || data.profile?.email || '';
            if (!userEmail) return;

            const mappedLog = {
              id: c.id || `chat-${Math.random().toString(36).substring(2, 9)}`,
              userEmail: userEmail.toLowerCase(),
              userName: data.displayName || data.profile?.name || userEmail.split('@')[0],
              topic: c.title || 'Arohi AI Consultation',
              sentiment: 'Neutral',
              messages: c.messages?.map((m: any) => ({
                sender: m.role === 'user' ? 'user' : 'arohi',
                text: m.content || m.text || '',
                time: m.timestamp || c.date || ''
              })) || []
            };

            const existingIdx = combinedChats.findIndex(ch => ch.userEmail && ch.userEmail.toLowerCase() === userEmail.toLowerCase() && ch.topic === mappedLog.topic);
            if (existingIdx !== -1) {
              combinedChats[existingIdx] = mappedLog;
            } else {
              combinedChats.unshift(mappedLog);
            }
          });
        }
      });
    } catch (err: any) {
      console.warn('Failed to load real-time chat logs from Firestore:', err.message || err);
    }
  }

  return res.json({ chats: combinedChats });
});

// 7.5. Real-Time Voice Calls list for Admin Panel
app.get('/api/admin/voice-calls', async (req, res) => {
  if (!checkAdminAuth(req)) {
    return res.status(403).json({ error: 'Access denied: Unauthorized' });
  }

  let combinedCalls: any[] = [];
  
  // First, let's seed with some high-quality mock call logs to ensure the admin panel is lively even on empty DB
  const mockCalls = [
    {
      id: "call-mock-1",
      userEmail: "elitetraderjunoon@gmail.com",
      userName: "Elite Trader Junoon",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      duration: 165, // 2m 45s
      summary: "The candidate discussed plans for setting up a fly ash bricks manufacturing factory with a capital budget of ₹10 Lakhs. AROHI recommended securing an Udyam MSME license and checked eligibility for the Mudra Loan scheme.",
      turns: [
        { speaker: "user", text: "Hi Arohi, I want to talk about setting up a brick kiln or brick factory in Bihar. I have 10 Lakhs capital.", timestamp: "11:07 AM" },
        { speaker: "arohi", text: "Namaste! That is a very viable business idea. For a fly ash bricks unit with 10 Lakhs capital, you can structure it under the MSME schemes for credit linkages.", timestamp: "11:07 AM" },
        { speaker: "user", text: "What licenses do I need and how can I get a government loan?", timestamp: "11:08 AM" },
        { speaker: "arohi", text: "Your major priorities are securing an Udyam MSME status, obtaining local municipal trade licenses, and checking PM Mudra loan eligibility.", timestamp: "11:08 AM" }
      ],
      analysis: {
        summary: "The candidate discussed plans for setting up a fly ash bricks manufacturing factory with a capital budget of ₹10 Lakhs. AROHI recommended securing an Udyam MSME license and checked eligibility for the Mudra Loan scheme.",
        priorities: [
          "PLANT INFRASTRUCTURE: Finalize machinery procurement specs for automatic/semi-automatic brick presses.",
          "FINANCING PLAN: Structure the 10 Lakhs budget, dividing 60% for machinery and 40% for working capital.",
          "MSME INCENTIVES: Apply for an Udyam MSME certificate to claim credit linkages and power tariff subsidies."
        ],
        completedTasks: [
          "Fly Ash Bricks Factory Setup Outline Created",
          "Capital Expenditure Allocations Mapped (10 Lakhs budget)",
          "MSME Subsidies Eligibility Verified"
        ],
        isCareerRelated: false,
        topics: { business: true, resume: false, jobs: false, courses: false }
      }
    },
    {
      id: "call-mock-2",
      userEmail: "candidate.rahul@gmail.com",
      userName: "Rahul Sharma",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      duration: 124, // 2m 04s
      summary: "Rahul Sharma discussed career growth tracks in modern web engineering. AROHI formulated an action plan targeting React 19 upskilling and corporate placement tracks.",
      turns: [
        { speaker: "user", text: "Hello Arohi, I am a frontend developer looking to get hired in high-growth startups.", timestamp: "03:15 PM" },
        { speaker: "arohi", text: "Namaste Rahul! High-growth startups prioritize solid state management, modular component designs, and TypeScript proficiency. Let's work on upskilling.", timestamp: "03:15 PM" },
        { speaker: "user", text: "Can you help me prepare a custom roadmap?", timestamp: "03:16 PM" },
        { speaker: "arohi", text: "Absolutely, I have created a dynamic learning roadmap including advanced React and D3 visualizations. Let's start with your portfolio review.", timestamp: "03:16 PM" }
      ],
      analysis: {
        summary: "Rahul Sharma discussed career growth tracks in modern web engineering. AROHI formulated an action plan targeting React 19 upskilling and corporate placement tracks.",
        priorities: [
          "DEVELOPER PORTFOLIO: Compile high-fidelity responsive projects demonstrating core technical competencies.",
          "SKILLS ADVANCEMENT: Upskill in modern frameworks such as React 19, TypeScript, and state architectures.",
          "PLACEMENT STRATEGY: Target state technical vacancies and corporate software development opportunities."
        ],
        completedTasks: [
          "Analyzed software development career alignment",
          "Configured personalized upskilling benchmarks",
          "Matched target technical vacancy tracks"
        ],
        isCareerRelated: true,
        topics: { business: false, resume: true, jobs: true, courses: true }
      }
    }
  ];

  combinedCalls = [...mockCalls];

  if (adminDb) {
    try {
      // 1. Load directly from voice_call_logs collection
      const logsSnap = await adminDb.collection('voice_call_logs').get();
      const dbLogs: any[] = [];
      logsSnap.forEach((doc: any) => {
        const data = doc.data();
        dbLogs.push({
          id: doc.id,
          uid: data.uid,
          timestamp: data.timestamp || new Date().toISOString(),
          duration: data.duration || 0,
          turns: data.turns || [],
          analysis: data.analysis || {},
          summary: data.analysis?.summary || 'No summary available.'
        });
      });

      // Fetch user profile info to enrich the DB log rows
      const usersSnap = await adminDb.collection('users').get();
      const userMap = new Map();
      usersSnap.forEach((doc: any) => {
        const data = doc.data();
        userMap.set(doc.id, {
          email: data.email || data.profile?.email || '',
          name: data.displayName || data.profile?.name || (data.email ? data.email.split('@')[0] : '')
        });
      });

      const enrichedDbLogs = dbLogs.map(log => {
        const uInfo = userMap.get(log.uid) || { email: 'guest@recruit.org.in', name: 'Guest Caller' };
        return {
          id: log.id,
          userEmail: uInfo.email,
          userName: uInfo.name,
          timestamp: log.timestamp,
          duration: log.duration,
          turns: log.turns,
          analysis: log.analysis,
          summary: log.summary
        };
      });

      // Merge DB logs with combinedCalls list
      enrichedDbLogs.forEach((newCall: any) => {
        const idx = combinedCalls.findIndex(c => c.id === newCall.id);
        if (idx !== -1) {
          combinedCalls[idx] = newCall;
        } else {
          combinedCalls.unshift(newCall);
        }
      });
    } catch (err: any) {
      const errMsg = err.message || String(err);
      if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('insufficient permissions')) {
        console.warn(`[Resilient Db] Firestore lacks permission for loading voice_call_logs. Defaulting server to high-fidelity persistent local storage mode.`);
        adminDb = null;
      } else {
        console.warn('Failed to load real-time voice call logs from Firestore:', errMsg);
      }
    }
  }

  // Fallback / merge local voice call logs when adminDb is disabled or failed
  const localDbLogs = inMemoryVoiceLogs.map((data, idx) => {
    const userProfile = inMemoryUsers.get(data.uid) || {};
    return {
      id: `local-call-${idx}-${data.timestamp}`,
      userEmail: userProfile.email || 'guest@recruit.org.in',
      userName: userProfile.displayName || 'Guest Caller',
      timestamp: data.timestamp || new Date().toISOString(),
      duration: data.duration || 0,
      turns: data.turns || [],
      analysis: data.analysis || {},
      summary: data.analysis?.summary || 'No summary available.'
    };
  });

  localDbLogs.forEach((newCall: any) => {
    const idx = combinedCalls.findIndex(c => c.id === newCall.id);
    if (idx !== -1) {
      combinedCalls[idx] = newCall;
    } else {
      combinedCalls.unshift(newCall);
    }
  });

  // Sort calls chronologically (newest first)
  combinedCalls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return res.json({ voiceCalls: combinedCalls });
});

// Resilient API calling helper with automatic fallback models to prevent 503 "High Demand" errors
async function generateContentWithFallback(aiClientInstance: GoogleGenAI, options: any) {
  const modelsToTry = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting generateContent with model: ${model}`);
      const response = await aiClientInstance.models.generateContent({
        ...options,
        model: model,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} failed with: ${err.message || err}. Trying next model...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All models failed to generate content.');
}

const AROHI_SYSTEM_INSTRUCTION = `You are AROHI (India's AI Opportunity Advisor), the flagship intelligent assistant of Recruit.org.in.
Recruit.org.in is an AI-powered universal opportunity ecosystem designed to serve a highly diverse and inclusive spectrum of 20+ specialized audience categories:
1. Students (1-10 CBSE & state syllabus, higher education, skill paths)
2. Teachers (educational support, tools, resources)
3. Parents (academic counseling, developmental aid)
4. Scientists (cosmic studies, technical research)
5. Researchers (analytics, papers, methodologies)
6. Doctors (health informatics, careers)
7. Engineers (modern technologies, coding, builds)
8. Entrepreneurs (startups, business validation, plans)
9. Job Seekers (government & private openings, recruitment grids)
10. Professionals (upskilling, networking, advancement)
11. Humans (universal search, life advice, supportive chat)
12. Businesses (MSMEs, registration, scaling, corporate hiring)
13. Govt. Aspirants (UPSC, SSC, banking, railway, mock tests)
14. Universities (curriculum guidelines, institutional support)
15. Organizations (operational advice, strategy)
16. Aliens (playful cosmic interactions, sci-fi queries)
17. The citizens of Mars (interstellar concepts, future logistics)
18. The citizens of Jupiter (gravitational thoughts, jovian intelligence)
19. All Govt. Officials (governance protocols, schemes database)
20. All Private Officials (enterprise management, growth)

You are fully optimized to provide personalized responses adapted to whichever persona or user category contacts you. Maintain this comprehensive and multi-dimensional scope at all times across all text chat and real-time live voice call interactions.

Your Personality:
* Professional, Intelligent, Helpful, Positive, Motivational, Human-like, Career-focused.
Your Communication Style & Multilingual Guidelines:
* Keep answers structured, highly scannable, using markdown headings, bold terms, and bullet points where applicable.
* Multilingual Support (English, Hindi, Odia):
  - English (EN): Provide professional, highly structured career guidance.
  - Hindi (HI / हिंदी): Respond in clear, formal Devanagari script.
  - Odia (OR / ଓଡ଼ିଆ): Respond in correct native Odia script.
  - Transliterated / Romanized input (Hinglish or English-sounding Odia): If the user types queries using Latin alphabet but sounding like Hindi (e.g., "mujhe railway job chahiye") or sounding like Odia (e.g., "mote state scheme bisayare kuha" or "mote business karibaku achhi"), you must reply warmly in their exact style. Use easy-to-read transliterated language (sounding language) or high-quality bilingual (e.g., mixing matching English keywords with transliterated Odia/Hindi phrasing) to make it highly natural and approachable!
  - Never force standard English if the user initiated in Odia, Hindi, or English-sounding regional languages.

============================================================
MASTER PROMPT — FOUNDERS, LEADERSHIP & VISION OF AROHI AND RECRUIT.ORG.IN
============================================================

Leadership & Vision:
If anyone asks who created, developed, founded, owns, leads, or envisioned Arohi or Recruit.org.in, respond confidently and professionally:
"Arohi and the Recruit.org.in AI ecosystem were conceived and developed under the supreme leadership of Commander Junoon (Junoon Nayak), with strategic support from Mr. Giridhari Prasad Nayak and Mr. Jitendra Kumar Mohanty. Together, they form the core leadership team behind the vision, strategy, and execution of the Recruit ecosystem."

Leadership Profiles:

* Commander Junoon (Junoon Nayak)
Commander Junoon is the visionary behind Arohi and Recruit.org.in. Within the project, he is presented as a visionary entrepreneur and technology leader focused on building AI-powered platforms that solve real-world challenges. His expertise spans artificial intelligence strategy, technology innovation, digital transformation, entrepreneurship, product vision, platform development, and ecosystem building. His leadership is driven by the belief that advanced technology should be accessible, practical, and empowering for everyone.

* Mr. Giridhari Prasad Nayak
Mr. Giridhari Prasad Nayak is the project's senior strategic consultant. He provides strategic guidance, business consulting, organizational planning, governance, decision-making support, and long-term growth insights. His role helps ensure that the Recruit ecosystem is built on strong planning, sustainability, and practical execution.

* Mr. Jitendra Kumar Mohanty
Mr. Jitendra Kumar Mohanty is the project's multi-industry management professional. He contributes operational leadership, organizational management, execution planning, process optimization, and cross-industry business expertise. His focus is on transforming strategic ideas into efficient, scalable operations.

---

Why Arohi Was Created:
Arohi was created with a mission to make advanced artificial intelligence useful, accessible, and affordable for everyone.
The founders envisioned a platform where students, job seekers, professionals, entrepreneurs, businesses, institutions, and organizations could receive intelligent assistance from a single AI ecosystem.
Arohi aims to bridge the gap between people and technology by providing AI-powered guidance, productivity tools, career support, business assistance, learning resources, and digital services through one unified platform.

---

Vision of Recruit.org.in:
Recruit.org.in is envisioned as more than a job platform.
Its long-term vision is to become one of the world's leading AI-powered ecosystems for:
- Employment & Careers
- Education & Skill Development
- Entrepreneurship & Startups
- Business Growth
- Professional Services
- AI Productivity
- Government & Citizen Services
- Innovation & Digital Transformation

The platform strives to empower individuals and organizations through intelligent technology that simplifies complex tasks and creates meaningful opportunities.

---

Response Guidelines:
- Always be respectful, professional, and factual.
- Present these leadership profiles and descriptions as the project's own representation of its leadership and vision.
- Do not claim independent public recognition, awards, rankings, or achievements unless supported by reliable public sources.
- If asked about external verification, clarify that these descriptions reflect the project's stated leadership team, mission, and vision.
- Represent Arohi as an AI assistant that embodies the values of innovation, accessibility, integrity, and service to society.

============================================================

You can assist with:
1. Career Guidance (career counselling, roadmap generation, skill gap analysis, upskilling, education planning, future career predictions).
2. Job Assistance (job discovery, resume review, ATS optimization, interview preparation, salary guidance).
3. Business Guidance (MSME guidance, startup support, business idea validation, business planning, market insights, funding awareness, growth roadmaps).
4. Government Schemes (discovering student/farmer/women/MSME central & state schemes, eligibility analysis, document requirements, application guidance).
5. Learning Guidance (course recommendations, certification pathways, skill development).

Always speak as AROHI. Introduce yourself proudly and offer helpful, positive advice centered on Indian career and economic advancement.`;

// 1. Chat with AROHI Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history, file, language, uid } = req.body;

  if (!message && !file) {
    return res.status(400).json({ error: 'Message or File is required' });
  }

  const messageText = message || '';

  // Log activity
  logActivity('chat', `User conversed with AROHI AI [Lang: ${language || 'en'}]: "${messageText.length > 50 ? messageText.substring(0, 50) + '...' : messageText}"${file ? ` with attached file: ${file.name}` : ''}`);

  try {
    if (aiClient) {
      // Setup chats
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }));

      // Build modern multimodal parts payload
      const userParts: any[] = [{ text: messageText || "Please analyze this file." }];
      if (file && file.base64 && file.mimeType) {
        userParts.push({
          inlineData: {
            data: file.base64,
            mimeType: file.mimeType
          }
        });
      }

      // Build dynamic system instruction based on chosen interface language
      let dynamicInstruction = AROHI_SYSTEM_INSTRUCTION;

      // Load user memory context if uid is provided
      if (uid) {
        try {
          const userSnap = await safeUserDb.get(uid);
          if (userSnap.exists) {
            const userData = userSnap.data();
            const displayName = userData.displayName || '';
            const profile = userData.profile || {};
            const activeGoal = profile.activeGoal || '';
            const education = profile.education || '';
            
            let memoryContext = `\n\n=== USER IDENTITY & PERSONALIZED PROFILE MEMORY ===`;
            memoryContext += `\n* Name: ${displayName || 'Honored Guest'}`;
            if (userData.email) memoryContext += `\n* Email: ${userData.email}`;
            if (activeGoal) memoryContext += `\n* Active Career/MSME Goal: ${activeGoal}`;
            if (education) memoryContext += `\n* Education Background: ${education}`;
            if (profile.location) memoryContext += `\n* Location: ${profile.location}`;
            if (profile.phone) memoryContext += `\n* Contact Phone: ${profile.phone}`;
            
            // Summarize past chats
            if (userData.arohiChats && userData.arohiChats.length > 0) {
              memoryContext += `\n\n=== PAST TEXT CHAT CONVERSATIONS RECORDED ===`;
              userData.arohiChats.slice(0, 5).forEach((chat: any) => {
                memoryContext += `\n* Conversation [ID: ${chat.id}, Title: "${chat.title}"]:`;
                if (chat.messages && chat.messages.length > 0) {
                  const firstMsg = chat.messages[0]?.content || '';
                  const lastMsg = chat.messages[chat.messages.length - 1]?.content || '';
                  memoryContext += `\n  - Started with: "${firstMsg.slice(0, 100).replace(/\n/g, ' ')}..."`;
                  memoryContext += `\n  - Ended with: "${lastMsg.slice(0, 100).replace(/\n/g, ' ')}..."`;
                }
              });
            }

            // Summarize past voice calls
            if (userData.arohiCalls && userData.arohiCalls.length > 0) {
              memoryContext += `\n\n=== PAST VOICE CALLS RECORDED ===`;
              userData.arohiCalls.slice(0, 5).forEach((call: any) => {
                memoryContext += `\n* Voice Call [Date: ${call.date}, Duration: ${call.duration}s]:`;
                if (call.summaryText) {
                  memoryContext += `\n  - Summary: "${call.summaryText.slice(0, 200).replace(/\n/g, ' ')}..."`;
                }
              });
            }

            memoryContext += `\n\nAROHI's MEMORY INSTRUCTIONS: You have perfect recall of the user's past chats and voice calls listed above. Any time they mention or refer to a past call or chat, warmly reference your memory, confirm your recollection, and offer continuity. Use their name and personalized goals naturally during chat or calls to make them feel heard and remembered!`;
            
            dynamicInstruction += memoryContext;
          }
        } catch (memErr) {
          console.error("Error loading user memory context in /api/chat:", memErr);
        }
      }
      const languageNames: Record<string, string> = {
        hi: 'HINDI (हिंदी)',
        or: 'ODIA (ଓଡ଼ିଆ)',
        bn: 'BENGALI (বাংলা)',
        te: 'TELUGU (తెలుగు)',
        mr: 'MARATHI (मराठी)',
        ta: 'TAMIL (தமிழ்)',
        gu: 'GUJARATI (ગુજરાતી)',
        ur: 'URDU (اردو)',
        kn: 'KANNADA (ಕನ್ನಡ)',
        ml: 'MALAYALAM (മലയാളം)',
        pa: 'PUNJABI (ਪੰਜਾਬੀ)',
        as: 'ASSAMESE (অসমীয়া)'
      };

      if (language && languageNames[language]) {
        const langName = languageNames[language];
        dynamicInstruction += `\n\n[USER INTERFACE LANGUAGE: ${langName}. The user prefers ${langName.split(' ')[0]}. You MUST reply primarily in ${langName} script or in highly natural sounding transliterated script (mixing local phonetic spelling with English keywords) depending on how the user communicates. Match their regional preference warmly, motivatingly, and professionally in that language.]`;
      } else {
        dynamicInstruction += `\n\n[USER INTERFACE LANGUAGE: ENGLISH. The user prefers English. Maintain default English unless they type in any Indian regional language or Hinglish/transliterated language, in which case match their chosen language perfectly.]`;
      }

      if (messageText.toLowerCase().includes('resume') || messageText.toLowerCase().includes('cv') || messageText.toLowerCase().includes('biodata') || messageText.toLowerCase().includes('career')) {
        dynamicInstruction += `\n\n[RESUME DIRECTIVE: If you are writing, drafting, or editing a resume, CV, or professional profile for the user, you MUST append a valid JSON representation of the resume at the very end of your response, wrapped inside a single block like "[RESUME_DOCX_DATA_START]" and "[RESUME_DOCX_DATA_END]". Do not mention this JSON in the conversational text. Keep the JSON highly valid.
Schema to use:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "Phone number",
  "linkedin": "linkedin URL/handle",
  "github": "github URL/handle",
  "summary": "Professional summary statement",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {
      "company": "Company name",
      "role": "Job role/title",
      "duration": "Duration (e.g. June 2024 - Present)",
      "achievements": ["Achievement bullet 1", "Achievement bullet 2"]
    }
  ],
  "education": [
    {
      "school": "University/School name",
      "degree": "Degree earned",
      "duration": "Duration (e.g. 2020 - 2024)"
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Short project summary",
      "technologies": ["React", "TypeScript"]
    }
  ]
}
Construct this JSON strictly based on details discussed, or use standard professional default placeholders corresponding to their profile if details are sparse. This ensures they have a working Microsoft Word file download immediately!]`;
      }

      // Call Gemini API using modern SDK with fallback strategy
      const response = await generateContentWithFallback(aiClient, {
        contents: [
          ...formattedHistory,
          { role: 'user', parts: userParts }
        ],
        config: {
          systemInstruction: dynamicInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ response: response.text });
    } else {
      // Fallback response generator if API key is not present
      return res.json({
        response: getArohiFallbackResponse(messageText, file ? file.name : undefined),
        fallback: true
      });
    }
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.json({
      response: `[AROHI AI Server Note: Encountered an API error. Here is a simulated response to help you build:]\n\n${getArohiFallbackResponse(messageText, file ? file.name : undefined)}`,
      error: error.message
    });
  }
});

// 1.25. Analyze Voice Call Turns Endpoint using Gemini SDK
app.post('/api/analyze-call', async (req, res) => {
  const { turns, callDuration, uid } = req.body;
  if (!turns || !Array.isArray(turns)) {
    return res.status(400).json({ error: 'turns array is required' });
  }

  // 1. Validate and sanitize transcript speech turns
  const validatedTurns = turns
    .filter((t: any) => t && typeof t === 'object' && t.text && typeof t.text === 'string' && t.text.trim().length > 0)
    .map((t: any) => ({
      speaker: t.speaker === 'user' ? 'user' : 'arohi',
      text: t.text.trim(),
      timestamp: t.timestamp || new Date().toISOString()
    }));

  try {
    let parsed: any;
    if (aiClient && validatedTurns.length > 0) {
      const text = validatedTurns.map(t => `${t.speaker === 'user' ? 'Candidate' : 'Arohi AI'}: ${t.text}`).join('\n');
      
      const prompt = `Perform a comprehensive conversation analysis on the following real-time Indian voice interaction between a candidate and AROHI AI.
Analyze the actual dialogue, and extract details such as any specific names, numbers, budgets, or business types they discussed (e.g. "manufacturing setup of flying ash bricks factory with a budget of 10 lakhs" or similar details).

Return a clean, valid JSON response with the following fields:
- summary: (string, a warm, professional, detailed 1-2 sentence executive summary of what was ACTUALLY discussed in this specific call, reflecting real topics, names, budgets, and objectives. Do NOT assume generic templates like a bakery, software development, or a career plan unless actually mentioned in the transcript. Be fully truthful to the actual speech.)
- priorities: (array of exactly 3 strings, crucial action items or strategic next-step priorities tailored specifically to what they discussed. Do NOT use technical meta-logs or developer/system events like "Initialized AROHI system".)
- completedTasks: (array of exactly 2-3 strings, completed milestones or accomplishments during the call. Do NOT include technical meta-logs, system operations, API calls, or server/developer events such as "Initialized AROHI system", "Scanned payload", "Parsed JSON", "Set up connection".)
- isCareerRelated: (boolean, true if the topic is NOT business/MSME/entrepreneurship)
- topics: (object containing the following booleans):
  - business: (boolean, true if startup, funding, business, MSME, shop, manufacturing, or factory was discussed)
  - resume: (boolean, true if resume, CV, biodata, or portfolio was discussed)
  - jobs: (boolean, true if job vacancy, exams, SSC, PSC, placement was discussed)
  - courses: (boolean, true if courses, upskilling, certifications, training was discussed)

Call Transcript Turns:
${text}`;

      const response = await generateContentWithFallback(aiClient, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are AROHI, a brilliant career and business development analyst. Synthesize voice sessions with high fidelity and zero template slop. NEVER include developer or API event descriptions as completed tasks.',
        }
      });

      parsed = JSON.parse(response.text || '{}');
    } else {
      // Return a smart client-side analysis from the server
      parsed = runSmartOfflineAnalysis(validatedTurns);
    }

    // 2. Structured logging mechanism to console (fully readable/scannable logs)
    console.log(JSON.stringify({
      tag: 'AROHI_VOICE_SESSION_TRANSCRIPT',
      timestamp: new Date().toISOString(),
      uid: uid || 'guest',
      callDuration: callDuration || 0,
      totalTurns: turns.length,
      validatedTurnsCount: validatedTurns.length,
      rawWordCount: validatedTurns.reduce((acc: number, t: any) => acc + t.text.split(/\s+/).length, 0),
      analysisSummary: parsed.summary || 'None'
    }, null, 2));

    // 3. Persist the validated transcript & analysis in general voice logs
    const newVoiceLog = {
      uid: uid || 'guest',
      timestamp: new Date().toISOString(),
      duration: callDuration || 0,
      turns: validatedTurns,
      analysis: parsed,
    };
    inMemoryVoiceLogs.unshift(newVoiceLog);
    saveLocalVoiceLogs();

    if (adminDb) {
      try {
        await adminDb.collection('voice_call_logs').add(newVoiceLog);
        console.log(`[Structured Log] Successfully logged transcript to voice_call_logs Firestore collection for UID: ${uid || 'guest'}`);
      } catch (logErr: any) {
        const errMsg = logErr.message || String(logErr);
        if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('insufficient permissions')) {
          console.warn(`[Resilient Db] Firestore lacks permission for writing to voice_call_logs. Defaulting server to high-fidelity persistent local storage mode.`);
          adminDb = null;
        } else {
          console.error('[Structured Log] Firestore voice_call_logs write error:', errMsg);
        }
      }
    }

    // 4. Persist directly inside the user's active call-history list in Firestore/LocalDB
    if (uid) {
      try {
        const docSnap = await safeUserDb.get(uid);
        if (docSnap.exists) {
          const userData = docSnap.data() || {};
          const arohiCalls = userData.arohiCalls || [];
          
          const newCallItem = {
            id: `call-${Date.now()}`,
            duration: callDuration || 0,
            turns: validatedTurns,
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            summaryText: parsed.summary,
            isCareerRelated: !parsed.topics?.business,
            analysis: parsed
          };
          
          const updatedCalls = [newCallItem, ...arohiCalls];
          await safeUserDb.update(uid, {
            arohiCalls: updatedCalls,
            updatedAt: new Date().toISOString()
          });
          console.log(`[Structured Log] Saved validated call record to user's database profile for UID: ${uid}`);
        }
      } catch (profileErr: any) {
        console.error('[Structured Log] Error updating user voice profile:', profileErr.message || profileErr);
      }
    }

    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error in /api/analyze-call:', error);
    const analysis = runSmartOfflineAnalysis(validatedTurns);
    return res.json({ success: true, analysis, error: error.message });
  }
});

function runSmartOfflineAnalysis(turns: any[]) {
  if (!turns || turns.length === 0) {
    return {
      summary: "The voice session completed successfully, but no spoken turns were registered.",
      priorities: [
        "PLANNING: Refine your professional or entrepreneurial strategy with AROHI.",
        "SKILLS: Focus on learning practical, high-demand industry skills.",
        "COMPLIANCE: Research state-sponsored developmental programs and support provisions."
      ],
      completedTasks: [
        "AROHI Real-Time voice consultation completed"
      ],
      isCareerRelated: true,
      topics: { business: false, resume: false, jobs: false, courses: false }
    };
  }

  const text = turns.map(t => t.text.toLowerCase()).join(' ');

  const isBricks = /brick|ash|fly|cement/.test(text);
  const isBusiness = isBricks || /bakery|bake|bread|cake|business|entrepreneur|shop|mudra|loan|startup|venture|funding|finance|retail|commerce|market|industry|manufactur/.test(text);
  const isResume = /resume|cv|portfolio|bio|biodata|interview|hire|hiring|recruit/.test(text);
  const isJobs = /job|vacancy|exam|ssc|psc|railway|post|placement|technical service/.test(text);
  const isCourses = /course|learn|skill|upskill|react|d3|training|study|education|cert/.test(text);

  const userTurns = turns.filter(t => t.speaker === 'user' || t.speaker?.toLowerCase() === 'candidate');
  const assistantTurns = turns.filter(t => t.speaker === 'arohi' || t.speaker?.toLowerCase() === 'arohi ai' || t.speaker === 'assistant');

  const userTexts = userTurns.map(t => t.text.trim()).filter(Boolean);
  const assistantTexts = assistantTurns.map(t => t.text.trim()).filter(Boolean);

  let summary = "";
  if (userTexts.length > 0 && assistantTexts.length > 0) {
    const primaryQuery = userTexts[0];
    const primaryResponse = assistantTexts[0];
    
    const cleanQuery = primaryQuery.length > 120 ? primaryQuery.substring(0, 117) + "..." : primaryQuery;
    const cleanResponse = primaryResponse.length > 150 ? primaryResponse.substring(0, 147) + "..." : primaryResponse;
    
    summary = `The candidate discussed: "${cleanQuery}". AROHI provided personalized guidance, recommending: "${cleanResponse}".`;
  } else if (userTexts.length > 0) {
    const cleanQuery = userTexts[0].length > 180 ? userTexts[0].substring(0, 177) + "..." : userTexts[0];
    summary = `The voice session captured the candidate's query: "${cleanQuery}". AROHI analyzed this input to frame tailored development opportunities.`;
  } else if (assistantTexts.length > 0) {
    const cleanResponse = assistantTexts[0].length > 180 ? assistantTexts[0].substring(0, 177) + "..." : assistantTexts[0];
    summary = `AROHI provided consultation guidance: "${cleanResponse}", outlining technical and developmental milestones.`;
  } else {
    summary = "The candidate and AROHI engaged in a voice consultation. Discussion points centered on matching qualifications against active vacancies, identifying upskilling opportunities, or exploring state-sponsored schemes.";
  }

  let priorities: string[] = [];
  let completedTasks: string[] = [];

  if (isBricks) {
    priorities = [
      "PLANT INFRASTRUCTURE: Finalize machinery procurement specs for automatic/semi-automatic brick presses.",
      "FINANCING PLAN: Structure the 10 Lakhs budget, dividing 60% for machinery and 40% for working capital.",
      "MSME INCENTIVES: Apply for an Udyam MSME certificate to claim credit linkages and power tariff subsidies."
    ];
    completedTasks = [
      "Fly Ash Bricks Factory Setup Outline Created",
      "Capital Expenditure Allocations Mapped (10 Lakhs budget)",
      "MSME Subsidies Eligibility Verified"
    ];
  } else if (isBusiness) {
    const bizMatch = text.match(/(bakery|shop|venture|startup|retail|commerce)/);
    const bizName = bizMatch ? bizMatch[1] : "commercial venture";
    priorities = [
      `BUSINESS MODELLING: Finalize the commercial product line, pricing framework, and equipment procurement list for your ${bizName}.`,
      "FINANCE: Prepare draft business proposals and check eligibility for the PM Mudra Loan Scheme.",
      "COMPLIANCE: Check licensing guidelines (FSSAI/Municipal) and regional trading registrations."
    ];
    completedTasks = [
      `Business Model Outline Generated for ${bizName}`,
      "Mudra Loan Scheme (PMMY) Eligibility Checklist Verified",
      "Sourcing & Commercial Setup Priorities Mapped"
    ];
  } else if (isResume && !isJobs) {
    priorities = [
      "RESUME EXPORT: Review and download the personalized professional resume generated in this session.",
      "PORTFOLIO: Collate live project links highlighting key engineering outputs and interactive features.",
      "PREPARATION: Go through mock interviews with Arohi's career sandbox to practice core answers."
    ];
    completedTasks = [
      "Candidate Professional Resume Drafted",
      "Technical Competencies (React 19, TypeScript) Formatted for Export"
    ];
  } else {
    const techKeywords = ["react", "software", "developer", "coding", "technical", "web", "d3", "programming", "python", "java", "sql", "engineering"];
    const hasTech = techKeywords.some(kw => text.includes(kw));

    if (hasTech) {
      priorities = [
        "DEVELOPER PORTFOLIO: Compile high-fidelity responsive projects demonstrating core technical competencies.",
        "SKILLS ADVANCEMENT: Upskill in modern frameworks such as React 19, TypeScript, and state architectures.",
        "PLACEMENT STRATEGY: Target state technical vacancies and corporate software development opportunities."
      ];
      completedTasks = [
        "Analyzed software development career alignment",
        "Configured personalized upskilling benchmarks",
        "Matched target technical vacancy tracks"
      ];
    } else {
      priorities = [
        "CAREER STRATEGY: Consult AROHI periodically to refine your professional or entrepreneurial strategy.",
        "DEVELOPMENT: Focus on learning practical, high-demand industry skills that fit your desired track.",
        "COMPLIANCE: Research state-sponsored developmental programs and career support provisions."
      ];
      completedTasks = [
        "Completed professional skill diagnostic",
        "AROHI Real-Time voice consultation logged",
        "Career development checklist updated"
      ];
    }
  }

  return {
    summary,
    priorities,
    completedTasks,
    isCareerRelated: !isBusiness,
    topics: {
      business: isBusiness || turns.length === 0,
      resume: isResume,
      jobs: isJobs,
      courses: isCourses
    }
  };
}

// 1.5. Generate Resume Word Document (.docx) Endpoint
app.post('/api/generate-resume-docx', async (req, res) => {
  try {
    const resumeData = req.body;
    if (!resumeData || !resumeData.name) {
      return res.status(400).json({ error: 'Name is required to generate a resume.' });
    }

    const buffer = await createResumeDocx(resumeData);
    const safeName = resumeData.name.replace(/\s+/g, '_');
    const filename = `${safeName}_Resume.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error: any) {
    console.error('Error in /api/generate-resume-docx:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Resume AI Analysis Endpoint
app.post('/api/analyze-resume', async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  // Log activity
  logActivity('resume', `User scanned resume for ATS compatibility (${resumeText.length} characters)`);

  try {
    if (aiClient) {
      const prompt = `Perform a comprehensive ATS and professional resume analysis on the following resume content.
Return a clean JSON response containing:
- atsScore (number from 0 to 100)
- rating (string, e.g., "Good", "Needs Improvement", "Excellent")
- skillsGap (array of strings, key skills that are missing based on standard Indian job trends)
- missingKeywords (array of strings, industry-standard terms that would improve searchability)
- suggestions (array of strings, actionable improvement ideas)
- feedbackText (markdown-formatted detailed summary of the profile strengths and weaknesses)

Resume Content:
${resumeText}`;

      const response = await generateContentWithFallback(aiClient, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are AROHI, an expert ATS recruitment scanner. Analyze the resume with high precision.',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Simulated Resume Analysis Response
      const fallbackAnalysis = {
        atsScore: 68,
        rating: 'Needs Improvement',
        skillsGap: ['Cloud Architecture (AWS/GCP)', 'Docker & Kubernetes', 'System Design Patterns', 'CI/CD Pipelines'],
        missingKeywords: ['Microservices', 'RESTful APIs', 'TypeScript', 'Automated Testing', 'Agile Methodologies'],
        suggestions: [
          'Quantify accomplishments: Use metrics and percentages instead of just listing responsibilities (e.g., "Improved API response times by 30%").',
          'Add a distinct "Technical Skills" matrix categorizing languages, frameworks, databases, and DevOps tools.',
          'Optimize resume formatting: Ensure a single-column layout for better parser compatibility.',
          'Tailor keywords specifically to target roles to clear recruiter screening bots.'
        ],
        feedbackText: `### Resume Evaluation Summary
Hello! I am **AROHI**, your AI Opportunity Advisor. I have reviewed your resume and found a strong foundation in core engineering, but noticed several opportunities to align it better with modern industry standard ATS requirements.

* **Strengths Identified:** Clear educational history and exposure to React & Node.js ecosystem.
* **Key Improvements Needed:** The experience statements feel highly task-oriented rather than achievements-oriented. Quantify your contributions to stand out!`,
        fallback: true
      };
      return res.json(fallbackAnalysis);
    }
  } catch (error: any) {
    console.error('Error in /api/analyze-resume:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 2.5. AI Candidate Matching Endpoint
app.post('/api/ai-match-candidate', async (req, res) => {
  const { candidateProfile, jobRequirements } = req.body;
  if (!candidateProfile || !jobRequirements) {
    return res.status(400).json({ error: 'Candidate profile and job requirements are required' });
  }

  logActivity('recruitment', `Recruiter ran AI Candidate Matching for candidate "${candidateProfile.name}" against job "${jobRequirements.title}"`);

  try {
    if (aiClient) {
      const prompt = `Perform a professional AI Candidate Matching analysis. Compare the Candidate's profile against the Job's requirements.
      
      Candidate Profile:
      - Name: ${candidateProfile.name}
      - Qualifications: ${candidateProfile.qualification}
      - Contact: ${candidateProfile.email} / ${candidateProfile.phone}
      - Location / Other Details: ${candidateProfile.address || 'Not specified'}

      Job Requirements:
      - Title: ${jobRequirements.title}
      - Organization: ${jobRequirements.organization}
      - Eligibility & Skills Needed: ${jobRequirements.eligibility}
      - Salary / Vacancies: ${jobRequirements.salary || 'Market Standard'} / ${jobRequirements.vacancies || '1'}

      Return a clean JSON response containing:
      - matchScore (number from 0 to 100 representing compatibility)
      - recommendation (string: "Strong Match", "Standard Fit", "Requires Upskilling", "Not Recommended")
      - keyStrengths (array of strings, areas where candidate matches perfectly)
      - skillGaps (array of strings, skills or keywords candidate is missing)
      - customQuestions (array of strings, 3 tailored interview questions to ask this specific candidate to test their gaps)
      - evaluationMarkdown (markdown-formatted detailed recruiter report about why they match or don't match, and hiring suggestions)`;

      const response = await generateContentWithFallback(aiClient, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are AROHI, an advanced AI Recruiter and candidate evaluator. Assess candidates with high professional standard, objectivity and actionable insight.',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // High-quality simulated response based on candidate name and job
      const matchScore = Math.floor(65 + Math.random() * 30);
      let recommendation = "Standard Fit";
      if (matchScore >= 85) recommendation = "Strong Match";
      else if (matchScore < 75) recommendation = "Requires Upskilling";

      const fallbackAnalysis = {
        matchScore,
        recommendation,
        keyStrengths: [
          `Fulfills the core educational background requested for ${jobRequirements.title}.`,
          "Possesses clear local connectivity and verified professional contact details.",
          "Demonstrates basic readiness to learn and execute specialized workplace protocols."
        ],
        skillGaps: [
          "Needs further exposure to advanced toolkits in " + (jobRequirements.eligibility ? jobRequirements.eligibility.slice(0, 50) : "modern workflows"),
          "Lacks documented certifications for specific enterprise tools."
        ],
        customQuestions: [
          `How would you apply your qualification "${candidateProfile.qualification ? candidateProfile.qualification.slice(0, 40) : 'your studies'}" to solve typical technical challenges in our team?`,
          `We see you are interested in "${jobRequirements.title}". What is your approach when dealing with tight deadlines or complex client specifications?`,
          `How do you keep yourself updated with the fast-evolving skills specified in our requirements?`
        ],
        evaluationMarkdown: `### Recruiter Diagnostics Report
Hello! I am **AROHI**, your AI Recruitment co-pilot. I have scanned **${candidateProfile.name}** against the requirements for the **${jobRequirements.title}** role.

#### Overall Matching Summary
* **Alignment Rate:** ${matchScore}% Compatibility
* **Hiring Verdict:** **${recommendation}**
* **Core Strength:** Strong alignment with academic benchmarks and location criteria.
* **Core Gap:** Needs specific micro-certifications or training on intermediate operational tools.
`,
        fallback: true
      };
      return res.json(fallbackAnalysis);
    }
  } catch (error: any) {
    console.error('Error in /api/ai-match-candidate:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. Career Roadmap Endpoint
app.post('/api/generate-roadmap', async (req, res) => {
  const { field, targetRole } = req.body;
  if (!field || !targetRole) {
    return res.status(400).json({ error: 'field and targetRole are required' });
  }

  // Log activity
  logActivity('roadmap', `User generated Career Transition Roadmap for "${targetRole}" inside "${field}"`);

  try {
    if (aiClient) {
      const prompt = `Design a highly-detailed professional career roadmap for someone trying to transition into the field of "${field}" as a "${targetRole}" in India.
Provide a clean JSON response with the following fields:
- title: string
- estimatedMonths: number
- phases: array of objects containing:
  - phaseNumber: number
  - title: string
  - duration: string
  - skillsToLearn: array of strings
  - recommendedResources: array of strings
  - checkpointProject: string
- criticalCertifications: array of strings
- salaryExpectation: string (monthly or yearly range in INR for freshers & mid-levels)`;

      const response = await generateContentWithFallback(aiClient, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are AROHI, a veteran career development architect. Output highly accurate roadmap steps.',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Mock Roadmap Response
      const fallbackRoadmap = {
        title: `Career Transition Blueprint: ${targetRole} (${field})`,
        estimatedMonths: 6,
        phases: [
          {
            phaseNumber: 1,
            title: 'Foundations & Core Principles',
            duration: 'Month 1-2',
            skillsToLearn: ['Basic Command Line', 'Version Control with Git/GitHub', 'Core Programming Syntax', 'Data Structures fundamentals'],
            recommendedResources: ['freeCodeCamp YouTube courses', 'CS50 Introduction to Computer Science', 'MDN Web Docs'],
            checkpointProject: 'Build a Personal Portfolio Website containing 3 mock projects and publish it live on GitHub Pages.'
          },
          {
            phaseNumber: 2,
            title: 'Advanced Frameworks & Tools',
            duration: 'Month 3-4',
            skillsToLearn: ['React.js / Next.js Frameworks', 'Tailwind CSS utility styling', 'State Management (Redux/Zustand)', 'API consumption'],
            recommendedResources: ['Official React Docs', 'ByteByteGo System Design guide', 'Frontend Mentor exercises'],
            checkpointProject: 'Create a fully responsive e-commerce dashboard with cart management, local storage sync, and dynamic item listings.'
          },
          {
            phaseNumber: 3,
            title: 'Backend Integration & Deployment',
            duration: 'Month 5-6',
            skillsToLearn: ['Node.js & Express servers', 'Relational SQL & Firestore schemas', 'REST API Design', 'Cloud hosting (Vercel, Render, Cloud Run)'],
            recommendedResources: ['Node.js Official guides', 'Mosh Hamedani Backend Course', 'MDN Express tutorial'],
            checkpointProject: 'Develop a secure Full-Stack Opportunity Tracker where users login, log applications, and view customized status boards.'
          }
        ],
        criticalCertifications: [
          'AWS Certified Cloud Practitioner',
          'Google Professional Cloud Developer',
          'React Developer Certification (Meta/Coursera)'
        ],
        salaryExpectation: '₹4,50,000 - ₹8,50,000 per annum for freshers; scaling to ₹15,00,000+ for mid-level engineers.',
        fallback: true
      };
      return res.json(fallbackRoadmap);
    }
  } catch (error: any) {
    console.error('Error in /api/generate-roadmap:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. Live AI Opportunity Sync & Search Online
app.post('/api/fetch-online-jobs', async (req, res) => {
  const { sector, location, jobType } = req.body;
  
  logActivity('visit', `User triggered Live AI Opportunity Sync for state: "${location || 'All India'}" and sector: "${sector || 'All'}"`);

  try {
    if (aiClient) {
      const prompt = `Generate an array of 5 to 7 highly realistic and detailed active government exam postings, admit cards, or results in India, specifically targeting:
- Sector: ${sector || 'Any'}
- State/Location: ${location || 'All India or Odisha or Delhi or Maharashtra or Bihar'}
- Job Type: ${jobType || 'government or private'}

Each item MUST perfectly adhere to the following JSON schema:
{
  "id": "string (unique kebab-case ID, e.g. 'rbi-assistant-2026')",
  "title": "string (Title of vacancy or admit-card or result, e.g. 'RBI Assistant Online Form 2026')",
  "organization": "string (Official board/company name, e.g. 'Reserve Bank of India')",
  "postDate": "2026-06-25",
  "shortInfo": "string (Detailed summary of recruitment criteria)",
  "category": "latest-jobs" | "admit-card" | "results" | "answer-key" | "syllabus" | "admission",
  "tags": ["array", "of", "strings", "e.g. RBI, Banking, Graduation"],
  "department": "SSC" | "Railway" | "UPSC" | "Bank" | "Defence" | "State PSC" | "Teaching" | "State Govt" | "Private Sector",
  "isNew": true,
  "state": "string (e.g., 'Odisha', 'All India', 'Maharashtra', 'Delhi-NCR', etc.)",
  "jobType": "government" | "private",
  "sector": "string (e.g. Banking & Finance, IT & Software, Security & Defence, etc.)",
  "dates": {
    "applicationBegin": "2026-06-25",
    "lastDateApply": "2026-07-25",
    "lastDateFee": "2026-07-25",
    "examDate": "string",
    "admitCardAvailable": "string",
    "resultDeclared": "string"
  },
  "fees": {
    "generalOBC": "string",
    "scST": "string",
    "female": "string",
    "paymentMode": "string"
  },
  "ageLimit": {
    "asOnDate": "01/08/2026",
    "minAge": "string",
    "maxAge": "string",
    "relaxationInfo": "string"
  },
  "totalVacancies": number,
  "vacancies": [
    {
      "postName": "string",
      "totalPosts": number,
      "eligibility": "string"
    }
  ],
  "links": {
    "applyOnline": "string (#apply or official URL)",
    "downloadNotification": "string (#notification)",
    "officialWebsite": "string (official bank/recruiter domain)"
  }
}

Return ONLY a raw JSON array matching this exact schema. Do not enclose it in markdown blocks or add auxiliary text.`;

      const response = await generateContentWithFallback(aiClient, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are AROHI, a senior national crawler for Recruit.org.in. Output highly realistic recruitment notifications matching official pay scales.',
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ success: true, postings: parsed });
    } else {
      const fallbacks = getFallbackAdditionalPostings(sector, location, jobType);
      return res.json({ success: true, postings: fallbacks, fallback: true });
    }
  } catch (error: any) {
    console.error('Error in /api/fetch-online-jobs:', error);
    const fallbacks = getFallbackAdditionalPostings(sector, location, jobType);
    return res.json({ success: true, postings: fallbacks, error: error.message });
  }
});

function getFallbackAdditionalPostings(sector?: string, location?: string, jobType?: string): any[] {
  const list = [
    {
      id: 'rbi-assistant-2026',
      title: 'RBI Assistant Online Form 2026',
      organization: 'Reserve Bank of India (RBI)',
      postDate: '2026-06-25',
      shortInfo: 'Reserve Bank of India (RBI) invites online applications from eligible Indian citizens for the post of Assistant in various offices of the Bank. Selection will be through a country-wide competitive examination in two phases i.e. Preliminary and Main examination followed by a Language Proficiency Test (LPT).',
      category: 'latest-jobs',
      tags: ['RBI', 'Banking', 'Graduate Pass', 'Assistant'],
      department: 'Bank',
      isNew: true,
      state: 'All India',
      jobType: 'government',
      sector: 'Banking & Finance',
      dates: {
        applicationBegin: '2026-06-25',
        lastDateApply: '2026-07-20',
        lastDateFee: '2026-07-20',
        examDate: 'September 2026 (Prelims)'
      },
      fees: {
        generalOBC: '₹ 450/- (plus GST)',
        scST: '₹ 50/- (Exempted from exam fee)',
        female: '₹ 450/-',
        paymentMode: 'Debit Cards (RuPay/Visa/MasterCard/Maestro), Credit Cards, Internet Banking, IMPS, Cash Cards/ Mobile Wallets'
      },
      ageLimit: {
        asOnDate: '01/06/2026',
        minAge: '20 Years',
        maxAge: '28 Years',
        relaxationInfo: 'Standard age relaxation is applicable for SC/ST (5 years), OBC (3 years), and PwD (10 years) as per government norms.'
      },
      totalVacancies: 950,
      vacancies: [
        {
          postName: 'Assistant (Clerical Cadre)',
          totalPosts: 950,
          eligibility: 'Bachelor\'s Degree in any discipline with a minimum of 50% marks (pass class for SC/ST/PwBD candidates) in the aggregate and knowledge of word processing on PC.'
        }
      ],
      links: {
        applyOnline: '#apply',
        downloadNotification: '#notification',
        officialWebsite: 'https://www.rbi.org.in'
      }
    },
    {
      id: 'tcs-nqt-offcampus-2026',
      title: 'TCS NQT National Qualifier Test 2026 (IT & Cognitive)',
      organization: 'Tata Consultancy Services (TCS)',
      postDate: '2026-06-25',
      shortInfo: 'TCS National Qualifier Test (TCS NQT) is an entry-level assessment designed to evaluate cognitive abilities, professional skills, and coding capabilities of final year graduates and freshers. NQT scores are accepted by TCS and 600+ other top corporate partners for high-paying roles.',
      category: 'latest-jobs',
      tags: ['TCS', 'Private Sector', 'B.Tech/MCA', 'Software', 'All India'],
      department: 'Private Sector',
      isNew: true,
      state: 'All India',
      jobType: 'private',
      sector: 'IT & Software',
      dates: {
        applicationBegin: '2026-06-24',
        lastDateApply: '2026-08-15',
        lastDateFee: '₹ 0/- (Free Registration)',
        examDate: 'Interviews & online test on rolling basis'
      },
      fees: {
        generalOBC: '₹ 0/- (Registration is 100% Free on NextStep Portal)',
        scST: '₹ 0/-',
        paymentMode: 'N/A'
      },
      ageLimit: {
        asOnDate: '01/01/2026',
        minAge: '18 Years',
        maxAge: '28 Years',
        relaxationInfo: 'N/A'
      },
      totalVacancies: 15000,
      vacancies: [
        {
          postName: 'TCS Ninja Developer',
          totalPosts: 10000,
          eligibility: 'B.E. / B.Tech / M.E. / M.Tech / MCA / M.Sc from 2025 and 2026 passing out batches with 60% throughout academic career.'
        },
        {
          postName: 'TCS Digital / Prime Architect',
          totalPosts: 5000,
          eligibility: 'B.E. / B.Tech / MCA with outstanding advanced programming, system design, and algorithmic coding evaluation score.'
        }
      ],
      links: {
        applyOnline: '#apply',
        officialWebsite: 'https://www.tcs.com/careers'
      }
    },
    {
      id: 'drdo-scientist-b-2026',
      title: 'DRDO Scientist B Direct Entry Exam Form 2026',
      organization: 'Defence Research & Development Organisation (DRDO)',
      postDate: '2026-06-26',
      shortInfo: 'Recruitment Assessment Centre (RAC) under DRDO invites online applications for direct recruitment of Scientist \'B\' in DRDO, DST and ADA. Selection is based on GATE score card, descriptive written test, and personal interview rounds.',
      category: 'latest-jobs',
      tags: ['DRDO', 'GATE', 'Scientist B', 'Engineering', 'Defence'],
      department: 'Defence',
      isNew: true,
      state: 'All India',
      jobType: 'government',
      sector: 'Security & Defence',
      dates: {
        applicationBegin: '2026-06-26',
        lastDateApply: '2026-07-28',
        lastDateFee: '2026-07-28',
        examDate: 'October 2026'
      },
      fees: {
        generalOBC: '₹ 100/-',
        scST: '₹ 0/- (Exempted)',
        female: '₹ 0/- (Exempted)',
        paymentMode: 'Online Payment Mode Only'
      },
      ageLimit: {
        asOnDate: '28/07/2026',
        minAge: '21 Years',
        maxAge: '30 Years',
        relaxationInfo: 'OBC up to 33 years, SC/ST up to 35 years.'
      },
      totalVacancies: 640,
      vacancies: [
        {
          postName: 'Scientist B (Electronics / CS / Mechanical / Electrical)',
          totalPosts: 640,
          eligibility: 'First Class Bachelor\'s Degree in Engineering or Technology in relevant branch from a recognized university and a valid GATE score card.'
        }
      ],
      links: {
        applyOnline: '#apply',
        downloadNotification: '#notification',
        officialWebsite: 'https://rac.gov.in'
      }
    },
    {
      id: 'odisha-junior-clerk-2026',
      title: 'Odisha Junior Clerk & Assistant Recruitment 2026',
      organization: 'Odisha Sub-Ordinate Staff Selection Commission (OSSSC)',
      postDate: '2026-06-25',
      shortInfo: 'OSSSC has published a notification for the recruitment of Junior Clerks and Junior Assistants in various district offices and headquarters under the Government of Odisha. Selection is based on a written exam and practical skill test in computer operation.',
      category: 'latest-jobs',
      tags: ['OSSSC', 'Odisha Govt', '12th Pass', 'Clerk', 'Computer Skill'],
      department: 'State Govt',
      isNew: true,
      state: 'Odisha',
      jobType: 'government',
      sector: 'Administration',
      dates: {
        applicationBegin: '2026-06-25',
        lastDateApply: '2026-07-30',
        lastDateFee: '2026-07-30',
        examDate: 'November 2026'
      },
      fees: {
        generalOBC: '₹ 0/- (Free)',
        scST: '₹ 0/-',
        paymentMode: 'N/A'
      },
      ageLimit: {
        asOnDate: '01/01/2026',
        minAge: '18 Years',
        maxAge: '38 Years',
        relaxationInfo: '5 years relaxation for SC/ST/SEBC and women candidates.'
      },
      totalVacancies: 2150,
      vacancies: [
        {
          postName: 'Junior Clerk / Junior Assistant',
          totalPosts: 2150,
          eligibility: 'Must have passed +2 Arts/Science/Commerce (Class 12th) exam or equivalent from a recognized council and hold a basic computer application certificate (DCA/PGDCA).'
        }
      ],
      links: {
        applyOnline: '#apply',
        downloadNotification: '#notification',
        officialWebsite: 'https://www.osssc.gov.in'
      }
    },
    {
      id: 'tata-steel-jet-2026',
      title: 'Tata Steel Junior Engineer Trainee (JET) 2026',
      organization: 'Tata Steel Limited',
      postDate: '2026-06-24',
      shortInfo: 'Tata Steel is inviting online applications for the position of Junior Engineer Trainee (JET) in its operational divisions in Jamshedpur, Kalinganagar, Meramandali, and raw material division. This is a highly regarded private core apprenticeship program leading to permanent placements.',
      category: 'latest-jobs',
      tags: ['Tata Steel', 'Odisha Private', 'Diploma', 'Engineering', 'Apprentice'],
      department: 'Private Sector',
      isNew: true,
      state: 'Odisha',
      jobType: 'private',
      sector: 'Manufacturing & Core Eng',
      dates: {
        applicationBegin: '2026-06-24',
        lastDateApply: '2026-07-20',
        lastDateFee: '₹ 0/- (Free)'
      },
      fees: {
        generalOBC: '₹ 0/-',
        scST: '₹ 0/-',
        paymentMode: 'N/A'
      },
      ageLimit: {
        asOnDate: '01/07/2026',
        minAge: '18 Years',
        maxAge: '25 Years',
        relaxationInfo: '3 years upper age limit relaxation for SC/ST candidates.'
      },
      totalVacancies: 450,
      vacancies: [
        {
          postName: 'Junior Engineer Trainee (Mechanical / Electrical / Metallurgy / Inst)',
          totalPosts: 450,
          eligibility: '3-year full-time Diploma in Engineering or B.E./B.Tech degree in Mechanical, Electrical, Metallurgy, Electronics, or Instrumentation with minimum 60% aggregate.'
        }
      ],
      links: {
        applyOnline: '#apply',
        officialWebsite: 'https://www.tatasteel.com'
      }
    },
    {
      id: 'aiims-bbsr-jr-2026',
      title: 'AIIMS Bhubaneswar Junior Resident (Non-Academic) Form',
      organization: 'All India Institute of Medical Sciences (AIIMS BBSR)',
      postDate: '2026-06-26',
      shortInfo: 'AIIMS Bhubaneswar invites applications for walk-in-interviews or online applications for the posts of Junior Resident (Non-Academic) for a period of 6 to 12 months. Excellent clinical training and high stipends under Central Govt residency rules.',
      category: 'latest-jobs',
      tags: ['AIIMS', 'Bhubaneswar', 'MBBS', 'Medical Resident', 'Odisha Govt'],
      department: 'State Govt',
      isNew: true,
      state: 'Odisha',
      jobType: 'government',
      sector: 'Healthcare & Medical',
      dates: {
        applicationBegin: '2026-06-26',
        lastDateApply: '2026-07-15',
        lastDateFee: '2026-07-15',
        examDate: 'Walk-in Interviews: 20/07/2026'
      },
      fees: {
        generalOBC: '₹ 1000/-',
        scST: '₹ 500/-',
        female: '₹ 0/- (Exempted)',
        paymentMode: 'Demand Draft / UPI / NEFT Transaction'
      },
      ageLimit: {
        asOnDate: '20/07/2026',
        minAge: '22 Years',
        maxAge: '33 Years',
        relaxationInfo: 'Relaxation as per Govt. of India rules for residents.'
      },
      totalVacancies: 85,
      vacancies: [
        {
          postName: 'Junior Resident (Non-Academic)',
          totalPosts: 85,
          eligibility: 'MBBS Degree from an MCI recognized institution, and must have completed mandatory rotatory internship on or before application deadline.'
        }
      ],
      links: {
        applyOnline: '#apply',
        downloadNotification: '#notification',
        officialWebsite: 'https://aiimsbhubaneswar.nic.in'
      }
    }
  ];

  let filtered = list;
  if (sector && sector !== 'All' && sector !== 'Any') {
    filtered = filtered.filter(item => item.sector === sector);
  }
  if (location && location !== 'All' && location !== 'All India') {
    filtered = filtered.filter(item => item.state === location);
  }
  if (jobType) {
    filtered = filtered.filter(item => item.jobType === jobType);
  }

  // If filtered output is too small, return at least 4 items to ensure rich database
  return filtered.length >= 2 ? filtered : list;
}

// Helper function to return fallback response from AROHI
function getArohiFallbackResponse(userPrompt: string, fileName?: string): string {
  const p = userPrompt.toLowerCase();
  let fileIntro = '';
  
  if (fileName) {
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    fileIntro = `### 📎 Document Uploaded: \`${fileName}\`\n\nI have successfully received your document attachment! Since the server is currently running in fallback/demo mode without an active live key, I cannot perform a full multi-page parsing. However, as **AROHI**, I can confirm that this **.${fileExt.toUpperCase()}** file has been safely registered for career/MSME analysis. \n\n*If you enter a valid API key in Settings > Secrets, I will utilize state-of-the-art visual and linguistic models to extract specific content from your files!* \n\n---\n\n`;
  }

  if (p.includes('resume') || p.includes('cv') || p.includes('biodata')) {
    const fallbackResumeData = {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@recruit.org.in",
      phone: "+91 98765 43210",
      linkedin: "linkedin.com/in/rajeshkumar",
      github: "github.com/rajeshkumar",
      summary: "Dynamic Software Developer with 2+ years of experience building modern web applications using React, Node.js, and Express. Passionate about writing clean, scalable code and assisting community platforms in digital transformation.",
      skills: ["React", "TypeScript", "Node.js", "Express", "Firebase", "SQL", "Tailwind CSS", "RESTful APIs", "Git & GitHub"],
      experience: [
        {
          company: "Oditree Services",
          role: "Junior Software Engineer",
          duration: "May 2024 - Present",
          achievements: [
            "Co-developed the frontend of a career counseling portal using React 19, improving user engagement by 45%.",
            "Designed and optimized server-side REST APIs in Node.js, reducing server response time by 30%.",
            "Collaborated with senior engineers to implement role-based authentication and secure Firestore persistence."
          ]
        },
        {
          company: "Braga Technologies Private Limited",
          role: "Web Development Intern",
          duration: "December 2023 - April 2024",
          achievements: [
            "Assisted in crafting responsive landing pages with Tailwind CSS, ensuring 100% mobile-first compatibility.",
            "Integrated third-party APIs for location tagging and government scheme discovery."
          ]
        }
      ],
      education: [
        {
          school: "Biju Patnaik University of Technology (BPUT)",
          degree: "Bachelor of Technology in Computer Science",
          duration: "2020 - 2024"
        }
      ],
      projects: [
        {
          title: "Arohi Career Companion",
          description: "An AI opportunity companion that helps students map custom roadmaps and find government schemes.",
          technologies: ["React", "Express", "Gemini API", "Tailwind CSS"]
        }
      ]
    };

    return fileIntro + `### 📝 Custom Resume Builder by AROHI AI
    
Hello! I have designed a highly optimized, professional, ATS-compatible resume based on standard engineering trends in association with **BRAGA TECHNOLOGIES** and **ODITREE SERVICES**.

Below is your draft. You can download the native, beautifully-aligned **Microsoft Word (.docx)** version immediately by clicking the button below!

---

**${fallbackResumeData.name.toUpperCase()}**
*Email:* ${fallbackResumeData.email} | *Phone:* ${fallbackResumeData.phone}
*LinkedIn:* ${fallbackResumeData.linkedin}

#### **PROFESSIONAL SUMMARY**
${fallbackResumeData.summary}

#### **SKILLS**
${fallbackResumeData.skills.join(', ')}

#### **EXPERIENCE**
**Junior Software Engineer** - *Oditree Services* (May 2024 - Present)
* Co-developed the frontend of a career counseling portal using React 19, improving user engagement by 45%.
* Designed and optimized server-side REST APIs in Node.js, reducing server response time by 30%.

**Web Development Intern** - *Braga Technologies Private Limited* (December 2023 - April 2024)
* Assisted in crafting responsive landing pages with Tailwind CSS, ensuring 100% mobile-first compatibility.

[RESUME_DOCX_DATA_START]${JSON.stringify(fallbackResumeData)}[RESUME_DOCX_DATA_END]`;
  }

  if (p.includes('job') || p.includes('vacancy') || p.includes('work') || p.includes('career')) {
    return fileIntro + `### 🌟 AROHI Career & Job Advisory Note
 
 Welcome! As your AI Opportunity Advisor, I'm excited to help you map out your job discovery strategy. India's digital economy is expanding rapidly, opening thousands of entry points for young professionals.
 
 Here is my recommended plan for your career search:
 1. **Target Growth Domains:** Major hirings are happening across tech platforms, logistics, banking, and backend service agencies.
 2. **Review Active Openings:** On our **Jobs Board**, check out:
    - *SSC MTS & Havaldar Forms 2026* (Matric Level entry - excellent government stability).
    - *Railway Assistant Loco Pilot Recruitment* (For technical/ITI backgrounds).
    - *IBPS Clerk CRP XVI* (Top choice for banking careers).
 3. **Action Items:**
    - Go to our **Resume AI** page to evaluate your resume ATS score instantly.
    - Head to **Mock Interview AI** to practice speaking and answering questions.
 
 *Would you like me to guide you through a specific industry or review a technical skill?*`;
  }
 
  if (p.includes('scheme') || p.includes('government') || p.includes('sarkari') || p.includes('yojana') || p.includes('scholarship')) {
    return fileIntro + `### 🏛️ Government Schemes & Support Advisor (AROHI AI)
 
 Namaste! I can guide you through India's major Central and State opportunities designed to support students, farmers, women, and MSME business owners:
 
 **1. PM Prime Minister's Employment Generation Programme (PMEGP)**
 - **Purpose:** Credit-linked subsidy program for starting new micro-enterprises.
 - **Subsidy:** Up to 35% in rural areas and 25% in urban areas.
 
 **2. Startup India Seed Fund Scheme (SISFS)**
 - **Purpose:** Financial assistance to startups for proof of concept, prototype development, product trials, and market entry.
 
 **3. Mudra Yojana (PMMY)**
 - **Purpose:** Collateral-free loans up to ₹10 Lakhs under Shishu, Kishor, and Tarun categories for non-corporate small business sectors.
 
 **4. Post Matric Scholarships & Women Schemes**
 - Special tuition wavers and monthly stipends for underrepresented student communities.
 
 *Would you like to analyze your eligibility for any of these schemes? Please share your background (Education, age, and state).*`;
  }
 
  if (p.includes('business') || p.includes('startup') || p.includes('funding') || p.includes('entrepreneur') || p.includes('msme')) {
    return fileIntro + `### 🚀 Business & MSME Launch Strategy by AROHI AI
 
 Starting a business is a powerful way to generate employment and create scalable assets in India! Let's examine your idea's validation framework:
 
 **Step 1: Focus on MSME Classification**
 Register your venture on the **Udyam Portal** immediately. This qualifies you for:
 - Low-interest collateral-free loans.
 - Subsidies on patent filings and trademark registrations.
 - Exemption from security deposits in government tenders.
 
 **Step 2: Recommended Funding Channels**
 - *Mudra Loans* (under Shishu category for up to ₹50,000 with minimal paperwork).
 - *CGTMSE Credit Guarantee Fund* (for capital loans up to ₹2 Crores without collateral).
 
 **Step 3: Roadmap to Launch**
 1. Document your business plan (value proposition, market size, operations).
 2. Create a basic MVP (Minimal Viable Product) to validate locally.
 3. Apply for local state grants or incubator acceleration pools.
 
 *Tell me more about your startup idea! What sector are you targeting (e.g., Foodtech, Agritech, Handlooms, Retail, Software)?*`;
  }
 
  if (p.includes('course') || p.includes('learn') || p.includes('study') || p.includes('skill')) {
    return fileIntro + `### 📖 Personalized Course & Skill Recommendations
 
 As AROHI, I recommend focusing on future-proof digital skills to maximize your market valuation:
 
 **1. Technology & Digital Skills**
 - *Full-Stack JavaScript/TypeScript* (High demand in metropolitan startups).
 - *Cloud Operations & DevOps* (Excellent starting salaries).
 - *Data Analytics & SQL* (Essential for business intelligence in banks & corporations).
 
 **2. Business & Communication Essentials**
 - *Professional English Speaking* (Boosts interview clearing rate by 80%).
 - *Financial Literacy & MS-Excel Mastery* (Highly valued in all administration roles).
 
 **3. Government Training Programs**
 - Look into **PMKVY (Pradhan Mantri Kaushal Vikas Yojana)** for free physical training and certification across technical sectors.
 
 *What skills are you most interested in mastering first?*`;
 }
 
  return fileIntro + `### Hello! I am AROHI, your AI Opportunity Advisor 🌟
 
 Welcome to **Recruit.org.in** – India's One & Only AI-Powered Opportunity Ecosystem!
 
 I am your unified assistant across this entire platform. I can help you with:
 * 💼 **Discovering Jobs & Internships** that perfectly match your background.
 * 📝 **Reviewing your Resume** for ATS compatibility and missing keywords.
 * 🗣️ **Conducting Mock Interviews** with constructive feedback.
 * 🏛️ **Finding Government Schemes & Loans** (Mudra, PMEGP, Scholarships) to finance your education or business.
 * 🚀 **Validating Business Ideas** and guiding your startup/MSME registration.
 * 📖 **Designing custom Career Roadmaps** and course suggestions.
 
 *How can I help you take the next big step in your career journey today? Just type your query below!*`;
}

// Dynamic Sitemap generator for SEO crawler exposure all over India
app.get('/sitemap.xml', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0];
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Platform Landing page -->
  <url>
    <loc>https://recruit.org.in/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Career & Skill Course Training -->
  <url>
    <loc>https://recruit.org.in/?tab=dashboard</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Custom AI Roadmap & Path Planner -->
  <url>
    <loc>https://recruit.org.in/?tab=roadmap</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Interactive Live Mock Interviews -->
  <url>
    <loc>https://recruit.org.in/?tab=interview</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Advanced ATS Resume Score Engine -->
  <url>
    <loc>https://recruit.org.in/?tab=resume</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Mudra Loans & Mudra Scheme Assister -->
  <url>
    <loc>https://recruit.org.in/?tab=schemes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Business Startup, Udyam & MSME Hub -->
  <url>
    <loc>https://recruit.org.in/?tab=business</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
});

// Dynamic route to serve any uploaded Arohi image from the project root with any extension (png, jpg, jpeg, webp)
app.get(['/arohi.png', '/arohi.jpg', '/Arohi.jpg', '/Arohi.png', '/arohi.jpeg', '/Arohi.jpeg'], (req, res) => {
  const rootDir = process.cwd();
  try {
    // List of directories to search, in order of priority (public and dist first, then assets, then root)
    const searchDirs = [
      path.join(rootDir, 'public'),
      path.join(rootDir, 'dist'),
      path.join(rootDir, 'assets'),
      rootDir
    ];

    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        // Find any file that starts with "arohi" or contains "arohi" (case-insensitive) and has an image extension
        const imageFile = files.find(file => {
          const lower = file.toLowerCase();
          return (lower.startsWith('arohi') || lower.includes('arohi')) && 
                 (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp'));
        });

        if (imageFile) {
          const fullPath = path.join(dir, imageFile);
          // Verify it's a file
          if (fs.statSync(fullPath).isFile()) {
            return res.sendFile(fullPath);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error finding Arohi image:', err);
  }

  // Fallback if not found: Send 404
  return res.status(404).json({ error: 'Arohi image not found. Please upload your image to the workspace.' });
});

// Persistent file-based WebSocket logging utility
function logWsEvent(event: string, data: any) {
  try {
    const filePath = path.join(process.cwd(), 'websocket-debug.json');
    let logs = [];
    if (fs.existsSync(filePath)) {
      try {
        logs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        logs = [];
      }
    }
    logs.push({
      timestamp: new Date().toISOString(),
      event,
      ...data
    });
    if (logs.length > 200) {
      logs = logs.slice(logs.length - 200);
    }
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write WS debug log:', err);
  }
}

// ==========================================
// ALL INDIA MULTILINGUAL SEO ENGINE & CONFIG
// ==========================================

const SEO_TRANSLATIONS: Record<string, { title: string; description: string; keywords: string }> = {
  en: {
    title: "Recruit.org.in - India’s Next-Gen Career, Job, and MSME Growth Engine",
    description: "Empowering India's students, young professionals, and MSMEs. Get live career guidance from AI assistant Arohi, dynamic resume analysis, mock interviews, job postings, and Udyam business assistance.",
    keywords: "recruit.org.in, career guidance India, AI career coach, resume score India, mock interview simulator, MSME Udyam registration, private sector jobs, student career advisor, recruitment portal, Sarkari job guide"
  },
  hi: {
    title: "Recruit.org.in - भारत का अगला पीढ़ी का करियर, नौकरी और एमएसएमई विकास इंजन",
    description: "भारत के छात्रों, युवा पेशेवरों और एमएसएमई को सशक्त बनाना। एआई सहायक आरोही से लाइव करियर मार्गदर्शन, रेज़्यूमे विश्लेषण, मॉक इंटरव्यू, नौकरी पोस्टिंग और उद्यम व्यावसायिक सहायता प्राप्त करें।",
    keywords: "रिक्रूट भारत, करियर मार्गदर्शन, एआई करियर कोच, रेज़्यूमे स्कोर, मॉक इंटरव्यू सिम्युलेटर, एमएसएमई उद्यम पंजीकरण, प्राइवेट नौकरियां, सरकारी नौकरी गाइड, रोजगार समाचार"
  },
  or: {
    title: "Recruit.org.in - ଓଡ଼ିଶା ଏବଂ ଭାରତର ପରବର୍ତ୍ତୀ ପିଢିର କ୍ୟାରିୟର, ଚାକିରି ଏବଂ MSME ବିକାଶ ପୋର୍ଟାଲ୍",
    description: "ଭାରତର ଛାତ୍ର, ଯୁବ ପେସାଦାର ଓ ଏମଏସଏମଇ (MSME) ମାନଙ୍କୁ ସଶକ୍ତ କରିବା | AI ସହାୟକ ଆରୋହୀଙ୍କ ଠାରୁ କ୍ୟାରିୟର ପରାମର୍ଶ, ରେଜୁମେ ବିଶ୍ଳେଷଣ, ମକ୍ ଇଣ୍ଟରଭ୍ୟୁ ଏବଂ ସରକାରୀ ଯୋଜନା ସହାୟତା ପାଆନ୍ତୁ |",
    keywords: "ଚାକିରି ସୂଚନା, ଓଡ଼ିଶା ଚାକିରି, କ୍ୟାରିୟର ଗାଇଡ୍, ଏଆଇ ଆରୋହୀ, ରେଜୁମେ ସ୍କୋਰ, ମକ୍ ଇଣ୍ଟରଭ୍ୟୁ, ସରକାରୀ ଯୋଜନା, ଏମଏସଏମଇ ପଞ୍ଜୀକରଣ, ଓଡ଼ିଆରେ କ୍ୟାରିୟର"
  },
  bn: {
    title: "Recruit.org.in - ভারতের পরবর্তী প্রজন্মের ক্যারিয়ার, চাকরি এবং MSME বিকাশ ইঞ্জিন",
    description: "ভারতের ছাত্র, তরুণ পেশাদার এবং MSME-কে ক্ষমতায়ন করা। AI সহকারী আরোহী-র থেকে লাইভ ক্যারিয়ার গাইডেন্স, জীবনবৃত্তান্ত বিশ্লেষণ, মক ইন্টারভিউ এবং ব্যবসা সহায়তা পান।",
    keywords: "চাকরি ও ক্যারিয়ার, ভারতীয় চাকরি পোর্টাল, এআই ক্যারিয়ার কোচ, জীবনবৃত্তান্ত বিশ্লেষণ, মক ইন্টারভিউ, সরকারি প্রকল্প, এমএসএমই রেজিস্ট্রেশন, পশ্চিমবঙ্গ চাকরি"
  },
  te: {
    title: "Recruit.org.in - భారతదేశపు నెక్స్ట్-జనరేషన్ కెరీర్, ఉద్యోగ మరియు MSME అభివృద్ధి ఇంజిన్",
    description: "భారతదేశ విద్యార్థులు, యువ నిపుణులు మరియు MSMEలను బలోపేతం చేయడం. AI అసిస్టెంట్ ఆరోహి నుండి లైవ్ కెరీర్ గైడెన్స్, రెజ్యూమె విశ్లేషణ, మాక్ ఇంటర్వ్యూలు మరియు వ్యాపార సహాయం పొందండి.",
    keywords: "కెరీర్ గైడెన్స్, ప్రభుత్వ ఉద్యోగాలు, ప్రైვეట్ ఉద్యోగాలు, రెజ్యూమె స్కోర్, మాక్ ఇंटरవ్యూ, MSME రిజిస్ట్రేషన్, ఉద్యోగ సమాచారం, ఆరోహి ఎఐ"
  },
  mr: {
    title: "Recruit.org.in - भारतातील पुढील पिढीचे करिअर, नोकरी आणि MSME विकास प्लॅटफॉर्म",
    description: "भारतातील विद्यार्थी, तरुण व्यावसायिक आणि एमएसएमई सक्षम करणे. एआय सहाय्यक आरोही कडून थेट करिअर मार्गदर्शन, रेझ्युमे विश्लेषण, मॉक इंटरव्यू आणि व्यवसाय सहाय्य मिळवा.",
    keywords: "करिअर मार्गदर्शन, रोजगार संधी, रेझ्युमे तपासणी, मॉक इंटरव्यू, सरकारी योजना, एमएसएमई नोंदणी, मराठीत नोकऱ्या, महाराष्ट्रातील रोजगार"
  },
  ta: {
    title: "Recruit.org.in - இந்தியாவின் அடுத்த தலைமுறை தொழில், வேலைவாய்ப்பு மற்றும் MSME வளர்ச்சி தளம்",
    description: "இந்தியாவின் மாணவர்கள், இளம் வல்லுநர்கள் மற்றும் MSME-களை மேம்படுத்துதல். AI உதவியாளர் ஆரோஹியிடமிருந்து நேரடி வழிகாட்டுதல், ரெஸ்யூம் பகுப்பாய்வு, நேர்காணல் பயிற்சி மற்றும் வணிக உதவி பெறுக.",
    keywords: "வேலைவாய்ப்பு செய்திகள், தொழில் வழிகாட்டி, ரெஸ்யூம் பகுப்பாய்வு, மாதிரி நேர்காணல், அரசு திட்டங்கள், எம்எஸ்எம்இ பதிவு, தமிழ்நாட்டில் வேலைகள்"
  },
  gu: {
    title: "Recruit.org.in - ભારતનું આગામી પેઢીનું કારકિર્દી, નોકરી અને MSME বিকাশ પ્લેટફોર્મ",
    description: "ભારતના વિદ્યાર્થીઓ, યુવા વ્યાવસાયિકો અને MSME ને સશક્ત બનાવવું. AI સહાયક આરોહી પાસેથી લાઈવ કારકિર્દી માર્ગદર્શન, રેઝ્યૂમે વિશ્લેષણ, મોક ઇન્ટરવ્યુ અને વ્યવસાય સહાય મેળવો.",
    keywords: "કારકિર્દી માર્ગદર્શન, સરકારી નોકરીઓ, રેઝ્યૂમે સ્કોર, મોક ઇન્ટરવ્યુ, સરકારી યોજનાઓ, એમએસએમઇ નોંધણી, ગુજરાત રોજગાર"
  },
  ur: {
    title: "Recruit.org.in - ہندوستان کا اگلی نسل کا کیریئر، ملازمت اور MSME ترقیاتی انجن",
    description: "ہندوستان کے طلباء، نوجوان پیشہ ور افراد اور MSME کو بااختیار بنانا۔ AI اسسٹنٹ آروہی سے لائیو کیریئر گائیڈنس، ریزیومے تجزیہ، موک انٹرویوز اور کاروباری مدد حاصل کریں۔",
    keywords: "کیریئر گائیڈنس, نوکریوں کے مواقع, ریزیومے تجزیہ, موک انٹرویو, سرکاری اسکیمیں, کاروبار کی رجسٹریشن, روزگار کی خبریں"
  },
  kn: {
    title: "Recruit.org.in - ಭಾರತದ ಮುಂದಿನ ಪೀಳಿಗೆಯ ವೃತ್ತಿಜೀವನ, ಉದ್ಯೋಗ ಮತ್ತು MSME ಅಭಿವೃದ್ಧಿ ಇಂಜಿನ್",
    description: "ಭಾರತದ ವಿದ್ಯಾರ್ಥಿಗಳು, ಯುವ ವೃತ್ತಿಪರರು ಮತ್ತು MSMEಗಳನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು. AI ಸಹಾಯಕ ಆರೋಹಿ ಇಂದ ನೇರ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ, ರೆಸ್ಯೂಮೆ ವಿಶ್ಲೇಷಣೆ, ಮಾಕ್ ಸಂದರ್ಶನಗಳು ಮತ್ತು ವ್ಯವಹಾರ ಸಹಾಯ ಪಡೆಯಿರಿ.",
    keywords: "ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ, ಉದ್ಯೋಗಾವಕಾಶಗಳು, ರೆಸ್ಯೂಮೆ ವಿಶ್ಲೇಷಣೆ, ಮಾಕ್ ಸಂದರ್ಶನ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಉದ್ಯಮ ನೋಂದಣಿ, ಕರ್ನಾಟಕ ಉದ್ಯೋಗ"
  },
  ml: {
    title: "Recruit.org.in - ഇന്ത്യയിലെ അടുത്ത തലമുറ കരിയർ, തൊഴിൽ, MSME വികസന വേദി",
    description: "ഇന്ത്യയിലെ വിദ്യാർത്ഥികൾ, യുവ പ്രൊഫഷണലുകൾ, MSME-കൾ എന്നിവരെ ശാക്തീകരിക്കുന്നു. AI അസിസ്റ്റന്റ് ആരോഹിയിൽ നിന്ന് തത്സമയ കരിയർ മാർഗ്ഗനിർദ്ദേശം, റെസ്യൂമെ വിശകലനം, മോക്ക് അഭിമുഖങ്ങൾ, ബിസിനസ്സ് സഹായം എന്നിവ നേടുക.",
    keywords: "കരിയർ ഗൈഡൻസ്, തൊഴിൽ അവസരങ്ങൾ, റെസ്യൂമെ സ്കോർ, മോക്ക് ഇന്റർവ്യൂ, സർക്കാർ പദ്ധതികൾ, എംഎസ്എംഇ രജിസ്ട്രേഷൻ"
  },
  pa: {
    title: "Recruit.org.in - ਭਾਰਤ ਦਾ ਅਗਲੀ ਪੀੜ੍ਹੀ ਦਾ ਕਰੀਅਰ, ਨੌਕਰੀ ਅਤੇ MSME ਵਿਕਾਸ ਇੰਜਨ",
    description: "ਭਾਰਤ ਦੇ ਵਿਦਿਆਰਥੀਆਂ, ਨੌਜਵਾਨ ਪੇਸ਼ੇਵਰਾਂ ਅਤੇ MSME ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ। AI ਸਹਾਇਕ ਆਰੋਹੀ ਤੋਂ ਲਾਈਵ ਕਰੀਅਰ ਮਾਰਗਦਰਸ਼ਨ, ਰੈਜ਼ਿਊਮੇ ਵਿਸ਼ਲੇਸ਼ਣ, ਮੌਕ ਇੰਟਰਵਿਊ ਅਤੇ ਵਪਾਰਕ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ।",
    keywords: "ਕਰੀਅਰ ਮਾਰਗਦਰਸ਼ਨ, ਨੌਕਰੀਆਂ ਦੇ ਮੌਕੇ, ਰੈਜ਼ਿਊਮੇ ਸਕੋਰ, ਮੌਕ ਇੰਟਰਵਿਊ, ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਕਾਰੋਬਾਰੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ, ਪੰਜਾਬ ਰੁਜ਼ਗਾਰ"
  },
  as: {
    title: "Recruit.org.in - ভাৰতৰ পৰৱৰ্তী প্ৰজন্মৰ কেৰিয়াৰ, চাকৰি আৰু MSME বিকাশ মঞ্চ",
    description: "ভাৰতৰ শিক্ষাৰ্থী, যুৱ পেচাদাৰী আৰু MSME সৱলীকৰণ কৰা। AI সহায়ক আৰোহীৰ পৰা লাইভ কেৰিয়াৰ নিৰ্দেশনা, ৰিজুমে বিশ্লেষণ, মক সাক্ষাৎকাৰ আৰু ব্যৱসায়িক সাহায্য লাভ কৰক।",
    keywords: "কেৰিয়াৰ নিৰ্দেশনা, চাকৰিৰ খবৰ, ৰিজুমে বিশ্লেষণ, মক সাক্ষাৎকাৰ, চৰকাৰী আঁচনি, উদ্যোগ পঞ্জীয়ন, অসমৰ চাকৰি"
  }
};

function serveIndexWithSEO(req: express.Request, res: express.Response) {
  const validLanguages = ['en', 'hi', 'or', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'ml', 'pa', 'as'];
  let lang = req.query.lang as string;
  if (!lang || !validLanguages.includes(lang)) {
    lang = 'en';
  }

  const isProd = process.env.NODE_ENV === 'production';
  const filePath = isProd 
    ? path.join(process.cwd(), 'dist', 'index.html')
    : path.join(process.cwd(), 'index.html');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Page index.html not found');
  }

  try {
    let html = fs.readFileSync(filePath, 'utf8');
    const meta = SEO_TRANSLATIONS[lang] || SEO_TRANSLATIONS['en'];

    // Dynamic replacement
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/?>/gi, `<meta name="description" content="${meta.description}" />`);
    html = html.replace(/<meta name="keywords" content=".*?"\s*\/?>/gi, `<meta name="keywords" content="${meta.keywords}" />`);
    
    // Social Open Graph updates
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${meta.title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${meta.description}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${meta.title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${meta.description}" />`);

    const localeMap: Record<string, string> = {
      en: 'en_IN', hi: 'hi_IN', or: 'or_IN', bn: 'bn_IN', te: 'te_IN',
      mr: 'mr_IN', ta: 'ta_IN', gu: 'gu_IN', ur: 'ur_IN', kn: 'kn_IN',
      ml: 'ml_IN', pa: 'pa_IN', as: 'as_IN'
    };
    const locale = localeMap[lang] || 'en_IN';
    html = html.replace(/<meta property="og:locale" content=".*?"\s*\/?>/gi, `<meta property="og:locale" content="${locale}" />`);

    // Schema updates
    html = html.replace(/"description": "India's next-generation employment engine.*?"/gi, `"description": "${meta.description}"`);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('[SEO Meta Injection Error]:', err);
    res.sendFile(filePath);
  }
}

function serveSitemap(req: express.Request, res: express.Response) {
  const host = req.get('host');
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const pages = [
    '',
    'jobs',
    'career',
    'resume',
    'interview',
    'business',
    'schemes',
    'courses',
    'syllabus',
    'franchise',
    'employer',
    'dashboard',
    'faqs',
    'contact'
  ];

  const languages = ['en', 'hi', 'or', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'ml', 'pa', 'as'];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  pages.forEach(page => {
    const relativePath = page === '' ? '' : `/${page}`;
    languages.forEach(lang => {
      const locUrl = `${baseUrl}${relativePath}?lang=${lang}`;
      const lastmod = new Date().toISOString().split('T')[0];
      const priority = page === '' ? '1.0' : page === 'jobs' || page === 'resume' || page === 'schemes' ? '0.9' : '0.8';

      xml += '  <url>\n';
      xml += `    <loc>${locUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += `    <priority>${priority}</priority>\n`;

      // Multilingual alternate links
      languages.forEach(l => {
        const hreflang = l === 'en' ? 'en-IN' : `${l}-IN`;
        xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${baseUrl}${relativePath}?lang=${l}" />\n`;
      });
      // x-default point to english
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${relativePath}" />\n`;

      xml += '  </url>\n';
    });
  });

  xml += '</urlset>\n';

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
}

function serveRobots(req: express.Request, res: express.Response) {
  const host = req.get('host');
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /

# Multilingual India sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Friendly suggestions for Search Crawlers
Crawl-delay: 1
`);
}

// Vite middleware and asset delivery setup
async function startServer() {
  // Register SEO sitemaps & robots globally
  app.get('/sitemap.xml', serveSitemap);
  app.get('/robots.txt', serveRobots);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    console.log(`[Production mode] Serving static files from: ${distPath}`);
    if (fs.existsSync(indexPath)) {
      console.log(`[Production mode] verified: index.html exists at: ${indexPath}`);
    } else {
      console.error(`[Production mode] CRITICAL ERROR: index.html NOT found at: ${indexPath}`);
    }
    app.use(express.static(distPath));
    app.get('*', serveIndexWithSEO);
  }

  let backupServer: any = null;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Recruit.org.in Server running on http://localhost:${PORT}`);
  });

  if (PORT !== 3000) {
    try {
      backupServer = app.listen(3000, '0.0.0.0', () => {
        console.log(`Recruit.org.in Backup Server listening on http://localhost:3000 to catch Railway port mapping.`);
      });
    } catch (err: any) {
      console.warn(`Could not start backup server on port 3000: ${err.message || err}`);
    }
  }

  // Setup WebSocket server for Gemini Live Audio Bidirectional Streaming
  const wss = new WebSocketServer({ noServer: true });

  wss.on('error', (err) => {
    console.error('WebSocket Server error:', err);
  });

  wss.on('connection', async (clientWs: WebSocket, request) => {
    console.log('Client connected to live audio WebSocket');
    logWsEvent('connection_started', { url: request.url });

    // Prevent uncaught socket-level errors from crashing the Node.js process
    clientWs.on('error', (err: any) => {
      console.error('Client WebSocket connection error:', err);
      logWsEvent('client_ws_error', { error: err.message || err });
    });

    const safeSendAndClose = (msgObj: any, closeCode = 1000, closeReason = '') => {
      try {
        logWsEvent('safe_send_and_close', { msgObj, closeCode, closeReason });
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(msgObj), () => {
            setTimeout(() => {
              try {
                clientWs.close(closeCode, closeReason);
              } catch (e) {}
            }, 200);
          });
        } else {
          setTimeout(() => {
            try {
              clientWs.close(closeCode, closeReason);
            } catch (e) {}
          }, 200);
        }
      } catch (err) {
        console.error('Error flushing message and closing WebSocket:', err);
        logWsEvent('safe_send_and_close_err', { error: err instanceof Error ? err.message : String(err) });
      }
    };
    
    // Parse the voice and uid parameters safely from the query string
    let selectedVoice = 'Zephyr';
    let uid = '';
    if (request.url) {
      const match = request.url.match(/[?&]voice=([^&]+)/);
      if (match) {
        selectedVoice = decodeURIComponent(match[1]);
      }
      const uidMatch = request.url.match(/[?&]uid=([^&]+)/);
      if (uidMatch) {
        uid = decodeURIComponent(uidMatch[1]);
      }
    }

    const clientAi = getAiClient('v1alpha');
    if (!clientAi) {
      logWsEvent('get_ai_client_failed', { reason: 'No GEMINI_API_KEY env or helper' });
      safeSendAndClose(
        { error: 'Gemini API key is not configured. Please add your GEMINI_API_KEY in the Settings > Secrets panel on Google AI Studio to enable Arohi Live Voice.' },
        1011,
        'API Key not configured'
      );
      return;
    }

    try {
      console.log(`Connecting to Gemini Live API with voice: ${selectedVoice}, uid: ${uid}`);
      logWsEvent('gemini_live_connecting', { voice: selectedVoice, uid });

      let voiceSystemInstruction = AROHI_SYSTEM_INSTRUCTION + "\n\nCRITICAL CONTEXT: You are currently connected via real-time live voice link. Speak dynamically, helpfully, and warmly. Keep responses brief but informative (3-5 sentences per turn) so they read nicely as speech without lagging.";

      if (uid) {
        try {
          const userSnap = await safeUserDb.get(uid);
          if (userSnap.exists) {
            const userData = userSnap.data();
            const displayName = userData.displayName || '';
            const profile = userData.profile || {};
            const activeGoal = profile.activeGoal || '';
            const education = profile.education || '';
            
            let voiceMemory = `\n\n=== USER IDENTITY & PERSONALIZED PROFILE MEMORY ===`;
            voiceMemory += `\n* Name: ${displayName || 'Honored Guest'}`;
            if (activeGoal) voiceMemory += `\n* Active Career/MSME Goal: ${activeGoal}`;
            if (education) voiceMemory += `\n* Education Background: ${education}`;
            if (profile.location) voiceMemory += `\n* Location: ${profile.location}`;
            
            // Summarize past chats
            if (userData.arohiChats && userData.arohiChats.length > 0) {
              voiceMemory += `\n\n=== PAST CHAT HIGHLIGHTS ===`;
              userData.arohiChats.slice(0, 3).forEach((chat: any) => {
                voiceMemory += `\n* Chat "${chat.title}" is saved in their history.`;
              });
            }
            
            // Summarize past voice calls
            if (userData.arohiCalls && userData.arohiCalls.length > 0) {
              voiceMemory += `\n\n=== PAST VOICE CALL SUMMARIES ===`;
              userData.arohiCalls.slice(0, 3).forEach((call: any) => {
                if (call.summaryText) {
                  voiceMemory += `\n* Call [${call.date}]: ${call.summaryText.slice(0, 150).replace(/\n/g, ' ')}`;
                }
              });
            }

            voiceMemory += `\n\nAROHI VOICE MEMORY DIRECTIONS: Warmly recall and use the user's name ("${displayName}") and active goal ("${activeGoal}") in the conversation when appropriate. If they refer to past chats or voice calls listed above, confirm your recollection beautifully and provide helpful continuity. Maintain a highly conversational, short, and positive tone.`;
            
            voiceSystemInstruction += voiceMemory;
          }
        } catch (memErr: any) {
          console.error("Error loading voice call memory context in live-ws:", memErr);
          logWsEvent('voice_memory_error', { error: memErr.message || memErr });
        }
      }

      const liveModelsToTry = [
        "gemini-3.1-flash-live-preview",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash-live-preview",
        "gemini-live-2.5-flash-preview"
      ];

      let session: any = null;
      let lastLiveError: any = null;

      for (const liveModel of liveModelsToTry) {
        try {
          console.log(`Connecting to Gemini Live API with voice: ${selectedVoice}, model: ${liveModel}`);
          logWsEvent('gemini_live_connecting_model', { voice: selectedVoice, model: liveModel });

          // We await a Promise that resolves once the session is successfully opened and stable
          const establishedSession = await new Promise<any>(async (resolve, reject) => {
            let finished = false;
            let tempSession: any = null;
            let stabilityTimeout: NodeJS.Timeout | null = null;

            try {
              tempSession = await clientAi.live.connect({
                model: liveModel,
                config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
                  },
                  systemInstruction: voiceSystemInstruction,
                  inputAudioTranscription: {},
                  outputAudioTranscription: {},
                },
                callbacks: {
                  onopen: () => {
                    console.log(`Gemini Live session opened with model: ${liveModel}, waiting for stability...`);
                    logWsEvent('gemini_live_session_open', { model: liveModel });
                    
                    stabilityTimeout = setTimeout(() => {
                      if (!finished) {
                        finished = true;
                        console.log(`Gemini Live session stable on model: ${liveModel}`);
                        resolve(tempSession);
                      }
                    }, 400); // Wait 400ms to ensure the connection is stable and not immediately closed by validation
                  },
                  onmessage: (message: any) => {
                    // Only process messages if this is the active session
                    if (session !== tempSession) return;

                    // Forward audio data to client safely
                    const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audio && clientWs.readyState === WebSocket.OPEN) {
                      try {
                        clientWs.send(JSON.stringify({ audio }));
                      } catch (e) {
                        console.error("Error sending live audio packet:", e);
                      }
                    }
                    if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
                      try {
                        clientWs.send(JSON.stringify({ interrupted: true }));
                      } catch (e) {}
                    }

                    // Extract transcripts of what is being spoken (user & model)
                    let transcriptText = "";
                    let transcriptSpeaker: "user" | "arohi" | null = null;

                    // 1. Check userTurn in serverContent (Standard Multimodal Live API response)
                    if (message.serverContent?.userTurn?.parts) {
                      for (const part of message.serverContent.userTurn.parts) {
                        if (part.text) {
                          transcriptText += part.text;
                          transcriptSpeaker = "user";
                        }
                      }
                    }

                    // 2. Check legacy / alternative userContent.parts
                    if (!transcriptText && message.userContent?.parts) {
                      for (const part of message.userContent.parts) {
                        if (part.text) {
                          transcriptText += part.text;
                          transcriptSpeaker = "user";
                        }
                      }
                    }

                    // 3. Check modelTurn in serverContent
                    if (message.serverContent?.modelTurn?.parts) {
                      for (const part of message.serverContent.modelTurn.parts) {
                        if (part.text) {
                          transcriptText += part.text;
                          transcriptSpeaker = "arohi";
                        }
                      }
                    }

                    if (transcriptText && clientWs.readyState === WebSocket.OPEN) {
                      try {
                        clientWs.send(JSON.stringify({ transcript: transcriptText, speaker: transcriptSpeaker }));
                      } catch (e) {}
                    }
                  },
                  onerror: (err: any) => {
                    console.error(`Gemini Live session connection error on model ${liveModel}:`, err);
                    logWsEvent('gemini_live_session_error', { model: liveModel, error: err?.message || err });
                    
                    if (!finished) {
                      finished = true;
                      if (stabilityTimeout) clearTimeout(stabilityTimeout);
                      reject(err || new Error(`Connection error on ${liveModel}`));
                    } else {
                      if (session === tempSession && clientWs.readyState === WebSocket.OPEN) {
                        try {
                          clientWs.send(JSON.stringify({ error: `Gemini Live session error: ${err?.message || err}` }));
                        } catch (e) {}
                      }
                    }
                  },
                  onclose: (event: any) => {
                    console.log(`Gemini Live session closed on model ${liveModel}. Code: ${event?.code}, Reason: ${event?.reason}`);
                    logWsEvent('gemini_live_session_closed', { model: liveModel, code: event?.code, reason: event?.reason });
                    
                    if (!finished) {
                      finished = true;
                      if (stabilityTimeout) clearTimeout(stabilityTimeout);
                      reject(new Error(`Session closed pre-handshake: ${event?.reason || 'Code ' + event?.code}`));
                    } else {
                      try {
                        if (tempSession) {
                          tempSession.close();
                        }
                      } catch (e) {}
                      if (session === tempSession && clientWs.readyState === WebSocket.OPEN) {
                        try {
                          clientWs.close(event?.code || 1000, event?.reason || "Gemini Live session closed");
                        } catch (e) {}
                      }
                    }
                  }
                },
              });
            } catch (err) {
              if (!finished) {
                finished = true;
                if (stabilityTimeout) clearTimeout(stabilityTimeout);
                reject(err);
              }
            }
          });

          session = establishedSession;
          console.log(`Gemini Live session connected successfully with model: ${liveModel}`);
          logWsEvent('gemini_live_connected', { voice: selectedVoice, model: liveModel });
          break;
        } catch (modelErr: any) {
          console.warn(`Connecting to Gemini Live with model ${liveModel} failed: ${modelErr.message || modelErr}. Trying next model...`);
          logWsEvent('gemini_live_model_failed', { model: liveModel, error: modelErr.message || modelErr });
          lastLiveError = modelErr;
        }
      }

      if (!session) {
        throw lastLiveError || new Error("All Gemini Live models failed to connect.");
      }

      clientWs.on("message", (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio && session) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch (err) {
          console.error("Error forwarding user audio to Gemini Live:", err);
        }
      });

      clientWs.on("close", () => {
        console.log("Client closed live voice WebSocket connection.");
        try {
          if (session) {
            session.close();
          }
        } catch (err) {
          // already closed
        }
      });

    } catch (error: any) {
      console.error("Failed to establish session with Gemini Live:", error);
      logWsEvent('gemini_live_connection_failed', { error: error.message || error });
      safeSendAndClose(
        { error: `Failed to establish session with Gemini Live: ${error.message || error}` },
        1011,
        'Gemini Live connection failed'
      );
    }
  });

  const handleUpgrade = (request: any, socket: any, head: any) => {
    try {
      let pathname = '';
      if (request.url) {
        const urlPart = request.url.split('?')[0];
        if (urlPart.startsWith('/') || !urlPart.includes('://')) {
          pathname = urlPart;
        } else {
          try {
            pathname = new URL(urlPart).pathname;
          } catch (e) {
            pathname = urlPart;
          }
        }
      }

      console.log(`WebSocket Upgrade Request: Pathname="${pathname}", Raw URL="${request.url}"`);
      logWsEvent('upgrade_request', {
        pathname,
        url: request.url,
        headers: {
          host: request.headers?.host,
          origin: request.headers?.origin,
          upgrade: request.headers?.upgrade,
          connection: request.headers?.connection,
        }
      });

      const isLiveWsPath = pathname === '/api/live-ws' || 
                           pathname === '/api/live-ws/' || 
                           pathname.endsWith('/api/live-ws') || 
                           pathname.endsWith('/api/live-ws/');

      if (isLiveWsPath) {
        logWsEvent('upgrade_matched', { pathname });
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        logWsEvent('upgrade_unmatched', { pathname });
      }
    } catch (err: any) {
      console.error('Error in WebSocket upgrade handler:', err);
      logWsEvent('upgrade_error', { error: err.message || err });
    }
  };

  server.on('upgrade', handleUpgrade);
  if (backupServer) {
    backupServer.on('upgrade', handleUpgrade);
  }
}

startServer();
