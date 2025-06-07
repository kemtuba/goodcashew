import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIK6-Ysx2rlzrfskz2ZiGyN2LsylNcdSI",
  authDomain: "code-verify-g73jh.firebaseapp.com",
  projectId: "code-verify-g73jh",
  storageBucket: "code-verify-g73jh.appspot.com",
  messagingSenderId: "1019572052051",
  appId: "1:1019572052051:web:b5dc24afb650b2050326a6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
