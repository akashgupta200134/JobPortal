"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ApplicationsListPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("/api/applications")
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.applications);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Applications</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Candidate</th>
              <th className="border px-4 py-2">Job Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{app.candidateId?.fullName || "N/A"}</td>
                <td className="border px-4 py-2">{app.jobId?.title || "N/A"}</td>
                <td className="border px-4 py-2">{app.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <Link href={`/recruiter/applications/${app._id}`} className="text-blue-500 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
