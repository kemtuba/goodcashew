"use client";

// Import Suspense for pages that read search params
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Firebase and Supabase imports
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabaseClient';

// This is a global type declaration for the window object to include reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// The main Login component logic
const Login = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const role = searchParams.get('role'); 

  // Effect to set up the reCAPTCHA verifier when the component mounts
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, []);

  const sendOTP = async () => {
    setError('');
    setLoading(true);
    if (!window.recaptchaVerifier) {
        setError("reCAPTCHA not initialized. Please refresh the page.");
        setLoading(false);
        return;
    }
    try {
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to send code. Please check the phone number format.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError('');
    setLoading(true);

    const claimedRole = role;
    if (!claimedRole) {
      setError("No role selected. Please return to the homepage.");
      setLoading(false);
      return;
    }

    try {
      // 1. Confirm the user's identity via OTP
      await confirmationResult?.confirm(code);

      // 2. Fetch the user's profile from your database
      const { data: userProfile, error: supabaseError } = await supabase
        .from('goodcashew_users')
        .select('roles') // We only need their authorized roles
        .eq('phone_number', phone)
        .single();

      if (supabaseError || !userProfile) {
        setError('This phone number is not registered in our system.');
        setLoading(false);
        return;
      }

      // 3. The Business Rule Check: Verify the user is authorized for the claimed role
      const authorizedRoles = userProfile.roles as string[] | null;
      if (authorizedRoles && authorizedRoles.includes(claimedRole)) {
        // SUCCESS: The user is authorized. Redirect them.
        router.push(`/${claimedRole}`);
      } else {
        // FAILURE: The user is not authorized for this role. Show an error.
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
        
            {/* This div is the invisible target for the reCAPTCHA widget */}
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
                    <p className="text-center text-sm text-gray-600">Enter the 6-digit code sent to {phone}</p>
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


// The default export MUST be a parent component that wraps the main component in Suspense
const LoginPage = () => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <Login />
  </Suspense>
);

export default LoginPage;
