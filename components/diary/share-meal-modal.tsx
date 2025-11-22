// components/diary/share-meal-modal.tsx
"use client";

import { useState } from "react";
import { X, Share2, Check, Copy, UserPlus } from "lucide-react";
import { useComposeCast } from "@/hooks/use-minikit";

import { format } from "date-fns";

interface ShareMealModalProps {
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  entries: any[];
  onClose: () => void;
  date?: Date; // Optional date, defaults to today
}

const mealLabels: Record<ShareMealModalProps["mealType"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

export function ShareMealModal({ mealType, entries, onClose, date }: ShareMealModalProps) {
  const [copied, setCopied] = useState(false);
  const composeCast = useComposeCast();
  const label = mealLabels[mealType];
  const targetDate = date || new Date();
  const dateStr = format(targetDate, "yyyy-MM-dd");

  const generateShareLink = () => {
    // Create a shareable link for the meal with date
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const mealId = `${mealType}-${dateStr}`;
    return `${baseUrl}/shared/meal/${mealId}`;
  };

  const handleCopyLink = async () => {
    const link = generateShareLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareToText = async () => {
    const link = generateShareLink();
    const shareData = {
      title: `Check out my ${label} meal`,
      text: `Check out my ${label} meal`,
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await handleCopyLink();
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleShareToFriends = async () => {
    const link = generateShareLink();
    const text = `Check out my ${label} meal\n${link}`;
    
    if (composeCast) {
      await composeCast({
        text,
        embeds: [link],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Share {label}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={handleShareToText}
            className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share via Text</span>
          </button>

          <button
            onClick={handleShareToFriends}
            className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <UserPlus className="h-5 w-5" />
            <span className="font-medium">Share to Friends</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="font-medium">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

