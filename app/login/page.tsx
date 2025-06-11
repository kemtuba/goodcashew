// File: app/login/page.tsx

"use client"; // This component is interactive, so it must be a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation in App Router
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from '@/lib/firebase'; // <-- Import our new client-side auth

// This interface is needed for the window object
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Initialize reCAPTCHA verifier only once on the client side
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      // The container can be invisible
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  }, []);

  // Function to send the OTP to the user's phone
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const verifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, `+${phone}`, verifier);
      window.confirmationResult = confirmationResult;
      setIsCodeSent(true);
      setError('Verification code has been sent.');
    } catch (err: any) {
      console.error("Error sending code:", err);
      setError(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify the OTP and then sync with the backend
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Confirm the code with Firebase
      const confirmationResult = window.confirmationResult!;
      const userCredential = await confirmationResult.confirm(code);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) throw new Error("Firebase user not found after confirmation.");

      // 2. Get the secure ID token
      const firebaseToken = await firebaseUser.getIdToken(true);

      // 3. Automatically call our backend to sync the user (invisible to user)
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_token: firebaseToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to sync user profile.');

      // 4. Sync successful! Redirect to the dashboard
      const { userProfile } = data;
      router.push(`/dashboard/${userProfile.role}`);

    } catch (err: any) {
      console.error("Error verifying code or syncing:", err);
      setError(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">GoodCashew Login</h1>
          <p className="text-gray-500">
            {isCodeSent ? "Enter the code we sent you." : "Enter your phone number to begin."}
          </p>
        </div>

        {/* This div is required for the invisible reCAPTCHA */}
        <div id="recaptcha-container"></div>
        
        {!isCodeSent ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number with country code"
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
              {loading ? 'Sending Code...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="sr-only">Verification Code</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
              {loading ? 'Verifying & Logging In...' : 'Verify & Login'}
            </button>
          </form>
        )}
        
        {error && <p className="mt-4 text-sm text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
}