"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    fetch("/api/applications")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.applications.find(app => app._id === applicationId);
          setApplication(found);
        }
      });
  }, [applicationId]);

  const updateStatus = async status => {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    const data = await res.json();
    if (data.success) setApplication(data.application);
  };

  if (!application) return <div className="p-6">Loading...</div>;

  const candidate = application.candidateId;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow space-y-4">
      <h1 className="text-2xl font-semibold">{candidate.fullName}</h1>
      <p><strong>Email:</strong> {candidate.email}</p>
      <p><strong>Phone:</strong> {candidate.phone}</p>
      <p><strong>Skills:</strong> {candidate.skillCategory}</p>
      <p><strong>Experience:</strong> {candidate.experience} years</p>
      <p><strong>Status:</strong> {application.status}</p>

      <div>
        <h2 className="text-lg font-semibold mt-4">Video Profile</h2>
        {candidate.videoProfile && (
          <video src={candidate.videoProfile} controls className="w-full mt-2 rounded-lg" />
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-4">ID / Resume</h2>
        {candidate.idUpload && (
          <a href={candidate.idUpload} target="_blank" className="text-blue-500 hover:underline">
            View Document
          </a>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={() => updateStatus("accepted")} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Accept
        </button>
        <button onClick={() => updateStatus("rejected")} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Reject
        </button>
        <button onClick={() => updateStatus("shortlisted")} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
          Shortlist
        </button>
      </div>
    </div>
  );
}
