// frontend/src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getCurrentUser, logout, User } from '@/utils/auth';
import { useRouter } from 'next/navigation';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const isAuth = await isAuthenticated();
      
      if (isAuth) {
        const user = await getCurrentUser();
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          error: null,
        });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout(router);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still update state even if logout request fails
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
      router.push('/login');
    }
  }, [router]);

  const refreshAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
    
    // Set up periodic auth checks (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAuth]);

  return {
    ...authState,
    logout: handleLogout,
    refreshAuth,
  };
};