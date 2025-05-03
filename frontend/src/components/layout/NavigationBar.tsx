// src/components/layout/NavigationBar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavigationBar: React.FC = () => {
    const pathname = usePathname(); // Get the current path name to determine the active link

    const isActive = (path: string): boolean => {
        return pathname === path;
    };

    return (
        <nav className = "bg-white shadow-sm">
            <div className = "mx-auto px-4 sm:px-6 lg:px-8">
                <div className = "flex justify-between h-16">
                    <div className = "flex-shrink-0 flex items-center pl-2">
                        <Link href = "/" className = "font-bold text-xl text-indigo-700">
                            ENSIGN InsiderGuard
                        </Link>
                    </div>

                    <div className = "flex ml-auto">
                        <div className = "flex space-x-8">
                            {/* DASHBOARD BUTTON */}
                            <Link
                                href = "/"
                                className = {`inline-flex items-center px-1 pt-1 text-sm font-medium relative group ${
                                    isActive("/") ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Dashboard
                                {isActive("/") && (
                                    <span className = "absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500" />
                                )}
                                <span className = "absolute inset-x-0 bottom-0 h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </Link>
                            {/* INCIDENTS BUTTON */}
                            <Link
                                href = "/incidents"
                                className = {`inline-flex items-center px-1 pt-1 text-sm font-medium relative group ${
                                    isActive("/incidents") ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Incidents
                                {isActive("/incidents") && (
                                    <span className = "absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500" />
                                )}
                                <span className = "absolute inset-x-0 bottom-0 h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </Link>
                            {/* ALERTS BUTTON */}
                            <Link
                                href = "/alerts"
                                className = {`inline-flex items-center px-1 pt-1 text-sm font-medium relative group ${
                                    isActive("/alerts") ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Alerts
                                {isActive("/alerts") && (
                                    <span className = "absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500" />
                                )}
                                <span className = "absolute inset-x-0 bottom-0 h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};