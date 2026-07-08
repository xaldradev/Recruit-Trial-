import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp({
  ...firebaseConfig,
  authDomain: firebaseConfig.projectId ? `${firebaseConfig.projectId}.firebaseapp.com` : firebaseConfig.authDomain
});
export const auth = getAuth(app);

// Initialize Firestore using initializeFirestore with experimentalForceLongPolling to prevent iframe connection issues
export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

// Validate Connection to Firestore as per SKILL.md rules
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firebase client appears to be offline. Verify network or credentials.");
    }
  }
}
testConnection();
