// components/settings/health-integrations.tsx
"use client";

import { useState } from "react";
import { Activity, Check, X } from "lucide-react";

interface HealthProvider {
  id: "apple_health" | "google_fit" | "garmin" | "fitbit";
  name: string;
  icon: string;
  connected: boolean;
}

const providers: HealthProvider[] = [
  { id: "apple_health", name: "Apple Health", icon: "🍎", connected: false },
  { id: "google_fit", name: "Google Fit", icon: "📱", connected: false },
  { id: "garmin", name: "Garmin Connect", icon: "⌚", connected: false },
  { id: "fitbit", name: "Fitbit", icon: "💪", connected: false },
];

export function HealthIntegrations() {
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

  const handleConnect = async (providerId: string) => {
    // TODO: Implement OAuth flow for each provider
    alert(`${providerId} integration - Connect via OAuth (TODO: Implement)`);
    setConnectedProviders([...connectedProviders, providerId]);
  };

  const handleDisconnect = (providerId: string) => {
    setConnectedProviders(connectedProviders.filter((id) => id !== providerId));
    alert(`${providerId} disconnected`);
  };

  const handleSync = async (providerId: string) => {
    // TODO: Call syncHealthData from lib/health-integrations.ts
    alert(`Syncing data from ${providerId}... (TODO: Implement)`);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Health Integrations</h3>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Connect your fitness devices and apps to automatically sync weight and activity data.
      </p>

      <div className="space-y-3">
        {providers.map((provider) => {
          const isConnected = connectedProviders.includes(provider.id);
          return (
            <div
              key={provider.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {isConnected ? "Connected" : "Not connected"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleSync(provider.id)}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Sync
                    </button>
                    <button
                      onClick={() => handleDisconnect(provider.id)}
                      className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(provider.id)}
                    className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
        <p className="font-semibold">Privacy:</p>
        <p>We only sync weight and activity data. All data is stored securely and used only for tracking your progress.</p>
      </div>
    </div>
  );
}

