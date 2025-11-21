// hooks/use-minikit.ts
"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function useComposeCast() {
  const composeCast = useCallback(async (options: { 
    text?: string; 
    embeds?: [] | [string] | [string, string];
    parent?: { type: "cast"; hash: string };
    close?: boolean;
    channelKey?: string;
  }) => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      if (isInMiniApp) {
        await sdk.actions.composeCast(options);
      } else {
        // Fallback for browser
        const text = options.text || "";
        const url = `https://farcaster.com/~/compose?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error composing cast:", error);
    }
  }, []);

  return composeCast;
}

