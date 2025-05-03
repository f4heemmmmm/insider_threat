"use client";

// src/components/layout/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  // Get current path to determine active link
  const pathname = usePathname();
  
  // Check if the given path is the current active path
  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-indigo-600">
                InsiderGuard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium relative group
                  ${isActive('/') 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
                {/* Active indicator */}
                {isActive('/') && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500"></span>
                )}
                {/* Hover indicator with animation */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
              <Link
                href="/incidents"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium relative group
                  ${isActive('/incidents') 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Incidents
                {/* Active indicator */}
                {isActive('/incidents') && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500"></span>
                )}
                {/* Hover indicator with animation */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
              <Link
                href="/alerts"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium relative group
                  ${isActive('/alerts') 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Alerts
                {/* Active indicator */}
                {isActive('/alerts') && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500"></span>
                )}
                {/* Hover indicator with animation */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};