"use client";

import { login } from "@/utils/auth";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

/**
 * LoginPage component that provides secure authentication interface for ENSIGN InfoSecurity users.
 * Now featuring a redesigned InsiderGuard logo with modern typography design and scrambling animation.
 */
export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Animation states
    const [displayInsider, setDisplayInsider] = useState("");
    const [displayGuard, setDisplayGuard] = useState("");
    const [animationComplete, setAnimationComplete] = useState(false);

    const validateEmail = (email: string): boolean => {
        if (!email.endsWith("@ensigninfosecurity.com")) {
            setEmailError("Email must end with @ensigninfosecurity.com");
            return false;
        }

        const localPart = email.slice(0, email.indexOf("@ensigninfosecurity.com"));

        if (!localPart) {
            setEmailError("Please enter a valid email address");
            return false;
        }

        const allowedPattern = /^[a-zA-Z0-9_]+$/;
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
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
            
            const response = await login(formData.email, formData.password);

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

    // Scrambling animation logic
    useEffect(() => {
        const targetInsider = "Insider";
        const targetGuard = "Guard";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        
        let insiderIndex = 0;
        let guardIndex = 0;
        let scrambleCount = 0;
        const maxScrambles = 8; // Number of scramble iterations per letter
        const scrambleSpeed = 30; // Milliseconds between scrambles
        const revealDelay = 200; // Delay before starting to reveal each letter

        const scrambleText = () => {
            const randomChar = () => characters[Math.floor(Math.random() * characters.length)];
            
            // Scramble both words initially
            let newInsider = "";
            let newGuard = "";
            
            // Build Insider text
            for (let i = 0; i < targetInsider.length; i++) {
                if (i < insiderIndex) {
                    newInsider += targetInsider[i];
                } else {
                    newInsider += randomChar();
                }
            }
            
            // Build Guard text
            for (let i = 0; i < targetGuard.length; i++) {
                if (i < guardIndex) {
                    newGuard += targetGuard[i];
                } else {
                    newGuard += randomChar();
                }
            }
            
            setDisplayInsider(newInsider);
            setDisplayGuard(newGuard);
            
            scrambleCount++;
            
            // Every few scrambles, reveal the next letter
            if (scrambleCount % maxScrambles === 0) {
                if (insiderIndex < targetInsider.length) {
                    insiderIndex++;
                } else if (guardIndex < targetGuard.length) {
                    guardIndex++;
                }
            }
            
            // Continue until both words are fully revealed
            if (insiderIndex >= targetInsider.length && guardIndex >= targetGuard.length) {
                setDisplayInsider(targetInsider);
                setDisplayGuard(targetGuard);
                setAnimationComplete(true);
                return;
            }
            
            // Continue scrambling
            setTimeout(scrambleText, scrambleSpeed);
        };

        // Start the animation after a brief delay
        const startDelay = setTimeout(() => {
            scrambleText();
        }, 200);

        return () => {
            clearTimeout(startDelay);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full">
                {/* Redesigned InsiderGuard Logo - Clean Typography with Scrambling Animation */}
                <div className="text-left mb-4 relative">
                    {/* Main Logo */}
                    <div className="group cursor-default">
                        <h1 className="text-7xl font-thin text-white drop-shadow-2xl leading-tight relative">
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-cyan-200 bg-clip-text text-transparent font-light tracking-tight">
                                    {displayInsider || "Insider"}
                                </span>
                                <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent font-semibold tracking-tight">
                                    {displayGuard || "Guard"}
                                </span>
                                
                                {/* Animated underline
                                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 rounded-full transition-all duration-700 group-hover:w-full w-3/4"></div> */}
                                
                                {/* Subtle glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-sky-400/20 to-cyan-400/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                            </span>
                        </h1>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                </div>

                {/* Login Form Container - Unchanged */}
                <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900 bg-opacity-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <style jsx>{`
                            input:-webkit-autofill,
                            input:-webkit-autofill:hover,
                            input:-webkit-autofill:focus,
                            input:-webkit-autofill:active {
                                -webkit-text-fill-color: #e2e8f0 !important;
                                background-color: transparent !important;
                                background-image: none !important;
                                transition: background-color 5000s ease-in-out 0s;
                                -webkit-box-shadow: none !important;
                                box-shadow: none !important;
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

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-base font-medium text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-0 py-2 border-0 border-b-2 ${
                                            emailError ? "border-red-500" : "border-gray-600"
                                        } bg-transparent placeholder-gray-400 text-gray-100 focus:outline-none focus:border-blue-400 transition-colors duration-200 text-sm`}
                                        // placeholder="Enter your email address"
                                    />
                                </div>
                                {emailError && (
                                    <p className="mt-2 text-sm text-red-400" role="alert">
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-base font-medium text-gray-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-0 py-2 pr-12 border-0 border-b-2 border-gray-600 bg-transparent placeholder-gray-400 text-gray-100 focus:outline-none focus:border-blue-400 transition-colors duration-200 text-sm"
                                        // placeholder="Enter your password"
                                    />
                                    {formData.password && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <div className="relative w-4 h-4">
                                                <EyeOff 
                                                    className={`absolute inset-0 w-4 h-4 text-gray-400 hover:text-gray-300 transition-all duration-300 ${
                                                        showPassword ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                                                    }`}
                                                />
                                                
                                                <Eye 
                                                    className={`absolute inset-0 w-4 h-4 text-gray-400 hover:text-gray-300 transition-all duration-300 ${
                                                        showPassword ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-180 scale-75"
                                                    }`}
                                                />
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Login Button with Blue Theme - Unchanged */}
                        <button
                            type="submit"
                            disabled={isLoading || !!emailError}
                            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>

                {/* Bottom branding section - Unchanged */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400 mb-4">POWERED BY</p>
                    <div className="flex justify-center">
                        <img 
                            src="/EnsignNextLevel.png" 
                            alt="ENSIGN Intelligence" 
                            className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200"
                        />
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    © 2024 ENSIGN InfoSecurity. All rights reserved.
                </p>
            </div>
        </div>
    );
};