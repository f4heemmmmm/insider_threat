// frontend/src/components/layout/SidebarContext.tsx

"use client";

import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { SidebarContextType, SidebarContext, SidebarProviderProps } from "./constants/interfaces";

/**
 * SidebarProvider component that manages global sidebar state and responsive behavior.
 * 
 * This provider handles:
 * - Sidebar expansion/collapse state management with proper SSR support
 * - Persistent state storage using localStorage with hydration safety
 * - Mobile/desktop breakpoint detection and responsive behavior
 * - Unified state interface for both Sidebar and MainContent components
 * - Prevents hydration mismatches and refresh state issues
 * 
 * The provider automatically detects screen size changes and maintains
 * sidebar preferences across browser sessions while handling SSR properly.
 */
export const SidebarProvider = ({ children }: SidebarProviderProps) => {
    // Initialize with a function to prevent hydration mismatches
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        // During SSR, default to true
        if (typeof window === 'undefined') return true;
        
        // During client-side initialization, read from localStorage immediately
        try {
            const saved = localStorage.getItem("sidebar-expanded");
            return saved !== null ? JSON.parse(saved) : true;
        } catch (error) {
            console.warn("Failed to read sidebar state from localStorage:", error);
            return true;
        }
    });
    
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 1024;
    });
    
    // Track if we've completed initial client-side setup
    const [isClientReady, setIsClientReady] = useState(false);
    
    // Use ref to track if we should save to localStorage
    const shouldSaveRef = useRef(false);

    // Save to localStorage immediately when state changes
    const setStoredSidebarState = useCallback((expanded: boolean): void => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem("sidebar-expanded", JSON.stringify(expanded));
        } catch (error) {
            console.warn("Failed to save sidebar state to localStorage:", error);
        }
    }, []);

    // Handle client-side initialization
    useEffect(() => {
        if (typeof window !== 'undefined' && !isClientReady) {
            // Re-read from localStorage to ensure consistency
            try {
                const saved = localStorage.getItem("sidebar-expanded");
                const savedState = saved !== null ? JSON.parse(saved) : true;
                
                // Only update if different from current state
                if (savedState !== isExpanded) {
                    setIsExpanded(savedState);
                }
            } catch (error) {
                console.warn("Failed to read sidebar state:", error);
            }
            
            // Now we can start saving changes
            shouldSaveRef.current = true;
            setIsClientReady(true);
        }
    }, [isClientReady, isExpanded]);

    // Save to localStorage when state changes (no debounce)
    useEffect(() => {
        // Only save after initial client setup and if the change was user-initiated
        if (shouldSaveRef.current && isClientReady) {
            setStoredSidebarState(isExpanded);
        }
    }, [isExpanded, isClientReady, setStoredSidebarState]);

    // Handle window resize with debouncing
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkMobile = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const newIsMobile = window.innerWidth < 1024;
                setIsMobile(newIsMobile);
            }, 100);
        };

        // Only set up resize listener on client
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", checkMobile);
            
            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener("resize", checkMobile);
            };
        }
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const expandSidebar = useCallback(() => {
        setIsExpanded(true);
    }, []);

    const collapseSidebar = useCallback(() => {
        setIsExpanded(false);
    }, []);

    const value: SidebarContextType = {
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