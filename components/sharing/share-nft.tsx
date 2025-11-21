// components/sharing/share-nft.tsx
"use client";

import { Share2 } from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";

interface ProgressNFT {
  id: string;
  name: string;
  imageUrl?: string;
  unlockedAt: Date;
  metadata: {
    goalType: string;
    outcomeStats: Record<string, unknown>;
  };
  challengeId?: string;
}

interface ShareNFTProps {
  nft: ProgressNFT;
  variant?: "button" | "icon";
}

export function ShareNFT({ nft, variant = "icon" }: ShareNFTProps) {
  const handleShare = async () => {
    try {
      // Format outcome stats for display
      const statsText = Object.entries(nft.metadata.outcomeStats)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      // Determine emoji based on goal type
      const emojiMap: Record<string, string> = {
        weight_loss: "🎯",
        macro_adherence: "💪",
        challenge_winner: "🏆",
        monthly_milestone: "⭐",
        weekly_streak: "🔥",
      };

      const emoji = emojiMap[nft.metadata.goalType] || "🎉";

      const dateStr = new Date(nft.unlockedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let text = `${emoji} Just earned a Progress NFT!\n\n`;
      text += `🏆 ${nft.name}\n`;
      if (statsText) {
        text += `📊 ${statsText}\n`;
      }
      text += `📅 ${dateStr}\n\n`;
      text += `Celebrating my fitness journey on Macro Tracker! 💪\n\n`;
      text += `Track your macros, earn NFTs, and join challenges on Base.`;

      const isInMiniApp = await sdk.isInMiniApp();

      if (isInMiniApp) {
        // Use SDK action for mini app
        sdk.actions.composeCast({
          text,
          embeds: nft.imageUrl ? [window.location.origin, nft.imageUrl] : [window.location.origin],
        });
      } else {
        // Fallback for browser
        const url = `https://farcaster.com/~/compose?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error sharing NFT:", error);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <Share2 className="h-4 w-4" />
        Share NFT
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white opacity-0 transition-opacity hover:bg-blue-700 group-hover:opacity-100"
      title="Share NFT"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}

