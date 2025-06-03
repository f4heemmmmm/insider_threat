// frontend/src/components/layout/MainContent.tsx

import React from "react";
import { useSidebar } from "./SidebarContext";
import { MainContentProps } from "./constants/interfaces";

/**
 * MainContent component that provides responsive layout adjustments based on sidebar state.
 * 
 * This component dynamically adjusts its margins and padding to accommodate:
 * - Sidebar expansion and collapse states
 * - Mobile vs desktop breakpoints
 * - Smooth transitions between layout states
 * 
 * The layout automatically adapts to provide optimal spacing and prevents
 * content overlap with the sidebar across different screen sizes.
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