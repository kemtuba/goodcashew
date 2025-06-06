import { useState } from 'react';
import { auth, setupRecaptcha } from '../lib/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { createClient } from '@supabase/supabase-js';

// Set up Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');

  const sendOTP = async () => {
    setError('');
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyCode = async () => {
    setError('');
    try {
      await confirmationResult.confirm(code);
      // Auth success - now query Supabase for user data
      const { data, error } = await supabase
        .from('goodcashew_users')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (error || !data) {
        setError('User not found in Supabase');
      } else {
        console.log('User profile:', data);
        // Redirect or display dashboard here
      }
    } catch (err) {
      setError('Invalid code or login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">GoodCashew Login</h1>
      <div id="recaptcha-container"></div>

      {!confirmationResult ? (
        <>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Enter phone e.g. +233501234567"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="bg-green-600 text-white p-2 w-full" onClick={sendOTP}>
            Send Code
          </button>
        </>
      ) : (
        <>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Enter 6-digit code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="bg-green-700 text-white p-2 w-full" onClick={verifyCode}>
            Verify Code
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}


