"use client"; // required if using useState or hooks

import {CandidateSignupForm} from "@/app/signup/forms/CandidateSignupForm"; // make sure path is correct
import Image from "next/image";

export default function JobSeekerSignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-1">
      {/* Left Side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo / Brand */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            @JobPortal
          </a>
        </div>

        {/* Candidate Signup Form */}
        <div className="flex flex-1  items-center justify-center">
          <div className="w-full max-w-md">
            <CandidateSignupForm />
          </div>
        </div>
      </div>   
    </div>
  );
}
