"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin, DollarSign } from "lucide-react";

export default function ApplyJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    videoProfileUrl: "",
    idCardUrl: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "candidate") {
      alert("Please login as a candidate");
      router.push("/login");
      return;
    }
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await fetch("/api/jobs", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const foundJob = data.jobs.find((j) => j._id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          alert("Job not found");
          router.push("/JobSeeker/dashboard");
        }
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      alert("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          jobId,
          videoProfileUrl: formData.videoProfileUrl,
          idCardUrl: formData.idCardUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Application submitted successfully!");
        router.push("/JobSeeker/dashboard");
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setApplying(false);
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

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push("/JobSeeker/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-2xl border shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              {job.postedBy?.companyName?.[0]?.toUpperCase() || "C"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {job.postedBy?.companyName || "Company"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Apply for this Position</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="videoProfileUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Video Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                id="videoProfileUrl"
                type="url"
                placeholder="https://example.com/your-video.mp4"
                value={formData.videoProfileUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a link to your introduction video
              </p>
            </div>

            <div>
              <label
                htmlFor="idCardUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ID Card/Proof URL (Optional)
              </label>
              <input
                id="idCardUrl"
                type="url"
                placeholder="https://example.com/your-id.pdf"
                value={formData.idCardUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a link to your ID proof document
              </p>
            </div>

            <button
              type="submit"
              disabled={applying}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

