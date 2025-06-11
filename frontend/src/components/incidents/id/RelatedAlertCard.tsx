// frontend/src/components/incidents/id/RelatedAlertCard.tsx

import React from "react";
import { getScoreSeverity } from "@/constants/functions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RelatedAlertCardProps } from "../constants/interfaces";
import { AlertMainDetails } from "@/components/alerts/AlertMainDetails";

export const RelatedAlertCard: React.FC<RelatedAlertCardProps> = ({ alert, onClick, className = "" }) => {
    const severity = getScoreSeverity(alert.score);

    const handleClick = () => {
        if (onClick) {
            onClick(alert);
        }
    };

    return (
        <div
            id = {`alert-${alert.id}`}
            className = {`mb-6 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 border border-gray-200 hover:shadow-md cursor-pointer transform hover:translate-y-[-2px] ${className}`}
            onClick = {handleClick}
        >
            <div className = "p-6 flex flex-col gap-5">
                {/* HEADER */}
                <div className = "flex justify-between items-center">
                    <div className = "flex items-center gap-2">
                        <StatusBadge status = {severity} />
                        <h3 className = "text-base font-semibold text-gray-600"> Alert ID: </h3>
                        <h3 className = "text-base font-light text-gray-500"> {alert.id} </h3>
                    </div>
                    <div>
                        <span className = "font-light text-xl"> {alert.score} </span>
                    </div>
                </div>
                <AlertMainDetails alert = {alert} />
                {/* SUMMARY */}
                <div className = "px-2 pt-4 border-t border-gray-200">
                    <div className = "flex flex-wrap items-center">
                        {alert.MITRE_tactic && (
                            <div className = "py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                                <span className = "mr-1 font-semibold"> MITRE Tactic: </span>
                                {alert.MITRE_tactic}
                            </div>
                        )}
                        {alert.MITRE_tactic && alert.MITRE_technique && (
                            <div className = "h-6 border-r border-gray-300" />
                        )}
                        {alert.MITRE_technique && (
                            <div className = "py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                                <span className = "mr-1 font-semibold"> MITRE Technique </span>
                                {alert.MITRE_technique}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};