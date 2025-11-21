// lib/wagmi-config.ts
import { createConfig, http } from "wagmi";
import { base } from "viem/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { baseAccount } from "wagmi/connectors";

// Wagmi config with Farcaster Mini App and Base Account connectors
export const config = createConfig({
  chains: [base],
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: "Macro Tracker",
      appLogoUrl: `${typeof window !== "undefined" ? window.location.origin : "https://macro-tracker.vercel.app"}/icon.png`,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

