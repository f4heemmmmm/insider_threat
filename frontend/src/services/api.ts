// frontend/src/services/api.ts

import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // CRITICAL: Include cookies in all requests
    timeout: 10000, // 10 second timeout
});

// Request interceptor to ensure credentials are always included
api.interceptors.request.use(
    (config) => {
        // Ensure credentials are always sent with requests
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized responses
        if (error.response?.status === 401) {
            console.log('Authentication failed, redirecting to login...');
            
            // Clear any stored user data
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('sidebar-expanded');
            }
            
            // Only redirect if we're not already on the login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;