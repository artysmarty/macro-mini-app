// components/onboarding/onboarding-wizard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProfileStep } from "./profile-step";
import { GoalStep } from "./goal-step";
import { MacroStep } from "./macro-step";
import { MeasurementsStep } from "./measurements-step";
import { PhotoStep } from "./photo-step";
import type { User, BodyMeasurements } from "@/types";
import { calculateMacros } from "@/lib/macro-calculator";

interface OnboardingData {
  profile: Partial<User>;
  measurements?: BodyMeasurements;
  photo?: File;
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    profile: {},
  });

  const totalSteps = 5;

  const updateProfile = (updates: Partial<User>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const updateMeasurements = (measurements: BodyMeasurements) => {
    setData((prev) => ({ ...prev, measurements }));
  };

  const updatePhoto = (photo: File) => {
    setData((prev) => ({ ...prev, photo }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Calculate macros if not manually set
      if (!data.profile.goal || data.profile.weight || data.profile.height) {
        const user = data.profile as User;
        if (user.weight && user.height && user.age && user.gender && user.goal) {
          const macros = calculateMacros(user);
          // TODO: Save to API
        }
      }

      // TODO: Save profile, measurements, photo to API
      // TODO: Mark onboarding as complete

      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!(
          data.profile.age &&
          data.profile.height &&
          data.profile.weight &&
          data.profile.gender
        );
      case 2:
        return !!data.profile.goal && !!data.profile.activityLevel;
      case 3:
        return true; // Macros can be calculated or manual
      case 4:
        return true; // Measurements optional
      case 5:
        return true; // Photo optional
      default:
        return false;
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {step === 1 && <ProfileStep data={data.profile} onUpdate={updateProfile} />}
        {step === 2 && <GoalStep data={data.profile} onUpdate={updateProfile} />}
        {step === 3 && <MacroStep data={data.profile} onUpdate={updateProfile} />}
        {step === 4 && (
          <MeasurementsStep
            data={data.measurements}
            onUpdate={updateMeasurements}
          />
        )}
        {step === 5 && <PhotoStep data={data.photo} onUpdate={updatePhoto} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50 dark:border-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50 hover:bg-blue-700"
        >
          {step === totalSteps ? "Complete" : "Next"}
          {step < totalSteps && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

