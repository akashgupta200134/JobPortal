"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [loading, setLoading] = useState(false);

  // Assume recruiter info is stored in localStorage after login
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // from login
    if (user && user.role === "recruiter") {
      setRecruiterId(user._id);
    } else {
      alert("You must be logged in as a recruiter!");
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recruiterId) return;

    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        skills: skills.split(",").map((s) => s.trim()), // comma-separated
        location,
        salaryRange,
        postedBy: recruiterId,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Job created successfully!");
      router.push("/recruiter/jobs/manage");
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
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
          className="w-full border px-3 py-2 rounded-lg"
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
