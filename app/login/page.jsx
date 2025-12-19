"use client";

import { useState, useRef, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const recaptchaRef = useRef(null);
  const confirmationRef = useRef(null);
  const router = useRouter();

  // Initialize Recaptcha safely
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("Recaptcha resolved");
          },
          "expired-callback": () => {
            window.location.reload(); // Best way to reset expired recaptcha
          },
        }
      );
    }

    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure phone starts with + (Basic E.164 check)
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setStep("otp");
    } catch (err) {
      console.error("Send OTP Error:", err);
      alert("Error sending SMS. Please check the phone number.");
      // Reset ReCaptcha if it fails
      if (window.grecaptcha) window.grecaptcha.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationRef.current) {
      alert("Please request OTP first!");
      return;
    }
    setLoading(true);

    try {
      // 1. Firebase Confirmation
      await confirmationRef.current.confirm(otp);

      // 2. Backend Login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Specifically handle the 403 Role Mismatch from your backend
        throw new Error(data.message || "Login failed");
      }

      // 3. Update Global Context
      login(data.user); 

      // 4. Set Success Prompt
      setSuccessMsg(`Success! Logging you in as ${role}...`);

      // 5. Explicit Redirect Logic
      setTimeout(() => {
        if (role === "candidate") {
          router.push("/JobSeeker/dashboard");
        } else {
          router.push("/recruiter/dashboard");
        }
      }, 1500);

    } catch (err) {
      console.error("Verification Error:", err);
      // err.message will now contain "Role mismatch" if that's what the server sent
      alert(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900">
        Hello Again! Let’s Get You Started.
      </h1>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <div id="recaptcha-container"></div>

        {successMsg ? (
          <div className="text-center py-10 space-y-4">
             <div className="text-green-500 font-bold text-2xl">✓ Success!</div>
             <p className="text-gray-600 animate-pulse">{successMsg}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Login with Phone
            </h2>

            {step === "phone" && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === "candidate" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}
                  >
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("recruiter")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === "recruiter" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}
                  >
                    Recruiter
                  </button>
                </div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                />

                <Button type="submit" disabled={loading} className="w-full py-6 text-lg rounded-xl">
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <p className="text-sm text-gray-500 text-center">Enter the code sent to {phone}</p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <div className="flex gap-3">
                  <Button type="submit" disabled={loading} className="flex-[2] py-6 rounded-xl">
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setStep("phone")}
                    className="flex-1 py-6 rounded-xl"
                  >
                    Edit
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}