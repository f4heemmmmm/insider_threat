// src/components/ui/alert-model-elements/EventsList.tsx

import React, { JSX, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IndexedSharePointEvent } from "@/constants/interface";

// Function Import
import { formatValue } from "@/constants/functions";

interface EventsListProps {
    filteredEvents: IndexedSharePointEvent[];
}

const EventsList: React.FC<EventsListProps> = ({ filteredEvents }) => {
    const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
    const [expandedProperties, setExpandedProperties] = useState<Record<string, boolean>>({});

    const toggleEvent = (index: number): void => {
        setExpandedEvents(previousState => ({
            ...previousState,
            [index]: !previousState[index]
        }));
    };

    const toggleProperty = (eventIndex: number, propName: string): void => {
        const key = `${eventIndex}-${propName}`;
        setExpandedProperties(previousState => ({
            ...previousState,
            [key]: !previousState[key]
        }));
    };

    // Render a nested JSON object
    const renderNestedObject = (obj: any, eventIndex: number, propName: string, level: number = 0): JSX.Element => {
        if (!obj || typeof obj !== "object") {
            return (
                <div className = "font-mono text-sm pl-4 break-words whitespace-normal">
                    {formatValue(obj)}
                </div>
            );
        }

        return (
            <div className = "pl-4">
                <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {Object.entries(obj).map(([key, value], i) => {
                        if (key === '_originalIndex') return null;
                        const isObject = value !== null && typeof value === "object";
                        const nestedKey = `${eventIndex}-${propName}-${key}`;
                        const isExpanded = expandedProperties[nestedKey];
                        
                        return (
                            <div key = {`${nestedKey}-${i}`} className = "font-mono text-sm">
                                {isObject ? (
                                    <div className = "bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                                        <div className = "flex items-center cursor-pointer hover:bg-gray-50 py-2 px-3" onClick = {() => toggleProperty(eventIndex, `${propName}-${key}`)}>
                                            {isExpanded ? 
                                                <ChevronUp className = "h-3 w-3 mr-1 text-gray-500 flex-shrink-0" /> : 
                                                <ChevronDown className = "h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
                                            }
                                            <span className = "font-semibold text-indigo-600 truncate"> {key} </span>
                                            <span className = "ml-2 text-gray-600 text-xs">
                                                {Array.isArray(value) ? `Array(${value.length})` : 'Object'}
                                            </span>
                                        </div>
                                        {isExpanded && (
                                            <div className = "border-t border-gray-100 bg-gray-50 p-2">
                                                {renderNestedObject(value, eventIndex, `${propName}-${key}`, level + 1)}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className = "bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-3 h-full flex flex-col">
                                        <span className = "font-semibold text-indigo-600 text-xs mb-1 truncate"> {key} </span>
                                        <span className = "text-gray-800 break-all text-sm overflow-hidden break-words whitespace-normal"> {formatValue(value)} </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className = "divide-y divide-gray-100">
            {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => {
                    const isExpanded = expandedEvents[index];
                    const originalEventNumber = event._originalIndex + 1;
                    return (
                        <div key = {index} className = "hover:bg-gray-50">
                            <div
                                className = "flex items-center justify-between px-4 py-3 cursor-pointer"
                                onClick = {() => toggleEvent(index)}
                            >
                                <div className = "flex items-center">
                                    {isExpanded ? <ChevronUp className = "h-4 w-4 mr-2 text-gray-500" /> : <ChevronDown className = "h-4 w-4 mr-2 text-gray-500" />}
                                    <div>
                                        <div className = "font-semibold text-xs text-gray-900">
                                            Event #{originalEventNumber}
                                        </div>
                                        <div className = "text-xs text-gray-500">
                                            {Object.keys(event).filter(key => key !== "_originalIndex").length} properties
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isExpanded && (
                                <div className = "px-4 py-4 bg-gray-50 border-t border-gray-200">
                                    {event.AppAccessContext && (
                                        <div className = "mb-4 rounded-md border border-indigo-200 bg-indigo-50 overflow-hidden">
                                            <h3 className = "text-sm font-medium text-indigo-800 p-3">App Access Context</h3>
                                            <div className = "p-3">
                                                <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    {Object.entries(event.AppAccessContext).map(([key, value]) => (
                                                        <div key = {key} className = "bg-white rounded-md shadow-sm border border-gray-100 p-3">
                                                            <span className = "font-medium text-indigo-700 text-xs block mb-1 truncate">{key}</span>
                                                            <span className = "text-gray-700 text-xs block break-words whitespace-normal truncate">{formatValue(value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {Object.entries(event)
                                            .filter(([key]) => key !== "AppAccessContext" && key !== "_originalIndex")
                                            .map(([key, value], i) => {
                                                const isObject = (value !== null && typeof value === "object");
                                                const propKey = `${index}-${key}`;
                                                const isPropExpanded = expandedProperties[propKey];
                                                return (
                                                    <div key = {`${index}-${key}-${i}`} className = "rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
                                                        <div 
                                                            className = {`px-3 py-2 flex items-center justify-between ${isObject ? "cursor-pointer hover:bg-gray-50" : ""}`}
                                                            onClick = {isObject ? () => toggleProperty(index, key) : undefined}
                                                        >
                                                            <span className = "font-medium text-xs text-gray-700"> {key} </span>
                                                            {isObject && (
                                                                <div className = "flex items-center text-gray-500 text-xs">
                                                                    {Array.isArray(value) ? `Array(${value.length})` : "Object"}
                                                                    {isPropExpanded ?
                                                                        <ChevronUp className = "h-4 w-4 ml-1" /> :
                                                                        <ChevronDown className = "h-4 w-4 ml-1" />
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                        {!isObject && (
                                                            <div className = "px-3 py-2">
                                                                <div className = "text-gray-600 font-mono text-xs break-words max-h-20 overflow-y-auto">
                                                                    {formatValue(value)}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {isObject && isPropExpanded && (
                                                            <div className = "overflow-x-auto p-3">
                                                                {renderNestedObject(value, index, key)}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className = "text-center py-8 text-gray-500">
                    No events match your search criteria.
                </div>
            )}
        </div>
    );
};

export default EventsList;