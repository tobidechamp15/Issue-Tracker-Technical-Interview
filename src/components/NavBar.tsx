"use client";

import Link from "next/link";
import { Bell, HelpCircle } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "./ThemeToggle";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-default border-b border-default sticky top-0 z-50">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">

          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
              IT
            </span>
            <span className="text-base font-bold text-default">
              IssueTracker
            </span>
          </Link>


          <div className="flex items-center gap-3 shrink-0">
            {user && (
              <>
                <Link href="/dashboard" className="btn-ghost text-sm">
                  Dashboard
                </Link>
                <Link href="/issues" className="btn-ghost text-sm">
                  Issues
                </Link>
              </>
            )}


            {/* <button
              className="relative p-2.5 text-subtle hover:text-default rounded-lg hover:bg-surface-secondary transition-colors active:scale-[0.98]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              className="p-2.5 text-subtle hover:text-default rounded-lg hover:bg-surface-secondary transition-colors active:scale-[0.98]"
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button> */}
            <ThemeToggle />

            <div className="w-px h-8 bg-divider" />


            {user ? (
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size="md" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-default leading-tight">
                    {user.name}
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs text-muted hover:text-default transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
