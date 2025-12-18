import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
{/*//logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-zinc-900">
            Job<span className="text-primary">Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button>
            Get Started
          </Button>
        </div>

      </div>
    </header>
  )
}
