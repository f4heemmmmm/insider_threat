// frontend/src/components/incident-main-page/SkeletonComponents.tsx

import React from "react";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return <div className = {`animate-pulse bg-gray-200 rounded ${className}`} />
};

export const IncidentCardSkeleton: React.FC = () => {
    return (
        <div className = "border border-gray-200 rounded-lg mb-5 overflow-hidden">
            {/* HEADER */}
            <div className = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <Skeleton className = "h-5 w-40" />
                <Skeleton className = "h-5 w-24 rounded-full" />
            </div>

            {/* INCIDENT DETAILS */}
            <div className = "p-5 grid grid-cols-12 gap-x-4 gap-y-4">
                {/* RELATED ALERTS */}
                <div className = "col-span-12 sm:col-span-4 lg:col-span-4 border-r border-gray-100 pr-3">
                    <Skeleton className = "h-4 w-28 mb-2" />
                    <div className = "space-y-2">
                        {[1, 2].map((_, i) => (
                            <Skeleton key = {i} className = "h-5 w-full" />
                        ))}
                        <div className = "flex justify-end mt-2">
                            <Skeleton className = "h-5 w-20 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* USER */}
                <div className = "col-span-12 sm:col-span-2 lg:col-span-2 border-r border-gray-100 pr-2">
                    <Skeleton className = "h-4 w-16 mb-2" />
                    <Skeleton className = "h-5 w-32" />
                </div>

                {/* TIME DETAILS */}
                <div className = "col-span-12 sm:col-span-6 lg:col-span-6 grid grid-cols-3 gap-x-4">
                    {/* START DATETIME */}
                    <div className = "col-span-3 sm:col-span-1">
                        <Skeleton className = "h-4 w-24 mb-2" />
                        <Skeleton className = "h-5 w-full" />
                    </div>
                    {/* END DATETIME */}
                    <div className = "col-span-3 sm:col-span-1">
                        <Skeleton className = "h-4 w-24 mb-2" />
                        <Skeleton className = "h-5 w-full" />
                    </div>
                    {/* DURATION */}
                    <div className = "col-span-3 sm:col-span-1">
                        <Skeleton className = "h-4 w-24 mb-2" />
                        <Skeleton className = "h-5 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
};