export interface Alert {
    ID: string;
    user: string;
    datestr: Date;
    evidence: Record<string, any>;
    score: number;
    alert_name: string;
    MITRE_tactic: string;
    MITRE_technique: string;
    Logs: string | null;
    Detection_model: string;
    Description: string | null;
    isUnderIncident: boolean;
    incidentID?: string; // Add this field
    created_at: Date;
    updated_at: Date;
}

export interface AlertsResponse {
    alerts: Alert[];
    total: number;
}