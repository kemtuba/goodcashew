"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth, appCheck, getToken } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// --- UPDATED ICONS ---
import { Check, AlertCircle, Users, GraduationCap, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// --- UI COMPONENTS ---

const CashewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 100 105" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 20 C50 10, 30 15, 20 30" stroke="#4ADE80" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 30 C10 40, 10 90, 55 90 S90 60, 70 40 C65 30, 55 25, 50 30 Z" fill="#FBBF24" />
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

// --- REFINED: Info Panel with new copy, icons, and centered logo ---
const InfoPanel = () => {
    const slides = [
        {
            icon: Leaf,
            title: "Empowering Farmers, Uplifting Communities.",
            subtitle: "" // Subtitle removed for conciseness
        },
        {
            icon: Users,
            title: "Supporting 72 Farmer Families",
            subtitle: "through training, certification, and financial stability."
        },
        {
            icon: GraduationCap,
            title: "Empowering 156 Students",
            subtitle: "at the Rising Star Leadership Academy through our partnership."
        }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);
    
    const CurrentIcon = slides[index].icon;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center rounded-lg overflow-hidden bg-zinc-800/30 p-8 text-center text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-500/10 to-gray-500/0" />
            
            {/* Logo is now part of the main centered content */}
            <div className="mb-8">
                <GoodCashewLogo />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center gap-4"
                >
                    <CurrentIcon className="h-12 w-12 text-amber-400" strokeWidth={1.5}/>
                    <h2 className="text-2xl font-bold">{slides[index].title}</h2>
                    <p className="text-md text-gray-300 max-w-xs">{slides[index].subtitle}</p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


// --- MAIN LOGIN PAGE COMPONENT ---
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
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      confirmationResultRef.current = confirmationResult;
      setStep('verify-otp');
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
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
        
        {/* --- REFINED: The Info Panel with responsive height --- */}
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
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value); setIsPristine(false); }}
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
