// components/onboarding/onboarding-guard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { OnboardingWizard } from "./onboarding-wizard";

// Helper function to get consistent userId
function getUserId(fid: number | null | undefined): string {
  if (fid) {
    return `fid-${fid}`;
  }
  if (typeof window !== 'undefined') {
    let devUserId = localStorage.getItem('devUserId');
    if (!devUserId) {
      devUserId = `fid-dev-${Date.now()}`;
      localStorage.setItem('devUserId', devUserId);
    }
    return devUserId;
  }
  return `fid-dev-${Date.now()}`;
}

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { fid, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      // Skip check if on onboarding page or auth is still loading
      if (pathname === "/onboarding" || authLoading) {
        setIsChecking(false);
        return;
      }

      // If no fid, allow access (for local dev)
      if (!fid) {
        setIsChecking(false);
        return;
      }

      try {
        const userId = getUserId(fid);
        const response = await fetch(`/api/users?fid=${fid}`);
        
        if (response.ok) {
          const user = await response.json();
          if (!user.onboardingCompleted) {
            setNeedsOnboarding(true);
          }
        } else {
          // User doesn't exist, needs onboarding
          setNeedsOnboarding(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // On error, allow access (fail open)
      } finally {
        setIsChecking(false);
      }
    }

    checkOnboarding();
  }, [fid, authLoading, pathname]);

  // Show loading state while checking
  if (isChecking || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if needed
  if (needsOnboarding && pathname !== "/onboarding") {
    router.replace("/onboarding");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">Redirecting to onboarding...</div>
        </div>
      </div>
    );
  }

  // Otherwise, show normal content
  return <>{children}</>;
}

