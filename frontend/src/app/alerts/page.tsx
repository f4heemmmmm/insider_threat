// frontend/src/alerts/page.tsx
"use client";

import React, { useEffect, useState} from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// Alert Imports
import { Alert } from "../../types/alert.types";
import { AlertCards } from "@/components/ui/AlertCards";
import { AlertService, SortField, SortOrder } from "@/services/alert.service";

export default function AlertsPage() {
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [sortField, setSortField] = useState<SortField>("datestr");
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const totalPages = Math.ceil(total / limit);

    const fetchAlerts = async (searchTerm = "") => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;

            let response;
            if (searchTerm) {
                // Dedicated API endpoint that includes the search term
                response = await AlertService.searchAlerts(searchTerm, limit, offset, sortField, sortOrder);
            } else {
                response = await AlertService.getAlerts(limit, offset, sortField, sortOrder);
            }

            setTotal(response.total);
            setAlerts(response.alerts);
        } catch (error) {
            console.error("Error fetching alerts: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts(searchQuery);
    }, [page, limit, sortField, sortOrder]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            setPage(1);
            fetchAlerts(query);
        }, 500);
        setSearchTimeout(timeout);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle sort order if the same button is clicked
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // Set new field and default order to DESCENDING order
            setSortField(field);
            setSortOrder("desc");
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className = "h-4 w-4 text-gray-500" />
        }
        return sortOrder === "asc" ? 
            <span className = "text-indigo-500"><ArrowUp className = "h-4 w-4" /></span> :
            <span className = "text-indigo-500"><ArrowDown className = "h-4 w-4" /></span>;
    };

    return (
        <div className = "h-full w-full px-0 py-0">
            <div className = "bg-white shadow rounded-lg h-full flex flex-col">
                <div className = "px-6 py-4 border-b border-gray-200">
                    <div className = "flex justify-between items-center mb-4">
                        <h2 className = "text-lg font-semibold text-gray-900">
                            <span className = "text-4xl font-light">{total}</span> Alerts
                        </h2>
                        <div className = "relative w-64">
                            <div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className = "h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type = "text"
                                className = "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[12px] leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder = "Search alerts..."
                                value = {searchQuery}
                                onChange = {handleSearch}
                            />
                        </div>
                    </div>

                    {/* SORT CONTROLS */}
                    <div className = "flex space-x-4">
                        {/* SORT BY DATE */}
                        <button
                            onClick = {() => handleSort("datestr")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "datestr" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Date </span>
                            {getSortIcon("datestr")}
                        </button>
                        {/* SORT BY SCORE */}
                        <button
                            onClick = {() => handleSort("score")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "score" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Score </span>
                            {getSortIcon("score")}
                        </button>
                        {/* SORT BY ALERT NAME */}
                        <button
                            onClick = {() => handleSort("alert_name")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "alert_name" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Alert Name </span>
                            {getSortIcon("alert_name")}
                        </button>
                    </div>
                </div>

                <div className = "flex-grow p-6 bg-gray-50">
                    <AlertCards alerts = {alerts} loading = {loading} />

                    {/* PAGINATION */}
                    {totalPages > 0 && (
                        <div className = "flex items-center justify-between mt-6">
                            <div className = "flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick = {() => setPage(Math.max(1, page - 1))}
                                    disabled = {page === 1}
                                    className = {`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        page === 1 ? "text-gray-500 bg-gray-100" : "text-gray-700 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick = {() => setPage(Math.min(totalPages, page + 1))}
                                    disabled = {page === totalPages}
                                    className = {`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        page === totalPages ? "text-gray-500 bg-gray-100" : "text-gray-700 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className = "hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <nav className = "relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label = "Pagination">
                                        <button
                                            onClick = {() => setPage(Math.max(1, page - 1))}
                                            disabled = {page === 1}
                                            className = {`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                                page === 1 ? "text-gray-400" : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className = "sr-only"> Previous </span>
                                            &larr;
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                // Show all pages if 5 or less pages
                                                pageNumber = i + 1;
                                            } else if (page <= 3) {
                                                // At the beginning, show the first 5 pages
                                                pageNumber = i + 1 
                                            } else if (page >= totalPages - 2) {
                                                // At the end, show last 5 pages
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                // In the middle, show 2 before and 2 after the current page
                                                pageNumber = page - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key = {pageNumber}
                                                    onClick = {() => setPage(pageNumber)}
                                                    className = {`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page === pageNumber
                                                            ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick = {() => setPage(Math.min(totalPages, page + 1))}
                                            disabled = {page === totalPages || totalPages === 0}
                                            className = {`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                                page == totalPages || totalPages === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className = "sr-only"> Next </span>
                                            &rarr;
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};