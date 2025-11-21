// hooks/use-minikit.ts
"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function useComposeCast() {
  const composeCast = useCallback(async (options: { text: string; embeds?: (string | { url: string })[] }) => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      if (isInMiniApp) {
        sdk.actions.composeCast(options);
      } else {
        // Fallback for browser
        const url = `https://farcaster.com/~/compose?text=${encodeURIComponent(options.text)}`;
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error composing cast:", error);
    }
  }, []);

  return composeCast;
}

