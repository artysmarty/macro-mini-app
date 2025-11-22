// components/sharing/nft-earned-modal.tsx
"use client";

import { useState } from "react";
import { X, Image as ImageIcon, Share2 } from "lucide-react";
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

interface NFTEarnedModalProps {
  nft: ProgressNFT;
  onClose: () => void;
}

export function NFTEarnedModal({ nft, onClose }: NFTEarnedModalProps) {
  const [shared, setShared] = useState(false);

  const generateShareLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `${baseUrl}/shared/award/${nft.id}`;
  };

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

      const shareLink = generateShareLink();

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
        // Use SDK action for mini app with shareable link as embed
        sdk.actions.composeCast({
          text,
          embeds: nft.imageUrl ? [shareLink, nft.imageUrl] : [shareLink],
        });
      } else {
        // Fallback for browser
        const url = `https://farcaster.com/~/compose?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      }

      setShared(true);
    } catch (error) {
      console.error("Error sharing NFT:", error);
    }
  };

  const dateStr = new Date(nft.unlockedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">🎉 NFT Earned!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You&apos;ve unlocked a new Progress NFT
            </p>
          </div>

          {/* NFT Preview */}
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-purple-400 to-purple-600 dark:border-gray-700">
            <div className="aspect-square flex items-center justify-center">
              {nft.imageUrl && nft.imageUrl !== "/nft-placeholder.png" ? (
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-24 w-24 text-white opacity-50" />
              )}
            </div>
          </div>

          {/* NFT Details */}
          <div className="mb-6 space-y-2">
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Earned on {dateStr}
            </p>
            {Object.keys(nft.metadata.outcomeStats).length > 0 && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Stats:
                </p>
                <div className="space-y-1">
                  {Object.entries(nft.metadata.outcomeStats).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-xs text-gray-700 dark:text-gray-300"
                    >
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Share2 className="h-4 w-4" />
              Share NFT
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              View Later
            </button>
          </div>

          {shared && (
            <p className="mt-3 text-center text-xs text-green-600 dark:text-green-400">
              ✓ Shared to your feed!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
