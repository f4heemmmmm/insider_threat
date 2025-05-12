// frontend/src/incidents/page.tsx

"use client";

import React, { useEffect, useState } from "react";

// Components Import
import { IncidentCard } from "@/components/incident-main-page/IncidentCard";
import { renderPagination } from "@/components/incident-main-page/IncidentPagination";
import { CardContent, CardHeader, Card, CardTitle } from "@/components/incident-main-page/CardComponents";

// Alert Files
import { Alert } from "@/types/alert.types";
import { AlertService } from "@/services/alert.service";

// Incident Files
import { Incident } from "@/types/incident.types";
import { IncidentService } from "@/services/incident.service";
import { IncidentCardSkeleton } from "@/components/incident-main-page/SkeletonComponents";

export default function IncidentsPage() {
    const [limit] = useState(10);
    const [page, setPage]  = useState(1);
    const [total, setTotal] = useState(0);
    const totalPages = Math.ceil(total / limit);
    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [incidentRelatedAlerts, setIncidentRelatedAlerts] = useState<Map<string, Alert[]>>(new Map());

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                setLoading(true);
                const offset = (page - 1) * limit;
                const response = await IncidentService.getIncidents(limit, offset);
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
        fetchIncidents();
    }, [page, limit]);

    const navigateToIncidentDetails = (incidentID: string) => {
        window.location.href = `/incidents/${incidentID}`;
    };

    return (
        <div className = "container mx-auto px-4 py-8 w-full">
            {/* INCIDENT TITLE */}
            <div className = "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className = "text-xl sm:text-2xl font-semibold tracking-tight text-gray-800 mb-2">
                        <span className = "text-5xl font-light">{incidents.length}</span> Incidents Found
                    </h1>
                </div>
            </div>

            {/* INCIDENT CARDS */}
            <Card className = "shadow-md border-gray-200">
                <CardHeader className = "flex flex-row items-center justify-between pb-2 border-b border-gray-100">
                    <CardTitle className = "text-xl font-semibold text-gray-800"> All Incidents </CardTitle>
                    <div className = "flex items-center gap-2">
                        {/* ADDITIONAL FILTERS/CONTROLS HERE */}
                    </div>
                </CardHeader>
                <CardContent className = "p-4 sm:p-6">
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
                    {totalPages > 1 && renderPagination({page, totalPages, total, limit, setPage})}
                </CardContent>
            </Card>
        </div>
    );
};