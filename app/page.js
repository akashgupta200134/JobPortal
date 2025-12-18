import HeroSection from "./common/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full  " />
      </div>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <HeroSection />
      </section>
    </main>
  );
}

