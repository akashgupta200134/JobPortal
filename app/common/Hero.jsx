import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-7xl ml-10 px-6 py-24">
        {/* Text Content */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="max-w-5xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
            Get Hired for Your Skills. <br />
            <span className="text-primary">
              Hire Talent That Delivers.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            A smart job portal connecting skilled professionals with trusted recruiters.
            Fast hiring. Verified talent. Real opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
            {/* Candidate / Job Seeker Signup */}
            <Link href="/signup/jobseeker">
              <Button size="lg" className="px-8">
                Apply for Jobs
              </Button>
            </Link>

            {/* Recruiter Signup */}
            <Link href="/signup/recruiter">
              <Button
                size="lg"
                variant="outline"
                className="px-8"
              >
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
