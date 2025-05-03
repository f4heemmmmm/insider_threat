// src/components/layout/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-semibold text-indigo-600">InsiderGuard</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              <Link 
                href="/"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link 
                href="/incidents"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Incidents
              </Link>
              <Link 
                href="/alerts"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                Alerts
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};