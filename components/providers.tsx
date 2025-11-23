// components/providers.tsx
"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { base } from "viem/chains";
import { config } from "@/lib/wagmi-config";
import { useState, useEffect } from "react";
import { useAuthenticate } from "@/hooks/use-authenticate";
import { AuthContext } from "@/contexts/auth-context";
import { sdk } from "@farcaster/miniapp-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  // Authenticate user when app opens
  const authState = useAuthenticate();

  // Call ready() to signal to Base/Farcaster that the app has loaded
  useEffect(() => {
    async function initializeSDK() {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        if (isInMiniApp) {
          // Signal that the mini app is ready
          await sdk.actions.ready();
          console.log("Mini app ready signal sent");
        }
      } catch (error) {
        console.error("Error initializing SDK ready state:", error);
      }
    }
    initializeSDK();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ""}
            chain={base}
          >
            {children}
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AuthContext.Provider>
  );
}

