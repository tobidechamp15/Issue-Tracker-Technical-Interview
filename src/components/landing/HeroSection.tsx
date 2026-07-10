import Link from "next/link";
import BrowserFrame from "./BrowserFrame";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50">
      {/* Background gradient blob */}
      <div
        className="absolute top-0 right-0 -z-10 translate-x-1/4 -translate-y-1/4"
        aria-hidden="true"
      >
        <div className="w-[800px] h-[800px] rounded-full bg-indigo-200 opacity-40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase mb-4">
              Issue Tracking, Simplified
            </p>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Track issues.
              <br />
              Ship faster.
            </h1>

            {/* Supporting paragraph */}
            <p className="mt-6 text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Create, assign, prioritize, and resolve issues with a clean
              dashboard that shows what actually needs attention. Built for
              teams that want to move fast without losing track.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/register"
                className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right: Browser frame */}
          <div className="lg:rotate-1">
            <BrowserFrame />
          </div>
        </div>
      </div>
    </section>
  );
}
