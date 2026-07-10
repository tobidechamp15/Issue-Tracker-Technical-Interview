"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      {!isLanding && <NavBar />}
      {children}
    </>
  );
}
