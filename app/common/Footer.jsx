import { Button } from "@/components/ui/button";
import { Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <header className="sticky top-0 z-50 w-full border-t bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/*//logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-zinc-900">
            Job<span className="text-primary">Portal</span>
          </span>
        </div>
        <p>Built By @Akash Gupta</p>

        <div className="flex items-center   gap-5">
          <Link href="/">
            <Github />
          </Link>

          <Link href="/">
            <Instagram />
          </Link>

          <Link href="/">
            <Twitter />
          </Link>
        </div>
      </div>
    </header>
  );
}
