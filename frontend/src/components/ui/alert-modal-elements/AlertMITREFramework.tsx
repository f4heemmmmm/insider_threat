// frontend/src/components/ui/alert-modal-elements/AlertMITREFramework.tsx:

import React from "react";
import { ExternalLink } from "lucide-react";
import { AlertProps } from "@/constants/interface";
import { getMITREInformation } from "@/data/MITREData";

export const AlertMITREFramework: React.FC<AlertProps> = ({ alert }) => {
    const handleTacticClick = () => {
        if (!alert.MITRE_tactic || alert.MITRE_tactic === "N/A") {
            return;
        }
        
        const tacticInformation = getMITREInformation(alert.MITRE_tactic);
        if (tacticInformation) {
            window.open(tacticInformation.url, "_blank", "noopener,noreferrer");
        } else {
            console.error("No MITRE information found for the tactic specified.");
        }
    };

    const handleTechniqueClick = () => {
        if (!alert.MITRE_technique || alert.MITRE_technique === "N/A") {
            return;
        }
        
        const techniqueInformation = getMITREInformation(alert.MITRE_technique);
        if (techniqueInformation) {
            window.open(techniqueInformation.url, "_blank", "noopener,noreferrer");
        } else {
            console.error("No MITRE information found for the technique specified.");
        }
    };

    // Check if the MITRE tactic is clickable
    const tacticInformation = alert.MITRE_tactic ? getMITREInformation(alert.MITRE_tactic) : null;
    const isTacticClickable = Boolean(tacticInformation);

    // Check if the MITRE technique is clickable
    const techniqueInformation = alert.MITRE_technique ? getMITREInformation(alert.MITRE_technique) : null;
    const isTechniqueClickable = Boolean(techniqueInformation);

    return (
        <div className = "relative">
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <ExternalLink className = "h-4 w-4 mr-2 text-indigo-700" />
                MITRE Framework Details
            </h4>
            <div className = "bg-white p-4 rounded-md border border-gray-200 shadow-md">
                <div className = "space-y-4 text-sm flex flex-col gap-3 p-3">

                    {/* MITRE TACTIC */}
                    <div className = "flex flex-col gap-2">
                        <span className = "font-medium text-gray-700"> MITRE Tactic </span>
                        <div className = "flex items-center">
                            <button
                                onClick = {handleTacticClick}
                                disabled = {!isTacticClickable}
                                className = {`text-left text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md block w-full ${
                                    isTacticClickable
                                    ? "transition-colors cursor-pointer hover:underline hover:text-blue-600"
                                    : "cursor-default"
                                }`}
                                aria-label = {isTacticClickable ? `Click for ${alert.MITRE_tactic} details.` : "MITRE Tactic"}
                            >
                                {alert.MITRE_tactic || "N/A"}
                            </button>
                        </div>
                    </div>

                    {/* MITRE TECHNIQUE */}
                    <div className = "flex flex-col gap-2">
                        <span className = "font-medium text-gray-700"> MITRE Technique </span>
                        <div className = "flex items-center">
                            <button
                                onClick = {handleTechniqueClick}
                                disabled = {!isTechniqueClickable}
                                className = {`text-left text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md block w-full ${
                                    isTechniqueClickable
                                    ? "transition-colors cursor-pointer hover:underline hover:text-blue-600"
                                    : "cursor-default"
                                }`}
                                aria-label = {isTechniqueClickable ? `Click for ${alert.MITRE_technique} details.` : "MITRE Technique"}
                            >
                                {alert.MITRE_technique || "N/A"}
                            </button>
                        </div>
                    </div>

                    {/* DETECTION MODEL */}
                    <div className = "flex flex-col gap-2">
                        <span className = "text-sm font-medium text-gray-700"> Detection Model </span>
                        <div className = "flex items-center ">
                            <span className = "text-left  text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md block w-full">
                                {alert.Detection_model || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};