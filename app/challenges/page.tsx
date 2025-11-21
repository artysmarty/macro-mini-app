// app/challenges/page.tsx
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { AppBar } from "@/components/layout/app-bar";
import { ChallengeList } from "@/components/challenges/challenge-list";

export default function ChallengesPage() {
  const handleNewChallenge = () => {
    // TODO: Open create challenge modal/form
    console.log("Create new challenge");
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col">
        <AppBar
          title="Challenges"
          rightAction={
            <button
              onClick={handleNewChallenge}
              className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-dark-hover"
            >
              <span className="text-xl">+</span>
            </button>
          }
        />
        <ChallengeList onCreateClick={handleNewChallenge} />
      </div>
    </MainLayout>
  );
}
