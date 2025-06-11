import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";

// IncidentSummaryCard.tsx
export interface IncidentSummaryCardProps {
    incident: Incident;
    MITRETactics: string[];
    incidentDuration: {
        start_time: Date | null;
        end_time: Date | null;
        duration: string;
    };
    totalAlerts: number;
    onShowAlerts: () => void;
    getScoreSeverity: (score: number) => "low" | "medium" | "high" | "critical";
};

// IncidentTimeline.tsx - Enhanced to support different event types including comments
export interface TimelineEvent {
    id: string;
    timestamp: string;
    date: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    eventType: "alert" | "status_change" | "comment"; // Added comment type
    MITRE_tactic?: string;
    MITRE_technique?: string;
    statusChange?: {
        action: "closed" | "reopened" | "created_open" | "created_closed";
        previousStatus: boolean;
        newStatus: boolean;
        userDisplayName?: string;
    };
    comment?: {
        id: string;
        content: string;
        userDisplayName: string;
        userId: string;
        canEdit: boolean;
        canDelete: boolean;
        isEditing?: boolean;
        createdAt: Date;
        updatedAt: Date;
    }; // New field for comment details
    onClick?: () => void;
};

// Enhanced interface for incident status change events with user tracking
export interface IncidentStatusChange {
    id: string;
    timestamp: Date;
    action: "closed" | "reopened" | "created_open" | "created_closed";
    previousStatus: boolean;
    newStatus: boolean;
    userId?: string;
    userDisplayName?: string;
};

// New interface for incident comments
export interface IncidentComment {
    id: string;
    incident_id: string;
    user_id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    user_display_name?: string;
    can_edit?: boolean;
    can_delete?: boolean;
};

export interface IncidentTimelineProps {
    events: TimelineEvent[];
    className?: string;
    title?: string;
    onAlertSelect?: (eventId: string) => void;
    onCommentEdit?: (commentId: string, newContent: string) => void;
    onCommentDelete?: (commentId: string) => void;
};

// RelatedAlertCard.tsx
export interface RelatedAlertCardProps {
    alert: Alert;
    onClick?: (alert: Alert) => void;
    className?: string;
};

// RelatedAlertsModal.tsx
export interface RelatedAlertsModalProps {
    isOpen: boolean;
    onClose: () => void;
    alerts: Alert[];
    incidentID: string;
};