// components/profile/profile-header.tsx
"use client";

import { useAccount } from "wagmi";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export function ProfileHeader() {
  const { address } = useAccount();
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        if (isInMiniApp) {
          const ctx = await sdk.context;
          setContext(ctx);
        }
      } catch (error) {
        console.error("Error loading context:", error);
      }
    };
    loadContext();
  }, []);

  const user = context?.user;
  const displayName = user?.displayName || user?.username || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "User");
  const pfpUrl = user?.pfpUrl;

  return (
    <div className="flex items-center gap-4">
      {pfpUrl ? (
        <img
          src={pfpUrl}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover border-2 border-primary"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white border-2 border-primary">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{displayName}</h2>
        {user?.username && (
          <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
        )}
        {user?.bio && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{user.bio}</p>
        )}
      </div>
      <button className="rounded-lg border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
        Edit Profile
      </button>
    </div>
  );
}

