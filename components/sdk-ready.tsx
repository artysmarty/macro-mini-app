// components/sdk-ready.tsx
"use client";

import { useEffect } from "react";

/**
 * Component that calls sdk.actions.ready() immediately when mounted
 * This is required for Base/Farcaster mini app integration
 */
export function SDKReady() {
  useEffect(() => {
    // Log that component mounted
    console.log("[SDKReady] Component mounted, starting initialization...");
    
    // Use dynamic import to ensure SDK is available
    const initializeSDK = async () => {
      try {
        console.log("[SDKReady] Starting SDK import...");
        
        // Dynamic import to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        console.log("[SDKReady] SDK imported successfully:", !!sdk);
        console.log("[SDKReady] SDK actions available:", !!sdk?.actions);
        
        // Check if we're in a mini app
        try {
          const isInMiniApp = await sdk.isInMiniApp();
          console.log("[SDKReady] isInMiniApp:", isInMiniApp);
        } catch (checkError) {
          console.error("[SDKReady] Error checking isInMiniApp:", checkError);
        }
        
        // Wait for SDK to be fully initialized
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log("[SDKReady] Attempting ready() call...");
        
        // Try calling ready() directly
        await sdk.actions.ready();
        console.log("[SDKReady] ✅✅✅ Ready signal sent successfully! ✅✅✅");
        
        // Also try multiple times as a fallback
        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log("[SDKReady] ✅ Ready signal sent again (confirm)");
          } catch (e: any) {
            console.error("[SDKReady] Confirm ready() failed:", e?.message || e);
          }
        }, 1000);
      } catch (error: any) {
        console.error("[SDKReady] ❌❌❌ CRITICAL ERROR:", error?.message || error);
        console.error("[SDKReady] Error stack:", error?.stack);
        console.error("[SDKReady] Full error object:", error);
        
        // Retry after delay
        setTimeout(async () => {
          try {
            console.log("[SDKReady] Retrying after error...");
            const { sdk } = await import("@farcaster/miniapp-sdk");
            await sdk.actions.ready();
            console.log("[SDKReady] ✅ Ready signal sent on retry");
          } catch (retryError: any) {
            console.error("[SDKReady] ❌ Retry failed:", retryError?.message || retryError);
            console.error("[SDKReady] Retry error stack:", retryError?.stack);
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
      console.log("[SDKReady] Window load event fired");
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
        console.log("[SDKReady] ✅ Ready signal sent on window load");
      } catch (error: any) {
        console.error("[SDKReady] Window load ready() failed:", error?.message || error);
      }
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("load", handleLoad);
      // Also try immediately if already loaded
      if (document.readyState === "complete") {
        console.log("[SDKReady] Document already complete, calling ready() immediately");
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

