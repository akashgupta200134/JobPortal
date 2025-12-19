"use client";

import { useState, useRef, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef(null);
  const confirmationRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!recaptchaRef.current) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => console.log("Recaptcha resolved"),
          }
        );
      } catch (err) {
        console.error("Recaptcha init error:", err);
      }
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
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setStep("otp");
    } catch (err) {
      console.error("Send OTP Error:", err);
      alert(err.message);
      if (recaptchaRef.current) {
        recaptchaRef.current
          .render()
          .then((widgetId) => grecaptcha.reset(widgetId));
      }
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
      await confirmationRef.current.confirm(otp);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, role }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (role === "candidate") {
        router.push("/JobSeeker/dashboard");
      } else {
        router.push("/recruiter/dashboard");
      }
    } catch (err) {
      console.error("Verification Error:", err);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="  text-5xl font-bold text-center mt-5">
        Hello Again! Let’s Get You Started.
      </p>

      <div className="min-h-screen flex items-center justify-center -mt-15 ml-10 ">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
            Login with Phone
          </h2>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {/* Role Selector */}
              <div className="flex justify-between mb-6 bg-gray-100 p-3 rounded-xl">
                <label
                  className={`flex items-center cursor-pointer px-4 py-2 rounded-xl transition-all ${
                    role === "candidate"
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={role === "candidate"}
                    onChange={() => setRole("candidate")}
                    className="mr-2"
                  />
                  Candidate
                </label>
                <label
                  className={`flex items-center cursor-pointer px-4 py-2 rounded-xl transition-all ${
                    role === "recruiter"
                      ? "bg-white text-black shadow-md"
                      : "text-gray-700 hover:bg-green-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={role === "recruiter"}
                    onChange={() => setRole("recruiter")}
                    className="mr-2 "
                  />
                  Recruiter
                </label>
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                required
                className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 transition-all placeholder-gray-400"
              />
              <div id="recaptcha-container"></div>

              <Button
                variant=""
                type="submit"
                disabled={loading}
                className="w-full    text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all shadow-lg"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-1   transition-all placeholder-gray-400"
              />
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  type="submit"
                  disabled={loading}
                  className="  text-black py-3 border px-6 rounded-xl font-semibold hover:scale-105 transform transition-all shadow-lg"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                  variant=""
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-white hover:underline font-medium ml-4"
                >
                  Change Number
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
