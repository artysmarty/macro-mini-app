// components/sharing/share-food.tsx
"use client";

import { useState } from "react";
import { Share2, Check, Copy, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useComposeCast } from "@/hooks/use-minikit";

interface ShareFoodProps {
  foodItem: {
    id: string;
    name: string;
    type: "food" | "meal" | "recipe";
    brand?: string;
    servingSize?: string;
    calories?: number;
  };
  variant?: "button" | "icon";
}

export function ShareFood({ foodItem, variant = "button" }: ShareFoodProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const composeCast = useComposeCast();

  const generateShareLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `${baseUrl}/shared/${foodItem.type}/${foodItem.id}`;
  };

  const handleCopyLink = async () => {
    const link = generateShareLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareToText = async () => {
    const link = generateShareLink();
    const shareData = {
      title: `Check out ${foodItem.name}`,
      text: `I found this ${foodItem.type}: ${foodItem.name}`,
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy
        await handleCopyLink();
      }
      setShowMenu(false);
    } catch (err) {
      // User cancelled or error
      console.error("Share failed:", err);
    }
  };

  const handleShareToFriends = async () => {
    const link = generateShareLink();
    const text = `Check out this ${foodItem.type}: ${foodItem.name}\n${link}`;
    
    if (composeCast) {
      await composeCast({
        text,
        embeds: [link],
      });
    }
    setShowMenu(false);
  };

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <Share2 className="h-4 w-4" />
        </button>
        
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-8 z-50 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="p-1">
                <button
                  onClick={handleShareToText}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                  Share via Text
                </button>
                <button
                  onClick={handleShareToFriends}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <UserPlus className="h-4 w-4" />
                  Share to Friends
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="p-1">
              <button
                onClick={handleShareToText}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Share2 className="h-4 w-4" />
                Share via Text
              </button>
              <button
                onClick={handleShareToFriends}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <UserPlus className="h-4 w-4" />
                Share to Friends
              </button>
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

