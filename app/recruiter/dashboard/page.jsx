"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle, Users, Clock } from "lucide-react";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobs(data.jobs);
      });

    fetch("/api/applications")
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.applications);
      });
  }, []);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status !== "closed").length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === "applied").length;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Manage jobs and applications efficiently</p>
        </div>
        <Link
          href="/recruiter/jobs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90 transition"
        >
          + Post Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Jobs" value={totalJobs} icon={<Briefcase />} />
        <StatCard title="Active Jobs" value={activeJobs} icon={<CheckCircle />} />
        <StatCard title="Total Applications" value={totalApplications} icon={<Users />} />
        <StatCard title="Pending Reviews" value={pendingApplications} icon={<Clock />} />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <DashboardButton href="/recruiter/jobs/manage" label="Manage Jobs" />
        <DashboardButton href="/recruiter/applications" label="View Applications" variant="outline" />
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-gray-400">{icon}</div>
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight">{value}</h2>
    </div>
  );
}

function DashboardButton({ href, label, variant = "default" }) {
  const base = "rounded-xl px-5 py-2.5 text-sm font-medium transition";
  const styles = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {label}
    </Link>
  );
}
