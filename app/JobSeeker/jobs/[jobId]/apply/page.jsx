"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, DollarSign, Video, FileText, User, Mail, Phone, Briefcase, Globe } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function ApplyJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;
  const { user, loading: authLoading, login } = useAuth(); 

  const [job, setJob] = useState(null);
  const [fetchingJob, setFetchingJob] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    skills: "",
    videoProfileUrl: "",
    resumeFile: null,
  });

  // 1. Unified Auth & Job Fetching
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "candidate") {
        router.push("/login");
        return;
      }
      fetchJobDetails();
    }
  }, [authLoading, user, jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await fetch("/api/jobs", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const foundJob = data.jobs.find((j) => j._id === jobId);
        if (foundJob) setJob(foundJob);
        else {
          alert("Job not found");
          router.push("/JobSeeker/dashboard");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetchingJob(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [id]: files ? files[0] : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      // Step A: Prepare Application Payload
      const formPayload = new FormData();
      formPayload.append("jobId", jobId);
      Object.keys(formData).forEach((key) => {
        if (formData[key]) formPayload.append(key, formData[key]);
      });

      // Step B: Submit the Job Application
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formPayload,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Step C: THE PERMANENT FIX
        // If the user is currently "New User", we update their DB record permanently
        if (user?.name === "New User" || !user?.name) {
          try {
            await fetch("/api/user/update-profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                userId: user.id, 
                fullName: formData.fullName 
              }),
            });

            // ✅ Step D: Update Navbar/Context immediately
            login({ ...user, name: formData.fullName });
          } catch (profileErr) {
            console.error("Profile update failed:", profileErr);
          }
        }

        alert("Application submitted successfully!");
        router.push("/JobSeeker/dashboard");
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      alert("An error occurred: " + err.message);
    } finally {
      setApplying(false);
    }
  };

  if (authLoading || fetchingJob) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => router.push("/JobSeeker/dashboard")} 
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-black transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        {/* Job Card Header */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8 shadow-sm">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h1>
           <div className="flex flex-wrap gap-5 text-gray-600">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job?.postedBy?.companyName}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job?.location}</span>
              {job?.salaryRange && (
                <span className="flex items-center gap-1.5 text-green-700 font-bold">
                  <DollarSign className="w-4 h-4" /> {job?.salaryRange}
                </span>
              )}
           </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><User className="w-4 h-4"/> Full Name *</label>
                <input id="fullName" type="text" value={formData.fullName} onChange={handleChange} required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Mail className="w-4 h-4"/> Email Address *</label>
                <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black" placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Phone className="w-4 h-4"/> Phone Number *</label>
                <input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black" placeholder="+91..." />
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Globe className="w-4 h-4"/> Current Location *</label>
                <input id="location" type="text" value={formData.location} onChange={handleChange} required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black" placeholder="City, State" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Briefcase className="w-4 h-4"/> Skills *</label>
              <input id="skills" type="text" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, UI/UX" required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black" />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Video className="w-4 h-4"/> Video Profile URL (YouTube/Loom)</label>
              <input id="videoProfileUrl" type="url" value={formData.videoProfileUrl} onChange={handleChange} placeholder="https://..." className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black" />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><FileText className="w-4 h-4"/> Resume (PDF Only) *</label>
              <input id="resumeFile" type="file" accept=".pdf" onChange={handleChange} required className="w-full border-2 border-dashed p-6 rounded-2xl cursor-pointer hover:bg-gray-50 transition" />
            </div>

            <button 
              type="submit" 
              disabled={applying} 
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all disabled:opacity-50"
            >
              {applying ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}