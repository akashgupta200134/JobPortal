"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ApplicationsListPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.applications);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Applications...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Received Applications</h1>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Candidate</th>
              <th className="p-4">Job Title</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold">{app.fullName}</p>
                  <p className="text-xs text-gray-500">{app.email}</p>
                </td>
                <td className="p-4">{app.jobId?.title || "Deleted Job"}</td>
                <td className="p-4 capitalize">
                   <span className="px-2 py-1 rounded-md text-xs bg-gray-100">{app.status}</span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/recruiter/applications/${app._id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400">No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}