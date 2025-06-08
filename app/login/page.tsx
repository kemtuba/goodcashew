"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  connectAuthEmulator
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';

// Global type extension
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Normalize Ghanaian phone numbers for Firebase
const normalizePhoneNumber = (input: string): string => {
  if (input.startsWith('0')) return '+233' + input.slice(1);
  if (input.startsWith('233')) return '+' + input;
  return input.startsWith('+') ? input : `+${input}`;
};

const Login = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  useEffect(() => {
    // Connect to Auth emulator (if in development mode)
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
      } catch (err) {
        console.log('Auth emulator already connected or failed to connect.');
      }
    }

    // Set up reCAPTCHA only once
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const sendOTP = async () => {
    setError('');
    setLoading(true);

    const normalizedPhone = normalizePhoneNumber(phone);

    try {
      const result = await signInWithPhoneNumber(auth, normalizedPhone, window.recaptchaVerifier!);
      setConfirmationResult(result);

      if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
        console.log('🔐 Test OTP (emulator): 123456');
      }

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

    const normalizedPhone = normalizePhoneNumber(phone);
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
        .eq('phone_number', normalizedPhone)
        .single();

      if (supabaseError || !userProfile) {
        setError('This phone number is not registered in our system.');
        setLoading(false);
        return;
      }

      const authorizedRoles = userProfile.roles as string[] | null;

      if (authorizedRoles && authorizedRoles.includes(claimedRole)) {
        router.push(`/dashboard/${claimedRole}`);
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

        {/* reCAPTCHA container (invisible) */}
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
            <p className="text-center text-sm text-gray-600">Enter the 6-digit code sent to {normalizePhoneNumber(phone)}</p>
            <input
              type="text"
              className="border p-3 w-full rounded-md text-center tracking-widest"
              placeholder="------"
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

// Wrapper with Suspense for searchParams (Next.js 13+)
const LoginPage = () => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <Login />
  </Suspense>
);

export default LoginPage;
