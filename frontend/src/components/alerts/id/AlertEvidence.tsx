// frontend/src/components/alerts/id/AlertEvidence.tsx

import { AlertEvidenceProps } from "../constants/interfaces";
import { FileText, ChevronUp, ChevronDown } from "lucide-react";
import { getSortedEvidenceEntries, formatEvidenceValue } from "@/constants/functions";

export const AlertEvidence: React.FC<AlertEvidenceProps> = ({ alert, expandedEvidenceSection, toggleEvidenceSection }) => {
    const hasEvidence = alert.evidence && Object.keys(alert.evidence).length > 0;
    const isExpanded = expandedEvidenceSection[`${alert.ID}-properties`];
    const evidenceCount = hasEvidence ? getSortedEvidenceEntries(alert.evidence).length : 0;

    const handleToggle = () => {
        toggleEvidenceSection(alert.ID, "properties");
    };

    return (
        <div className = "space-y-4">
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className = "h-4 w-4 mr-2 text-indigo-600" />
                Evidence 
                {hasEvidence && (
                    <span className = "ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        {evidenceCount}
                    </span>
                )}
            </h4>
            {hasEvidence ? (
                <div className = "border rounded-md overflow-hidden bg-white shadow-sm">
                    <button
                        onClick = {handleToggle}
                        className = "group w-full px-4 py-3 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                    >
                        <div className = "flex items-center justify-between">
                            <h5 className = "text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                Evidence Properties
                            </h5>
                            <div className = "flex items-center space-x-2">
                                <span className = "text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                                    {isExpanded ? "Collapse" : "Expand"}
                                </span>
                                {isExpanded ? (
                                    <ChevronUp className = "h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
                                ) : (
                                    <ChevronDown className = "h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
                                )}
                            </div>
                        </div>
                    </button>
                    <div 
                        className = {`transition-all duration-300 ease-in-out bg-white ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        style={{ maxHeight: isExpanded ? "24rem" : "0rem"}}
                    >
                        <div className = "border-t border-gray-200 overflow-y-auto max-h-96 space-y-2 p-4">
                            {getSortedEvidenceEntries(alert.evidence).map(([key, value], index) => (
                                <div 
                                    key = {key} 
                                    className = "py-3 px-4 hover:bg-slate-50 rounded-md transition-all duration-300 border-l-2 border-transparent hover:border-slate-200"
                                >
                                    <div className = "flex items-center gap-4">
                                        <div className = "text-sm font-medium text-slate-900 min-w-0 w-1/6 flex-shrink-0">
                                            {key}
                                        </div>
                                        <div className = "text-sm text-slate-600 font-mono bg-slate-50 px-3 py-2 rounded border flex-1 min-w-0 break-all">
                                            {formatEvidenceValue(value)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className = "border rounded-md overflow-hidden bg-white shadow-sm">
                    <div className = "py-6 text-center text-sm text-slate-500">
                        No evidence details available
                    </div>
                </div>
            )}
        </div>
    );
};