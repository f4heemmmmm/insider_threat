import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for conditional Tailwind CSS class merging.
 * 
 * Combines clsx and tailwind-merge for optimal class handling:
 * - Conditional class application with clsx for dynamic styling
 * - Tailwind CSS class conflict resolution with intelligent merging
 * - Duplicate class removal and optimization for performance
 * - Support for arrays, objects, and conditional class expressions
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}