"use client";

/**
 * AuthContext
 * Manages authentication state and token persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import type { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load authentication state from localStorage on mount
   * Only runs on client-side (browser)
   */
  useEffect(() => {
    const loadAuth = async () => {
      // Skip if running on server
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedAccessToken && storedUser) {
          setAccessToken(storedAccessToken);
          setUser(JSON.parse(storedUser));

          // Validate token by fetching current user
          try {
            const currentUser = await apiClient.getMe(storedAccessToken);
            setUser(currentUser);
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
          } catch (error) {
            // Token invalid, try to refresh
            await refreshAuth();
          }
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  /**
   * Clear authentication state
   */
  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  /**
   * Save authentication state
   */
  const saveAuth = useCallback((user: User, accessToken: string, refreshToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }, []);

  /**
   * Login
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await apiClient.login({ email, password });
        saveAuth(response.user, response.accessToken, response.refreshToken);
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    [saveAuth, clearAuth]
  );

  /**
   * Register
   */
  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const response = await apiClient.register({ email, password, name });
        saveAuth(response.user, response.accessToken, response.refreshToken);
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    [saveAuth, clearAuth]
  );

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken && accessToken) {
          await apiClient.logout(refreshToken, accessToken);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  }, [accessToken, clearAuth]);

  /**
   * Refresh authentication using refresh token
   */
  const refreshAuth = useCallback(async () => {
    try {
      if (typeof window === "undefined") {
        throw new Error("Cannot refresh on server");
      }

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await apiClient.refreshToken({ refreshToken });

      // Update only tokens, keep user data
      setAccessToken(response.accessToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

      // Fetch updated user data
      const currentUser = await apiClient.getMe(response.accessToken);
      setUser(currentUser);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuth();
      throw error;
    }
  }, [clearAuth]);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
