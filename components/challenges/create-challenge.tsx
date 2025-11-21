// components/challenges/create-challenge.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useAccount } from "wagmi";
import type { Challenge } from "@/types";

interface CreateChallengeProps {
  onBack: () => void;
  onCreated: () => void;
}

export function CreateChallenge({ onBack, onCreated }: CreateChallengeProps) {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationWeeks: 4,
    goalType: "weight_loss_percent" as Challenge["goalType"],
    entryStakeAmount: "",
    entryStakeToken: "project_token" as "project_token" | "usdc",
    targetWeightLossPercent: "",
    requiredMacroDaysPerWeek: "",
    maxParticipants: "",
    minParticipants: "",
  });

  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // TODO: Call ChallengePot.createChallenge() smart contract
      // TODO: Save challenge metadata to backend
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Challenge created! (Demo - implement smart contract call)");
      onCreated();
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div>
        <h2 className="text-2xl font-bold">Create Challenge</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set up a new fitness challenge with tokenized rewards
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Challenge Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            placeholder="e.g., 30 Day Weight Loss Challenge"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            rows={3}
            placeholder="Describe the challenge goals and rules..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Duration (weeks) *</label>
          <input
            type="number"
            required
            min={1}
            max={52}
            value={formData.durationWeeks}
            onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Goal Type *</label>
          <select
            value={formData.goalType}
            onChange={(e) => setFormData({ ...formData, goalType: e.target.value as any })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="weight_loss_percent">Weight Loss (%)</option>
            <option value="macro_adherence_days">Macro Adherence Days</option>
            <option value="activity_based">Activity Based</option>
          </select>
        </div>

        {formData.goalType === "weight_loss_percent" && (
          <div>
            <label className="mb-2 block text-sm font-medium">Target Weight Loss (%)</label>
            <input
              type="number"
              value={formData.targetWeightLossPercent}
              onChange={(e) => setFormData({ ...formData, targetWeightLossPercent: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g., 5"
            />
          </div>
        )}

        {formData.goalType === "macro_adherence_days" && (
          <div>
            <label className="mb-2 block text-sm font-medium">Required Macro Days Per Week</label>
            <input
              type="number"
              min={1}
              max={7}
              value={formData.requiredMacroDaysPerWeek}
              onChange={(e) => setFormData({ ...formData, requiredMacroDaysPerWeek: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g., 5"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Entry Stake Amount *</label>
            <input
              type="number"
              required
              value={formData.entryStakeAmount}
              onChange={(e) => setFormData({ ...formData, entryStakeAmount: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Stake Token *</label>
            <select
              value={formData.entryStakeToken}
              onChange={(e) => setFormData({ ...formData, entryStakeToken: e.target.value as any })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="project_token">FIT Token</option>
              <option value="usdc">USDC</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Min Participants</label>
            <input
              type="number"
              min={2}
              value={formData.minParticipants}
              onChange={(e) => setFormData({ ...formData, minParticipants: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Max Participants</label>
            <input
              type="number"
              min={2}
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Optional"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {creating ? "Creating..." : "Create Challenge"}
        </button>
      </form>
    </div>
  );
}

