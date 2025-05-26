// frontend/src/components/incidents/id/IncidentTimeline.tsx
import React from "react";
import { IncidentTimelineProps } from "../constants/interfaces";
import { handleMITRETacticClick, handleMITRETechniqueClick, isTacticClickable, isTechniqueClickable } from "../constants/functions";

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events, className = "" }) => {
    if (events.length === 0) {
        return (
            <div className = "flex items-center justify-center h-full text-gray-600 text-sm p-8">
                No timeline events to display.
            </div>
        );
    }

    return (
        <div className = {`${className} h-full`}>
            <div className = "overflow-y-auto max-h-[calc(100vh-300px)] p-4">
                <div className = "relative">
                    <div className = "absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                    <div className = "space-y-12">
                        {events.map((event, index) => (
                            <div key = {event.id} className = "relative pl-10">
                                <div className = "text-sm text-gray-900 mb-2 font-light">
                                    {event.date} {event.timestamp}
                                </div>
                                <div className = {`absolute left-2.5 top-1 transform w-3 h-3 rounded-full border-4 border-red-200 shadow-sm bg-red-600`} />
                                <div className = "bg-white border border-gray-300 rounded-lg shadow-sm">
                                    <div className = "p-4 pb-2">
                                        <div className = "flex items-start justify-between">
                                            <div className = "flex-1">
                                                {event.MITRE_tactic && event.MITRE_technique && (
                                                    <div className = "flex items-center flex-wrap gap-1">
                                                        {isTacticClickable(event.MITRE_tactic) ? (
                                                            <button
                                                                onClick = {() => handleMITRETacticClick(event.MITRE_tactic!)}
                                                                className = "text-gray-900 text-sm font-semibold hover:text-indigo-600 hover:underline transition-colors cursor-pointer inline-flex items-center"
                                                                aria-label={`Click for ${event.MITRE_tactic} MITRE details`}
                                                            >
                                                                {event.MITRE_tactic}
                                                            </button>
                                                        ) : (
                                                            <span className = "text-gray-900 text-sm font-semibold">
                                                                {event.MITRE_tactic}
                                                            </span>
                                                        )}
                                                        <span className = "font-light text-xs text-gray-600"> via </span>
                                                        {isTechniqueClickable(event.MITRE_technique) ? (
                                                            <button
                                                                onClick = {() => handleMITRETechniqueClick(event.MITRE_technique!)}
                                                                className = "text-gray-900 text-sm font-semibold hover:text-indigo-600 hover:underline transition-colors cursor-pointer inline-flex items-center"
                                                                aria-label = {`Click for ${event.MITRE_technique} MITRE details`}
                                                            >
                                                                {event.MITRE_technique}
                                                            </button>
                                                        ) : (
                                                            <span className = "text-gray-900 text-sm font-semibold">
                                                                {event.MITRE_technique}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button className = "text-gray-400 hover:text-gray-600">
                                                <svg className = "h-5 w-5" viewBox = "0 0 20 20" fill = "currentColor">
                                                    <path d = "M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className = "px-4 py-2">
                                        <div className = "mb-3">
                                            <h4 className = "text-xs font-semibold text-gray-700 mb-1"> Description </h4>
                                            <p className = "text-xs text-gray-700"> {event.description}. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};