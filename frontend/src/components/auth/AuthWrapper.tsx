// frontend/src/components/auth/AuthWrapper.tsx

"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { AuthWrapperProps } from "./constants/interface";
import { useRouter, usePathname } from "next/navigation";

/**
 * AuthWrapper component that provides authentication verification and routing control.
 * 
 * This wrapper component handles:
 * - Authentication state verification on route changes
 * - Automatic redirection based on authentication status
 * - Loading states during authentication verification
 * - Error handling for authentication failures
 * - Component cleanup to prevent memory leaks
 * 
 * The component ensures that unauthenticated users are redirected to the login page
 * and authenticated users are redirected away from the login page to the dashboard.
 * It provides a seamless authentication flow throughout the application.
 */
export default function AuthWrapper({ children }: AuthWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

    useEffect(() => {
        let mounted = true;

        /**
         * Verifies user authentication status and handles routing logic.
         * 
         * This function performs the following operations:
         * - Checks authentication status with the server
         * - Updates component state based on authentication result
         * - Redirects unauthenticated users to login page
         * - Redirects authenticated users away from login page to dashboard
         * - Handles authentication errors gracefully
         */
        const checkAuth = async () => {
            try {
                const isAuth = await isAuthenticated();
                
                if (!mounted) return;
                
                const newAuthState = isAuth ? "authenticated" : "unauthenticated";
                setAuthState(newAuthState);
                
                if (!isAuth && pathname !== "/login") {
                    console.log("User not authenticated, redirecting to login...");
                    router.push("/login");
                } else if (isAuth && pathname === "/login") {
                    console.log("User already authenticated, redirecting to dashboard...");
                    router.push("/");
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                if (!mounted) return;
                
                setAuthState("unauthenticated");
                if (pathname !== "/login") {
                    router.push("/login");
                }
            }
        };

        checkAuth();

        return () => {
            mounted = false;
        };
    }, [pathname, router]);

    if (authState === "loading") {
        return (
            <div className = "flex h-screen w-full items-center justify-center bg-gray-100">
                <div className = "text-center">
                    <div className = "inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
                    <p className = "mt-4 text-lg font-semibold text-gray-700"> Verifying authentication... </p>
                </div>
            </div>
        );
    }
    return <>{children}</>;
};