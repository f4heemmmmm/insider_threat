// frontend/src/components/ui/alert-modal-elements/AlertIncidentStatus.tsx:

"use client";

import { ExternalLink } from "lucide-react";
import React, { useState, useEffect } from "react";
import { AlertProps } from "@/constants/interface";
import { AlertService } from "@/services/alert.service";

import { Incident } from "@/types/incident.types";

export const AlertIncidentStatus: React.FC<AlertProps> = ({ alert }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [incident, setIncident] = useState<Incident | null>(null);

    const fetchRelatedIncident = async () => {
        console.log("Fetching related incident...");

        try {
            setLoading(true);

            // Try retrieving incident using its incident ID
            if (alert.incidentID) {
                try {
                    const { IncidentService } = await import("@/services/incident.service");
                    const relatedIncident = await IncidentService.getIncidentByID(alert.incidentID);
                    console.log("Incident found!");
                    setIncident(relatedIncident);
                    return;
                } catch(error) {
                    console.error("Error fetching incident by ID: ", error);
                }
            }

            // Fallback: Try the alert's relationship endpoint
            const relatedIncident = await AlertService.getIncidentForAlert(alert.ID);
            setIncident(relatedIncident);
        } catch (error) {
            console.error("Error fetching for alert: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (alert.isUnderIncident) {
            fetchRelatedIncident();
        }
    }, [alert]);

    return (
        <div>
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3"> Incident Status </h4>
            <div className = "bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className = "flex items-center justify-between">
                    <span className = "font-medium text-gray-700"> Incident </span>
                    {alert.isUnderIncident ? (
                        <span className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Incident Related
                        </span>
                    ) : (
                        <span className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Not Incident Related
                        </span>
                    )}
                </div>
                {alert.isUnderIncident && (
                    <div className = "space-y-3 text-sm">
                        {loading ? (
                            <div className = "text-gray-500 py-2"> Loading incident information...</div>
                        ) : incident ? (
                            <>
                                <div className = "flex items-center justify-between">
                                    <span className = "text-gray-600 w-1/2"> Incident ID </span>
                                    <span className = "text-xs font-semibold text-gray-500 flex items-center">
                                        {incident.ID.substring(0, 50)}...
                                        <a href = {`/incidents/${incident.ID}`} className = "ml-1 text-blue-500 hover:text-blue-700 hover:underline">
                                            <ExternalLink className = "h-3 w-3" />
                                        </a>
                                    </span>
                                </div>
                                <div className = "flex items-center justify-between">
                                    <span className = "text-gray-600 w-1/2"> Start Time </span>
                                    <span className = "text-xs font-semibold text-gray-500">
                                        {new Date(incident.windows_start).toLocaleString()}
                                    </span>
                                </div>
                                <div className = "flex items-center justify-between">
                                    <span className = "text-gray-600 w-1/2"> End Time </span>
                                    <span className = "text-xs font-semibold text-gray-500">
                                        {new Date(incident.windows_end).toLocaleString()}
                                    </span>
                                </div>
                                <div className = "flex items-center justify-between">
                                    <span className = "text-gray-600 w-1/2"> Score </span>
                                    <span className = "text-xs font-semibold text-gray-500">
                                        {incident.score}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className = "text-yellow-500 py-2">
                                This incident is marked as incident-related, but incident details are unavailable at the moment.
                                {alert.incidentID && (
                                    <div className = "mt-1 text-gray-500"> Incident ID {alert.incidentID.substring(0, 50)}... </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};