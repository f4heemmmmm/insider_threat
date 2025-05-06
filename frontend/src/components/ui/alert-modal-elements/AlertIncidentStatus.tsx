// frontend/src/components/ui/alert-modal-elements/AlertIncidentStatus.tsx

import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert } from "@/types/alert.types";
import { AlertProps } from "@/constants/interface";

export const AlertIncidentStatus: React.FC<AlertProps> = ({ alert }) => {
    return (
        <div>
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <AlertCircle className = "h-4 w-4 mr-2 text-indigo-600" />
                Incident Status
            </h4>
            <div className = "bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className = "flex items-center justify-between">
                    <span className = "font-medium text-gray-700"> Incident </span>
                    {alert.isUnderIncident ?
                        <span className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Incident Related
                        </span> :
                        <span className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Not Incident Related
                        </span> 
                    }
                </div>
                {alert.isUnderIncident && (
                    <div className = "space-y-3 text-sm mt-2">
                        <div className = "flex items-center justify-between">
                            <span className = "text-gray-600 w-1/2"> Created </span>
                            <span className = "text-xs font-semibold text-gray-500"> {new Date(alert.created_at).toLocaleString()} </span>
                        </div>
                        <div className = "flex items-center justify-between">
                            <span className = "text-gray-600 w-1/2"> Alert Occurence </span>
                            <span className = "text-xs font-semibold text-gray-500"> {new Date(alert.datestr).toLocaleString()} </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};