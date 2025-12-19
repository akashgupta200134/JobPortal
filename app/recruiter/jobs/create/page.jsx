"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"; // Use the hook we fixed!

export default function CreateJobPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Get global auth state
  
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
    if (!user?._id) return;

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
          postedBy: user._id, // Get ID directly from context
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Job created successfully!");
        router.push("/recruiter/jobs/manage");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show a blank screen or spinner while checking auth to prevent the "alert" flash
  if (authLoading || !user) {
    return <div className="flex justify-center p-10">Verifying Recruiter Session...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Create Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg h-32"
          required
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Salary Range"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition-colors"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}