"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobs(data.jobs);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Jobs</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Salary</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{job.title}</td>
                <td className="border px-4 py-2">{job.location}</td>
                <td className="border px-4 py-2">{job.salaryRange}</td>
                <td className="border px-4 py-2">{job.status || "active"}</td>
                <td className="border px-4 py-2 space-x-2">
                  <Link href={`/recruiter/jobs/${job._id}`} className="text-blue-500 hover:underline">
                    View
                  </Link>
                  {/* Optional: Edit / Close buttons */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
