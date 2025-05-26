// Modified SidebarContext.tsx
"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  isMobile: boolean;
}

// Create context with default closed state
const SidebarContext = createContext<SidebarContextType>({
  expanded: false, // Default to closed 
  setExpanded: () => {},
  isMobile: false
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  // Initialize with closed state for better consistency
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // This effect only handles mobile detection, not sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    
    // Check on mount
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // This effect handles closing the sidebar on page navigation
  useEffect(() => {
    // Close sidebar when pathname changes (page navigation)
    setExpanded(false);
  }, [pathname]);
  
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};