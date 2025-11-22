// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AppBar } from "@/components/layout/app-bar";
import { Settings } from "lucide-react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AchievementsSection } from "@/components/profile/achievements-section";
import { NFTsSection } from "@/components/profile/nfts-section";
import { WorkoutsSection } from "@/components/profile/workouts-section";
import { TokenBalance } from "@/components/profile/token-balance";
import { FriendsSection } from "@/components/profile/friends-section";
import { SettingsModal } from "@/components/profile/settings-modal";
import { NFTEarnedModal } from "@/components/sharing/nft-earned-modal";
import { useNFTEarned } from "@/hooks/use-nft-earned";
import { MiniAppCard } from "@/components/profile/miniapp-card";

type ProfileTab = "overview" | "workouts" | "friends";

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const { earnedNFT, clearEarnedNFT, checkForRecentNFT } = useNFTEarned();

  // Check for recently earned NFT on mount
  useEffect(() => {
    checkForRecentNFT();
  }, [checkForRecentNFT]);

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "workouts", label: "Workouts" },
    { id: "friends", label: "Friends" },
  ];

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col">
        <AppBar
          title="My Profile"
          rightAction="settings"
          onRightActionClick={() => setShowSettings(true)}
        />

        <main className="flex-1 pb-24">
          {/* Profile Header */}
          <div className="border-b border-gray-300 bg-white px-4 py-4 dark:border-dark-border dark:bg-dark-bg">
            <ProfileHeader />
          </div>

          {/* Segmented Tabs */}
          <div className="border-b border-gray-300 bg-white px-4 dark:border-dark-border dark:bg-dark-bg">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 border-b-2 pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4 p-4">
            {activeTab === "overview" && (
              <>
                <MiniAppCard />
                <TokenBalance />
                <AchievementsSection />
                <AwardsSection />
              </>
            )}
            {activeTab === "workouts" && <WorkoutsSection />}
            {activeTab === "friends" && <FriendsSection />}
          </div>
        </main>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {earnedNFT && <NFTEarnedModal nft={earnedNFT} onClose={clearEarnedNFT} />}
    </MainLayout>
  );
}

// Renamed NFTsSection to AwardsSection for display
function AwardsSection() {
  return <NFTsSection />;
}
