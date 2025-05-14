// frontend/src/app/alerts/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Add this import

// Component Imports
import { AlertCards } from "@/components/ui/AlertCards";
import { Pagination } from "@/components/Pagination";

// Alert Files
import { Alert } from "@/types/alert.types";
import { AlertService, SortField, SortOrder } from "@/services/alert.service";

export default function AlertsPage() {
    const router = useRouter(); // ✅ Add this line to use router
    
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const totalPages = Math.ceil(total / limit);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [sortField, setSortField] = useState<SortField>("datestr");
    const [showIncidentRelated, setShowIncidentRelated] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Calculate pagination indices
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);

    // API Call
    const fetchAlerts = async (searchTerm = "") => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            let response;
            if (showIncidentRelated) {
                const incidentAlerts = await AlertService.getAlertsUnderIncident(true, sortField, sortOrder);
                response = {
                    alerts: incidentAlerts,
                    total: incidentAlerts.length,
                };
            } else if (searchTerm) {
                response = await AlertService.searchAlerts(searchTerm, limit, offset, sortField, sortOrder);
                console.log("Search term!");
                console.log("NO:", response.total);
            } else {
                console.log("Goes here instead");
                response = await AlertService.getAlerts(limit, offset, sortField, sortOrder);
            }
            setTotal(response.total);
            setAlerts(response.alerts);
        } catch (error) {
            console.error("Error fetching alerts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts(searchQuery);
    }, [page, limit, sortField, sortOrder, showIncidentRelated]);

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
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
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

    const toggleIncidentRelated = () => {
        setShowIncidentRelated(!showIncidentRelated);
        setPage(1);
    };

    const handlePageChange = (newPage : number) => {
        setPage(newPage);
    };

    // ✅ Add this function to handle alert clicks
    const handleAlertClick = React.useCallback((alert: Alert): void => {
        router.push(`/alerts/${alert.ID}`);
    }, [router]);

    return (
        <div className = "h-full p-10">
            <div className = "bg-white shadow rounded-lg h-full flex flex-col">
                <div className = "px-6 py-4 border-b border-gray-200">
                    <div className = "flex justify-between items-center mb-4">
                        <h2 className = "text-lg font-semibold text-gray-900">
                            <span className = "text-4xl font-light">{total}</span> Alerts
                        </h2>
                        {/* SEARCH BAR */}
                        <div className = "relative w-64">
                            <div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className = "h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type = "text"
                                className = "block w-full pl-10 py-2 pr-3 border border-gray-300 rounded-[12px] leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400 sm:text-sm"
                                placeholder = "Search alerts..."
                                value = {searchQuery}
                                onChange = {handleSearch}
                            />
                        </div>
                    </div>

                    {/* SORT/FILTER CONTROLS */}
                    <div className = "flex space-x-4">
                        {/* SORT BY DATE */}
                        <button
                            onClick = {() => handleSort("datestr")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "datestr" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Date </span>
                            {getSortIcon("datestr")}
                        </button>

                        {/* SORT BY SCORE */}
                        <button
                            onClick = {() => handleSort("score")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "score" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Score </span>
                            {getSortIcon("score")}
                        </button>

                        {/* SORT BY ALERT NAME */}
                        <button
                            onClick = {() => handleSort("alert_name")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "alert_name" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Alert </span>
                            {getSortIcon("alert_name")}
                        </button>

                        {/* INCIDENT RELATED ALERTS FILTER */}
                        <button
                            onClick = {toggleIncidentRelated}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                showIncidentRelated ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Incident Related </span>
                        </button>
                    </div>
                </div>

                <div className = "flex-grow p-6 bg-gray-50">
                    {/* ✅ Pass the handleAlertClick function to AlertCards */}
                    <AlertCards 
                        alerts={alerts} 
                        loading={loading}
                        onAlertClick={handleAlertClick}
                    />

                    {/* PAGINATION */}
                    {totalPages > 0 && (
                        <Pagination
                            currentPage = {page}
                            totalPages = {totalPages}
                            onPageChange = {handlePageChange}
                            totalItems = {total}
                            startIndex = {startIndex}
                            endIndex = {endIndex}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};