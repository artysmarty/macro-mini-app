// components/profile/friends-section.tsx
"use client";

import { useState } from "react";
import { Users, UserPlus, UserMinus } from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";

interface Friend {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  status: "friend" | "follower" | "following" | "pending";
}

// Mock friends - will be replaced with API data from Base social graph
const mockFriends: Friend[] = [
  {
    fid: 1234,
    username: "alice_fitness",
    displayName: "Alice",
    pfpUrl: undefined,
    status: "friend",
  },
  {
    fid: 5678,
    username: "bob_macro",
    displayName: "Bob",
    pfpUrl: undefined,
    status: "follower",
  },
];

export function FriendsSection() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);

  const handleInviteFriend = async () => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      const text = "Join me on Macro Tracker - let's hit our fitness goals together! 💪";
      
      if (isInMiniApp) {
        sdk.actions.composeCast({
          text,
          embeds: [window.location.origin],
        });
      } else {
        const url = `https://farcaster.com/~/compose?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error inviting friend:", error);
    }
  };

  const handleRemoveFriend = (fid: number) => {
    setFriends(friends.filter((f) => f.fid !== fid));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold">Friends & Followers</h3>
        </div>
        <button
          onClick={handleInviteFriend}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      </div>

      {friends.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <Users className="mx-auto mb-2 h-12 w-12 text-gray-400" />
          <p className="mb-4 text-sm">No friends yet. Invite someone to join!</p>
          <button
            onClick={handleInviteFriend}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Invite Friends
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.fid}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                {friend.pfpUrl ? (
                  <img
                    src={friend.pfpUrl}
                    alt={friend.displayName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {friend.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium">{friend.displayName}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    @{friend.username}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {friend.status === "follower" && (
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    Follows you
                  </span>
                )}
                {friend.status === "friend" && (
                  <button
                    onClick={() => handleRemoveFriend(friend.fid)}
                    className="rounded-lg p-1 text-gray-400 hover:text-red-600"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

