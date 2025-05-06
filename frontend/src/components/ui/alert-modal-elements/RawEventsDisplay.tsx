// src/components/ui/RawEventsDisplay.tsx

import { Search } from "lucide-react";
import React, { useState } from "react";
import { RawEventsDisplayProps } from "@/constants/interface";

// Component Import
import EventsList from "./EventsList";

// Function Import
import { parseAppAccessEvents } from "@/constants/functions";

const RawEventsDisplay: React.FC<RawEventsDisplayProps> = ({ rawEvents }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Handle null or undefined input
    if (!rawEvents) {
        return (
            <div className = "text-sm text-gray-500 italic bg-white p-4 rounded-md border border-gray-200">
                No raw events available...
            </div>
        );
    }

    const parsedEvents = parseAppAccessEvents(rawEvents);

    const filteredEvents = !searchTerm.trim()
        ? parsedEvents
        : parsedEvents.filter(event => {
            const eventString = JSON.stringify(event).toLowerCase();
            return eventString.includes(searchTerm.toLowerCase());
        });

    return (
        <div className = "rounded-md overflow-hidden bg-white">
            {/* SEARCH BAR */}
            <div className = "p-2 border-gray-200">
                <div className = "relative">
                    <Search className = "absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type = "text"
                        placeholder = "Search events..."
                        className = "pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className = "mt-2 text-xs text-gray-500">
                    {filteredEvents.length} of {parsedEvents.length} events
                </div>
            </div>

            {/* EVENTS LIST */}
            <EventsList filteredEvents = {filteredEvents} />
        </div>
    );
};

export default RawEventsDisplay;