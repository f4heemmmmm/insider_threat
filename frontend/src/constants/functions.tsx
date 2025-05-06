// src/constants/functions.tsx
import { IndexedSharePointEvent } from "@/constants/interface";

export const getScoreSeverity = (score: number) => {
    if (score >= 90) {
        return "critical";
    }
    if (score >= 70) {
        return "high";
    }
    if (score >= 50) {
        return "medium";
    }
    return "low";
};

export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "critical":
            return "text-red-400";
        case "high":
            return "text-orange-400";
        case "medium":
            return "text-amber-400";
        case "low":
            return "text-blue-400";
        default:
            return "text-gray-500";
    }
};

export const formatEvidenceValue = (value: any): string => {
    if (value === null || value === undefined) {
        return "N/A";
    }
    if (typeof value === "object") {
        if ((Array.isArray(value) && value.length === 0) || Object.keys(value).length === 0 && !Array.isArray(value)) {
            return "N/A";
        }
        return JSON.stringify(value, null, 2);
    }
    return String(value);
};

export const getSortedEvidenceEntries = (evidence: any) => {
    if (!evidence) {
        return [];
    }
    return Object.entries(evidence)
        .filter(([key]) => key !== "list_raw_events")       // Filtering out the raw events (displayed separately)
        .filter(([key, value]) => {                         // Filtering out null or undefined values
            if (value === null || value === undefined) {
                return false;
            }
            if (value === "") {
                return false;
            }
            if (typeof value === "object" && Object.keys(value).length === 0) {
                return false;
            }
            if (Array.isArray(value) && value.length === 0) {
                return false;
            }
            return true;
        })
        .sort((a, b) => a[0].localeCompare(b[0]));          // Sorting alphabetically by key
};

export const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
        return "null";
    }
    if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
};

// Parse and clean AppAccessContext events
export const parseAppAccessEvents = (events: any): IndexedSharePointEvent[] => {
    try {
        if (Array.isArray(events)) {
            return events.map((event, index) => {
                if (typeof event === "string") {
                    // For strings that are escaped JSON, we need to clean and parse them
                    try {
                        // Remove outer quotes if present
                        let cleanEvent = event;
                        if (cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) {
                            cleanEvent = cleanEvent.slice(1, -1);
                        }
                        
                        // Replace escaped quotes with actual quotes
                        cleanEvent = cleanEvent.replace(/\\"/g, '"');

                        // Parse the cleaned string and add original index
                        const parsedEvent = JSON.parse(cleanEvent);
                        return { ...parsedEvent, _originalIndex: index };
                    } catch (error) {
                        console.error(`Error parsing event at index ${index}:`, error);
                        return { error: `Failed to parse event: ${error instanceof Error ? error.message : "Unknown error"}`, _originalIndex: index };
                    }
                } else if (typeof event === "object") {
                    return { ...event, _originalIndex: index };
                } else {
                    return { error: `Unsupported event type: ${typeof event}`, _originalIndex: index };
                }
            });
        } else if (typeof events === "string") {
            try {
                const parsed = JSON.parse(events);
                if (Array.isArray(parsed)) {
                    return parseAppAccessEvents(parsed);
                } else {
                    return [{ ...parsed, _originalIndex: 0 }];
                }
            } catch {
                let cleanEvent = events;
                if (cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) {
                    cleanEvent = cleanEvent.slice(1, -1);
                }
                cleanEvent = cleanEvent.replace(/\\"/g, '"');
                try {
                    const parsedEvent = JSON.parse(cleanEvent);
                    return [{ ...parsedEvent, _originalIndex: 0 }];
                } catch (error) {
                    console.error("Error parsing single string event:", error);
                    return [{ error: `Failed to parse event: ${error instanceof Error ? error.message : "Unknown error"}`, _originalIndex: 0 }];
                }
            }
        } else if (typeof events === "object" && events !== null) {
            return [{ ...events, _originalIndex: 0 }];
        }
        return [{ error: 'Unsupported events format', _originalIndex: 0 }];
    } catch (error) {
        console.error("Error in parseAppAccessEvents:", error);
        return [{ error: `Global parsing error: ${error instanceof Error ? error.message : "Unknown error"}`, _originalIndex: 0 }];
    }
};