// frontend/src/components/ui/UnifiedPagination.tsx
import React from "react";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Base interface for all pagination props
interface BasePaginationProps {
    currentPage: number;
    totalPages: number;
    onNavigate: (page: number) => void;
    disabled?: boolean;
}

// Props for list-style pagination (incidents list)
interface ListPaginationProps extends BasePaginationProps {
    mode: 'list';
    total: number;
    limit: number;
    itemName?: string; // e.g., "incidents", "alerts", etc.
}

// Props for navigation-style pagination (incident details)
interface NavigationPaginationProps extends BasePaginationProps {
    mode: 'navigation';
    currentItemId?: string;
    itemName?: string; // e.g., "incident", "alert", etc.
}

type UnifiedPaginationProps = ListPaginationProps | NavigationPaginationProps;

export const UnifiedPagination: React.FC<UnifiedPaginationProps> = (props) => {
    const hasPrevious = props.currentPage > 1;
    const hasNext = props.currentPage < props.totalPages;

    const handlePrevious = () => {
        if (hasPrevious && !props.disabled) {
            props.onNavigate(props.currentPage - 1);
        }
    };

    const handleNext = () => {
        if (hasNext && !props.disabled) {
            props.onNavigate(props.currentPage + 1);
        }
    };

    const renderListMode = (props: ListPaginationProps) => {
        const itemName = props.itemName || 'items';
        const startItem = Math.min(props.total, (props.currentPage - 1) * props.limit + 1);
        const endItem = Math.min(props.total, props.currentPage * props.limit);

        return (
            <>
                {/* MOBILE LIST PAGINATION */}
                <div className="flex flex-1 justify-between sm:hidden">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={!hasPrevious || props.disabled}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex items-center px-2">
                        <span className="text-xs text-gray-700">
                            {props.currentPage} of {props.totalPages}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={!hasNext || props.disabled}
                        className="flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* DESKTOP LIST PAGINATION */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-gray-700">
                            Showing <span className="font-medium">{startItem}</span> to{" "}
                            <span className="font-medium">{endItem}</span> of{" "}
                            <span className="font-medium">{props.total}</span> {itemName}
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={!hasPrevious || props.disabled}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, props.totalPages) }).map((_, i) => {
                                let pageNumber = i + 1;
                                // Smart page number calculation for many pages
                                if (props.totalPages > 5) {
                                    if (props.currentPage <= 3) {
                                        pageNumber = i + 1;
                                        if (i === 4) pageNumber = props.totalPages;
                                    } else if (props.currentPage >= props.totalPages - 2) {
                                        pageNumber = props.totalPages - 4 + i;
                                        if (i === 0) pageNumber = 1;
                                    } else {
                                        pageNumber = props.currentPage - 2 + i;
                                        if (i === 0) pageNumber = 1;
                                        if (i === 4) pageNumber = props.totalPages;
                                    }
                                }
                                
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={props.currentPage === pageNumber ? "default" : "outline"}
                                        onClick={() => props.onNavigate(pageNumber)}
                                        disabled={props.disabled}
                                        className={`relative hidden md:inline-flex items-center px-4 py-2 text-xs font-medium ${
                                            props.currentPage === pageNumber
                                                ? "z-10 bg-blue-600 text-white"
                                                : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                            
                            <Button
                                variant="outline"
                                onClick={handleNext}
                                disabled={!hasNext || props.disabled}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>
                    </div>
                </div>
            </>
        );
    };

    const renderNavigationMode = (props: NavigationPaginationProps) => {
        const itemName = props.itemName || 'item';

        return (
            <>
                {/* MOBILE NAVIGATION */}
                <div className="flex flex-1 justify-between sm:hidden">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={!hasPrevious || props.disabled}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex items-center px-2">
                        <span className="text-xs text-gray-700">
                            {props.currentPage} of {props.totalPages}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={!hasNext || props.disabled}
                        className="flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-gray-700">
                            Showing {itemName}{" "}
                            <span className="font-medium">{props.currentPage}</span> of{" "}
                            <span className="font-medium">{props.totalPages}</span>
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={!hasPrevious || props.disabled}
                                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous {itemName}
                            </Button>
                            
                            {props.currentItemId && (
                                <div className="relative inline-flex items-center px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-300">
                                    <span className="text-gray-900 font-semibold">ID: {props.currentItemId}</span>
                                </div>
                            )}
                            
                            <Button
                                variant="outline"
                                onClick={handleNext}
                                disabled={!hasNext || props.disabled}
                                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm"
                            >
                                Next {itemName}
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </nav>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-5 sm:px-6 mt-4 rounded-b-lg">
            {props.mode === 'list' ? renderListMode(props) : renderNavigationMode(props)}
        </div>
    );
};

// Helper hook for converting your existing pagination state to the new format
export const usePaginationAdapter = () => {
    return {
        // Convert list page state to unified props
        forListPage: (page: number, total: number, limit: number, setPage: (page: number) => void) => ({
            mode: 'list' as const,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total,
            limit,
            itemName: 'incidents',
            onNavigate: setPage,
        }),
        
        // Convert navigation state to unified props  
        forNavigationPage: (currentIndex: number, totalItems: number, currentId: string, onNavigate: (index: number) => void) => ({
            mode: 'navigation' as const,
            currentPage: currentIndex + 1, // Convert 0-based to 1-based
            totalPages: totalItems,
            currentItemId: currentId,
            itemName: 'incident',
            onNavigate: (page: number) => onNavigate(page - 1), // Convert back to 0-based
        }),
    };
};