// frontend/src/components/layout/MainContent.tsx

"use client";
import React from "react";
import { useSidebar } from "./SidebarContext";
import { MainContentProps } from "./constants/interfaces";

/**
 * MainContent component that adjusts its layout based on sidebar state.
 * Provides responsive margins and padding that adapt to sidebar expansion
 * and mobile/desktop breakpoints.
 */
export const MainContent: React.FC<MainContentProps> = ({ children }) => {
    const { expanded, isMobile } = useSidebar();
    return (
        <div 
            className = {`transition-all duration-300 pt-5 pb-5 px-2 md:px-4 lg:px-6 ${
                expanded && !isMobile ? "lg:ml-64" : "lg:ml-16"
            }`}
        >
            {children}
        </div>
    );
};