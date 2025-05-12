// src/components/ui/StatusBadge.tsx
// refactor

import React from 'react';

interface StatusBadgeProps {
  status: 'low' | 'medium' | 'high' | 'critical' | "unknown";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
        case "unknown":
        return 'bg-gray-100 text-gray-800';      
default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

