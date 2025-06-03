// frontend/src/components/ui/StatusBadge.tsx

import React from "react";
import { StatusBadgeProps } from "./constants/interfaces";

/**
 * StatusBadge component for displaying severity levels with appropriate visual styling.
 * 
 * This component provides:
 * - Color-coded status indicators for different severity levels
 * - Consistent styling across the application
 * - Accessibility-friendly color combinations with proper contrast
 * - Flexible className prop for additional custom styling
 * 
 * The component automatically capitalizes the status text and applies
 * appropriate background and text colors based on the severity level.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
    /**
     * Determines the appropriate CSS classes based on the status severity level.
     * Uses a color system that provides clear visual hierarchy and accessibility.
     * @returns {string} CSS classes for background and text colors
     */
    const getStatusStyles = () => {
        switch (status) {
            case "low":
                return "bg-green-100 text-green-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "high":
                return "bg-orange-100 text-orange-800";
            case "critical":
                return "bg-red-100 text-red-800";
            case "unknown":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span className = {`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()} ${className}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};