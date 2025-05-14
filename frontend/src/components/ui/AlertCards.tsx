// frontend/src/components/AlertCards.tsx

import React from "react";
import { AlertCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Alert } from "@/types/alert.types";
import { AlertMainDetails } from "./AlertMainDetails";
import { getScoreSeverity } from "@/constants/functions";

interface AlertCardProps {
    alerts: Alert[];
    loading?: boolean;
    onAlertClick?: (alert: Alert) => void; // ✅ Add this prop
}

export const AlertCards: React.FC<AlertCardProps> = ({ 
    alerts, 
    loading = false,
    onAlertClick // ✅ Accept the onAlertClick prop
}) => {
    // ✅ Removed modal-related state since we're using navigation now
    // const [modalOpen, setModalOpen] = useState<boolean>(false);
    // const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    // const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});

    // ✅ Updated to use onAlertClick instead of opening modal
    const handleAlertClick = (alert: Alert) => {
        if (onAlertClick) {
            onAlertClick(alert);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className = "flex justify-center items-center h-64 w-full">
                <div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
        );
    }

    // Empty State
    if (alerts.length === 0) {
        return (
            <div className = "text-center py-16 text-gray-500 bg-white rounded-lg w-full shadow-sm border border-gray-200">
                <AlertCircle className = "mx-auto h-12 w-12 text-gray-400" />
                <h3 className = "mt-2 text-lg font-medium text-gray-900"> No alerts found. </h3>
                <p className = "mt-1 text-sm text-gray-500"> Try adjusting your search criteria or check back later. </p>
            </div>
        );
    }

    return (
        <div className = "space-y-4 w-full mx-auto">
            {alerts.map((alert) => {
                const severity = getScoreSeverity(alert.score);
                return (
                    <div
                        id = {`alert-${alert.ID}`}
                        key = {alert.ID}
                        className = {`mb-6 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 border border-gray-200 hover:shadow-md cursor-pointer transform hover:translate-y-[-2px]`}
                        onClick = {() => handleAlertClick(alert)} // ✅ Updated to use navigation
                    >
                        {/* Alert Header */}
                        <div className = "p-6 flex flex-col gap-5">
                            <div className = "flex justify-between items-center">
                                <div className = "flex items-center gap-2">
                                    <StatusBadge status = {severity} />
                                    <h3 className = "text-base font-semibold text-gray-600"> Alert ID: </h3>
                                    <h3 className = "text-base font-light text-gray-500"> {alert.ID} </h3>
                                </div>
                                <div>
                                    <span className = "font-semibold text-xl"> {alert.score} </span>
                                </div>
                            </div>
                            <AlertMainDetails alert = {alert} />
                            {/* ALERT SUMMARY */}
                            <div className = "px-2 py-4 border-t border-gray-200">
                                <div className = "flex flex-wrap items-center">
                                    {alert.MITRE_tactic && (
                                        <div className = "py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                                            <span className = "mr-1 font-semibold"> MITRE Tactic: </span>
                                            {alert.MITRE_tactic}
                                        </div>
                                    )}

                                    {alert.MITRE_tactic && alert.MITRE_technique && (
                                        <div className = "h-6 border-r border-gray-300 mx-2" />
                                    )}

                                    {alert.MITRE_technique && (
                                        <div className = "py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                                            <span className = "mr-1 font-semibold"> MITRE Technique: </span>
                                            {alert.MITRE_technique}
                                        </div>
                                    )}

                                    {alert.MITRE_technique && alert.Detection_model && (
                                        <div className = "h-6 border-r border-gray-300 mx-2" />
                                    )}

                                    {alert.Detection_model && (
                                        <div className = "py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                                            <span className = "mr-1 font-semibold"> Detection Model: </span>
                                            {alert.Detection_model}
                                        </div>
                                    )}
                                </div>

                                {alert.Description && (
                                    <div className = "text-sm text-gray-600 mt-4 px-4 gap-1 flex flex-col">
                                        <div className = "text-sm font-semibold"> Description: </div>
                                        <div className = "flex items-start">
                                            <p className = "font-light">
                                                {
                                                    alert.Description.length > 250 ?
                                                        `${alert.Description.substring(0, 250)}...` :
                                                        alert.Description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        // ✅ Removed AlertModal since we're using navigation now
    );
};