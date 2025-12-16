'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData } from '@/lib/api';

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo, redirectIfFound = false } = options;
  const router = useRouter();
  
  const {
    user,
    token,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    fetchUser,
    clearError,
    isAuthenticated,
    isAdmin,
  } = useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  // Handle redirects based on auth state
  useEffect(() => {
    if (!redirectTo || isLoading) return;

    const authenticated = isAuthenticated();
    
    if (
      // If redirectTo is set, redirect if the user was not found
      (redirectTo && !redirectIfFound && !authenticated) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && authenticated)
    ) {
      router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, isLoading, isAuthenticated, router]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    await storeLogin(credentials);
  }, [storeLogin]);

  const register = useCallback(async (data: RegisterData) => {
    await storeRegister(data);
  }, [storeRegister]);

  const logout = useCallback(() => {
    storeLogout();
    router.push('/');
  }, [storeLogout, router]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    register,
    logout,
    clearError,
  };
}

// Hook for protecting routes that require authentication
export function useRequireAuth(redirectTo = '/auth/login') {
  return useAuth({ redirectTo, redirectIfFound: false });
}

// Hook for protecting routes that should not be accessible when authenticated
export function useRedirectIfAuthenticated(redirectTo = '/account') {
  return useAuth({ redirectTo, redirectIfFound: true });
}

// Hook for admin-only routes
export function useRequireAdmin(redirectTo = '/') {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && !auth.isAdmin) {
      router.push(redirectTo);
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.isAdmin, router, redirectTo]);

  return auth;
}
