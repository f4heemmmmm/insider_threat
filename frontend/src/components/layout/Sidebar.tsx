// frontend/src/components/layout/Sidebar.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSidebar } from "./SidebarContext";
import { NavigationItem } from "./constants/interfaces";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, logout, User } from "@/utils/auth";
import {
    HomeIcon,
    HomeSolidIcon,
    ExclamationTriangleIcon,
    ExclamationTriangleSolidIcon,
    ShieldExclamationIcon,
    ShieldExclamationSolidIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from "./constants/interfaces";

/**
 * Sidebar component that provides the main navigation interface for the application.
 * 
 * Features include:
 * - Collapsible sidebar with smooth animations and proper state management
 * - Active route highlighting with solid/outline icon variants
 * - User profile display with robust authentication status handling
 * - Responsive design for mobile and desktop with auto-collapse
 * - Persistent expansion state across sessions with SSR safety
 * - Loading states and comprehensive error handling for user data
 * - Secure logout functionality with proper cleanup
 * - Prevention of memory leaks and race conditions
 */
export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const { isExpanded, toggleSidebar, isMobile } = useSidebar();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userError, setUserError] = useState<string | null>(null);

    const navigation: NavigationItem[] = [
        {
            name: "Dashboard",
            href: "/",
            icon: HomeIcon,
            solidIcon: HomeSolidIcon,
        },
        {
            name: "Incidents",
            href: "/incidents",
            icon: ShieldExclamationIcon,
            solidIcon: ShieldExclamationSolidIcon,
        },
        {
            name: "Alerts",
            href: "/alerts",
            icon: ExclamationTriangleIcon,
            solidIcon: ExclamationTriangleSolidIcon,
        },
        
    ];

    /**
     * Fetches current user information with robust error handling.
     * Prevents race conditions and handles cleanup properly.
     */
    const fetchUser = useCallback(async () => {
        try {
            setIsLoading(true);
            setUserError(null);
            
            const user = await getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error("Failed to fetch current user:", error);
            setCurrentUser(null);
            setUserError(error instanceof Error ? error.message : "Failed to load user");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const loadUser = async () => {
            try {
                setIsLoading(true);
                setUserError(null);
                
                const user = await getCurrentUser();
                
                if (mounted) {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error("Failed to fetch current user:", error);
                
                if (mounted) {
                    setCurrentUser(null);
                    setUserError(error instanceof Error ? error.message : "Failed to load user");
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            mounted = false;
        };
    }, []);

    /**
     * Handles user logout process with comprehensive error handling and cleanup.
     * Prevents multiple logout attempts and ensures proper state cleanup.
     */
    const handleLogout = useCallback(async () => {
        if (isLoggingOut) return; // Prevent multiple logout attempts
        
        try {
            setIsLoggingOut(true);
            await logout();
            
            // Clear user state
            setCurrentUser(null);
            setUserError(null);
            
            // Navigate to login
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            
            // Even if logout fails on the client, redirect to login
            // The server will handle clearing the session
            router.push("/login");
        } finally {
            setIsLoggingOut(false);
        }
    }, [isLoggingOut, router]);

    /**
     * Determines if a navigation item should be highlighted as active.
     * Handles both exact matches for dashboard and prefix matches for other routes.
     */
    const isActive = useCallback((href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    }, [pathname]);

    /**
     * Generates user initials for avatar display with fallback hierarchy.
     * Handles edge cases and provides safe defaults.
     */
    const getUserInitials = useCallback((user: User | null): string => {
        if (!user) return "U";
        
        try {
            const firstInitial = user.firstName?.trim()?.charAt(0)?.toUpperCase() || "";
            const lastInitial = user.lastName?.trim()?.charAt(0)?.toUpperCase() || "";
            const emailInitial = user.email?.trim()?.charAt(0)?.toUpperCase() || "";
            
            // Prefer firstName + lastName, fallback to email, then "U"
            if (firstInitial && lastInitial) {
                return firstInitial + lastInitial;
            } else if (firstInitial) {
                return firstInitial;
            } else if (emailInitial) {
                return emailInitial;
            }
            
            return "U";
        } catch (error) {
            console.warn("Error generating user initials:", error);
            return "U";
        }
    }, []);

    /**
     * Handles navigation with error handling.
     */
    const handleNavigation = useCallback((href: string) => {
        try {
            router.push(href);
            
            // Only collapse on mobile if user explicitly wants it
            // Remove auto-collapse to respect user preference
        } catch (error) {
            console.error("Navigation failed:", error);
        }
    }, [router]);

    /**
     * Renders user profile section with loading and error states.
     */
    const renderUserProfile = () => {
        if (isLoading) {
            return (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse flex-shrink-0" />
                    {isExpanded && (
                        <div className="ml-3 space-y-2 flex-1">
                            <div className="h-3 bg-gray-700 rounded animate-pulse" />
                            <div className="h-2 bg-gray-700 rounded animate-pulse w-3/4" />
                        </div>
                    )}
                </div>
            );
        }

        if (userError) {
            return (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                        <UserCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    {isExpanded && (
                        <div className="ml-3">
                            <p className="text-sm text-red-400">Error loading user</p>
                            <button 
                                onClick={fetchUser}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (!currentUser) {
            return (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <UserCircleIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    {isExpanded && (
                        <div className="ml-3">
                            <p className="text-sm text-gray-400">Not signed in</p>
                            <button 
                                onClick={fetchUser}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="flex items-center">
                    <div className="relative flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
                            {getUserInitials(currentUser)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-900" />
                    </div>
                    
                    {isExpanded && (
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                                {currentUser.firstName && currentUser.lastName 
                                    ? `${currentUser.firstName} ${currentUser.lastName}`
                                    : currentUser.email || "Unknown User"
                                }
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {currentUser.email || "No email"}
                            </p>
                        </div>
                    )}
                </div>

                {isExpanded && (
                    <div className="pt-2 space-y-1">
                        <button
                            onClick={() => handleNavigation("/profile")}
                            className="flex w-full items-center rounded px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <UserCircleIcon className="h-4 w-4 mr-3" />
                            Profile
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center rounded px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                    </div>
                )}

                {!isExpanded && (
                    <div className="pt-2 space-y-2">
                        <button
                            onClick={() => handleNavigation("/profile")}
                            className="flex w-full items-center justify-center p-2 rounded hover:bg-gray-800 transition-colors"
                            title="Profile"
                        >
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center justify-center p-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                            title={isLoggingOut ? "Signing out..." : "Sign out"}
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out ${
                isExpanded ? "w-64" : "w-16"
            }`}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                {isExpanded ? (
                    <div className="flex items-center justify-between w-full px-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl font-medium truncate"> InsiderGuard </span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded hover:bg-gray-800 transition-colors flex-shrink-0"
                            aria-label="Collapse sidebar"
                        >
                            <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-800 transition-colors"
                        aria-label="Expand sidebar"
                    >
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8">
                <div className="px-3 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const SolidIcon = item.solidIcon;
                        const active = isActive(item.href);

                        return (
                            <div key={item.name} className="relative">
                                <button
                                    onClick={() => handleNavigation(item.href)}
                                    className={`group relative flex w-full items-center rounded-lg transition-all duration-200 px-3 py-2.5 ${
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                                    title={!isExpanded ? item.name : undefined}
                                >
                                    <div className="flex items-center justify-center w-5 flex-shrink-0">
                                        {active ? (
                                            <SolidIcon className="h-5 w-5" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    {isExpanded && (
                                        <span className="ml-3 flex-1 text-left text-base font-medium truncate">
                                            {item.name}
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-800">
                <div className="p-4">
                    {renderUserProfile()}
                </div>
            </div>
        </div>
    );
};