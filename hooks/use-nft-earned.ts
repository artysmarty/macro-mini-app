// hooks/use-nft-earned.ts
"use client";

import { useState, useCallback } from "react";

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

export function useNFTEarned() {
  const [earnedNFT, setEarnedNFT] = useState<ProgressNFT | null>(null);

  const triggerNFTEarned = useCallback((nft: ProgressNFT) => {
    setEarnedNFT(nft);
    // Store in sessionStorage to persist across page reloads
    if (typeof window !== "undefined") {
      sessionStorage.setItem("recently-earned-nft", JSON.stringify(nft));
    }
  }, []);

  const clearEarnedNFT = useCallback(() => {
    setEarnedNFT(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("recently-earned-nft");
    }
  }, []);

  // Check for recently earned NFT on mount
  const checkForRecentNFT = useCallback(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("recently-earned-nft");
      if (stored) {
        try {
          const nft = JSON.parse(stored);
          // Convert date string back to Date object
          nft.unlockedAt = new Date(nft.unlockedAt);
          setEarnedNFT(nft);
        } catch (error) {
          console.error("Error parsing stored NFT:", error);
          sessionStorage.removeItem("recently-earned-nft");
        }
      }
    }
  }, []);

  return {
    earnedNFT,
    triggerNFTEarned,
    clearEarnedNFT,
    checkForRecentNFT,
  };
}

