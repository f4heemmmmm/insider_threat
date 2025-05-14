// frontend/src/app/incidents/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// Components Import
import { IncidentCard } from "@/components/incident-main-page/IncidentCard";
import { CardContent, CardHeader, Card, CardTitle } from "@/components/incident-main-page/CardComponents";
import { Pagination } from "@/components/Pagination";

// Alert Files
import { Alert } from "@/types/alert.types";
import { AlertService } from "@/services/alert.service";

// Incident Files
import { Incident } from "@/types/incident.types";
import { IncidentService, SortField, SortOrder } from "@/services/incident.service";
import { IncidentCardSkeleton } from "@/components/incident-main-page/SkeletonComponents";

export default function IncidentsPage() {
    const [limit] = useState(10);
    const [page, setPage]  = useState(1);
    const [total, setTotal] = useState(0);
    const totalPages = Math.ceil(total / limit);
    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [incidentRelatedAlerts, setIncidentRelatedAlerts] = useState<Map<string, Alert[]>>(new Map());
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [sortField, setSortField] = useState<SortField>("windows_start");
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Calculate pagination indices
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);

    // API Call
    const fetchIncidents = async (searchTerm = "") => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            let response;
            
            if (searchTerm) {
                response = await IncidentService.searchIncidents(searchTerm, limit, offset, sortField, sortOrder);
            } else {
                response = await IncidentService.getIncidents(limit, offset, sortField, sortOrder);
            }
            
            setIncidents(response.incidents);
            setTotal(response.total);

            // Store related alerts for each incident using AlertService
            const alertsMap = new Map<string, Alert[]>();

            for (const incident of response.incidents) {
                try {
                    const alertsUnderIncident = await AlertService.getAlertsByIncidentID(incident.ID, "datestr", "desc");   // Sort by date, and with the most recent ones first
                    alertsMap.set(incident.ID, alertsUnderIncident);
                } catch (error) {
                    console.error(`Error fetching alerts for incident ${incident.ID}:`, error);
                    alertsMap.set(incident.ID, []);
                }
            }
            setIncidentRelatedAlerts(alertsMap);
        } catch (error) {
            console.error("Error fetching incidents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents(searchQuery);
    }, [page, limit, sortField, sortOrder]);

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
            return <ArrowUpDown className = "h-4 w-4 text-gray-500" />
        }
        return sortOrder === "asc" ?
            <span className = "text-indigo-500"><ArrowUp className = "h-4 w-4" /></span> :
            <span className = "text-indigo-500"><ArrowDown className = "h-4 w-4" /></span>;
    };

    const navigateToIncidentDetails = (incidentID: string) => {
        window.location.href = `/incidents/${incidentID}`;
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className = "h-full p-10">
            <div className = "bg-white shadow rounded-lg h-full flex flex-col">
                <div className = "px-6 py-4 border-b border-gray-200">
                    <div className = "flex justify-between items-center mb-4">
                        <h2 className = "text-lg font-semibold text-gray-900">
                            <span className = "text-4xl font-light">{total}</span> Incidents
                        </h2>
                        {/* SEARCH BAR */}
                        <div className = "relative w-64">
                            <div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className = "h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type = "text"
                                className = "block w-full pl-10 py-2 pr-3 border border-gray-300 rounded-[12px] leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400 sm:text-sm"
                                placeholder = "Search incidents..."
                                value = {searchQuery}
                                onChange = {handleSearch}
                            />
                        </div>
                    </div>

                    {/* SORT/FILTER CONTROLS */}
                    <div className = "flex space-x-4">
                        {/* SORT BY DATE */}
                        <button
                            onClick = {() => handleSort("windows_start")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "windows_start" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> Date </span>
                            {getSortIcon("windows_start")}
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

                        {/* SORT BY USER */}
                        <button
                            onClick = {() => handleSort("user")}
                            className = {`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                                sortField === "user" ? "bg-indigo-50 text-indigo-400" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span> User </span>
                            {getSortIcon("user")}
                        </button>
                    </div>
                </div>

                <div className = "flex-grow p-6 bg-gray-50">
                    <div className = "space-y-2">
                        {loading ? (
                            Array.from({ length: limit }).map((_, index) => (
                                <IncidentCardSkeleton key = {index} />
                            ))
                        ) : incidents.length === 0 ? (
                            <div className = "text-center py-16 border border-dashed border-gray-200 rounded-lg">
                                <p className = "text-gray-500 text-lg"> No incidents found. </p>
                            </div>
                        ) : (
                            // Render actual incidents 
                            incidents.map((incident) => (
                                <IncidentCard
                                    key = {incident.ID}
                                    incident = {incident}
                                    alerts = {incidentRelatedAlerts.get(incident.ID) || []}
                                    onClick = {() => navigateToIncidentDetails(incident.ID)}
                                />
                            ))
                        )}
                    </div>

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