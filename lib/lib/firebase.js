import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
apiKey: "AIzaSyCIK6-Ysx2rlzrfskz2ZiGyN2LsylNcdSI",
  authDomain: "code-verify-g73jh.firebaseapp.com",
  projectId: "code-verify-g73jh",
  storageBucket: "code-verify-g73jh.firebasestorage.app",
  messagingSenderId: "1019572052051",
  appId: "1:1019572052051:web:b5dc24afb650b2050326a6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
