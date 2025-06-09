// frontend/src/components/layout/MainContent.tsx

import React from "react";
import { useSidebar } from "./SidebarContext";
import { MainContentProps } from "./constants/interfaces";

/**
 * MainContent component that provides responsive layout adjustments based on sidebar state.
 * 
 * This component dynamically adjusts its margins and padding to accommodate:
 * - Sidebar expansion and collapse states with smooth transitions
 * - Mobile vs desktop breakpoints with proper responsive behavior
 * - Navigation stability that prevents layout shifts during route changes
 * - Optimal spacing and content positioning across all screen sizes
 * 
 * The layout automatically adapts to provide optimal spacing and prevents
 * content overlap with the sidebar across different screen sizes while
 * maintaining consistent user experience during state transitions.
 */
export const MainContent: React.FC<MainContentProps> = ({ children }) => {
    const { expanded, isMobile } = useSidebar();
    
    // Calculate margin based on sidebar state and device type
    const getLeftMargin = () => {
        // On mobile, sidebar is overlay so no margin needed
        if (isMobile) {
            return "";
        }
        
        // On desktop, adjust margin based on sidebar state
        return expanded ? "lg:ml-64" : "lg:ml-16";
    };
    
    return (
        <div 
            className={`
                transition-all duration-300 ease-in-out
                pt-5 pb-5 px-2 
                md:px-4 lg:px-6 
                min-h-screen
                ${getLeftMargin()}
            `}
        >
            <div className="w-full max-w-full">
                {children}
            </div>
        </div>
    );
};