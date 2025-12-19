"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Mail, Phone } from "lucide-react";

export default function RecruiterProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || userData.role !== "recruiter") {
      alert("Please login as a recruiter");
      router.push("/login");
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Recruiter Profile</h1>

        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {user.companyName?.[0]?.toUpperCase() || user.recruiterName?.[0]?.toUpperCase() || "R"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.companyName || "Company Name"}</h2>
              <p className="text-gray-600">{user.recruiterName || "Recruiter"}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium">{user.companyName || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Recruiter Name</p>
                <p className="font-medium">{user.recruiterName || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email || user.companyEmail || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={() => router.push("/recruiter/dashboard")}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

