"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"; // Use the context we fixed

export default function CandidateDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Get auth state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    // Only fetch jobs if the auth check is finished and we have a valid candidate
    if (!authLoading && user?.role === "candidate") {
      fetchJobs();
    }
  }, [user, authLoading]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleApply = (jobId) => {
    router.push(`/JobSeeker/jobs/${jobId}/apply`);
  };

  // 1. Show global loader while checking if user is logged in
  if (authLoading || (jobsLoading && jobs.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your opportunities...</p>
        </div>
      </div>
    );
  }

  // 2. If Auth is done and no user, return null (Middleware will redirect)
  if (!user || user.role !== "candidate") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Find your next opportunity from {jobs.length} open positions
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs available
            </h3>
            <p className="text-gray-600">
              Check back later for new opportunities
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {job.postedBy?.companyName?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {job.postedBy?.companyName || "Company"}
                        </p>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Posted{" "}
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApply(job._id)}
                    className="ml-4 px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}