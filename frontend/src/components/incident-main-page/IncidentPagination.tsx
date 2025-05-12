// frontend/src/components/incident-main-page/IncidentPagination.tsx
import React from "react";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IncidentPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    setPage: (page: number) => void;
}

export const renderPagination = ({ page, totalPages, total, limit, setPage }: { page: number, totalPages: number, total: number, limit: number, setPage: (page: number) => void }) => {
    return (
        <div className = "flex items-center justify-between border-t border-gray-200 bg-white px-4 py-5 sm:px-6 mt-4 rounded-b-lg">
            {/* MOBILE PAGINATION */}
            <div className = "flex flex-1 justify-between sm:hidden">
                <Button
                    variant = "outline"
                    onClick = {() => setPage(Math.max(1, page - 1))}
                    disabled = {page === 1}
                    className = "flex items-center gap-1"
                >
                    <ChevronLeft className = "h-4 w-4" />
                    Previous
                </Button>
                <div className = "flex items-center px-2">
                    <span className = "text-xs text-gray-700">
                        {page} of {totalPages}
                    </span>
                </div>
                <Button
                    variant = "outline"
                    onClick = {() => setPage(Math.min(totalPages, page + 1))}
                    disabled = {page === totalPages}
                    className = "flex items-center gap-1"
                >
                    Next
                    <ChevronRight className = "h-4 w-4" />
                </Button>
            </div>

            {/* DESKTOP PAGINATION */}
            <div className = "hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className = "text-xs text-gray-700">
                        Showing <span className = "font-medium"> {Math.min(total, (page - 1) * limit + 1)} </span> to <span className = "font-medium"> {total} </span> incidents
                    </p>
                </div>
                <div>
                    <nav className = "isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <Button
                        variant = "outline"
                        onClick = {() => setPage(Math.max(1, page - 1))}
                        disabled = {page === 1}
                        className = "relative inline-flex items-center rounded-l-md px-2 py-2"
                        >
                            Previous
                            <ChevronLeft className = "h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            let pageNumber = i + 1;
                            if (totalPages > 5) {
                                if (page <= 3) {
                                    pageNumber = i + 1;
                                    if (i === 4) {
                                        pageNumber = totalPages;
                                    }
                                } else if (page >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                    if (i === 0) {
                                        pageNumber = 1;
                                    }
                                } else {
                                    pageNumber = page - 2 + i;
                                    if (i === 0) {
                                        pageNumber = 1;
                                    }
                                    if (i === 4) {
                                        pageNumber = totalPages;
                                    }
                                }
                            }
                            return (
                                <Button
                                    key = {pageNumber}
                                    variant = {page === pageNumber ? "default" : "outline"}
                                    onClick = {() => setPage(pageNumber)}
                                    className = {`relative hidden md:inline-flex items-center px-4 py-2 text-xs font-medium ${
                                        page === pageNumber
                                            ? "z-10 bg-blue-600 text-white"
                                            : "text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                        <Button
                            variant = "outline"
                            onClick = {() => setPage(Math.min(totalPages, page + 1))}
                            disabled = {page === totalPages}
                            className = "relative inline-flex items-center rounded-r-md px-2 py-2"
                        >
                            <span className = "sr-only"> Next </span>
                            <ChevronRight className = "h-4 w-4" />
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

