// components/layout/main-layout.tsx
"use client";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { usePathname } from "next/navigation";

const noNavPaths = ["/onboarding", "/auth", "/settings"];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !noNavPaths.some((path) => pathname?.startsWith(path));

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-20">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}

