// contexts/auth-context.tsx
"use client";

import { createContext, useContext } from "react";

interface AuthState {
  token: string | null;
  fid: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthState>({
  token: null,
  fid: null,
  isAuthenticated: false,
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

