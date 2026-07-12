"use client";

import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

export default function LandingNav() {
  return (
    <nav className="bg-default border-b border-default sticky top-0 z-50">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
              IT
            </span>
            <span className="text-lg font-bold text-default">IssueTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted hover:text-default transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted hover:text-default transition-colors"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="text-sm text-muted hover:text-default transition-colors"
            >
              Docs
            </a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
