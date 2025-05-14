
// frontend/src/components/incident-id-page/IncidentSummaryCard.tsx

"use client";

import React from "react";
import { StatusBadge } from "../ui/StatusBadge";
import { Clock, AlertCircle } from "lucide-react";
import { Incident } from "@/types/incident.types";

interface IncidentSummaryCardProps {
    incident: Incident;
    MITRETactics: string[];
    incidentDuration: {
        start_time: Date | null;
        end_time: Date | null;
        duration: string;
    };
    totalAlerts: number;
    onShowAlerts: () => void;
    getScoreSeverity: (score: number) => 'low' | 'medium' | 'high' | 'critical';
}

export const IncidentSummaryCard: React.FC<IncidentSummaryCardProps> = ({
    incident,
    MITRETactics,
    totalAlerts,
    incidentDuration,
    onShowAlerts,
    getScoreSeverity
}) => {
    // Calculate duration from windows_start to windows_end
    const calculateWindowDuration = () => {
        const startTime = new Date(incident.windows_start);
        const endTime = new Date(incident.windows_end);
        const diffMs = endTime.getTime() - startTime.getTime();
        
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    return (
        <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Incident Summary</h2>
            </div>
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First Row */}
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">User</h3>
                        <p className="text-sm text-gray-900">{incident.user}</p>
                    </div>

                    

                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">Start Time</h3>
                        <p className="text-sm text-gray-900">
                            {new Date(incident.windows_start).toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                        <div className="flex items-center text-sm text-gray-900">
                            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                            <span>{calculateWindowDuration()}</span>
                        </div>
                    </div>

                    {/* Second Row */}

                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">Score</h3>
                        <div className="flex items-center">
                            <StatusBadge status={getScoreSeverity(incident.score)} />
                            <span className="ml-2 text-sm text-gray-900">{incident.score}</span>
                        </div>
                    </div>

    

                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">End Time</h3>
                        <p className="text-sm text-gray-900">
                            {new Date(incident.windows_end).toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">Related Alerts</h3>
                        <div>
                            <button
                                onClick={onShowAlerts}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Show all related alerts ({totalAlerts})
                            </button>
                        </div>
                    </div>

                    {/* Third Row - Full Width */}
                    <div className="md:col-span-3 space-y-1">
                        <h3 className="text-sm font-medium text-gray-500">MITRE Tactics Used:</h3>
                        <div className="flex flex-wrap gap-2">
                            {MITRETactics.length > 0 ? (
                                MITRETactics.map((tactic, index) => (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-800">
                                        {tactic}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500 italic">No MITRE tactics found</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


