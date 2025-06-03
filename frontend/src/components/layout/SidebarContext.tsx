// frontend/src/components/layout/SidebarContext.tsx

"use client";

import { useContext, useState, useEffect } from "react";
import { SidebarContextType, SidebarContext, SidebarProviderProps } from "./constants/interfaces";

/**
 * SidebarProvider component that manages global sidebar state and responsive behavior.
 * 
 * This provider handles:
 * - Sidebar expansion/collapse state management
 * - Persistent state storage using localStorage
 * - Mobile/desktop breakpoint detection and responsive behavior
 * - Unified state interface for both Sidebar and MainContent components
 * 
 * The provider automatically detects screen size changes and maintains
 * sidebar preferences across browser sessions for improved user experience.
 */
export const SidebarProvider = ({ children }: SidebarProviderProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("sidebar-expanded");
        if (saved !== null) {
            setIsExpanded(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        /**
         * Detects mobile screen size based on Tailwind's lg breakpoint (1024px).
         * Updates state when window is resized to maintain responsive behavior.
         */
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", JSON.stringify(isExpanded));
    }, [isExpanded]);

    const toggleSidebar = () => setIsExpanded(prev => !prev);
    const expandSidebar = () => setIsExpanded(true);
    const collapseSidebar = () => setIsExpanded(false);

    const value = {
        isExpanded,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
        expanded: isExpanded,
        isMobile,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

/**
 * Custom hook for accessing sidebar context state and methods.
 * 
 * @throws {Error} When used outside of SidebarProvider
 * @returns {SidebarContextType} Sidebar state and control methods
 */
export const useSidebar = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};