// frontend/src/app/incidents/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Components Import
import { IncidentCard } from "@/components/incidents/main/IncidentCard";
import { CardContent, CardHeader, Card, CardTitle } from "@/components/incidents/main/CardComponents";
import { Pagination } from "@/components/Pagination";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

// Alert Files
import { Alert } from "@/types/alert.types";
import { AlertService } from "@/services/alert.service";

// Incident Files
import { Incident } from "@/types/incident.types";
import { IncidentService, SortField, SortOrder } from "@/services/incident.service";
import { IncidentCardSkeleton } from "@/components/incidents/main/SkeletonComponents";

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

type ClosureStatusFilter = "all" | "open" | "closed";

export default function IncidentsPage() {
    const router = useRouter();
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const totalPages = Math.ceil(total / limit);
    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [incidentRelatedAlerts, setIncidentRelatedAlerts] = useState<Map<string, Alert[]>>(new Map());
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [sortField, setSortField] = useState<SortField>("windows_start");
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [closureStatusFilter, setClosureStatusFilter] = useState<ClosureStatusFilter>("all");
    const [isClosureDropdownOpen, setIsClosureDropdownOpen] = useState(false);
    
    // Date range state
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: null,
        endDate: null
    });

    // Calculate pagination indices
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);

    // Check if date range filter is active
    const isDateRangeActive = Boolean(dateRange.startDate && dateRange.endDate);

    // Check if closure status filter is active
    const isClosureFilterActive = closureStatusFilter !== "all";

    // API Call
    const fetchIncidents = async (searchTerm = "") => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            let response;
            
            // Build filters object
            const filters: any = {};
            if (closureStatusFilter !== "all") {
                filters.is_closed = closureStatusFilter === "closed";
            }
            
            // Priority order: Date range > Search > Default
            if (isDateRangeActive) {
                // Date range filtering - get all incidents in range (no pagination)
                response = await IncidentService.getIncidentsByDateRange(
                    dateRange.startDate!,
                    dateRange.endDate!,
                    undefined, // user filter (could be added later)
                    sortField,
                    sortOrder
                );
                
                // Apply closure status filter on frontend for date range results
                if (closureStatusFilter !== "all") {
                    const filteredIncidents = response.incidents.filter((incident: Incident) => {
                        return closureStatusFilter === "closed" ? incident.is_closed : !incident.is_closed;
                    });
                    response = {
                        incidents: filteredIncidents,
                        total: filteredIncidents.length
                    };
                }
            } else if (searchTerm) {
                // Search filtering
                response = await IncidentService.searchIncidents(searchTerm, limit, offset, sortField, sortOrder);
                
                // Apply closure status filter on frontend for search results
                if (closureStatusFilter !== "all") {
                    const filteredIncidents = response.incidents.filter((incident: Incident) => {
                        return closureStatusFilter === "closed" ? incident.is_closed : !incident.is_closed;
                    });
                    response = {
                        incidents: filteredIncidents,
                        total: filteredIncidents.length
                    };
                }
            } else {
                // Default - get all incidents with closure filter
                response = await IncidentService.getIncidents(limit, offset, sortField, sortOrder, filters);
            }
            
            // Handle response
            const incidentsData = response.incidents || [];
            const totalCount = response.total || 0;

            setIncidents(incidentsData);
            setTotal(totalCount);

            // Store related alerts for each incident using AlertService
            const alertsMap = new Map<string, Alert[]>();

            for (const incident of incidentsData) {
                try {
                    const alertsUnderIncident = await AlertService.getAlertsByIncidentID(incident.id, "datestr", "desc");
                    alertsMap.set(incident.id, alertsUnderIncident);
                } catch (error) {
                    console.error(`Error fetching alerts for incident ${incident.id}:`, error);
                    alertsMap.set(incident.id, []);
                }
            }
            setIncidentRelatedAlerts(alertsMap);
        } catch (error) {
            console.error("Error fetching incidents:", error);
            setIncidents([]);
            setTotal(0);
            setIncidentRelatedAlerts(new Map());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents(searchQuery);
    }, [page, limit, sortField, sortOrder, dateRange, closureStatusFilter]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            setPage(1);
            fetchIncidents(query);
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

    // Fixed navigation using Next.js router for client-side navigation
    const navigateToIncidentDetails = useCallback((incidentID: string) => {
        router.push(`/incidents/${incidentID}`);
    }, [router]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // Date range handlers
    const handleDateRangeChange = (newDateRange: DateRange) => {
        setDateRange(newDateRange);
        setPage(1);
        
        // Reset search when applying date range
        if (newDateRange.startDate && newDateRange.endDate) {
            setSearchQuery("");
        }
    };

    const handleDateRangeClear = () => {
        setDateRange({ startDate: null, endDate: null });
        setPage(1);
    };

    // Closure status filter handlers
    const handleClosureStatusChange = (status: ClosureStatusFilter) => {
        setClosureStatusFilter(status);
        setPage(1);
        setIsClosureDropdownOpen(false);
    };

    const getClosureStatusLabel = (status: ClosureStatusFilter) => {
        switch (status) {
            case "all":
                return "All Incidents";
            case "open":
                return "Open Incidents";
            case "closed":
                return "Closed Incidents";
            default:
                return "All Incidents";
        }
    };



    return (
        <div className="h-full p-10">
            <div className="bg-white shadow rounded-lg h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            <span className="text-4xl font-light">{total}</span>
                            {closureStatusFilter === "closed" 
                                ? " Closed" 
                                : closureStatusFilter === "open" 
                                    ? " Open" 
                                    : ""
                            } Incidents
                        </h2>
                        
                        <div className="flex items-center space-x-4">
                            {/* CLOSURE STATUS FILTER */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsClosureDropdownOpen(!isClosureDropdownOpen)}
                                    className={`w-48 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex items-center justify-between ${
                                        isClosureFilterActive ? "ring-2 ring-indigo-200 border-indigo-300" : ""
                                    }`}
                                >
                                    <span className={isClosureFilterActive ? "text-indigo-700 font-medium" : "text-gray-700"}>
                                        {getClosureStatusLabel(closureStatusFilter)}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </button>
                                
                                {isClosureDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                                        <div className="py-1">
                                            {(["all", "open", "closed"] as ClosureStatusFilter[]).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleClosureStatusChange(status)}
                                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                        closureStatusFilter === status
                                                            ? "bg-indigo-50 text-indigo-700 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {getClosureStatusLabel(status)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                    placeholder="Search incidents..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    disabled={isDateRangeActive}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SORT/FILTER CONTROLS */}
                    <div className="flex space-x-4">
                        {/* SORT BY DATE */}
                        <button
                            onClick={() => handleSort("windows_start")}
                            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "windows_start" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>Date</span>
                            {getSortIcon("windows_start")}
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

                        {/* SORT BY USER */}
                        <button
                            onClick={() => handleSort("user")}
                            className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "user" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>User</span>
                            {getSortIcon("user")}
                        </button>

                        {/* Active filter indicators */}
                        {isDateRangeActive && (
                            <div className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md flex items-center">
                                <span>Date Range Active</span>
                            </div>
                        )}
                        
                        {isClosureFilterActive && (
                            <div className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md flex items-center">
                                <span>{closureStatusFilter === "open" ? "Open Only" : "Closed Only"}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow p-6 bg-gray-50">
                    <div className="space-y-2">
                        {loading ? (
                            Array.from({ length: limit }).map((_, index) => (
                                <IncidentCardSkeleton key={index} />
                            ))
                        ) : incidents.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
                                <p className="text-gray-500 text-lg">
                                    {isClosureFilterActive || isDateRangeActive || searchQuery
                                        ? "No incidents found matching your filters."
                                        : "No incidents found."
                                    }
                                </p>
                            </div>
                        ) : (
                            // Render actual incidents 
                            incidents.map((incident) => (
                                <IncidentCard
                                    key={incident.id}
                                    incident={incident}
                                    alerts={incidentRelatedAlerts.get(incident.id) || []}
                                    onClick={() => navigateToIncidentDetails(incident.id)}
                                />
                            ))
                        )}
                    </div>

                    {/* PAGINATION - Only show for non-date-range results */}
                    {totalPages > 0 && !isDateRangeActive && !searchQuery && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={total}
                            startIndex={startIndex}
                            endIndex={endIndex}
                        />
                    )}
                    
                    {/* Date range results summary */}
                    {isDateRangeActive && total > 0 && (
                        <div className="mt-6 text-center text-sm text-gray-500">
                            Showing {total} incident{total !== 1 ? 's' : ''} in selected date range
                            {isClosureFilterActive && ` (${closureStatusFilter} only)`}
                        </div>
                    )}
                    
                    {/* Search results summary */}
                    {searchQuery && total > 0 && (
                        <div className="mt-6 text-center text-sm text-gray-500">
                            Found {total} incident{total !== 1 ? 's' : ''} matching "{searchQuery}"
                            {isClosureFilterActive && ` (${closureStatusFilter} only)`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};