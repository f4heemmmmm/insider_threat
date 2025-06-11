// frontend/src/components/incidents/id/IncidentSummaryCard.tsx

"use client";

import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IncidentSummaryCardProps } from "../constants/interfaces";
import { getWindowDuration, handleMITRETacticClick, isTacticClickable} from "../constants/functions";

export const IncidentSummaryCard: React.FC<IncidentSummaryCardProps> = ({ incident, MITRETactics, totalAlerts, incidentDuration, onShowAlerts, getScoreSeverity }) => {
    const handleShowAlertsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Show alerts button clicked in incident summary card.");
        onShowAlerts();
    };

    return (
        <div className = "bg-white border border-gray-100 rounded-lg mb-6 shadow-lg">
            <div className = "px-8 py-6 border-b border-gray-50">
                <div className = "flex items-center justify-between">
                    <span className = "text-sm font-medium text-gray-500 bg-gray-50 py-1 rounded-md">
                        ID: {incident.id}
                    </span>
                </div>
            </div>
            <div className = "px-8 py-8">
                <div className = "grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className = "space-y-3">
                        <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4"> User </h3>
                        <p className = "text-lg text-gray-800 font-light"> {incident.user} </p>
                    </div>
                    <div className = "space-y-3">
                        <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4"> Start </h3>
                        <p className = "text-lg text-gray-800 font-light"> {new Date(incident.windows_start).toLocaleString()} </p>
                    </div>
                    <div className = "space-y-3">
                        <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4"> Duration </h3>
                        <p className = "text-lg text-gray-800 font-light"> {getWindowDuration(incident.windows_start, incident.windows_end)} </p>
                    </div>
                    <div className = "space-y-3">
                        <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4"> Score </h3>
                        <div className = "flex items-center gap-3">
                            <StatusBadge status = {getScoreSeverity(incident.score)} />
                            <span className = "text-lg text-gray-800 font-light"> {incident.score} </span>
                        </div>
                    </div>
                    <div className = "space-y-3">
                        <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4"> End </h3>
                        <p className = "text-lg text-gray-800 font-light">
                            {new Date(incident.windows_end).toLocaleString()}
                        </p>
                    </div>
                    <div className = "space-y-3">
                        <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4"> Related Alerts </h3>
                        <div>
                            <button
                                type = "button"
                                onClick = {handleShowAlertsClick}
                                className = "px-2 py-2 text-base font-light text-gray-900 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 focus:outline-none hover:cursor-pointer focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-200"
                            >
                                Show all related alerts ({totalAlerts})
                            </button>
                        </div>
                    </div>
                    <div className = "md:col-span-3 pt-6 border-t border-gray-300">
                        <div className = "space-y-4">
                            <h3 className = "text-sm font-semibold text-gray-500 uppercase tracking-wider h-4">
                                ATT&CK MITRE Tactics
                            </h3>
                            <div className = "flex flex-wrap gap-5">
                                {MITRETactics.length > 0 ? (
                                    MITRETactics?.map((tactic, index) => {
                                        const isClickable = isTacticClickable(tactic);
                                        return (
                                            <button
                                                key = {index}
                                                onClick = {() => handleMITRETacticClick(tactic)}
                                                disabled = {!isClickable}
                                                className = {`px-3 py-1.5 text-lg font-light rounded-md border transition-all duration-200 ${
                                                    isClickable
                                                        ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                                                        : "bg-gray-50 text-gray-400 border-gray-100 cursor-default"
                                                }`}
                                                aria-label = {isClickable ? `Click for ${tactic} MITRE details` : `MITRE Tactic: ${tactic}`}
                                            >
                                                {tactic}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <span className = "text-sm text-gray-500 italic"> No MITRE tactics found. </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};