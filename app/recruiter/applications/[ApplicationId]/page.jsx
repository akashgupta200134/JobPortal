"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const [app, setApp] = useState(null);

  useEffect(() => {
    if (applicationId) {
      fetch(`/api/applications/${applicationId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setApp(data.application); });
    }
  }, [applicationId]);

  const updateStatus = async (status) => {
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "applications/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) setApp(data.application);
  };

  if (!app) return <div className="p-10 text-center">Loading Detail...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl border">
      <h1 className="text-3xl font-bold">{app.fullName}</h1>
      <p className="text-gray-500 underline mb-6">{app.email}</p>
      
      <div className="space-y-4">
        <p><strong>Phone:</strong> {app.phoneNumber}</p>
        <p><strong>Location:</strong> {app.location}</p>
        <p><strong>Skills:</strong> {app.skills}</p>
        <p><strong>Job:</strong> {app.jobId?.title}</p>
      </div>

      <div className="mt-8">
        <h3 className="font-bold mb-2">Video Introduction</h3>
        <video src={app.videoProfileUrl} controls className="w-full rounded-lg border bg-black" />
      </div>

      {app.resumeUrl && (
        <div className="mt-6">
          <a href={app.resumeUrl} target="_blank" className="bg-blue-50 text-blue-600 px-4 py-2 rounded border border-blue-200">
            View Resume PDF
          </a>
        </div>
      )}

      <div className="flex gap-4 mt-10">
        <button onClick={() => updateStatus("accepted")} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold">Accept</button>
        <button onClick={() => updateStatus("rejected")} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold">Reject</button>
      </div>
    </div>
  );
}