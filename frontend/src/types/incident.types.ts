export interface Incident {
    ID: string;
    user: string;
    windows_start: Date;
    windows_end: Date;
    windows: string[];
    score: number;
    created_at: Date;
    updated_at: Date;
}

export interface IncidentsResponse {
    incidents: Incident[];
    total: number;
}