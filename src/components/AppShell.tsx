"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      {!isLanding && <NavBar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-default bg-default">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            
          </div>
          <p className="text-sm text-muted">
            &copy; {currentYear} IssueTracker, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
