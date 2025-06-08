// frontend/src/utils/auth.ts

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
 */

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

export const login = async (email: string, password: string): Promise<{
    success: boolean;
    message: string;
    user?: User;
}> => {
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
            throw new Error(data.message || "Login failed");
        }
        return data;
    } catch (error: any) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed");
    }
};

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
    }

    if (typeof window !== "undefined") {
        localStorage.removeItem("sidebar-expanded");
        localStorage.removeItem("user");
    }

    if (router) {
        router.push("/login");
    } else if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
};

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