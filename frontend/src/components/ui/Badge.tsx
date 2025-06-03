// frontend/src/components/ui/StatusBadge.tsx

import React from "react";
import { BadgeProps } from "./constants/interfaces";

/**
 * Badge component for displaying labels, tags, or status indicators.
 * 
 * This component provides:
 * - Two visual variants: default (filled) and outline styles
 * - Consistent styling with rounded corners and appropriate padding
 * - Flexible content support through children prop
 * - Customizable styling through className prop
 * 
 * The default variant uses a blue background with white text,
 * while the outline variant uses a border with transparent background.
 */
export const Badge: React.FC<BadgeProps> = ({ variant = "default", className = "", children }) => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    const variantStyles = variant === "outline" 
        ? "border border-gray-200" 
        : "bg-blue-600 text-white";
    
    return (
        <span className = {`${baseStyles} ${variantStyles} ${className}`}>
            {children}
        </span>
    );
};