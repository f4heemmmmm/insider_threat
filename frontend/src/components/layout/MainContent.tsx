// src/components/layout/MainContent.tsx

"use client";
import React from 'react';
import { useSidebar } from './SidebarContext';

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { expanded, isMobile } = useSidebar();
  
  return (
    <div 
      className={`transition-all duration-300 pt-5 pb-5 px-2 md:px-4 lg:px-6 ${
        expanded && !isMobile ? 'lg:ml-64' : 'lg:ml-16'
      }`}
    >
      {children}
    </div>
  );
};