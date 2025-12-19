"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Hide user info when on auth-related pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold">
          Job<span className="text-primary">Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Conditional check to hide profile on login page */}
          {user && !isAuthPage ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
    <span className="text-sm font-bold text-zinc-900 leading-tight">
  {user?.name || user?.fullName || user?.recruiterName || "User"}
</span>
                <span className="text-[11px] mt-1 font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 capitalize">
                  {user.role}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="border border-zinc-200 gap-2">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className={pathname === "/login" ? "hidden" : ""}>Login</Button>
              </Link>
              <Link href="/signup">
                <Button className={pathname === "/signup" ? "hidden" : ""}>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}