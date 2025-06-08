// frontend/src/components/dashboard/RecentIncidentsTable.tsx

import { ArrowRight } from "lucide-react";
import React, { useState, useEffect }  from "react";
import { IncidentWithAlertCount, RecentIncidentsTableProps } from "./constants/interfaces";
import { formatID, formatUsername } from "./constants/functions";

import { AlertService } from "@/services/alert.service";

// Updated interface to include date filtering props
interface RecentIncidentsTablePropsLocal {
    loading: boolean;
    recentIncidents: IncidentWithAlertCount[];
    startDate?: Date;
    endDate?: Date;
    isFiltered?: boolean;
}

export const RecentIncidentsTable: React.FC<RecentIncidentsTablePropsLocal> = ({ 
    loading, 
    recentIncidents, 
    startDate, 
    endDate, 
    isFiltered = false 
}) => {
    const [incidents, setIncidents] = useState<IncidentWithAlertCount[]>([]);
    const [alertCounts, setAlertCounts] = useState<Record<string, number>>({});
    const [fetchingAlertCounts, setFetchingAlertCounts] = useState<boolean>(false);

    // Filter incidents based on date range
    const filterIncidentsByDateRange = (incidents: IncidentWithAlertCount[]): IncidentWithAlertCount[] => {
        if (!startDate || !endDate || !isFiltered) {
            return incidents;
        }

        return incidents.filter(incident => {
            const incidentStartDate = new Date(incident.windows_start);
            const incidentEndDate = new Date(incident.windows_end);
            
            // Check if the incident overlaps with the selected date range
            // An incident is included if it starts before the end date and ends after the start date
            return incidentStartDate <= endDate && incidentEndDate >= startDate;
        });
    };

    // Generate dynamic title based on filtering state
    const getTableTitle = (): string => {
        if (!isFiltered || !startDate || !endDate) {
            return "Recent Incidents";
        }

        const formatDate = (date: Date): string => {
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        return `Incidents from ${formatDate(startDate)} to ${formatDate(endDate)}`;
    };

    // Generate dynamic empty state message
    const getEmptyStateMessage = (): { title: string; subtitle: string } => {
        if (!isFiltered || !startDate || !endDate) {
            return {
                title: "No incidents found.",
                subtitle: "Recent incidents will appear here."
            };
        }

        const formatDate = (date: Date): string => {
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        return {
            title: "No incidents found for the selected period.",
            subtitle: `No incidents shown for the duration of ${formatDate(startDate)} to ${formatDate(endDate)}.`
        };
    };

    // Fetch the alert counts for each incident
    useEffect(() => {
        if (recentIncidents.length > 0 && !loading) {
            const fetchAlertCounts = async () => {
                setFetchingAlertCounts(true);
                const counts: Record<string, number> = {};

                try {
                    const promises = recentIncidents.map(async (incident) => {
                        try {
                            const alerts = await AlertService.getAlertsByIncidentID(incident.ID);
                            counts[incident.ID] = alerts.length;
                        } catch (error) {
                            console.error(`Error fetching alerts for incident: ${incident.ID}`, error);
                            counts[incident.ID] = 0;
                        }
                    });
                    await Promise.all(promises);
                    setAlertCounts(counts);

                    // Filter incidents by date range and merge with alert counts
                    const filteredIncidents = filterIncidentsByDateRange(recentIncidents);
                    const incidentsWithCounts = filteredIncidents.map(incident => ({
                        ...incident,
                        alertCount: counts[incident.ID] || 0
                    }));
                    
                    setIncidents(incidentsWithCounts);
                } catch (error) {
                    console.error("Error fetching alert counts:", error);
                } finally {
                    setFetchingAlertCounts(false);
                }
            };   
            fetchAlertCounts();
        } else {
            // If no incidents or still loading, filter the empty array
            const filteredIncidents = filterIncidentsByDateRange(recentIncidents);
            setIncidents(filteredIncidents);
        }
    }, [recentIncidents, loading, startDate, endDate, isFiltered]);

    const emptyState = getEmptyStateMessage();

    return (
        <div className = "col-span-1 rounded-lg bg-white p-6 shadow-md md:col-span-2">
            <div className = "flex items-center justify-between mb-6">
                <h3 className = "text-xl font-light text-gray-800">{getTableTitle()}</h3>
                <a
                    href = "/incidents"
                    className = "inline-flex items-center text-sm font-medium text-blue-900 hover:text-pink-800 gap-2"
                >
                    View All Incidents
                    <ArrowRight className = "h-4 w-4" />
                </a>
            </div>

            <div className = "overflow-x-auto w-full">
                {loading || fetchingAlertCounts ? (
                    <div className = "flex justify-center items-center h-64 w-full">
                        <div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"/>
                    </div>
                ) : incidents.length === 0 ? (
                    <div className = "text-center py-16 text-gray-500 bg-gray-50 rounded-md w-full">
                        <svg
                            className = "mx-auto h-12 w-12 text-gray-400"
                            fill = "none"
                            viewBox = "0 0 24 24"
                            stroke = "currentColor"
                            aria-hidden = "true"
                        >
                             <path
                                strokeLinecap = "round"
                                strokeLinejoin = "round"
                                strokeWidth = {2}
                                d = "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className = "mt-2 text-lg font-medium text-gray-900">{emptyState.title}</h3>
                        <p className = "mt-1 text-sm text-gray-500">{emptyState.subtitle}</p>
                    </div>
                ) : (
                    <table className = "min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Start
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    End
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Related Alerts
                                </th>
                            </tr>
                        </thead>
                        <tbody className = "bg-white divide-y divide-gray-200">
                            {incidents.slice (0, 5).map((incident) => (
                                <tr
                                    key = {incident.ID}
                                    className = "hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                                    onClick = {() => window.location.href = `/incidents/${incident.ID}`}
                                >
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <a
                                            href = {`/incidents/${incident.ID}`}
                                            className = "text-sm font-light text-blue-600 hover:text-blue-800 hover:underline"
                                            onClick = {(e) => e.stopPropagation()}
                                        >
                                            {formatID(incident.ID)}
                                        </a>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = {`flex h-10 w-10 items-center justify-center rounded-full`}>
                                            <span className = "text-sm font-light">
                                                {incident.score}
                                            </span>
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = "text-sm font-light text-gray-900">
                                            {formatUsername(incident.user)}
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = "text-sm font-light text-gray-900">
                                            {new Date(incident.windows_start).toLocaleString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = "text-sm font-light text-gray-900">
                                            {new Date(incident.windows_end).toLocaleString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                            })}
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = {`flex h-8 w-8 items-center justify-center rounded-full mr-2 ${
                                            (incident.alertCount || 0) > 10 ? "bg-red-100 text-red-900" :
                                            (incident.alertCount || 0) > 5 ? "bg-orange-100 text-orange-900" :
                                            "bg-blue-100 text-blue-900"
                                        }`}>
                                            <span className = "text-sm font-medium"> {(incident.alertCount || 0) > 99 ? "99+" : incident.alertCount} </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};