// frontend/src/components/incidents/id/RelatedAlertsModal.tsx

import React from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle } from "lucide-react";
import { RelatedAlertCard } from "./RelatedAlertCard";
import { RelatedAlertsModalProps } from "../constants/interfaces";

export const RelatedAlertsModal: React.FC<RelatedAlertsModalProps> = ({ isOpen, onClose, alerts, incidentID }) => {
    const router = useRouter();

    const handleAlertClick = (alertID: string) => {
        router.push(`/alerts/${alertID}`);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className = "fixed inset-0 z-50 overflow-y-auto">
            <div className = "fixed inset-0 backdrop-blur-md transition-opacity" onClick = {handleBackdropClick}>
                {/* MODAL */}
                <div className = "flex min-h-full items-center justify-center p-4">
                    <div className = "relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col">
                        {/* HEADER */}
                        <div className = "flex items-center justify-between p-6">
                            <div className = "flex items-center">
                                <div>
                                    <h2 className = "text-xl font-semibold text-gray-900"> Related Alerts </h2>
                                    <p className = "text-sm text-gray-500">
                                        {alerts.length} alert{alerts.length !== 1 ? "s" : ""} found for this incident.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick = {onClose}
                                className = "rounded-full p-2 hover:bg-gray-100 transition-colors"
                            >
                                <X className = "h-7 w-7 text-gray-500" />
                            </button>
                        </div>
                        <div className = "flex-1 overflow-y-auto p-6">
                            {alerts.length === 0 ? (
                                <div className = "text-center py-12">
                                    <AlertTriangle className = "h-12 w-12 text-red-300 mx-auto mb-4" />
                                    <h3 className = "text-lg font-medium text-gray-900 mb-2"> No related alerts found. </h3>
                                    <p className = "text-gray-500"> This incident does not have any associated alerts. </p>
                                </div>
                            ) : (
                                <div className = "grid gap-4">
                                    {alerts.map((alert) => (
                                        <RelatedAlertCard
                                            key = {alert.ID}
                                            alert = {alert}
                                            onClick = {() => handleAlertClick(alert.ID)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* FOOTER */}
                        <div className = "flex justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick = {onClose}
                                className = "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};