// hooks/use-authenticate.ts
"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface AuthState {
  token: string | null;
  fid: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Hook to authenticate user with Quick Auth when app opens
 * This automatically authenticates users when they open the mini app
 */
export function useAuthenticate() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    fid: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    async function authenticate() {
      try {
        // Check if we're in a mini app environment
        const isInMiniApp = await sdk.isInMiniApp();
        
        if (!isInMiniApp) {
          // Not in mini app, skip authentication
          setAuthState({
            token: null,
            fid: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // Get token from Quick Auth
        const { token } = await sdk.quickAuth.getToken();
        
        // Verify token with backend to get FID
        const backendUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const response = await sdk.quickAuth.fetch(`${backendUrl}/api/auth`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to verify token");
        }

        const data = await response.json();
        
        setAuthState({
          token,
          fid: data.fid,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Authentication failed:", error);
        // Authentication failed, but continue in read-only mode
        setAuthState({
          token: null,
          fid: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }

    authenticate();
  }, []);

  return authState;
}

