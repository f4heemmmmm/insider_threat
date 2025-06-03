// frontend/src/components/layout/AuthenticatedLayout.tsx

"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { MainContent } from "@/components/layout/MainContent";
import { AuthenticatedLayoutProps } from "./constants/interfaces";
import { SidebarProvider } from "@/components/layout/SidebarContext";

/**
 * AuthenticatedLayout component that manages authentication state and layout structure.
 * 
 * This component handles:
 * - Authentication verification and redirection logic
 * - Periodic authentication checks to maintain session validity
 * - Loading states during authentication verification
 * - Conditional rendering of sidebar layout vs login page layout
 * - Automatic routing between authenticated and unauthenticated states
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

    useEffect(() => {
        let mounted = true;

        /**
         * Verifies user authentication status and handles routing logic.
         * Redirects authenticated users away from login page and vice versa.
         */
        const checkAuth = async () => {
            try {
                const isAuth = await isAuthenticated();
                
                if (!mounted) return;
                
                if (isAuth) {
                    setAuthState("authenticated");
                    
                    if (pathname === "/login") {
                        router.push("/");
                        return;
                    }
                } else {
                    setAuthState("unauthenticated");
                    
                    if (pathname !== "/login") {
                        router.push("/login");
                        return;
                    }
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

        const authCheckInterval = setInterval(checkAuth, 5 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(authCheckInterval);
        };
    }, [pathname, router]);

    if (authState === "loading") {
        return (
            <div className = "flex h-screen w-full items-center justify-center bg-gray-100">
                <div className = "text-center">
                    <div className = "inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
                    <p className = "mt-4 text-lg font-semibold text-gray-700"> Loading... </p>
                </div>
            </div>
        );
    }

    if (pathname === "/login") {
        return <div className = "min-h-screen bg-gray-50"> {children} </div>;
    }

    if (authState === "unauthenticated") {
        return null;
    }

    return (
        <SidebarProvider>
            <div className = "min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className = "flex-1">
                    <MainContent>
                        {children}
                    </MainContent>
                </div>
            </div>
        </SidebarProvider>
    );
};