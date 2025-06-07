// The final, correct version of login.tsx

import { useRouter } from 'next/router';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const Login = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { role } = router.query;

  const sendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier!);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError('');
    setLoading(true);
    try {
      await confirmationResult?.confirm(code);
      const { data, error: supabaseError } = await supabase
        .from('goodcashew_users')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (supabaseError || !data) {
        console.error('Supabase error:', supabaseError);
        setError('User not found in our system.');
      } else {
        const userRole = data.role || 'farmer'; 
        router.push(`/dashboard/${userRole}`);
      }
    } catch (err) {
      console.error('Firebase confirmation error:', err);
      setError('Invalid code or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Login as {role ? String(role).replace('_', ' ') : 'user'}
      </h1>
      {/* This div is the target for the RecaptchaVerifier */}
      <div id="recaptcha-container"></div>

      {!confirmationResult ? (
        <>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Enter phone e.g. +233501234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            className="bg-green-600 text-white p-2 w-full"
            onClick={sendOTP}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </>
      ) : (
        <>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="bg-green-700 text-white p-2 w-full"
            onClick={verifyCode}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Login;