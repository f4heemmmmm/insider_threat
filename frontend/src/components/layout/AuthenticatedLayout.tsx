// frontend/src/components/layout/AuthenticatedLayout.tsx

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { isAuthenticated } from "@/utils/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { MainContent } from "@/components/layout/MainContent";
import { AuthenticatedLayoutProps } from "./constants/interfaces";
import { SidebarProvider } from "@/components/layout/SidebarContext";

type AuthState = "loading" | "authenticated" | "unauthenticated";

/**
 * AuthenticatedLayout component that manages authentication state and layout structure.
 * 
 * This component handles:
 * - Authentication verification and redirection logic with race condition prevention
 * - Periodic authentication checks to maintain session validity
 * - Loading states during authentication verification with proper cleanup
 * - Conditional rendering of sidebar layout vs login page layout
 * - Automatic routing between authenticated and unauthenticated states
 * - SSR-safe authentication handling with proper hydration
 * - Memory leak prevention and component cleanup
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [authState, setAuthState] = useState<AuthState>("loading");
    const mountedRef = useRef(true);
    const authIntervalRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Verifies user authentication status and handles routing logic.
     * Prevents race conditions and handles cleanup properly.
     */
    const checkAuth = useCallback(async () => {
        if (!mountedRef.current) return;

        try {
            const isAuth = await isAuthenticated();
            
            if (!mountedRef.current) return;
            
            if (isAuth) {
                setAuthState("authenticated");
                
                // Redirect authenticated users away from login page
                if (pathname === "/login") {
                    router.push("/");
                }
            } else {
                setAuthState("unauthenticated");
                
                // Redirect unauthenticated users to login page
                if (pathname !== "/login") {
                    router.push("/login");
                }
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            
            if (!mountedRef.current) return;
            
            setAuthState("unauthenticated");
            
            // On auth error, redirect to login unless already there
            if (pathname !== "/login") {
                router.push("/login");
            }
        }
    }, [pathname, router]);

    /**
     * Sets up periodic authentication checks with proper cleanup.
     */
    const setupAuthInterval = useCallback(() => {
        // Clear existing interval
        if (authIntervalRef.current) {
            clearInterval(authIntervalRef.current);
        }

        // Set up new interval (check every 5 minutes)
        authIntervalRef.current = setInterval(checkAuth, 5 * 60 * 1000);
    }, [checkAuth]);

    /**
     * Initial authentication check and interval setup.
     */
    useEffect(() => {
        mountedRef.current = true;

        // Initial auth check
        checkAuth();

        // Set up periodic checks
        setupAuthInterval();

        return () => {
            mountedRef.current = false;
            
            // Cleanup interval
            if (authIntervalRef.current) {
                clearInterval(authIntervalRef.current);
                authIntervalRef.current = null;
            }
        };
    }, [checkAuth, setupAuthInterval]);

    /**
     * Handle route changes - verify auth when route changes.
     */
    useEffect(() => {
        if (mountedRef.current) {
            checkAuth();
        }
    }, [pathname, checkAuth]);

    /**
     * Cleanup on unmount.
     */
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (authIntervalRef.current) {
                clearInterval(authIntervalRef.current);
            }
        };
    }, []);

    // Loading state
    if (authState === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
                    <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    // Login page layout
    if (pathname === "/login") {
        return (
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        );
    }

    // Unauthenticated state - show nothing while redirecting
    if (authState === "unauthenticated") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
                    <p className="mt-2 text-sm text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    // Authenticated layout
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 relative">
                    <MainContent>
                        {children}
                    </MainContent>
                </div>
            </div>
        </SidebarProvider>
    );
};