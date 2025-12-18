export default function RecruiterLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-6">
        <h2 className="text-xl font-bold mb-6">Recruiter Panel</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/recruiter/dashboard" className="text-gray-700 hover:text-black">Dashboard</a>
          <a href="/recruiter/jobs/create" className="text-gray-700 hover:text-black">Create Job</a>
          <a href="/recruiter/jobs/manage" className="text-gray-700 hover:text-black">Manage Jobs</a>
          <a href="/recruiter/applications" className="text-gray-700 hover:text-black">Applications</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
