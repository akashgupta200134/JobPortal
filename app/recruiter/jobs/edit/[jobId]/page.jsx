"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "recruiter") {
      alert("Please login as a recruiter");
      router.push("/login");
      return;
    }
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch("/api/jobs", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const job = data.jobs.find((j) => j._id === jobId);
        if (job) {
          if (job.postedBy?._id !== user._id && job.postedBy?._id !== user.id) {
            alert("You can only edit your own jobs");
            router.push("/recruiter/jobs/manage");
            return;
          }
          setTitle(job.title);
          setDescription(job.description);
          setSkills(job.skills ? job.skills.join(", ") : "");
          setLocation(job.location || "");
          setSalaryRange(job.salaryRange || "");
        } else {
          alert("Job not found");
          router.push("/recruiter/jobs/manage");
        }
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      alert("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/jobs?id=${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          skills,
          location,
          salaryRange,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Job updated successfully!");
        router.push("/recruiter/jobs/manage");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => router.push("/recruiter/jobs/manage")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Manage Jobs
        </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                placeholder="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                placeholder="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                placeholder="Salary Range"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
