// frontend/src/components/layout/SidebarContext.tsx

"use client";
import { usePathname } from "next/navigation";
import { SidebarContextType } from "./constants/interfaces";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

const SidebarContext = createContext<SidebarContextType>({
    expanded: false,
    setExpanded: () => {},
    isMobile: false
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
    children: ReactNode;
}

/**
 * SidebarProvider component that manages sidebar state including expansion,
 * mobile detection, and localStorage persistence. Handles responsive behavior
 * and automatic sidebar collapse on mobile navigation.
 */
export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [expanded, setExpandedState] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    const setExpanded = (newExpanded: boolean) => {
        setExpandedState(newExpanded);
        if (typeof window !== "undefined") {
            localStorage.setItem("sidebar-expanded", JSON.stringify(newExpanded));
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("sidebar-expanded");
                if (saved !== null) {
                    const savedExpanded = JSON.parse(saved);
                    setExpandedState(savedExpanded);
                }
            } catch (error) {
                console.warn("Failed to load sidebar state from localStorage:", error);
            }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    
    useEffect(() => {
        if (isMobile && expanded) {
            setExpanded(false);
        }
    }, [pathname, isMobile, expanded]);
    
    if (!mounted) {
        return null;
    }
    
    return (
        <SidebarContext.Provider value = {{ expanded, setExpanded, isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
};