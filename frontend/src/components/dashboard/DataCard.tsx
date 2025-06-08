// frontend/src/components/dashboard/DataCard.tsx

import React from "react";
import Link from "next/link";
import { DataCardProps } from "./constants/interfaces";

export const DataCard: React.FC<DataCardProps> = ({ title, subtitle, value, suffix = "", href, className }) => {
    // Format values with commas and suffix
    const formatValue = (num: number): string => {
        if (typeof num !== "number" || isNaN(num)) {
            return "--"
        }
        try {
            return new Intl.NumberFormat("en-US").format(num) + suffix;
        } catch (error) {
            return num.toString() + suffix;
        }
    };

    // Validate required data props
    if (!title || title.trim() === "") {
        console.warn("DataCard: 'title' prop is required!");
        return null;
    }

    const CardContent = () => (
        <div className = {`flex items-center justify-center h-full w-full p-4 sm:p-6 ${className}`}>
            <div className = "flex flex-col items-center justify-center w-full">
                {/* CONTENT */}
                <div className = "text-center">
                    {/* NUMBER */}
                    <p className = "text-4xl sm:text-5xl font-thin text-gray-800 mb-3">
                        {formatValue(value)}
                    </p>
                    {/* TITLE */}
                    <h2 className = "text-base sm:text-md font-medium text-gray-700">
                        {title}
                    </h2>
                    {/* SUBTITLE (DATE RANGE) */}
                    {subtitle && (
                        <p className = "text-sm font-light text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    if (href) {
        // Basic URL validation
        if (typeof href !== "string" || (!href.startsWith("/") && (!href.startsWith("http")))) {
            console.warn("DataCard: Invalid 'href' prop!");
            return <CardContent />
        }
        return (
            <Link href = {href} className = "block h-full">
                <CardContent />
            </Link>
        );
    }
    return <CardContent />;
};