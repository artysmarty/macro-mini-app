// components/challenges/challenge-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, Coins, Trophy, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { Challenge } from "@/types";

// Mock challenges - will be replaced with API data
const mockChallenges: Challenge[] = [
  {
    id: "1",
    creatorUserId: "user1",
    name: "30 Day Weight Loss Challenge",
    description: "Lose 5% body weight in 30 days",
    durationWeeks: 4,
    goalType: "weight_loss_percent",
    entryStakeAmount: "100",
    entryStakeToken: "project_token",
    rules: { targetWeightLossPercent: 5 },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    potSize: "5000",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type Filter = "all" | "active" | "open" | "my-challenges";

interface ChallengeListProps {
  onCreateClick: () => void;
}

export function ChallengeList({ onCreateClick }: ChallengeListProps) {
  const router = useRouter();
  const [challenges] = useState<Challenge[]>(mockChallenges);
  const [filter, setFilter] = useState<Filter>("all");

  const filteredChallenges = challenges.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.status === "active";
    if (filter === "open") return c.status === "open";
    return false;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "open", label: "Open" },
    { id: "my-challenges", label: "My Challenges" },
  ];

  return (
    <div className="flex min-h-screen flex-col pb-24">
      {/* Filter Pills */}
      <div className="border-b border-gray-300 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-card dark:text-gray-400 dark:hover:bg-dark-hover"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards */}
      <main className="flex-1 space-y-3 p-4">
        {filteredChallenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-300 bg-white p-12 text-center shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
            <Trophy className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-dark-text">
              No challenges found
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Join or create a fitness challenge with friends and compete to win rewards.
            </p>
            <button
              onClick={onCreateClick}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Create Challenge
            </button>
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onClick={() => router.push(`/challenges/${challenge.id}`)}
            />
          ))
        )}
      </main>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: () => void;
}

function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const [joining, setJoining] = useState(false);
  const timeRemaining = formatDistanceToNow(challenge.endDate, { addSuffix: true });
  const participantCount = 12; // Mock - replace with API data

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setJoining(true);
    // TODO: Connect wallet and stake tokens
    // TODO: Call ChallengePot.joinChallenge() via OnchainKit
    setTimeout(() => {
      setJoining(false);
      alert("Joined challenge! (Demo - implement on-chain staking)");
    }, 2000);
  };

  return (
    <div
      onClick={onClick}
      className="w-full rounded-xl border border-gray-300 bg-white p-4 text-left shadow-card transition-all hover:border-primary hover:shadow-lg dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark dark:hover:border-primary cursor-pointer"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-dark-text">
            {challenge.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
        </div>
        <span
          className={`ml-3 rounded-full px-3 py-1 text-xs font-medium ${
            challenge.status === "active"
              ? "bg-success/20 text-success"
              : "bg-primary/20 text-primary"
          }`}
        >
          {challenge.status}
        </span>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-dark-text">
              {participantCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">participants</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-dark-text">
              {timeRemaining.split(" ")[0]}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">left</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-warning" />
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-dark-text">
              {challenge.potSize}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">FIT</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-dark-hover">
        <div>
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Entry Stake</div>
          <div className="text-base font-bold text-gray-900 dark:text-dark-text">
            {challenge.entryStakeAmount} {challenge.entryStakeToken === "project_token" ? "FIT" : "USDC"}
          </div>
        </div>
        <button
          onClick={handleJoin}
          disabled={joining || (challenge.status !== "open" && challenge.status !== "active")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {joining ? "Joining..." : "Join"}
          {!joining && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
