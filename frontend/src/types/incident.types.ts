// frontend/src/types/incident.types.ts

export interface Incident {
    ID: string;
    user: string;
    windows_start: Date;
    windows_end: Date;
    score: number;
    windows: string[];
    isClosed: boolean; 
    created_at: Date;
    updated_at: Date;
}

export interface IncidentsResponse {
    incidents: Incident[];
    total: number;
}
