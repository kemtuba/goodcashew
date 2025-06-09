// app/login/page.tsx
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Firebase imports
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  connectAuthEmulator
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';

// Global type extension for window object
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

/**
 * Normalizes Ghanaian phone numbers to the international +233 format.
 * This ensures consistency in the database and for Firebase auth.
 * @param input - The phone number string from the user.
 * @returns A normalized phone number string.
 */
const normalizePhoneNumber = (input: string): string => {
  if (input.startsWith('0')) return '+233' + input.slice(1);
  if (input.startsWith('233')) return '+' + input;
  return input.startsWith('+') ? input : `+${input}`;
};

const Login = () => {
  // Check for emulator mode once at the top.
  const isEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === 'true';

  // Conditionally set initial state based on emulator mode.
  // This pre-fills the form with your test number and a standard test code.
  const [phone, setPhone] = useState(isEmulator ? '+12012830478' : '');
  const [code, setCode] = useState(isEmulator ? '123456' : '');
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  // A single, combined useEffect for setup logic.
  useEffect(() => {
    // Connect to Auth emulator using the explicit environment variable.
    if (isEmulator) {
      try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        console.log("Firebase Auth emulator connected.");
      } catch (err) {
        // This catch block prevents errors on fast refresh if already connected.
        console.log('Auth emulator may already be connected.');
      }
    }

    // Set up reCAPTCHA for production use.
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [isEmulator]);

  const sendOTP = async () => {
    setError('');
    setLoading(true);

    // UPDATED LOGIC: Only normalize the phone number if NOT in emulator mode.
    // The emulator test number is assumed to be perfectly formatted.
    const finalPhone = isEmulator ? phone : normalizePhoneNumber(phone);
    const verifier = isEmulator ? null : window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, finalPhone, verifier!);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error('OTP send error:', err);
      setError(err.message || 'Failed to send code. Please check the phone number format.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError('');
    setLoading(true);
    
    // UPDATED LOGIC: Same as above, only normalize if not using the emulator.
    const finalPhone = isEmulator ? phone : normalizePhoneNumber(phone);
    const claimedRole = role;

    if (!claimedRole) {
      setError('No role selected. Please return to the homepage.');
      setLoading(false);
      return;
    }

    try {
      await confirmationResult?.confirm(code);

      const { data: userProfile, error: supabaseError } = await supabase
        .from('goodcashew_users')
        .select('roles')
        .eq('phone_number', finalPhone) // Use the conditionally normalized number
        .single();

      if (supabaseError || !userProfile) {
        setError('This phone number is not registered in our system.');
        setLoading(false);
        return;
      }

      const authorizedRoles = userProfile.roles as string[] | null;

      if (authorizedRoles && authorizedRoles.includes(claimedRole)) {
        // CORRECTED ROUTE: This now matches your app/(dashboard)/[role] file structure.
        router.push(`/${claimedRole}`);
      } else {
        const roleName = claimedRole.replace(/_/g, ' ');
        setError(`This phone number is not authorized as a ${roleName}.`);
      }

    } catch (err) {
      console.error('Verification failed:', err);
      setError('The code you entered is invalid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Login as {role ? String(role).replace(/_/g, ' ') : 'User'}
          </h1>
          <p className="text-gray-600">Enter your phone number to continue</p>
        </div>
        
        <div id="recaptcha-container"></div>

        {!confirmationResult ? (
          <div className="space-y-4">
            <input
              type="tel"
              className="border p-3 w-full rounded-md"
              placeholder="e.g., +233501234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="bg-green-600 text-white p-3 w-full rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
              onClick={sendOTP}
              disabled={loading || !phone}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">Enter the 6-digit code sent to {isEmulator ? phone : normalizePhoneNumber(phone)}</p>
            <input
              type="text"
              className="border p-3 w-full rounded-md text-center tracking-widest"
              placeholder="Enter OTP"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="bg-green-700 text-white p-3 w-full rounded-md font-semibold hover:bg-green-800 disabled:bg-gray-400"
              onClick={verifyCode}
              disabled={loading || code.length < 6}
            >
              {loading ? 'Verifying...' : 'Verify and Continue'}
            </button>
          </div>
        )}

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

// Wrapper with Suspense for Next.js App Router
const LoginPage = () => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <Login />
  </Suspense>
);

export default LoginPage;
