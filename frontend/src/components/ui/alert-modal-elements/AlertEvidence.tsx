// frontend/src/ui/alert-modal-elements/AlertEvidence.tsx:

import React from "react";
import { Alert } from "@/types/alert.types";
import { FileText, ChevronUp, ChevronDown } from "lucide-react";
import { getSortedEvidenceEntries, formatEvidenceValue } from "@/constants/functions";

interface AlertEvidenceProps {
    alert: Alert;
    expandedEvidenceSection: Record<string, boolean>;
    toggleEvidenceSection: (alertID: string, sectionName: string) => void;
}

export const AlertEvidence: React.FC<AlertEvidenceProps> = ({ alert, expandedEvidenceSection, toggleEvidenceSection}) => {
    return (
        <>
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className = "h-4 w-4 mr-2 text-indigo-600" />
                Evidence Details
            </h4>
            {alert.evidence && Object.keys(alert.evidence).length > 0 ? (
                <div>
                    <div className = "border rounded-md overflow-hidden bg-white shadow-sm mb-4">
                        <div className = "px-4 py-3 bg-gray-50 border-gray-200 flex justify-between items-center">
                            <h5 className = "text-sm font-medium text-gray-700"> Evidence Properties </h5>
                            <button
                                onClick = {() => toggleEvidenceSection(alert.ID, "properties")}
                                className = "flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                                {expandedEvidenceSection[`${alert.ID}-properties`] ? (
                                    <ChevronUp className = "h-4 w-4" />
                                ) : (
                                    <ChevronDown className = "h-4 w-4" />
                                )}
                            </button>
                        </div>
                        
                        {expandedEvidenceSection[`${alert.ID}-properties`] === true && (
                            <table className = "min-w-full divide-y divide-gray-200">
                                <tbody className = "divide-y divide-gray-100 bg-white">
                                    {getSortedEvidenceEntries(alert.evidence).map(([key, value]) => (
                                        <tr key = {key} className = "hover:bg-gray-50">
                                            <td className = "px-4 py-3 text-sm font-medium text-gray-900 align-middle w-1/4">
                                                {key}
                                            </td>
                                            <td className = "px-4 py-3 text-sm text-gray-600 break-all">
                                                <div className = "font-mono bg-gray-50 p-2 rounded">
                                                    {formatEvidenceValue(value)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            ) : (
                <div className = "text-sm text-gray-500 italic bg-white p-4 rounded-md border border-gray-200">
                    No evidence details available.
                </div>
            )}
        </>
    );
};