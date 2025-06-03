// frontend/src/utils/auth.ts

/**
 * JWT Authentication utility functions with cookie support
 * Handles login, logout, and user session management using HTTP-only cookies
 */

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Check if user is currently authenticated by verifying with server
 * Since we use HTTP-only cookies, we can't check client-side
 */
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            credentials: 'include', // Include cookies in request
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
};

/**
 * Get current user information from server
 * Makes API call to get user data since we can't access HTTP-only cookies
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include', // Include cookies in request
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }

        return null;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};

/**
 * Login user with email and password
 * Server will set HTTP-only cookie on successful login
 */
export const login = async (email: string, password: string): Promise<{
    success: boolean;
    message: string;
    user?: User;
}> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include', // Include cookies in request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
    }
};

/**
 * Logout user by calling server endpoint
 * Server will clear the HTTP-only cookie
 */
export const logout = async (router?: any): Promise<void> => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies in request
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Logout error:', error);
        // Continue with redirect even if logout request fails
    }

    // Clear any client-side data (if you have any)
    if (typeof window !== 'undefined') {
        localStorage.removeItem('sidebar-expanded');
        localStorage.removeItem('user'); // Remove any cached user data
    }

    // Redirect to login page
    if (router) {
        router.push('/login');
    } else if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

/**
 * Make authenticated API request with automatic cookie inclusion
 */
export const authenticatedFetch = async (
    url: string, 
    options: RequestInit = {}
): Promise<Response> => {
    const defaultOptions: RequestInit = {
        credentials: 'include', // Always include cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Prepend API base URL if not already included
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    return fetch(fullUrl, defaultOptions);
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user?: User | null): string => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
        return user.firstName;
    } else if (user.lastName) {
        return user.lastName;
    } else {
        return user.email?.split('@')[0] || 'User';
    }
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user?: User | null): string => {
    if (!user) return 'U';
    
    if (user.firstName && user.lastName) {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.firstName) {
        return user.firstName.charAt(0).toUpperCase();
    } else if (user.lastName) {
        return user.lastName.charAt(0).toUpperCase();
    } else if (user.email) {
        return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
};