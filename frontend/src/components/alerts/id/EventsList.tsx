// frontend/src/components/alerts/id/EventsList.tsx

import React, { JSX, useState } from "react";
import { formatValue } from "@/constants/functions";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EventsListProps } from "../constants/interfaces";

export const EventsList: React.FC<EventsListProps> = ({ filteredEvents }) => {
    const [expandedEventsList, setExpandedEventsList] = useState<Record<string, boolean>>({});
    const [expandedEventProperties, setExpandedEventProperties] = useState<Record<string, boolean>>({});

    const handleToggleEvents = (index: number): void => {
        setExpandedEventsList(previousState => ({
            ...previousState,
            [index]: !previousState[index]
        }));
    };

    const handleToggleEventProperty = (eventIndex: number, propertyName: string): void => {
        const key = `${eventIndex}-${propertyName}`;
        setExpandedEventProperties(previousState => ({
            ...previousState,
            [key]: !previousState[key]
        }));
    };

    // Render the nested JSON object 
    const renderNestedJSONObject = (obj: any, eventIndex: number, propertyName: string, level: number = 0): JSX.Element => {
        if (!obj || typeof obj !== "object") {
            return (
                <div className = "font-mono text-sm text-gray-700 break-words whitespace-normal">
                    {formatValue(obj)}
                </div>
            );
        }
        return (
            <div className = "space-y-3">
                {Object.entries(obj).map(([key, value], i) => {
                    if (key === "_originalIndex") {
                        return null;
                    }
                    const isJSONObject = (value !== null && typeof value === "object");
                    const nestedKey = `${eventIndex}-${propertyName}-${key}`;
                    const isExpanded = expandedEventProperties[nestedKey];
                    return (
                        <div key = {`${nestedKey}-${i}`} className = "bg-white border border-gray-100 rounded-lg overflow-hidden">
                            {isJSONObject ? (
                                <>
                                    <div 
                                        className = "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick = {() => handleToggleEventProperty(eventIndex, `${propertyName}-${key}`)}
                                    >
                                        <div className = "flex items-center space-x-2">
                                            <span className = "font-medium text-gray-900 text-sm"> {key} </span>
                                            <span className = "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {Array.isArray(value) ? `${value.length} items` : "Object"}
                                            </span>
                                        </div>
                                        {isExpanded ? 
                                            <ChevronUp className = "h-4 w-4 text-gray-400" /> : 
                                            <ChevronDown className = "h-4 w-4 text-gray-400" />
                                        }
                                    </div>
                                    {isExpanded && (
                                        <div className = "border-t border-gray-100 bg-gray-50 p-4">
                                            {renderNestedJSONObject(value, eventIndex, `${propertyName}-${key}`, level + 1)}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className = "p-4">
                                    <div className = "text-sm font-medium text-gray-900 mb-1">{key}</div>
                                    <div className = "text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded border break-all">
                                        {formatValue(value)}
                                    </div>
                                </div>
                            )}
                        </div> 
                    );
                })}
            </div>
        );
    };

    return (
        <div className = "divide-y divide-gray-300">
            {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => {
                    const isExpanded = expandedEventsList[index];
                    const originalEventNumber = event._originalIndex + 1;
                    return (
                        <div key = {index} className = "hover:bg-gray-50 transition-colors">
                            <div
                                className = "flex items-center justify-between px-4 py-4 cursor-pointer"
                                onClick = {() => handleToggleEvents(index)}
                            >
                                <div className = "flex items-center space-x-3">
                                    {isExpanded ? 
                                        <ChevronUp className = "h-4 w-4 text-gray-400" /> : 
                                        <ChevronDown className = "h-4 w-4 text-gray-400" />
                                    }
                                    <div>
                                        <div className = "font-semibold text-sm text-gray-900">
                                            Event #{originalEventNumber}
                                        </div>
                                        <div className = "text-xs text-gray-500 mt-0.5">
                                            {Object.keys(event).filter(key => key !== "_originalIndex").length} properties
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className = "px-4 pb-6 bg-gray-50">
                                    {event.AppAccessContext && (
                                        <div className = "mb-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                                            <div className = "px-4 py-3 bg-blue-100 border-b border-blue-200">
                                                <h3 className = "text-sm font-semibold text-blue-900"> App Access Context </h3>
                                            </div>
                                            <div className = "p-4">
                                                <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {Object.entries(event.AppAccessContext).map(([key, value]) => (
                                                        <div key = {key} className = "bg-white border border-blue-00 rounded-lg p-3">
                                                            <div className = "text-xs font-medium text-blue-900 mb-1"> {key} </div>
                                                            <div className = "text-xs text-gray-700 font-mono bg-gray-50 p-2 rounded break-words">
                                                                {formatValue(value)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(event)
                                            .filter(([key]) => key !== "AppAccessContext" && key !== "_originalIndex")
                                            .map(([key, value], i) => {
                                                const isObject = (value !== null && typeof value === "object");
                                                const propKey = `${index}-${key}`;
                                                const isPropExpanded = expandedEventProperties[propKey];
                                                return (
                                                    <div key = {`${index}-${key}-${i}`} className = "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                        <div 
                                                            className = {`px-4 py-3 flex items-center justify-between ${
                                                                isObject ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
                                                            }`}
                                                            onClick = {isObject ? () => handleToggleEventProperty(index, key) : undefined}
                                                        >
                                                            <span className = "font-medium text-sm text-gray-900"> {key} </span>
                                                            {isObject && (
                                                                <div className = "flex items-center space-x-2 text-gray-500">
                                                                    <span className = "text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {Array.isArray(value) ? `${value.length} items` : "Object"}
                                                                    </span>
                                                                    {isPropExpanded ?
                                                                        <ChevronUp className = "h-4 w-4" /> :
                                                                        <ChevronDown className = "h-4 w-4" />
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                        {!isObject && (
                                                            <div className = "px-4 pb-3">
                                                                <div className = "text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded border break-words max-h-24 overflow-y-auto">
                                                                    {formatValue(value)}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {isObject && isPropExpanded && (
                                                            <div className = "border-t border-gray-100 p-4 bg-gray-50">
                                                                {renderNestedJSONObject(value, index, key)}
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
                <div className = "text-center py-12 text-gray-500">
                    <div className = "text-sm"> No events match your search criteria </div>
                </div>
            )}
        </div>
    );
};