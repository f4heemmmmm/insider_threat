// frontend/src/components/layout/Sidebar.tsx

"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";

/**
 * Sidebar component that provides collapsible navigation with mobile responsiveness.
 * Features expandable/collapsible states, mobile overlay, navigation icons,
 * and user profile section. Handles both desktop and mobile layouts.
 */
export const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { expanded, setExpanded, isMobile } = useSidebar();
    
    const navItems = [
        {
            name: "Dashboard",
            href: "/",
            icon: (
                <svg xmlns = "http://www.w3.org/2000/svg" className = "h-5 w-5" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
                    <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: "Alerts",
            href: "/alerts",
            icon: (
                <svg xmlns = "http://www.w3.org/2000/svg" className = "h-5 w-5" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
                    <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: "Incidents",
            href: "/incidents",
            icon: (
                <svg xmlns = "http://www.w3.org/2000/svg" className = "h-5 w-5" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
                    <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
    ];

    return (
        <>
            {isMobile && expanded && (
                <div 
                    className = "fixed inset-0 bg-gray-900 bg-opacity-50 z-10 lg:hidden"
                    onClick = {() => setExpanded(false)}
                />
            )}
            
            <button
                onClick = {() => setExpanded(!expanded)}
                className = {`fixed ${expanded ? "left-[16rem] md:left-[15.5rem]" : "left-[4.25rem]"} top-4 z-20 rounded-full p-2 bg-slate-700 text-white shadow-lg border border-slate-600 transition-all duration-300 ease-in-out hover:bg-slate-600 focus:outline-none lg:left-auto lg:right-4`}
                aria-label = {expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
                <svg 
                    xmlns = "http://www.w3.org/2000/svg" 
                    className = {`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} 
                    fill = "none" 
                    viewBox = "0 0 24 24" 
                    stroke = "currentColor"
                >
                    <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </button>
            
            <div 
                className = {`fixed top-0 left-0 h-full bg-slate-800 text-white shadow-lg z-20 transition-all duration-300 ease-in-out ${
                    expanded ? "w-64" : "w-16"
                } ${isMobile && !expanded ? "-translate-x-full" : "translate-x-0"}`}
            >
                <div className = {`p-6 ${!expanded ? "px-3" : ""}`}>
                    <h2 className = {`text-xl font-bold mb-8 transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 hidden lg:block lg:opacity-0"}`}>
                        ENSIGN InsiderGuard
                    </h2>
                    
                    <div className = {`text-center mb-8 transition-opacity duration-200 ${!expanded ? "opacity-100 block" : "opacity-0 hidden"}`}>
                        <div className = "inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#165eac] text-[#fcb600] font-bold text-xl">
                            E
                        </div>
                    </div>
                    
                    <nav className = "space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            
                            return (
                                <Link
                                    key = {item.name}
                                    href = {item.href}
                                    className = {`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                                        isActive
                                            ? "bg-slate-700 text-white"
                                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                    } ${expanded ? "" : "justify-center"}`}
                                    title = {!expanded ? item.name : ""}
                                >
                                    <div className = {expanded ? "mr-3" : ""}>
                                        {item.icon}
                                    </div>
                                    <span className = {`transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0 hidden lg:inline lg:opacity-0"}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
};