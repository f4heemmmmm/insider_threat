// frontend/src/components/dashboard/RecentAlertsTable.tsx

import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { RecentAlertsTableProps } from "./constants/interfaces";
import { formatUsername, formatID, formatMITREInformation } from "./constants/functions"; 

import { Alert } from "@/types/alert.types";

export const RecentAlertsTable: React.FC<RecentAlertsTableProps> = ({ loading, recentAlerts }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        setAlerts(recentAlerts);
    }, [recentAlerts]);

    return (
        <div className = "col-span-1 rounded-lg bg-white p-6 shadow-md md:col-span-2">
            <div className = "flex items-center justify-between mb-6">
                <h3 className = "text-xl font-light text-gray-800"> Recent Alerts </h3>
                <a
                    href = "/alerts"
                    className = "inline-flex items-center text-sm font-medium text-blue-900 hover:text-pink-800 gap-2"
                >
                    View All Alerts
                    <ArrowRight className = "h-4 w-4" />
                </a>
            </div>

            <div className = "overflow-x-auto w-full">
                {loading ? (
                    <div className = "flex justify-center items-center h-64 w-full">
                        <div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"/>
                    </div>
                ) : alerts.length === 0 ? (
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
                        <h3 className = "mt-2 text-lg font-medium text-gray-900"> No alerts found. </h3>
                        <p className = "mt-1 text-sm text-gray-500"> Recent alerts will appear here. </p>
                    </div>
                ) : (
                    <table className = "min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    MITRE Information
                                </th>
                                <th className = "px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Related Alerts
                                </th>
                            </tr>
                        </thead>
                        <tbody className = "bg-white divide-y divide-gray-200">
                            {alerts.slice (0, 7).map((alert) => (
                                <tr
                                    key = {alert.ID}
                                    className = "hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                                    onClick = {() => window.location.href = `/alerts/${alert.ID}`}
                                >
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <a
                                            href = {`/alerts/${alert.ID}`}
                                            className = "text-sm font-light text-blue-600 hover:text-blue-800 hover:underline"
                                            onClick = {(e) => e.stopPropagation()}
                                        >
                                            {formatID(alert.ID)}
                                        </a>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = "text-sm font-light text-gray-900">
                                            {formatUsername(alert.user)}
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = "text-sm font-light text-gray-900">
                                            {new Date(alert.datestr).toLocaleString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = "text-sm font-light text-gray-900 max-w-xs truncate" title = {formatMITREInformation(alert.MITRE_tactic, alert.MITRE_technique)}>
                                            {formatMITREInformation(alert.MITRE_tactic, alert.MITRE_technique)}
                                        </div>
                                    </td>
                                    <td className = "px-6 py-4 whitespace-nowrap">
                                        <div className = {`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            alert.isUnderIncident 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-gray-100 text-gray-800"
                                        }`}>
                                            {alert.isUnderIncident ? "Under Incident" : "Standalone"}
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