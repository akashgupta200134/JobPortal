"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.jobs.find(j => j._id === jobId);
          setJob(found);
        }
      });
  }, [jobId]);

  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">{job.title}</h1>
      <p className="mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="mb-2"><strong>Salary:</strong> {job.salaryRange}</p>
      <p className="mb-2"><strong>Description:</strong> {job.description}</p>
      <p className="mb-2"><strong>Skills:</strong> {job.skills.join(", ")}</p>
      <p className="mb-2"><strong>Status:</strong> {job.status || "active"}</p>
    </div>
  );
}
