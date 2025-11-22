// components/sharing/share-achievement.tsx
"use client";

import { Share2 } from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";

interface ShareAchievementProps {
  achievement: {
    id?: string;
    title: string;
    description: string;
    type: "streak" | "weight" | "milestone";
    value: string;
  };
}

export function ShareAchievement({ achievement }: ShareAchievementProps) {
  const generateShareLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const achievementId = achievement.id || `achievement-${Date.now()}`;
    return `${baseUrl}/shared/achievement/${achievementId}`;
  };

  const handleShare = async () => {
    try {
      const emoji = {
        streak: "🔥",
        weight: "🎯",
        milestone: "🏆",
      }[achievement.type];

      const shareLink = generateShareLink();

      const text = `${emoji} ${achievement.title} - ${achievement.description}\n\nJust unlocked this achievement in Macro Tracker! 💪\n\nTrack your macros, earn rewards, and join challenges on Base.`;

      const isInMiniApp = await sdk.isInMiniApp();
      
      if (isInMiniApp) {
        // Use SDK action for mini app with shareable link as embed
        sdk.actions.composeCast({
          text,
          embeds: [shareLink],
        });
      } else {
        // Fallback for browser
        const url = `https://farcaster.com/~/compose?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error sharing achievement:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
    >
      <Share2 className="mr-2 inline h-4 w-4" />
      Share
    </button>
  );
}

