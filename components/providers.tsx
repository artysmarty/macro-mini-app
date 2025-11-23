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
      // Wait for app to be fully mounted and initialized
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        // Always try to call ready() - Base preview tool and production both need this
        console.log("[SDK] Attempting to call ready()...");
        await sdk.actions.ready();
        console.log("✅ [SDK] Ready signal sent successfully");
      } catch (error: any) {
        console.error("❌ [SDK] Error calling ready():", error?.message || error);
        // Check if we're in a mini app environment for logging
        try {
          const isInMiniApp = await sdk.isInMiniApp();
          console.log("[SDK] isInMiniApp:", isInMiniApp);
        } catch (checkError) {
          console.error("[SDK] Could not check isInMiniApp:", checkError);
        }
      }
    }
    
    // Initialize after component mounts
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

