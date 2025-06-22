// lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Prevent reinitialization on Fast Refresh or SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(app);

// Declare appCheck so it can be exported
let appCheck: AppCheck | undefined;

// Initialize App Check only in the browser
if (typeof window !== 'undefined' && !(window as any). FIREBASE_APPCHECK_INITIALIZED) {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
    ),
    isTokenAutoRefreshEnabled: true,
  });
  (window as any).FIREBASE_APPCHECK_INITIALIZED = true;
  console.log('✅ Firebase App Check initialized');
}

export { auth, appCheck };
