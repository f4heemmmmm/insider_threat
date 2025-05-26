// frontend/src/components/alerts/id/AlertMITREFramework.tsx

import React from "react";
import { AlertProps } from "../constants/interfaces";
import { Shield, ExternalLink, Target, Eye } from "lucide-react";
import { handleMITRETacticClick, handleMITRETechniqueClick, isTacticClickable, isTechniqueClickable } from "../constants/functions";

export const AlertMITREFramework: React.FC<AlertProps> = ({ alert }) => {
    // Check if the MITRE tactic/technique is clickable
    const isTacticClickableResult = isTacticClickable(alert.MITRE_tactic || "");
    const isTechniqueClickableResult = isTechniqueClickable(alert.MITRE_technique || "");

    return (
        <div>
            <div className = "flex items-center gap-2">
                <Shield className = "h-4 w-4 text-slate-600" />
                <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider"> MITRE Framework Details </h4>
            </div>
            <div className = "bg-white">
                <div className = "p-6 space-y-6">
                    {/* MITRE TACTIC */}
                    <div className = "space-y-3">
                        <div className = "flex items-center gap-2">
                            <span className = "text-sm font-medium text-slate-700"> MITRE Tactic </span>
                        </div>
                        <div className = "relative">
                            <button
                                onClick = {() => handleMITRETacticClick(alert.MITRE_tactic || "")}
                                disabled = {!(isTacticClickableResult)}
                                className = {`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 font-mono text-sm ${
                                    isTacticClickableResult
                                        ? "bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 cursor-pointer group"
                                        : "bg-slate-50 border-slate-200 text-slate-600 cursor-default"
                                }`}
                                aria-label = {isTacticClickableResult ? `Click for ${alert.MITRE_tactic} details` : "MITRE Tactic"}
                            >
                                <div className = "flex items-center justify-between">
                                    <span className = "truncate"> {alert.MITRE_tactic || "N/A"} </span>
                                    {isTacticClickableResult && (
                                        <ExternalLink className = "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                    {/* MITRE TECHNIQUE */}
                    <div className = "space-y-3">
                        <div className = "flex items-center gap-2">
                            <span className = "text-sm font-medium text-slate-700"> MITRE Technique </span>
                        </div>
                        <div className = "relative">
                            <button
                                onClick = {() => handleMITRETechniqueClick(alert.MITRE_technique || "")}
                                disabled = {!isTechniqueClickableResult}
                                className = {`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 font-mono text-sm ${
                                    isTechniqueClickableResult
                                        ? "bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 cursor-pointer group"
                                        : "bg-slate-50 border-slate-200 text-slate-600 cursor-default"
                                }`}
                                aria-label = {isTechniqueClickableResult ? `Click for ${alert.MITRE_technique} details` : "MITRE Technique"}
                            >
                                <div className = "flex items-center justify-between">
                                    <span className = "truncate"> {alert.MITRE_technique || "N/A"} </span>
                                    {isTechniqueClickableResult && (
                                        <ExternalLink className = "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                    {/* DETECTION MODEL */}
                    <div className = "space-y-3">
                        <div className = "flex items-center gap-2">
                            <span className = "text-sm font-medium text-slate-700"> Detection Model </span>
                        </div>
                        <div className = "px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className = "text-sm font-mono text-slate-700">
                                {alert.Detection_model || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};