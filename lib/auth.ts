// lib/auth.ts
// Quick Auth utilities for authentication

import { sdk } from "@farcaster/miniapp-sdk";

export interface AuthenticatedUser {
  fid: number;
  token: string;
}

/**
 * Authenticate user with Quick Auth
 * Note: Quick Auth is available via sdk.quickAuth when opened in mini app
 */
export async function authenticateUser(): Promise<AuthenticatedUser | null> {
  try {
    const isInMiniApp = await sdk.isInMiniApp();
    if (!isInMiniApp) {
      // Not in mini app, return null (context API should be used instead)
      return null;
    }

    // Get token from Quick Auth
    const { token } = await sdk.quickAuth.getToken();
    
    // Verify token with backend
    const response = await sdk.quickAuth.fetch(`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    const data = await response.json();
    return {
      fid: data.fid,
      token,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  // Check if token exists in memory/localStorage
  // In production, verify token validity
  return typeof window !== "undefined" && !!localStorage.getItem("auth_token");
}

/**
 * Sign out user
 */
export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_fid");
  }
}

