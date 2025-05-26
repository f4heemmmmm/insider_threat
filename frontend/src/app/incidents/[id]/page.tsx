// frontend/src/app/incidents/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";
import React, { useState, useEffect } from "react";
import { IncidentService } from "@/services/incident.service";
import { calculateIncidentDuration, extractMITRETactics, getScoreSeverity, mapAlertsToTimelineEvents } from "@/constants/functions";
import { TimelineEvent } from "@/components/incidents/constants/interfaces";
import { IncidentTimeline } from "@/components/incidents/id/IncidentTimeline";
import { RelatedAlertsModal } from "@/components/incidents/id/RelatedAlertsModal";
import { IncidentSummaryCard } from "@/components/incidents/id/IncidentSummaryCard";

export default function IncidentDetailsPage() {
    const params = useParams();
    const incidentID = params.id as string;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [MITRETactics, setMITRETactics] = useState<string[]>([]);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [isRelatedAlertsModalOpen, setIsRelatedAlertsModalOpen] = useState(false);

    const [incidentDuration, setIncidentDuration] = useState<{
        start_time: Date | null;
        end_time: Date | null;
        duration: string;
    }>({
        start_time: null,
        end_time: null,
        duration: ""
    });

    // Fetch incident 
    useEffect(() => {
        const fetchIncidentDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                // const response = await IncidentService.getAllIncidents("windows_start", "desc");
                // const foundIncident = response.find(inc => inc.ID === incidentID);
                const foundIncident = await IncidentService.getIncidentByID(incidentID);

                if (!foundIncident) {
                    setError("Incident not found!");
                    setLoading(false);
                    return;
                }
                
                setIncident(foundIncident);

                const alerts = await IncidentService.getRelatedAlerts(foundIncident.ID);
                const sortedAlerts = [...alerts].sort((a, b) =>
                    new Date(a.datestr).getTime() - new Date(b.datestr).getTime()
                );

                setRelatedAlerts(sortedAlerts);

                const timelineEvents = mapAlertsToTimelineEvents(sortedAlerts);
                setTimelineEvents(timelineEvents);

                const tactics = extractMITRETactics(sortedAlerts);
                setMITRETactics(tactics);

                const duration = calculateIncidentDuration(sortedAlerts);
                setIncidentDuration({
                    start_time: duration.earliestAlert || duration.latestAlert as Date | null,
                    end_time: duration.latestAlert || duration.latestAlert as Date | null,
                    duration: duration.duration
                });
            } catch (err) {
                console.error("Error fetching incident details: ", err);
                setError("Failed to load incident details.");
            } finally {
                setLoading(false);
            }
        };

        if (incidentID) {
            fetchIncidentDetails();
        }
    }, [incidentID]);

    const handleShowRelatedAlertsModal = () => {
        console.log("Show alerts clicked - opening modal.");
        setIsRelatedAlertsModalOpen(true);
    };

    const handleCloseRelatedAlertsModal = () => {
        console.log("Closing alerts modal.");
        setIsRelatedAlertsModalOpen(false);
    };

    if (loading) {
        return (
            <div className = "flex justify-center items-center h-64 w-full">
                <div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className = "bg-red-50 p-4 my-4">
                <div className = "flex">
                    <div className = "flex-shrink-0">
                        <svg className = "h-5 w-5 text-red-400" viewBox = "0 0 20 20" fill = "currentColor">
                            <path fillRule = "evenodd" d = "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule = "evenodd" />
                        </svg>
                    </div>
                    <div className = "ml-3">
                        <p className = "text-sm text-red-700"> {error} </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!incident) {
        return (
            <div className = "text-center py-16 text-gray-500 bg-gray-50 rounded-md max-w-8xl">
                <h3 className = "mt-2 text-lg font-medium text-gray-900"> Incident not found </h3>
                <p className = "mt-1 text-sm text-gray-500"> The incident you're looking for does not exist or has been removed. </p>
                <div className = "mt-6" />
            </div>
        );
    }

    return (
        <div className = "p-8">
            <div className = "flex justify-between items-center mb-6">
                <h1 className = "text-2xl font-semibold text-gray-900"> Incident Details </h1>
            </div>
            <IncidentSummaryCard
                incident = {incident}
                incidentDuration = {incidentDuration}
                MITRETactics = {MITRETactics}
                totalAlerts = {relatedAlerts.length}
                onShowAlerts = {handleShowRelatedAlertsModal}
                getScoreSeverity = {getScoreSeverity}
            />
            <div className = "w-full h-[calc(100vh-200px)] bg-white shadow rounded-lg">
                <div className = "px-6 py-4 border-b border-gray-200">
                    <h2 className = "text-lg font-semibold text-gray-900"> Incident Timeline </h2>
                </div>
                <IncidentTimeline
                    events = {timelineEvents}
                    className = "flex-grow"
                />
            </div>
            <RelatedAlertsModal
                isOpen = {isRelatedAlertsModalOpen}
                onClose = {handleCloseRelatedAlertsModal}
                alerts = {relatedAlerts}
                incidentID = {incidentID}
            />
        </div>
    );
};