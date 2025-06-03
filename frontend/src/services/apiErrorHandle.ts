// frontend/src/services/apiErrorHandler.ts

import { AxiosError } from 'axios';

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

/**
 * Handles API errors and provides user-friendly error messages
 * Includes special handling for authentication errors
 */
export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
            case 401:
                return {
                    message: 'Authentication required. Please log in again.',
                    status: 401,
                    code: 'UNAUTHORIZED'
                };
            case 403:
                return {
                    message: 'You do not have permission to access this resource.',
                    status: 403,
                    code: 'FORBIDDEN'
                };
            case 404:
                return {
                    message: 'The requested resource was not found.',
                    status: 404,
                    code: 'NOT_FOUND'
                };
            case 429:
                return {
                    message: 'Too many requests. Please try again later.',
                    status: 429,
                    code: 'RATE_LIMITED'
                };
            case 500:
                return {
                    message: 'Internal server error. Please try again later.',
                    status: 500,
                    code: 'INTERNAL_ERROR'
                };
            default:
                return {
                    message: message || 'An unexpected error occurred.',
                    status,
                    code: 'API_ERROR'
                };
        }
    }

    // Handle network errors
    if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
            return {
                message: 'Cannot connect to server. Please check your internet connection and try again.',
                code: 'NETWORK_ERROR'
            };
        }
        
        return {
            message: error.message,
            code: 'UNKNOWN_ERROR'
        };
    }

    return {
        message: 'An unknown error occurred.',
        code: 'UNKNOWN_ERROR'
    };
};

/**
 * Checks if an error is an authentication error
 */
export const isAuthError = (error: ApiError): boolean => {
    return error.status === 401 || error.code === 'UNAUTHORIZED';
};

/**
 * Checks if an error is a network connectivity error
 */
export const isNetworkError = (error: ApiError): boolean => {
    return error.code === 'NETWORK_ERROR';
};