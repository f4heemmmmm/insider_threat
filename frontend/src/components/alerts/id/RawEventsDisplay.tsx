// frontend/src/components/alerts/id/RawEventsDisplay.tsx

import { Search } from "lucide-react";
import { EventsList } from "./EventsList";
import React, { useState, useRef, useEffect } from "react";
import { parseAppAccessEvents } from "@/constants/functions";
import { ExtendedRawEventsDisplayProps } from "../constants/interfaces";

export const RawEventsDisplay: React.FC<ExtendedRawEventsDisplayProps> = ({ rawEvents, resetScroll }) => {
    const [resetKey, setResetKey] = useState<number>(0);
    const parsedEvents = parseAppAccessEvents(rawEvents);
    const eventsListScrollRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        if (resetScroll && eventsListScrollRef.current) {
            eventsListScrollRef.current.scrollTop = 0;
            setSearchTerm("");
            setResetKey(prev => prev + 1);
        }
    }, [resetScroll]);

    if (!rawEvents) {
        return (
            <div className = "text-sm text-gray-500 italic bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                No events available
            </div>
        );
    }

    const filteredEvents = !searchTerm.trim()
        ? parsedEvents
        : parsedEvents.filter(event => {
            const eventString = JSON.stringify(event).toLowerCase();
            return eventString.includes(searchTerm.toLowerCase());
        });

    return (
        <div className = "bg-white h-full flex flex-col">
            {/* SEARCH BAR */}
            <div className = "p-4 border-b border-gray-300 flex-shrink-0">
                <div className = "relative">
                    <Search className = "absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type = "text"
                        placeholder = "Search events..."
                        className = "pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-colors"
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className = "px-2 mt-3 text-xs text-gray-500 font-medium">
                    {filteredEvents.length} of {parsedEvents.length} events
                </div>
            </div>
            {/* EVENTS LIST */}
            <div 
                ref = {eventsListScrollRef}
                className = "flex-1 overflow-y-auto"
                style = {{ minHeight: 0 }}
            >
                <div> 
                    <EventsList 
                        key = {resetKey}
                        filteredEvents = {filteredEvents} 
                    />
                </div>
            </div>
        </div>
    );
};