// frontend/src/components/incidents/constants/functions.tsx
import { getMITREInformation } from "@/data/MITREData";
import { TimelineEvent, IncidentStatusChange, IncidentComment } from "./interfaces";
import { Alert } from "@/types/alert.types";

export const getScoreSeverityMapping = (score: number) => {
    if (score >= 90) {
        return {
            status: "critical" as const,
            label: "Critical"
        };
    }
    if (score >= 70) {
        return {
            status: "high" as const,
            label: "High"
        };
    }
    if (score >= 50) {
        return {
            status: "medium" as const,
            label: "Medium"
        };
    }
    return {
        status: "low" as const,
        label: "Low"
    }
};

export const formatDuration = (end: Date, start: Date): string => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let result = "";

    if (days > 0) {
        result += `${days}d `
    }
    if (hours % 24 > 0) {
        result += `${hours % 24}h `;
    }
    if (minutes % 60 > 0) {
        result += `${minutes % 60}m `
    }
    if (seconds % 60 > 0) {
        result += `${seconds % 60}s `
    }
    if (result === "") {
        result = "0s";
    }
    return result.trim()
};

export const getWindowDuration = (windows_start: Date, windows_end: Date) => {
    const startTime = new Date(windows_start);
    const endTime = new Date(windows_end);
    const diffMs = endTime.getTime() - startTime.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
};

export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthShort = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
};

export const handleMITRETacticClick = (tactic: string) => {
    if (!tactic || tactic === "N/A" || tactic === "") {
        return;
    }
    const tacticInformation = getMITREInformation(tactic);
    if (tacticInformation) {
        window.open(tacticInformation.url, "_blank", "noopener,noreferrer");
    } else {
        console.error("No MITRE information found for the tactic specified.");
    }
};

export const handleMITRETechniqueClick = (technique: string) => {
    if (!technique || technique === "N/A" || technique === "") {
        return;
    }
    const techniqueInformation = getMITREInformation(technique);
    if (techniqueInformation) {
        window.open(techniqueInformation.url, "_blank", "noopener,noreferrer");
    } else {
        console.error("No MITRE information found for the technique specified.");
    }
};

export const isTacticClickable = (tactic: string) => {
    if (!tactic || tactic === "N/A" || tactic === "") {
        return false;
    }
    const tacticInformation = getMITREInformation(tactic);
    return Boolean(tacticInformation && tacticInformation.url);
};

export const isTechniqueClickable = (technique: string) => {
    if (!technique || technique === "N/A" || technique === "") {
        return false;
    }
    const techniqueInformation = getMITREInformation(technique);
    return Boolean(techniqueInformation && techniqueInformation.url);
};

// Enhanced functions for handling incident status changes with user tracking

/**
 * Gets the display text and severity for different status change actions with user attribution
 */
export const getStatusChangeDisplay = (action: string, userDisplayName?: string) => {
    const userText = userDisplayName ? ` by ${userDisplayName}` : '';
    
    switch (action) {
        case "created_open":
            return {
                title: "Incident created",
                description: `Incident was created and is open${userText}`,
                severity: "medium" as const
            };
        case "created_closed":
            return {
                title: "Incident created (closed)",
                description: `Incident was created and is closed${userText}`,
                severity: "low" as const
            };
        case "closed":
            return {
                title: "Incident closed",
                description: `Incident status changed from open to closed${userText}`,
                severity: "low" as const
            };
        case "reopened":
            return {
                title: "Incident reopened",
                description: `Incident status changed from closed to open${userText}`,
                severity: "medium" as const
            };
        default:
            return {
                title: "Status changed",
                description: `Incident status changed: ${action}${userText}`,
                severity: "medium" as const
            };
    }
};

/**
 * Creates a timeline event for incident status changes with user information
 */
export const createStatusChangeEvent = (statusChange: IncidentStatusChange): TimelineEvent => {
    const timestamp = new Date(statusChange.timestamp);
    const statusDisplay = getStatusChangeDisplay(statusChange.action, statusChange.userDisplayName);
    
    return {
        id: statusChange.id,
        timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: formatDate(timestamp),
        title: statusDisplay.title,
        description: statusDisplay.description,
        severity: statusDisplay.severity,
        eventType: "status_change",
        statusChange: {
            action: statusChange.action as "closed" | "reopened" | "created_open" | "created_closed",
            previousStatus: statusChange.previousStatus,
            newStatus: statusChange.newStatus,
            userDisplayName: statusChange.userDisplayName
        }
    };
};

/**
 * Creates a timeline event for comments with user information and actions
 */
export const createCommentEvent = (comment: IncidentComment): TimelineEvent => {
    const timestamp = new Date(comment.created_at);
    const userDisplayName = comment.user_display_name || 'Unknown User';
    
    return {
        id: comment.id,
        timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: formatDate(timestamp),
        title: "Comment added",
        description: `${userDisplayName} added a comment`,
        severity: "low" as const,
        eventType: "comment",
        comment: {
            id: comment.id,
            content: comment.content,
            userDisplayName: userDisplayName,
            userId: comment.user_id,
            canEdit: comment.can_edit || false,
            canDelete: comment.can_delete || false,
            isEditing: false,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at
        }
    };
};

/**
 * Maps alerts to timeline events (existing functionality with eventType added)
 */
export const mapAlertsToTimelineEvents = (alerts: Alert[]): TimelineEvent[] => {
    return alerts.map(alert => {
        const alertDate = new Date(alert.datestr);
        return {
            id: alert.id,
            timestamp: alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: formatDate(alertDate),
            title: alert.Description || "Security Alert",
            description: alert.Description || "No description available",
            severity: getScoreSeverityMapping(alert.score).status,
            eventType: "alert" as const,
            MITRE_tactic: alert.MITRE_tactic,
            MITRE_technique: alert.MITRE_technique,
            onClick: () => {
                // This will be handled by the parent component
            }
        };
    });
};

/**
 * Merges alert events, status change events, and comment events into a unified timeline
 */
export const mergeTimelineEvents = (
    alertEvents: TimelineEvent[], 
    statusChangeEvents: TimelineEvent[],
    commentEvents: TimelineEvent[] = []
): TimelineEvent[] => {
    const allEvents = [...alertEvents, ...statusChangeEvents, ...commentEvents];
    
    // Sort by date and time (most recent first)
    return allEvents.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.timestamp}`);
        const dateB = new Date(`${b.date} ${b.timestamp}`);
        return dateB.getTime() - dateA.getTime();
    });
};

/**
 * Generates a unique ID for status change events
 */
export const generateStatusChangeId = (incidentId: string, timestamp: Date): string => {
    return `status_${incidentId}_${timestamp.getTime()}`;
};

/**
 * Creates a status change object from incident update (client-side helper)
 */
export const createIncidentStatusChange = (
    incidentId: string,
    previousStatus: boolean,
    newStatus: boolean,
    userDisplayName?: string
): IncidentStatusChange => {
    const timestamp = new Date();
    const action = newStatus ? "closed" : "reopened";
    
    return {
        id: generateStatusChangeId(incidentId, timestamp),
        timestamp,
        action,
        previousStatus,
        newStatus,
        userDisplayName
    };
};

/**
 * Formats comment content for display with proper line breaks
 */
export const formatCommentContent = (content: string): string => {
    return content.replace(/\n/g, '<br>');
};

/**
 * Truncates comment content for timeline display
 */
export const truncateCommentContent = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) {
        return content;
    }
    return content.substring(0, maxLength) + '...';
};