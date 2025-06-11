export interface Incident {
    id: string;
    user: string;
    windows_start: Date;
    windows_end: Date;
    score: number;
    windows: string[];
    is_closed: boolean; 
    created_at: Date;
    updated_at: Date;
}

export interface IncidentsResponse {
    incidents: Incident[];
    total: number;
}