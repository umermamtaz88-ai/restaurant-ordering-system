"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { tokenStore } from "@/lib/token-store";
import type {
  AuthTokens,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  signup: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function applySession(data: AuthTokens) {
  tokenStore.setSession(data.access_token, data.refresh_token, data.user);
  return data.user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const access = tokenStore.getAccessToken();
    if (!access) {
      setUser(null);
      return;
    }
    try {
      const response = await authService.me();
      if (response.data) {
        setUser(response.data);
        const refresh = tokenStore.getRefreshToken();
        if (refresh) {
          tokenStore.setSession(access, refresh, response.data);
        }
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        tokenStore.clear();
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    // Show cached session immediately — don't block the UI on /me
    const cached = tokenStore.getUser();
    if (cached) {
      setUser(cached);
      setIsLoading(false);
    }

    const access = tokenStore.getAccessToken();
    if (!access) {
      setIsLoading(false);
      return;
    }

    void (async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    if (!response.data) {
      throw new ApiError(response.message || "Login failed", 401);
    }
    const nextUser = applySession(response.data);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.signup(payload);
    if (!response.data) {
      throw new ApiError(response.message || "Signup failed", 400);
    }
    const nextUser = applySession(response.data);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefreshToken();
    try {
      if (refresh && tokenStore.getAccessToken()) {
        await authService.logout(refresh);
      }
    } catch {
      // Always clear local session even if revoke fails
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      logout,
      refreshUser,
      setUser,
    }),
    [user, isLoading, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
