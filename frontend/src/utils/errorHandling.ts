// frontend/src/utils/errorHandling.ts

/**
 * Error handling utilities for authentication and API interactions.
 * 
 * This module provides comprehensive error categorization and user-friendly
 * message generation to prevent technical errors from reaching end users.
 */

export interface ErrorResponse {
    success: false;
    message: string;
    code?: string;
    details?: any;
}

export interface SuccessResponse<T = any> {
    success: true;
    data?: T;
    message?: string;
}

export type APIResponse<T = any> = ErrorResponse | SuccessResponse<T>;

export enum ErrorCode {
    // Authentication Errors
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
    ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
    SESSION_EXPIRED = "SESSION_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    
    // Network Errors
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    TIMEOUT_ERROR = "TIMEOUT_ERROR",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    
    // Validation Errors
    INVALID_EMAIL = "INVALID_EMAIL",
    WEAK_PASSWORD = "WEAK_PASSWORD",
    MISSING_FIELDS = "MISSING_FIELDS",
    
    // Generic Errors
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
}

/**
 * Maps error codes to user-friendly messages.
 */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password. Please check your credentials and try again.",
    [ErrorCode.USER_NOT_FOUND]: "No account found with this email address. Please check your email or contact support.",
    [ErrorCode.ACCOUNT_LOCKED]: "Your account has been temporarily locked. Please contact support for assistance.",
    [ErrorCode.ACCOUNT_DISABLED]: "Your account has been disabled. Please contact support for assistance.",
    [ErrorCode.SESSION_EXPIRED]: "Your session has expired. Please log in again.",
    [ErrorCode.INVALID_TOKEN]: "Your session is invalid. Please log in again.",
    
    [ErrorCode.NETWORK_ERROR]: "Unable to connect to the server. Please check your internet connection and try again.",
    [ErrorCode.SERVER_ERROR]: "Server is currently unavailable. Please try again in a few moments.",
    [ErrorCode.TIMEOUT_ERROR]: "Request timed out. Please check your connection and try again.",
    [ErrorCode.CONNECTION_ERROR]: "Cannot connect to the server. Please ensure the backend service is running.",
    
    [ErrorCode.INVALID_EMAIL]: "Please enter a valid email address.",
    [ErrorCode.WEAK_PASSWORD]: "Password does not meet security requirements.",
    [ErrorCode.MISSING_FIELDS]: "Please fill in all required fields.",
    
    [ErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again.",
    [ErrorCode.FORBIDDEN]: "You don't have permission to perform this action.",
    [ErrorCode.NOT_FOUND]: "The requested resource was not found.",
};

/**
 * Safely extracts a string value from various error object structures.
 */
function safeGetErrorMessage(error: any): string {
    if (!error) return "";
    
    // Try various common error message properties
    const messagePaths = [
        error.message,
        error.error,
        error.details,
        error.description,
        error.statusText,
        error.data?.message,
        error.response?.data?.message,
        error.response?.statusText,
    ];
    
    for (const path of messagePaths) {
        if (typeof path === "string" && path.trim()) {
            return path.trim();
        }
    }
    
    // If error is a string itself
    if (typeof error === "string" && error.trim()) {
        return error.trim();
    }
    
    return "";
}

/**
 * Safely checks if an error object has properties indicating it's a network error.
 */
function isNetworkError(error: any): boolean {
    if (!error) return false;
    
    // Check common network error indicators
    const networkIndicators = [
        error.code === "ERR_NETWORK",
        error.code === "NETWORK_ERROR",
        error.name === "NetworkError",
        error.type === "network",
        Boolean(error.request && !error.response),
        error.code === "ECONNREFUSED",
        error.code === "ENOTFOUND",
        error.code === "ETIMEDOUT",
    ];
    
    return networkIndicators.some(Boolean);
}

/**
 * Safely checks if an error object represents a timeout.
 */
function isTimeoutError(error: any): boolean {
    if (!error) return false;
    
    const timeoutIndicators = [
        error.code === "ETIMEDOUT",
        error.code === "TIMEOUT",
        error.name === "TimeoutError",
        error.type === "timeout",
        Boolean(error.timeout),
    ];
    
    return timeoutIndicators.some(Boolean);
}

/**
 * Categorizes different types of errors and returns appropriate error codes.
 * Enhanced with robust error object handling.
 */
export function categorizeError(error: any): ErrorCode {
    // Handle null, undefined, or empty objects
    if (!error || (typeof error === "object" && Object.keys(error).length === 0)) {
        return ErrorCode.UNKNOWN_ERROR;
    }
    
    // Check for network errors first (most specific)
    if (isNetworkError(error)) {
        return ErrorCode.NETWORK_ERROR;
    }
    
    // Check for timeout errors
    if (isTimeoutError(error)) {
        return ErrorCode.TIMEOUT_ERROR;
    }
    
    // Get error message safely
    const errorMessage = safeGetErrorMessage(error).toLowerCase();
    
    // Handle string errors or extracted messages
    if (errorMessage) {
        // Authentication errors
        if (errorMessage.includes("invalid") && (
            errorMessage.includes("email") || 
            errorMessage.includes("password") || 
            errorMessage.includes("credentials")
        )) {
            return ErrorCode.INVALID_CREDENTIALS;
        }
        
        if (errorMessage.includes("user not found") || errorMessage.includes("user does not exist")) {
            return ErrorCode.USER_NOT_FOUND;
        }
        
        if (errorMessage.includes("account locked") || errorMessage.includes("locked")) {
            return ErrorCode.ACCOUNT_LOCKED;
        }
        
        if (errorMessage.includes("account disabled") || errorMessage.includes("disabled")) {
            return ErrorCode.ACCOUNT_DISABLED;
        }
        
        if (errorMessage.includes("session expired") || errorMessage.includes("token expired")) {
            return ErrorCode.SESSION_EXPIRED;
        }
        
        if (errorMessage.includes("invalid token") || errorMessage.includes("unauthorized")) {
            return ErrorCode.INVALID_TOKEN;
        }
        
        // Network-related errors
        if (errorMessage.includes("network") || 
            errorMessage.includes("fetch") || 
            errorMessage.includes("connection") ||
            errorMessage.includes("connect")) {
            return ErrorCode.NETWORK_ERROR;
        }
        
        if (errorMessage.includes("timeout")) {
            return ErrorCode.TIMEOUT_ERROR;
        }
        
        // Server errors
        if (errorMessage.includes("server") || 
            errorMessage.includes("internal") ||
            errorMessage.includes("unavailable")) {
            return ErrorCode.SERVER_ERROR;
        }
        
        // Validation errors
        if (errorMessage.includes("validation") || 
            errorMessage.includes("required") ||
            errorMessage.includes("missing")) {
            return ErrorCode.MISSING_FIELDS;
        }
        
        if (errorMessage.includes("forbidden") || errorMessage.includes("permission")) {
            return ErrorCode.FORBIDDEN;
        }
    }
    
    // Handle HTTP response errors (axios-like or fetch-like)
    const status = error?.response?.status || error?.status;
    if (typeof status === "number") {
        switch (status) {
            case 400:
                return ErrorCode.MISSING_FIELDS;
            case 401:
                return ErrorCode.INVALID_CREDENTIALS;
            case 403:
                return ErrorCode.FORBIDDEN;
            case 404:
                return ErrorCode.USER_NOT_FOUND;
            case 408:
                return ErrorCode.TIMEOUT_ERROR;
            case 423:
                return ErrorCode.ACCOUNT_LOCKED;
            case 429:
                return ErrorCode.ACCOUNT_LOCKED; // Rate limited
            case 500:
            case 502:
            case 503:
            case 504:
                return ErrorCode.SERVER_ERROR;
            default:
                if (status >= 400 && status < 500) {
                    return ErrorCode.INVALID_CREDENTIALS;
                } else if (status >= 500) {
                    return ErrorCode.SERVER_ERROR;
                }
                return ErrorCode.UNKNOWN_ERROR;
        }
    }
    
    // Handle Error objects
    if (error instanceof Error) {
        // Already handled message above, check error types
        if (error.name === "TypeError" && errorMessage.includes("fetch")) {
            return ErrorCode.NETWORK_ERROR;
        }
        
        if (error.name === "AbortError") {
            return ErrorCode.TIMEOUT_ERROR;
        }
    }
    
    // Default case for unrecognized errors
    return ErrorCode.UNKNOWN_ERROR;
}

/**
 * Generates a user-friendly error message from any error type.
 * Enhanced with robust error object handling.
 */
export function getErrorMessage(error: any): string {
    if (!error) {
        return ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
    }
    
    // Try to get a specific message from the error
    const specificMessage = safeGetErrorMessage(error);
    if (specificMessage) {
        // Check if it's already a user-friendly message
        const errorCode = categorizeError(error);
        const standardMessage = ERROR_MESSAGES[errorCode];
        
        // If the error message is technical, use the standard message
        if (specificMessage.length > 200 || 
            specificMessage.includes("stack") || 
            specificMessage.includes("TypeError") ||
            specificMessage.includes("fetch") ||
            specificMessage.toLowerCase().includes("axios")) {
            return standardMessage;
        }
        
        // If it seems user-friendly, use it
        return specificMessage;
    }
    
    // Fallback to categorized message
    const errorCode = categorizeError(error);
    return ERROR_MESSAGES[errorCode];
}

/**
 * Creates a standardized error response object.
 * Enhanced with robust error handling for malformed error objects.
 */
export function createErrorResponse(error: any, customMessage?: string): ErrorResponse {
    const errorCode = categorizeError(error);
    
    // Use custom message if provided, otherwise get from error handling
    let message = customMessage;
    if (!message) {
        // Try to get a meaningful message from the error
        const errorMessage = safeGetErrorMessage(error);
        message = errorMessage || ERROR_MESSAGES[errorCode];
    }
    
    // Ensure we always have a message
    if (!message || typeof message !== "string") {
        message = ERROR_MESSAGES[errorCode];
    }
    
    const response: ErrorResponse = {
        success: false,
        message,
        code: errorCode,
    };
    
    // Only include details in development and if error is meaningful
    if (process.env.NODE_ENV === "development") {
        if (error && typeof error === "object" && Object.keys(error).length > 0) {
            response.details = {
                originalError: error,
                errorType: error.constructor?.name || typeof error,
                timestamp: new Date().toISOString(),
            };
        } else if (error) {
            response.details = {
                originalError: String(error),
                errorType: typeof error,
                timestamp: new Date().toISOString(),
            };
        }
    }
    
    return response;
}

/**
 * Creates a standardized success response object.
 */
export function createSuccessResponse<T>(data?: T, message?: string): SuccessResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

/**
 * Safe error handler that prevents sensitive information leakage.
 * This function sanitizes errors and ensures only user-friendly messages are returned.
 * Enhanced with robust error object handling and meaningful logging.
 */
export function safeErrorHandler(error: any): ErrorResponse {
    // Enhanced error logging with meaningful information
    const logError = () => {
        if (!error) {
            console.error("Error occurred: null/undefined error");
            return;
        }
        
        if (typeof error === "string") {
            console.error("Error occurred:", error);
            return;
        }
        
        if (typeof error === "object") {
            // Check if it's an empty object
            if (Object.keys(error).length === 0) {
                console.error("Error occurred: empty error object");
                return;
            }
            
            // Create a sanitized version for logging
            const errorInfo = {
                message: safeGetErrorMessage(error),
                type: error.constructor?.name || typeof error,
                code: error.code || error.status || error.response?.status,
                name: error.name,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            };
            
            // Remove undefined values for cleaner logging
            const cleanErrorInfo = Object.fromEntries(
                Object.entries(errorInfo).filter(([_, value]) => value !== undefined)
            );
            
            console.error("Error occurred:", cleanErrorInfo);
            return;
        }
        
        // Fallback for other types
        console.error("Error occurred:", String(error));
    };
    
    // Log the error with enhanced information
    logError();
    
    // Never expose sensitive error details in production
    if (process.env.NODE_ENV === "production") {
        const errorCode = categorizeError(error);
        return {
            success: false,
            message: ERROR_MESSAGES[errorCode],
            code: errorCode,
        };
    }
    
    // In development, include more details for debugging but still sanitized
    return createErrorResponse(error);
}

/**
 * Validates authentication-specific errors and provides context-aware messages.
 * Enhanced with robust error handling for authentication flows.
 */
export function handleAuthError(error: any): ErrorResponse {
    // Handle null/undefined/empty errors
    if (!error) {
        return {
            success: false,
            message: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
            code: ErrorCode.UNKNOWN_ERROR,
        };
    }
    
    const errorCode = categorizeError(error);
    
    // Special handling for authentication-specific errors with enhanced messages
    switch (errorCode) {
        case ErrorCode.NETWORK_ERROR:
        case ErrorCode.CONNECTION_ERROR:
            return {
                success: false,
                message: "Cannot connect to the authentication server. Please check if the backend service is running and try again.",
                code: errorCode,
            };
            
        case ErrorCode.SERVER_ERROR:
            return {
                success: false,
                message: "Authentication server is currently unavailable. Please try again in a few moments.",
                code: errorCode,
            };
            
        case ErrorCode.TIMEOUT_ERROR:
            return {
                success: false,
                message: "Authentication request timed out. Please check your connection and try again.",
                code: errorCode,
            };
            
        case ErrorCode.INVALID_CREDENTIALS:
            return {
                success: false,
                message: "Invalid email or password. Please check your credentials and try again.",
                code: errorCode,
            };
            
        case ErrorCode.USER_NOT_FOUND:
            return {
                success: false,
                message: "No account found with this email address. Please verify your email or contact support.",
                code: errorCode,
            };
            
        case ErrorCode.ACCOUNT_LOCKED:
            return {
                success: false,
                message: "Your account has been temporarily locked. Please contact support for assistance.",
                code: errorCode,
            };
            
        case ErrorCode.ACCOUNT_DISABLED:
            return {
                success: false,
                message: "Your account has been disabled. Please contact support for assistance.",
                code: errorCode,
            };
            
        case ErrorCode.SESSION_EXPIRED:
            return {
                success: false,
                message: "Your session has expired. Please log in again.",
                code: errorCode,
            };
            
        case ErrorCode.INVALID_TOKEN:
            return {
                success: false,
                message: "Your session is invalid. Please log in again.",
                code: errorCode,
            };
            
        case ErrorCode.FORBIDDEN:
            return {
                success: false,
                message: "You don't have permission to access this resource. Please contact support if you believe this is an error.",
                code: errorCode,
            };
            
        case ErrorCode.MISSING_FIELDS:
            return {
                success: false,
                message: "Please fill in all required fields and try again.",
                code: errorCode,
            };
            
        default:
            // Fallback to safe error handler for unhandled cases
            return safeErrorHandler(error);
    }
}