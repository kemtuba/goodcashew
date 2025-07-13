"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth, appCheck, getToken } from '@/lib/firebase';
import Image from 'next/image'; // --- STRATEGIC UPDATE: Using Next.js Image for optimization
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, AlertCircle } from "lucide-react";

// --- STRATEGIC UPDATE: SIMPLIFIED & FOCUSED UI COMPONENTS ---

// The old hard-coded SVG logo components have been removed.
// We will now use the official SVG file.

const GoodCashewLogo = () => (
  // Using next/image for optimized loading and referencing our official SVG file.
  // This is cleaner and ensures we are always using the correct brand asset.
  <Image
    src="/goodcashew-final/app/goodcashew-primarylogo.svg"
    alt="goodCashew Logo"
    width={250} // Increased size to be the hero element
    height={40} // Adjusted height based on new width
    priority // Makes the logo load faster, as it's a critical element
  />
);

// --- STRATEGIC UPDATE: REVAMPED INFO PANEL ---
// Replaced the distracting carousel with a static, welcoming panel.
// This is clearer for low digital literacy users and elevates our brand.
const InfoPanel = () => {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center rounded-lg overflow-hidden bg-zinc-800/30 p-8 text-center text-white">
            {/* Subtle background gradient for visual texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-500/10 to-gray-500/0" />
            
            <div className="flex flex-col items-center justify-center gap-6">
                {/* 1. The Logo is now the hero element */}
                <GoodCashewLogo />

                {/* 2. A single, empowering message replaces the carousel */}
                <div className="mt-4">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, Partner.
                    </h1>
                    <p className="text-lg text-gray-300 mt-2 max-w-xs">
                        Your harvest, our future. Together, we grow.
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- MAIN LOGIN PAGE COMPONENT (Firebase logic remains unchanged) ---
export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'enter-phone' | 'verify-otp'>('enter-phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [isPristine, setIsPristine] = useState(true);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  }, []);

  useEffect(() => {
    if (isPristine) return;
    setPhoneValid(phoneNumber.length >= 10);
  }, [phoneNumber, isPristine]);

  const handlePhoneSubmit = async () => {
    if (!phoneValid) return;
    setError('');
    setLoading(true);
    try {
      const verifier = recaptchaVerifierRef.current!;
      const fullPhoneNumber = `+${phoneNumber}`; // --- UX FIX: Assuming country code might be needed
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
      confirmationResultRef.current = confirmationResult;
      setStep('verify-otp');
    } catch (err) {
      setError("Failed to send verification code. Please check the number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (otp.length < 6) return;
    setError('');
    setLoading(true);
    try {
      const confirmationResult = confirmationResultRef.current!;
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      if (!appCheck) throw new Error("App Check not initialized.");
      const appCheckToken = await getToken(appCheck, false);
      
      const response = await fetch('/api/firebase-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Firebase-AppCheck': appCheckToken.token },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed.');
      router.push(`/dashboard/${data.role}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-stone-900">
      <div className="w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row md:items-stretch rounded-xl overflow-hidden bg-stone-800/30 shadow-2xl">
        
        <div className="w-full md:w-1/2">
          <div className="w-full h-80 md:h-full">
            <InfoPanel />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8">
          <div id="recaptcha-container"></div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Member Login</h1>
          </div>
          
          {step === 'enter-phone' ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-600/80 overflow-hidden bg-gray-900/50">
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Phone Number (e.g., 233...)" // --- UX FIX: Added example
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value.replace(/[^0-9]/g, '')); setIsPristine(false); }}
                    className={`w-full bg-transparent border-0 rounded-none h-14 px-4 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 transition-all ${isPristine ? 'animate-pulse ring-2 ring-amber-500/50' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {!isPristine && (phoneValid ? <Check className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-400">Enter the phone number registered with the Good Cashew program.</p>
              <Button onClick={handlePhoneSubmit} disabled={loading || !phoneValid} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-bold text-lg py-3 h-14">
                {loading ? "Sending..." : "Continue"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-300">Enter the 6-digit code we sent to your phone.</p>
              <Input
                type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="123456" required
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
      
      <footer className="text-center text-xs text-gray-500 p-4 space-x-4">
        <a href="https://www.tirafanga.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Tirafanga Sustainability Alliance</a>
        <span>&bull;</span>
         <Dialog>
            <DialogTrigger asChild>
                <button className="hover:text-white">Contact Us</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact Information</DialogTitle>
                </DialogHeader>
                <p>For inquiries about the Good Cashew program, please contact us at: <a href="mailto:me@kem.design" className="text-amber-500 hover:underline">me@kem.design</a></p>
            </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
}
