"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateSignupForm } from "./forms/CandidateSignupForm";
import { RecruiterSignupForm } from "./forms/RecruiterSignupForm";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState(""); // "jobseeker" | "recruiter"

  // Handle role selection
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    // Optional: you can also redirect to /signup/jobseeker or /signup/recruiter
    // router.push(`/signup/${selectedRole}`);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-1">
      {/* Left Side */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo / Brand */}
        
          <p className="font-extrabold text-center text-4xl">
           Whether You’re Hiring or Applying, We’ve Got You Covered!!
          </p>  

        {/* Role Selection or Form */}
        <div className="flex flex-2 items-center   justify-center">
          <div className="w-full max-w-md border border-b-zinc-200 p-15">
            {!role ? (
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold">Create your account with @JobPortal</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Select your role to continue
                </p>

            <Button onClick={() => handleRoleSelection("jobseeker")} size="lg" className="px-8">
              I am a Job Seeker
              </Button>

                 <Button onClick={() => handleRoleSelection("recruiter")} size="lg" className="px-8">
            I am a Recruiter
              </Button>   
              </div>
            ) : role === "jobseeker" ? (
              <CandidateSignupForm />
            ) : (
              <RecruiterSignupForm />
            )}
          </div>
        </div>
      </div>

      
      
    </div>
  );
}
