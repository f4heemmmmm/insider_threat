// frontend/src/utils/auth.ts

import { handleAuthError, safeErrorHandler, createSuccessResponse, createErrorResponse, type APIResponse } from './errorHandling';

/**
 * JWT Authentication utilities with secure HTTP-only cookie support.
 * 
 * Provides comprehensive authentication functionality including:
 * - Server-side authentication verification with HTTP-only cookie validation
 * - User session management with secure cookie-based data retrieval
 * - Login/logout operations with automatic cookie handling and cleanup
 * - Authenticated API request wrapper with automatic credential inclusion
 * - User display utilities for UI presentation and avatar generation
 * - Client-side storage cleanup for complete session termination
 * - Graceful error handling without exceptions
 */

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
    code?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Checks if the current user is authenticated by verifying the HTTP-only cookie.
 * 
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.ok;
    } catch (error) {
        console.error("Authentication check failed:", error);
        return false;
    }
};

/**
 * Retrieves the current authenticated user's information.
 * 
 * @returns Promise<User | null> - User object if authenticated, null otherwise
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
};

/**
 * Authenticates a user with email and password.
 * Returns a structured response instead of throwing errors for better error handling.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise<LoginResponse> - Structured response with success/error information
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle HTTP error responses gracefully
            const errorResponse = handleAuthError({
                response: {
                    status: response.status,
                    data: data
                }
            });

            return {
                success: false,
                message: errorResponse.message,
                code: errorResponse.code,
            };
        }

        // Successful login
        return {
            success: true,
            message: data.message || "Login successful",
            user: data.user,
        };

    } catch (error: any) {
        console.error("Login error:", error);
        
        // Handle network errors and other exceptions gracefully
        const errorResponse = handleAuthError(error);
        
        return {
            success: false,
            message: errorResponse.message,
            code: errorResponse.code,
        };
    }
};

/**
 * Logs out the current user and cleans up session data.
 * Always attempts cleanup even if server logout fails.
 * 
 * @param router - Optional Next.js router for navigation
 */
export const logout = async (router?: any): Promise<void> => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Logout error:", error);
        // Continue with cleanup even if server logout fails
    }

    // Always perform client-side cleanup
    if (typeof window !== "undefined") {
        // Clear any stored user data
        localStorage.removeItem("sidebar-expanded");
        localStorage.removeItem("user");
        
        // Clear any other application-specific data
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith("auth_") || key.startsWith("user_") || key.startsWith("session_"))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (storageError) {
            console.warn("Error clearing localStorage:", storageError);
        }
    }

    // Navigate to login page
    if (router) {
        router.push("/login");
    } else if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
};

/**
 * Wrapper for fetch requests that automatically includes authentication credentials.
 * 
 * @param url - Request URL (can be relative or absolute)
 * @param options - Fetch options
 * @returns Promise<Response> - Fetch response
 */
export const authenticatedFetch = async (
    url: string, 
    options: RequestInit = {}
): Promise<Response> => {
    const defaultOptions: RequestInit = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };
    
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    return fetch(fullUrl, defaultOptions);
};

/**
 * Enhanced authenticated fetch that returns structured responses.
 * 
 * @param url - Request URL
 * @param options - Fetch options
 * @returns Promise<APIResponse> - Structured response with error handling
 */
export const authenticatedRequest = async <T = any>(
    url: string,
    options: RequestInit = {}
): Promise<APIResponse<T>> => {
    try {
        const response = await authenticatedFetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            const errorResponse = safeErrorHandler({
                response: {
                    status: response.status,
                    data: data
                }
            });
            return errorResponse;
        }

        return createSuccessResponse(data);
    } catch (error) {
        const errorResponse = safeErrorHandler(error);
        return errorResponse;
    }
};

/**
 * Generates a display name for the user.
 * 
 * @param user - User object
 * @returns string - User's display name
 */
export const getUserDisplayName = (user?: User | null): string => {
    if (!user) return "User";
    
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
        return user.firstName;
    } else if (user.lastName) {
        return user.lastName;
    } else {
        return user.email?.split("@")[0] || "User";
    }
};

/**
 * Generates initials for the user (for avatars, etc.).
 * 
 * @param user - User object
 * @returns string - User's initials
 */
export const getUserInitials = (user?: User | null): string => {
    if (!user) return "U";
    
    if (user.firstName && user.lastName) {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.firstName) {
        return user.firstName.charAt(0).toUpperCase();
    } else if (user.lastName) {
        return user.lastName.charAt(0).toUpperCase();
    } else if (user.email) {
        return user.email.charAt(0).toUpperCase();
    }
    return "U";
};

/**
 * Validates if a user has required authentication properties.
 * 
 * @param user - User object to validate
 * @returns boolean - True if user is valid
 */
export const isValidUser = (user?: User | null): user is User => {
    return !!(user && user.id && user.email);
};

/**
 * Gets user avatar URL or generates initials-based avatar data.
 * 
 * @param user - User object
 * @returns object - Avatar information
 */
export const getUserAvatar = (user?: User | null) => {
    const initials = getUserInitials(user);
    const displayName = getUserDisplayName(user);
    
    return {
        initials,
        displayName,
        // You can add avatar URL logic here if you have user profile images
        avatarUrl: null,
        fallbackInitials: initials,
    };
};