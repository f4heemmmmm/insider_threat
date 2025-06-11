// frontend/src/components/ui/alert-modal-elements/AlertIncidentStatus.tsx:

"use client";

import { FileWarning } from "lucide-react";
import { Incident } from "@/types/incident.types";
import React, { useState, useEffect } from "react";
import { AlertProps } from "../constants/interfaces";
import { AlertService } from "@/services/alert.service";


export const AlertIncidentStatus: React.FC<AlertProps> = ({ alert }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [incident, setIncident] = useState<Incident | null>(null);

    const fetchRelatedIncident = async () => {
        console.log("Fetching related incident...");

        try {
            setLoading(true);

            // Try retrieving incident using its incident ID
            if (alert.incident_id) {
                try {
                    const { IncidentService } = await import("@/services/incident.service");
                    const relatedIncident = await IncidentService.getIncidentByID(alert.incident_id);
                    console.log("Incident found!");
                    setIncident(relatedIncident);
                    return;
                } catch(error) {
                    console.error("Error fetching incident by ID: ", error);
                }
            }

            // Fallback: Try the alert's relationship endpoint
            const relatedIncident = await AlertService.getIncidentForAlert(alert.id);
            setIncident(relatedIncident);
        } catch (error) {
            console.error("Error fetching for alert: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (alert.is_under_incident) {
            fetchRelatedIncident();
        }
    }, [alert]);

    return (
        <div>
            <div className = "flex items-center gap-2 mb-3">
                <FileWarning className = "h-4 w-4 text-slate-600" />
                <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider"> Incident Status </h4>
            </div>            
            <div className = "bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className = "flex items-center justify-between">
                    <span className = "font-medium text-gray-700"> Incident </span>
                    {alert.is_under_incident ? (
                        <span className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Incident Related
                        </span>
                    ) : (
                        <span className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Not Incident Related
                        </span>
                    )}
                </div>
                {alert.is_under_incident && (
                    <div className = "space-y-3 text-sm">
                        {loading ? (
                            <div className = "text-gray-500 py-2"> Loading incident information...</div>
                        ) : incident ? (
                            <div className = "flex flex-col gap-4">
                                <div className = "flex items-center justify-between mt-4">
                                    <span className = "text-gray-600 w-1/2"> Incident ID </span>
                                    <span className = "text-xs font-light text-gray-500 flex items-center">
                                        <a href = {`/incidents/${incident.id}`} className = "ml-1 text-blue-500 hover:text-blue-700 hover:underline">
                                            {incident.id.substring(0, 30)}...
                                        </a>
                                    </span>
                                </div>
                                <div className = "flex items-center justify-between">
                                    <span className = "text-gray-600 w-1/2"> Start </span>
                                    <span className = "text-xs font-semibold text-gray-500">
                                        {new Date(incident.windows_start).toLocaleString()}
                                    </span>
                                </div>
                                <div className = "flex items-center justify-between">
                                    <span className = "text-gray-600 w-1/2"> End </span>
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
                            </div>
                        ) : (
                            <div className = "text-yellow-500 py-2">
                                This incident is marked as incident-related, but incident details are unavailable at the moment.
                                {alert.incident_id && (
                                    <div className = "mt-1 text-gray-500"> Incident ID {alert.incident_id.substring(0, 50)}... </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};