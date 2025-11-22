// app/onboarding/page.tsx
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <MainLayout>
      <OnboardingWizard />
    </MainLayout>
  );
}

