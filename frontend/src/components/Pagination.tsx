// frontend/src/components/ui/Pagination.tsx

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    startIndex: number;
    endIndex: number;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex }) => {
    return (
        <div className = "flex items-center justify-between mt-6">
            <div className = "flex-1 flex justify-between sm:hidden">
                <button
                    onClick = {() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled = {currentPage === 1}
                    className = {`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 ? "text-gray-400 bg-gray-100" : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                >
                    Previous
                </button>
                <button
                    onClick = {() => onPageChange(Math.max(totalPages, currentPage + 1))}
                    disabled = {currentPage === totalPages}
                    className = {`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages ? "text-gray-400 bg-gray-100" : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                >
                    Next
                </button>
            </div>
            <div className = "hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div> 
                    <p className = "text-sm text-gray-700">
                        Showing <span className="font-medium"> {totalItems === 0 ? 0 : startIndex + 1} </span> to {" "}
                        <span className = "font-medium"> {endIndex} </span> of{' '}
                        <span className = "font-medium"> {totalItems} </span> results
                    </p>
                </div>
                <div>
                    <nav className = "relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label = "Pagination">
                        <button
                            onClick = {() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled = {currentPage === 1}
                            className = {`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <span className = "sr-only"> Previous </span>
                            &larr;
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                                pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i;
                            } else {
                                pageNumber = currentPage - 2 + i;
                            }
                        
                            return (
                                <button
                                    key = {pageNumber}
                                    onClick = {() => onPageChange(pageNumber)}
                                    className = {`relative inline-flex items-center px-4 py-2 border ${
                                        currentPage === pageNumber
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    } text-sm font-medium`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                        <button
                            onClick = {() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled = {currentPage === totalPages || totalPages === 0}
                            className = {`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === totalPages || totalPages === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <span className = "sr-only"> Next </span>
                            &rarr;
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};