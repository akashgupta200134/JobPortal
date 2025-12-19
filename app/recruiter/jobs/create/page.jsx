"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Wait until AuthContext finishes checking the session
    if (!authLoading) {
      if (!user || user.role !== "recruiter") {
        alert("You must be logged in as a recruiter!");
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for both _id (MongoDB default) and id (some API transformations)
    const recruiterId = user?._id || user?.id;

    if (!recruiterId) {
      alert("User session not found. Please log out and log back in.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          skills,
          location,
          salaryRange,
          postedBy: recruiterId, 
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Job created successfully!");
        // Ensure this path matches your actual folder structure
        router.push("/recruiter/jobs/manage"); 
      } else {
        alert("Error: " + (data.message || "Failed to create job"));
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Prevent "Flash" of content or alerts while loading
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg animate-pulse">Verifying session...</p>
      </div>
    );
  }

  // 2. Safety check: If not loading and no user, the useEffect will handle the redirect
  if (!user || user.role !== "recruiter") return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            placeholder="Describe the role, responsibilities, and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input
            type="text"
            placeholder="React, Node.js, TypeScript"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Remote / Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input
              type="text"
              placeholder="e.g. ₹10L - ₹15L"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-bold transition-all disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Publishing Job..." : "Post Job Now"}
        </button>
      </form>
    </div>
  );
}