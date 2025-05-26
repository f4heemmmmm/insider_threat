// frontend/src/components/alerts/id/AlertRawEvents.tsx

import { RawEventsDisplay } from "./RawEventsDisplay";
import React, { useRef, useEffect, useState } from "react";
import { List, ChevronUp, ChevronDown } from "lucide-react";
import { AlertRawEventsProps } from "../constants/interfaces";

export const AlertRawEvents: React.FC<AlertRawEventsProps> = ({ evidence, alertID, expandedEvidenceSection, toggleEvidenceSection }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isExpanded = expandedEvidenceSection[`${alertID}-rawEvents`];
    const eventCount = Array.isArray(evidence?.list_raw_events) ? evidence.list_raw_events.length : 1;
    const [resetTrigger, setResetTrigger] = useState<number>(0);

    const hasRawEvents = (evidence: any): boolean => {
        return evidence && 
            Object.prototype.hasOwnProperty.call(evidence, "list_raw_events") &&
            evidence.list_raw_events &&
            (
                (Array.isArray(evidence.list_raw_events) && evidence.list_raw_events.length > 0) ||
                (typeof evidence.list_raw_events === "object" && 
                    !Array.isArray(evidence.list_raw_events) &&
                    Object.keys(evidence.list_raw_events).length > 0)
            )
    }

    useEffect(() => {
        if (isExpanded && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [isExpanded]);

    const handleToggleEvidenceSection = () => {
        if (isExpanded) {
            setResetTrigger(prev => prev + 1);
        }
        toggleEvidenceSection(alertID, "rawEvents");
    };

    if (!hasRawEvents(evidence)) {
        return null;
    }

    return (
        <div className = "space-y-4">
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <List className = "h-4 w-4 mr-2 text-indigo-600" />
                Raw Events
                <span className = "ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                    {eventCount}
                </span>
            </h4>
            <div className = "border rounded-md overflow-hidden bg-white shadow-sm">
                <button
                    onClick = {handleToggleEvidenceSection}
                    className = "group w-full px-4 py-3 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                    <div className = "flex items-center justify-between">
                        <h5 className = "text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                            Event Details
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
                    className = {`transition-all duration-300 ease-in-out bg-white overflow-hidden ${isExpanded ? "max-h-[60rem] opacity-100" : "max-h-0 opacity-0"}`}
                    style = {{ maxHeight: isExpanded ? "40rem" : "0rem" }}
                >
                    <div 
                        ref = {scrollContainerRef}
                        className = "border-t border-gray-200 h-full"
                        style = {{ height: isExpanded ? "40rem" : "0", minHeight: 0 }}
                    >
                        <RawEventsDisplay 
                            key = {resetTrigger}
                            rawEvents = {evidence.list_raw_events} 
                            resetScroll = {!isExpanded}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};