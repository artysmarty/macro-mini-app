// components/profile/nfts-section.tsx
"use client";

import { Image as ImageIcon } from "lucide-react";
import { ShareNFT } from "@/components/sharing/share-nft";

interface ProgressNFT {
  id: string;
  name: string;
  imageUrl: string;
  challengeId?: string;
  unlockedAt: Date;
  metadata: {
    goalType: string;
    outcomeStats: Record<string, unknown>;
  };
}

// Mock NFTs - will be replaced with actual NFT data from contract
const mockNFTs: ProgressNFT[] = [
  {
    id: "1",
    name: "Monthly Milestone #1",
    imageUrl: "/nft-placeholder.png",
    unlockedAt: new Date("2024-01-31"),
    metadata: {
      goalType: "weight_loss",
      outcomeStats: { weightLost: "5 lbs", days: 30 },
    },
  },
  {
    id: "2",
    name: "Challenge Winner",
    imageUrl: "/nft-placeholder.png",
    challengeId: "challenge-1",
    unlockedAt: new Date("2024-01-28"),
    metadata: {
      goalType: "macro_adherence",
      outcomeStats: { adherenceScore: 95, rank: 1 },
    },
  },
];

export function NFTsSection() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold">Awards</h3>
        <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          {mockNFTs.length} collected
        </span>
      </div>

      {mockNFTs.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <ImageIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
          <p className="text-sm">No NFTs yet. Complete challenges to earn them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {mockNFTs.map((nft) => (
            <div
              key={nft.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600 relative flex items-center justify-center">
                {nft.imageUrl && nft.imageUrl !== "/nft-placeholder.png" ? (
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-white opacity-50" />
                )}
                {/* Share button appears on hover */}
                <div className="absolute right-2 top-2">
                  <ShareNFT nft={nft} variant="icon" />
                </div>
              </div>
              <div className="p-3">
                <h4 className="mb-1 text-sm font-semibold">{nft.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(nft.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

