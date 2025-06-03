// frontend/src/app/login/page.tsx

"use client";

import { login } from "@/utils/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * LoginPage component that provides secure authentication interface for ENSIGN InfoSecurity users.
 * 
 * This component features:
 * - Email validation specific to @ensigninfosecurity.com domain
 * - Real-time form validation with detailed error messaging
 * - Password visibility toggle for improved user experience
 * - Loading states and comprehensive error handling
 * - Responsive design with modern UI aesthetics
 * - Accessibility features including proper ARIA labels and roles
 * - Browser autofill compatibility with custom styling
 * 
 * The component enforces strict email format requirements and provides
 * clear feedback for authentication errors and network connectivity issues.
 */
export default function LoginPage() {
    const router  =  useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Validates email address against ENSIGN InfoSecurity domain requirements.
     * 
     * Validation rules:
     * - Must end with @ensigninfosecurity.com
     * - Local part cannot be empty
     * - Only alphanumeric characters and underscores allowed
     * - Underscores cannot be at beginning or end
     * - No consecutive underscores permitted
     * 
     * @param {string} email - The email address to validate
     * @returns {boolean} True if email meets all validation criteria
     */
    const validateEmail = (email: string): boolean => {
        if (!email.endsWith("@ensigninfosecurity.com")) {
            setEmailError("Email must end with @ensigninfosecurity.com");
            return false;
        }

        const localPart  =  email.slice(0, email.indexOf("@ensigninfosecurity.com"));

        if (!localPart) {
            setEmailError("Please enter a valid email address");
            return false;
        }

        const allowedPattern  =  /^[a-zA-Z0-9_]+$/;
        if (!allowedPattern.test(localPart)) {
            setEmailError("Email can only contain letters, numbers, and underscores");
            return false;
        }

        if (localPart.startsWith("_") || localPart.endsWith("_")) {
            setEmailError("Email cannot start or end with an underscore");
            return false;
        }

        if (localPart.includes("__")) {
            setEmailError("Email cannot contain consecutive underscores");
            return false;
        }

        setEmailError("");
        return true;
    };

    /**
     * Handles form input changes with real-time validation.
     * Clears errors when user starts typing and validates email format.
     */
    const handleChange  =  (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError("");

        if (name === "email" && value) {
            validateEmail(value);
        } else if (name === "email" && !value) {
            setEmailError("");
        }
    };

    /**
     * Handles form submission with comprehensive validation and error handling.
     * Manages loading states and provides specific feedback for different error types.
     */
    const handleSubmit  =  async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateEmail(formData.email)) {
            return;
        }

        setIsLoading(true);
        setError("");
        setEmailError("");

        try {
            console.log("Attempting login with JWT authentication...");
            
            const response  =  await login(formData.email, formData.password);

            if (response.success) {
                console.log("Login successful, redirecting to dashboard...");
                router.push("/");
            } else {
                setError(response.message || "Login failed");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            
            if (error.message.includes("fetch")) {
                setError("Cannot connect to server. Please check if the backend is running on port 3000.");
            } else if (error.message.includes("Invalid email or password")) {
                setError("Invalid email or password");
            } else {
                setError(error.message || "Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className = "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className = "max-w-lg w-full">
                <div className = "text-center mb-8">
                    <h1 className = "text-5xl font-semibold text-gray-900">
                        <span className = "text-blue-600 font-bold">ENSIGN</span> InsiderGuard
                    </h1>
                </div>

                <div className = "bg-white rounded-2xl shadow-xl p-10">
                    <form className = "space-y-6" onSubmit = {handleSubmit}>
                        {error && (
                            <div className = "bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className = "flex">
                                    <div className = "flex-shrink-0">
                                        <svg className = "h-5 w-5 text-red-400" xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 20 20" fill = "currentColor">
                                            <path fillRule = "evenodd" d = "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule = "evenodd" />
                                        </svg>
                                    </div>
                                    <div className = "ml-3">
                                        <p className = "text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <style jsx>{`
                            input:-webkit-autofill,
                            input:-webkit-autofill:hover,
                            input:-webkit-autofill:focus,
                            input:-webkit-autofill:active {
                                -webkit-box-shadow: 0 0 0 30px white inset !important;
                                -webkit-text-fill-color: #111827 !important;
                                background-color: transparent !important;
                                background-image: none !important;
                                transition: background-color 5000s ease-in-out 0s;
                            }
                            
                            input:-moz-autofill {
                                background-color: transparent !important;
                                background-image: none !important;
                            }
                            
                            input:autofill {
                                background-color: transparent !important;
                                background-image: none !important;
                            }
                        `}</style>

                        <div className = "space-y-5">
                            <div>
                                <label htmlFor = "email" className = "block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className = "relative">
                                    <input
                                        id = "email"
                                        name = "email"
                                        type = "email"
                                        autoComplete = "email"
                                        required
                                        value = {formData.email}
                                        onChange = {handleChange}
                                        className = {`appearance-none block w-full px-0 py-3 border-0 border-b-2 ${
                                            emailError ? "border-red-500" : "border-gray-300"
                                        } bg-transparent placeholder-gray-400 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white]`}
                                        placeholder = "Enter your ENSIGN username"
                                    />
                                </div>
                                {emailError && (
                                    <p className = "mt-2 text-sm text-red-600" role = "alert">
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor = "password" className = "block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className = "relative">
                                    <input
                                        id = "password"
                                        name = "password"
                                        type = {showPassword ? "text" : "password"}
                                        autoComplete = "current-password"
                                        required
                                        value = {formData.password}
                                        onChange = {handleChange}
                                        className = "appearance-none block w-full px-0 py-3 pr-12 border-0 border-b-2 border-gray-300 bg-transparent placeholder-gray-400 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white]"
                                        placeholder = "Enter your password"
                                    />
                                    <button
                                        type = "button"
                                        className = "absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick = {() => setShowPassword(!showPassword)}
                                    >
                                        <div className = "relative w-5 h-5">
                                            <svg 
                                                className = {`absolute inset-0 w-5 h-5 text-gray-400 hover:text-gray-600 transition-all duration-300 ${
                                                    showPassword ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                                                }`} 
                                                xmlns = "http://www.w3.org/2000/svg" 
                                                viewBox = "0 0 20 20" 
                                                fill = "currentColor"
                                            >
                                                <path fillRule = "evenodd" d = "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule = "evenodd" />
                                                <path d = "M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                            
                                            <svg 
                                                className = {`absolute inset-0 w-5 h-5 text-gray-400 hover:text-gray-600 transition-all duration-300 ${
                                                    showPassword ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-180 scale-75"
                                                }`} 
                                                xmlns = "http://www.w3.org/2000/svg" 
                                                viewBox = "0 0 20 20" 
                                                fill = "currentColor"
                                            >
                                                <path d = "M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule = "evenodd" d = "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule = "evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type = "submit"
                            disabled = {isLoading || !!emailError}
                            className = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <span className = "flex items-center">
                                    <svg className = "animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns = "http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24">
                                        <circle className = "opacity-25" cx = "12" cy = "12" r = "10" stroke = "currentColor" strokeWidth = "4"></circle>
                                        <path className = "opacity-75" fill = "currentColor" d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>

                <p className = "mt-8 text-center text-xs text-gray-500">
                    © 2024 ENSIGN InfoSecurity. All rights reserved.
                </p>
            </div>
        </div>
    );
};