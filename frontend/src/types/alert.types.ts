export interface Alert {
    id: string;
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
    is_under_incident: boolean;
    incident_id?: string;
    created_at: Date;
    updated_at: Date;
}

export interface AlertsResponse {
    alerts: Alert[];
    total: number;
}