// src/components/ui/alert-modal-elements/AlertMITREFramework.tsx

import React from "react";
import { ExternalLink } from "lucide-react";
import { AlertProps } from "@/constants/interface";

export const AlertMITREFramework: React.FC<AlertProps> = ({ alert }) => {
    return (
        <div>
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <ExternalLink className = "h-4 w-4 mr-2 text-indigo-600" />
                MITRE Framework Details
            </h4>
            <div className = "bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className = "space-y-4 text-sm">
                    <div className = "flex flex-col">
                        <span className = "font-medium text-gray-700 mb-2"> MITRE Tactic </span>
                        <div className = "flex items-center">
                            <span className = "text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md block w-full">
                                {alert.MITRE_tactic || "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className = "flex flex-col">
                        <span className = "font-medium text-gray-700 mb-2"> MITRE Technique </span>
                        <div className = "flex items-center">
                            <span className = "text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md block w-full">
                                {alert.MITRE_technique || "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className = "flex flex-col">
                        <span className = "font-medium text-gray-700 mb-2"> MITRE Tactic </span>
                        <div className = "flex items-center">
                        <span className = "text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md block w-full">
                            {alert.Detection_model ? `${alert.Detection_model}.` : "N/A"}
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};