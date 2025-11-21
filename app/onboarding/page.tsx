// app/onboarding/page.tsx
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useAccount } from "wagmi";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // TODO: Check if user has completed onboarding
  // If yes, redirect to dashboard

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-6 p-6">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold">Welcome to Macro Tracker!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to continue.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <OnboardingWizard />
    </MainLayout>
  );
}

