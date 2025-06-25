// /app/page.tsx

"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
// --- THIS IS THE FIX, PART 1 ---
// We now import `appCheck` and `getToken` from your Firebase configuration.
// This allows the frontend to request the necessary security token.
import { auth, appCheck, getToken } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, AlertCircle, Trees } from "lucide-react";

// --- UI COMPONENTS FROM YOUR ORIGINAL FILE ---
// These are included directly for simplicity and to match your original structure.

const CashewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 100 105" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Path for the green leaf */}
    <path d="M60 20 C50 10, 30 15, 20 30" stroke="#4ADE80" strokeWidth="8" strokeLinecap="round" />
    {/* Path for the yellow fruit body */}
    <path d="M50 30 C10 40, 10 90, 55 90 S90 60, 70 40 C65 30, 55 25, 50 30 Z" fill="#FBBF24" />
    {/* Path for the brown cashew nut */}
    <path d="M55 90 C 50 100, 60 105, 65 95" stroke="#A16207" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const GoodCashewLogo = () => (
  <div className="relative">
    <svg width="180" height="28" viewBox="0 0 180 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="22" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="300" fill="white" letterSpacing="0.05em">GOOD</text>
      <text x="73" y="22" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="700" fill="white" letterSpacing="0.05em">CASHEW</text>
    </svg>
    <div className="absolute -top-2 -right-3">
      <CashewIcon />
    </div>
  </div>
);

// EXPLANATION: The RoleIllustration is kept for visual consistency.
// However, since we no longer know the user's role on this page, it now
// displays a beautiful, generic default state instead of changing.
const DefaultIllustration = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center rounded-lg overflow-hidden bg-zinc-800/30 p-4 gap-y-3">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-500/10 to-gray-500/0" />
    <Trees size={80} className="text-gray-400" strokeWidth={1.5} />
    <GoodCashewLogo />
  </div>
);


// --- MAIN LOGIN PAGE COMPONENT ---
// This combines your UI with our final, secure authentication logic.

export default function LoginPage() {
  const router = useRouter();

  // State management for the form and authentication flow
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'enter-phone' | 'verify-otp'>('enter-phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for UI enhancements
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [isPristine, setIsPristine] = useState(true);

  // Use refs to hold Firebase objects, preventing re-renders and solving TS issues.
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // Initialize the invisible reCAPTCHA verifier once on component mount.
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  }, []);

  // Validate the phone number as the user types.
  useEffect(() => {
    if (isPristine) return;
    setPhoneValid(phoneNumber.length >= 10); // Simple validation
  }, [phoneNumber, isPristine]);

  const handlePhoneSubmit = async () => {
    if (!phoneValid) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const verifier = recaptchaVerifierRef.current!;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      confirmationResultRef.current = confirmationResult;
      setStep('verify-otp');
    } catch (err: any) {
      console.error("Error sending code:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (otp.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const confirmationResult = confirmationResultRef.current!;
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();

      // --- THIS IS THE FIX, PART 2 ---
      // We get the App Check token before making the API call.
      if (!appCheck) {
          throw new Error("App Check not initialized on the client.");
      }
      const appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
      
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // And we include the token in the request header.
          'X-Firebase-AppCheck': appCheckTokenResponse.token,
        },
        body: JSON.stringify({ idToken }), // Send only the token
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync user profile.');
      }

      // The API now tells us where to go based on the user's real role.
      router.push(`/dashboard/${data.role}`);
    } catch (err: any) {
      console.error("OTP submission error:", err);
      setError(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-stone-900">
      <div className="w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row md:items-center rounded-xl overflow-hidden bg-stone-800/30 shadow-2xl">
        
        {/* Left Panel: The Illustration */}
        <div className="w-full md:w-1/2">
          <div className="w-full h-48 md:h-full md:aspect-auto aspect-video">
            <DefaultIllustration />
          </div>
        </div>

        {/* Right Panel: The Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8">
          <div id="recaptcha-container"></div>
          
          {step === 'enter-phone' ? (
            <div className="space-y-4">
              {/* EXPLANATION: SegmentedControl is removed as role is now handled by the backend. */}
              <div className="rounded-lg border border-gray-600/80 overflow-hidden bg-gray-900/50">
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setIsPristine(false);
                    }}
                    className={`w-full bg-transparent border-0 rounded-none h-14 px-4 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 transition-all ${isPristine ? 'animate-pulse ring-2 ring-amber-500/50' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {!isPristine && (phoneValid ? <Check className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />)}
                  </div>
                </div>
              </div>
              <Button onClick={handlePhoneSubmit} disabled={loading || !phoneValid} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-bold text-lg py-3 h-14">
                {loading ? "Sending..." : "Continue"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-300">Enter the code we sent to your phone.</p>
              <Input
                id="code" type="text" value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                className="w-full bg-gray-900/50 border border-gray-600/80 rounded-lg h-14 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-widest"
              />
              <Button onClick={handleVerifyCode} disabled={loading || otp.length < 6} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-bold text-lg py-3 h-14">
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
