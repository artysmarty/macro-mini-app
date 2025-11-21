// components/profile/achievements-section.tsx
"use client";

import { Trophy, Flame, Target, Calendar } from "lucide-react";
import { ShareAchievement } from "@/components/sharing/share-achievement";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: Date;
  value: string;
}

// Mock achievements - will be replaced with API data
const achievements: Achievement[] = [
  {
    id: "streak-30",
    title: "30 Day Streak",
    description: "Hit your macros for 30 days straight",
    icon: <Flame className="h-6 w-6" />,
    unlocked: true,
    unlockedAt: new Date("2024-01-30"),
    value: "30 days",
  },
  {
    id: "weight-loss-5",
    title: "5lb Milestone",
    description: "Lost 5 pounds toward your goal",
    icon: <Target className="h-6 w-6" />,
    unlocked: true,
    unlockedAt: new Date("2024-01-25"),
    value: "5 lbs",
  },
  {
    id: "weekly-perfect",
    title: "Perfect Week",
    description: "Hit macros every day for a week",
    icon: <Calendar className="h-6 w-6" />,
    unlocked: true,
    unlockedAt: new Date("2024-01-15"),
    value: "7/7 days",
  },
  {
    id: "streak-60",
    title: "60 Day Streak",
    description: "Hit your macros for 60 days straight",
    icon: <Flame className="h-6 w-6" />,
    unlocked: false,
    value: "45/60 days",
  },
];

export function AchievementsSection() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-card dark:shadow-card-dark">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Achievements</h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl border-2 p-3 transition-all ${
              achievement.unlocked
                ? "border-success/50 bg-success/10 dark:bg-success/5"
                : "border-gray-300 bg-gray-100 opacity-60 dark:border-dark-border dark:bg-dark-hover"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div
                className={
                  achievement.unlocked
                    ? "text-success"
                    : "text-gray-400 dark:text-gray-600"
                }
              >
                {achievement.icon}
              </div>
            </div>
            <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-dark-text">
              {achievement.title}
            </h4>
            <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
              {achievement.description}
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium">
                {achievement.unlocked ? (
                  <span className="text-success">
                    ✓ {achievement.value}
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">{achievement.value}</span>
                )}
              </div>
              {achievement.unlocked && (
                <ShareAchievement
                  achievement={{
                    title: achievement.title,
                    description: achievement.description,
                    type: achievement.id.includes("streak")
                      ? "streak"
                      : achievement.id.includes("weight")
                      ? "weight"
                      : "milestone",
                    value: achievement.value,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
