// components/sdk-ready.tsx
"use client";

import { useEffect } from "react";

/**
 * Component that calls sdk.actions.ready() immediately when mounted
 * This is required for Base/Farcaster mini app integration
 */
export function SDKReady() {
  useEffect(() => {
    // Use dynamic import to ensure SDK is available
    const initializeSDK = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Wait for SDK to be fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log("[SDKReady] SDK imported, attempting ready() call...");
        
        // Try calling ready() directly
        await sdk.actions.ready();
        console.log("[SDKReady] ✅ Ready signal sent successfully");
        
        // Also try multiple times as a fallback
        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log("[SDKReady] ✅ Ready signal sent again (confirm)");
          } catch (e) {
            // Silent fail on confirm
          }
        }, 1000);
      } catch (error: any) {
        console.error("[SDKReady] ❌ Error:", error?.message || error);
        console.error("[SDKReady] Error details:", error);
        
        // Retry after delay
        setTimeout(async () => {
          try {
            const { sdk } = await import("@farcaster/miniapp-sdk");
            await sdk.actions.ready();
            console.log("[SDKReady] ✅ Ready signal sent on retry");
          } catch (retryError: any) {
            console.error("[SDKReady] ❌ Retry failed:", retryError?.message || retryError);
          }
        }, 1000);
      }
    };
    
    // Call immediately when component mounts
    initializeSDK();
  }, []);

  // Also try to call ready() when window loads
  useEffect(() => {
    const handleLoad = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
        console.log("[SDKReady] ✅ Ready signal sent on window load");
      } catch (error) {
        // Silent fail
      }
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("load", handleLoad);
      // Also try immediately if already loaded
      if (document.readyState === "complete") {
        handleLoad();
      }
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}

