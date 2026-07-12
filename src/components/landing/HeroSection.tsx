import Link from "next/link";
import BrowserFrame from "./BrowserFrame";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-default border-b border-default">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="text-center lg:text-left">

            <p className="text-sm font-medium tracking-wide text-blue-700 uppercase mb-4">
              Issue Tracking, Simplified
            </p>


            <h1 className="text-4xl md:text-5xl font-bold text-default leading-tight tracking-tight">
              Track issues.
              <br />
              Ship faster.
            </h1>


            <p className="mt-6 text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Create, assign, prioritize, and resolve issues with a clean
              dashboard that shows what actually needs attention. Built for
              teams that want to move fast without losing track.
            </p>


            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/register"
                className="btn-primary w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="btn-secondary w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </div>
          </div>


          <div className="lg:rotate-1">
            <BrowserFrame />
          </div>
        </div>
      </div>
    </section>
  );
}
