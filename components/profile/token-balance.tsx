// components/profile/token-balance.tsx
"use client";

import { useState } from "react";
import { Coins, TrendingUp } from "lucide-react";
import { useAccount } from "wagmi";

export function TokenBalance() {
  const { address } = useAccount();
  // TODO: Fetch actual token balance from contract
  const [balance] = useState("1,250.50");
  const [earned] = useState("1,050.00");
  const [staked] = useState("200.50");

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
      <div className="mb-4 flex items-center gap-2">
        <Coins className="h-5 w-5 text-warning" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Token Balance</h3>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl bg-gradient-to-r from-success to-primary p-5 text-white shadow-lg">
          <div className="text-sm opacity-90">Total FIT</div>
          <div className="text-3xl font-bold">{balance}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-success/10 p-3 dark:bg-success/5">
            <div className="mb-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Earned</span>
            </div>
            <div className="text-lg font-semibold text-success">
              {earned} FIT
            </div>
          </div>

          <div className="rounded-lg bg-primary/10 p-3 dark:bg-primary/5">
            <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Staked in Challenges</div>
            <div className="text-lg font-semibold text-primary">
              {staked} FIT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
