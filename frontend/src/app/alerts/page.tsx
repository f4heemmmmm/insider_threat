// frontend/src/app/alerts/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Component Imports
import { Pagination } from "@/components/Pagination";
import { AlertCards } from "@/components/alerts/main/AlertCards";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

// Alert Files
import { Alert } from "@/types/alert.types";
import { AlertService, SortField, SortOrder } from "@/services/alert.service";

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

export default function AlertsPage() {
    const router = useRouter();
    
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
    
    // Date range state
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: null,
        endDate: null
    });
    const [showDateRangeFilter, setShowDateRangeFilter] = useState(false);

    // Calculate pagination indices
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);

    // API Call
    const fetchAlerts = async (searchTerm = "") => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            let response;

            // Priority order: Date range > Incident related > Search > Default
            if (showDateRangeFilter && dateRange.startDate && dateRange.endDate) {
                // Date range filtering
                const dateRangeAlerts = await AlertService.getAlertsByDateRange(
                    dateRange.startDate,
                    dateRange.endDate,
                    undefined, // user filter (could be added later)
                    sortField,
                    sortOrder
                );
                response = {
                    alerts: dateRangeAlerts,
                    total: dateRangeAlerts.length,
                };
            } else if (showIncidentRelated) {
                // Incident related filtering
                const incidentAlerts = await AlertService.getAlertsUnderIncident(true, sortField, sortOrder);
                response = {
                    alerts: incidentAlerts,
                    total: incidentAlerts.length,
                };
            } else if (searchTerm) {
                // Search filtering
                response = await AlertService.searchAlerts(searchTerm, limit, offset, sortField, sortOrder);
                console.log("Search term!");
                console.log("NO:", response.total);
            } else {
                // Default - get all alerts
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
    }, [page, limit, sortField, sortOrder, showIncidentRelated, showDateRangeFilter, dateRange]);

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
            return <ArrowUpDown className="h-4 w-4 text-gray-500" />
        }
        return sortOrder === "asc" ?
            <span className="text-indigo-500"><ArrowUp className="h-4 w-4" /></span> :
            <span className="text-indigo-500"><ArrowDown className="h-4 w-4" /></span>;
    };

    const toggleIncidentRelated = () => {
        setShowIncidentRelated(!showIncidentRelated);
        setPage(1);
        // Reset date range filter when enabling incident filter
        if (!showIncidentRelated) {
            setShowDateRangeFilter(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleAlertClick = React.useCallback((alert: Alert): void => {
        router.push(`/alerts/${alert.id}`);
    }, [router]);

    // Date range handlers
    const handleDateRangeChange = (newDateRange: DateRange) => {
        setDateRange(newDateRange);
        const hasDateRange = Boolean(newDateRange.startDate || newDateRange.endDate);
        setShowDateRangeFilter(hasDateRange);
        setPage(1);
        
        // Reset other filters when applying date range
        if (hasDateRange) {
            setShowIncidentRelated(false);
            setSearchQuery("");
        }
    };

    const handleDateRangeClear = () => {
        setDateRange({ startDate: null, endDate: null });
        setShowDateRangeFilter(false);
        setPage(1);
    };

    const toggleDateRangeFilter = () => {
        const newShowDateRange = !showDateRangeFilter;
        setShowDateRangeFilter(newShowDateRange);
        setPage(1);
        
        // Reset other filters when enabling date range filter
        if (newShowDateRange) {
            setShowIncidentRelated(false);
        }
        
        // If disabling and no actual date range, clear it
        if (!newShowDateRange && (!dateRange.startDate && !dateRange.endDate)) {
            setDateRange({ startDate: null, endDate: null });
        }
    };

    // Check if date range filter is active
    const isDateRangeActive = showDateRangeFilter && Boolean(dateRange.startDate || dateRange.endDate);

    return (
        <div className="h-full p-10">
            <div className="bg-white shadow rounded-lg h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            <span className="text-4xl font-light">{total}</span> Alerts
                        </h2>
                        
                        <div className="flex items-center space-x-4">
                            {/* DATE RANGE PICKER */}
                            <DateRangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                onClear={handleDateRangeClear}
                                placeholder="Filter by date range"
                                className="w-64"
                                maxDaysRange={365} // 1 year max range
                                maxPastDays={1095} // 3 years in the past
                            />
                            
                            {/* SEARCH BAR */}
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 py-2 pr-3 border border-gray-300 rounded-[12px] leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400 sm:text-sm"
                                    placeholder="Search alerts..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    disabled={isDateRangeActive || showIncidentRelated}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SORT/FILTER CONTROLS */}
                    <div className="flex space-x-4">
                        {/* SORT BY DATE */}
                        <button
                            onClick={() => handleSort("datestr")}
                            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "datestr" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>Date</span>
                            {getSortIcon("datestr")}
                        </button>

                        {/* SORT BY SCORE */}
                        <button
                            onClick={() => handleSort("score")}
                            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "score" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>Score</span>
                            {getSortIcon("score")}
                        </button>

                        {/* SORT BY ALERT NAME */}
                        <button
                            onClick={() => handleSort("alert_name")}
                            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "alert_name" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>Alert</span>
                            {getSortIcon("alert_name")}
                        </button>

                        {/* INCIDENT RELATED ALERTS FILTER */}
                        <button
                            onClick={toggleIncidentRelated}
                            disabled={isDateRangeActive}
                            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                showIncidentRelated ? "bg-indigo-50 text-indigo-400" : 
                                isDateRangeActive ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>Incident Related</span>
                        </button>

                        {/* Active filter indicator */}
                        {isDateRangeActive && (
                            <div className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md flex items-center">
                                <span>Date Range Active</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow p-6 bg-gray-50">
                    <AlertCards 
                        alerts={alerts} 
                        loading={loading}
                        onAlertClick={handleAlertClick}
                    />

                    {/* PAGINATION */}
                    {totalPages > 0 && !isDateRangeActive && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={total}
                            startIndex={startIndex}
                            endIndex={endIndex}
                        />
                    )}
                    
                    {/* Date range pagination note */}
                    {isDateRangeActive && total > 0 && (
                        <div className="mt-6 text-center text-sm text-gray-500">
                            Showing {total} alert{total !== 1 ? 's' : ''} in selected date range
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};