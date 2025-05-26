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

// IncidentTimeline.tsx
export interface TimelineEvent {
    id: string;
    timestamp: string;
    date: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    MITRE_tactic?: string;
    MITRE_technique?: string;
    onClick?: () => void;
};

export interface IncidentTimelineProps {
    events: TimelineEvent[];
    className?: string;
    title?: string;
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