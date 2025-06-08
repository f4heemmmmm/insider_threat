// frontend/src/hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { isAuthenticated, getCurrentUser, logout, User } from "@/utils/auth";

interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
}

/**
 * useAuth hook for comprehensive authentication state management.
 * 
 * Provides React authentication functionality including:
 * - Automatic authentication status checking with periodic verification
 * - User session management with current user data retrieval
 * - Secure logout handling with proper state cleanup and navigation
 * - Error handling for authentication failures and network issues
 * - Loading state management for UI responsiveness during auth operations
 * - Manual auth refresh capability for forced session validation
 */
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
            console.error("Auth check failed:", error);
            setAuthState({
                isLoading: false,
                isAuthenticated: false,
                user: null,
                error: error instanceof Error ? error.message : "Authentication failed",
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
            console.error("Logout failed:", error);
            setAuthState({
                isLoading: false,
                isAuthenticated: false,
                user: null,
                error: null,
            });
            router.push("/login");
        }
    }, [router]);

    const refreshAuth = useCallback(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        checkAuth();
        const interval = setInterval(checkAuth, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [checkAuth]);

    return {
        ...authState,
        logout: handleLogout,
        refreshAuth,
    };
};