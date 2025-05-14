import { api } from "./api";
import { Alert } from "@/types/alert.types";
import { Incident, IncidentsResponse } from "@/types/incident.types";

export type SortField = 'windows_start' | 'score' | 'user';
export type SortOrder = 'asc' | 'desc';

export const IncidentService = {
    // Get all incidents with pagination and sorting
    getIncidents: async (
        limit = 10, 
        offset = 0, 
        sortField: SortField = 'windows_start', 
        sortOrder: SortOrder = 'desc',
        filters = {}
    ): Promise<IncidentsResponse> => {
        const params: any = {
            limit,
            offset,
            sortField,
            sortOrder,
            ...filters
        };
        
        const response = await api.get("/incident", {
            params
        });
        return response.data;
    },

    // Search incidents by query string with sorting
    searchIncidents: async (
        query: string, 
        limit = 10, 
        offset = 0,
        sortField: SortField = 'windows_start', 
        sortOrder: SortOrder = 'desc'
    ): Promise<IncidentsResponse> => {
        const params: any = {
            query,
            limit,
            offset,
            sortField,
            sortOrder
        };
        
        const response = await api.get("/incident/search", {
            params
        });
        return response.data;
    },

    // Get incidents by the date range
    getIncidentsByDateRange: async (
        startDate: Date, 
        endDate: Date, 
        user?: string,
        sortField: SortField = 'windows_start', 
        sortOrder: SortOrder = 'desc'
    ): Promise<IncidentsResponse> => {
        const response = await api.get("/incident/date-range", {
            params: {
                start_date: startDate,
                end_date: endDate,
                user,
                sortField,
                sortOrder
            },
        });
        return response.data;
    },
    
    // Get incidents by user
    getIncidentsByUser: async (
        user: string,
        sortField: SortField = 'windows_start', 
        sortOrder: SortOrder = 'desc'
    ): Promise<Incident[]> => {
        const response = await api.get(`/incident/user/${user}`, {
            params: {
                sortField,
                sortOrder
            }
        });
        return response.data;
    },

    // Get incident count
    getIncidentCount: async (): Promise<number> => {
        const response = await api.get('/incident', {
            params: {
                limit: 1,
                offset: 0,
            },
        });
        return response.data.total;
    },

    // Get incident by ID
    getIncidentByID: async (id: string): Promise<Incident> => {
        const response = await api.get(`/incident/${id}`);
        return response.data;
    },

    // DEPRECATED: Use getIncidentById instead
    // Get a specific incident by composite key
    getIncidentByCompositeKey: async (user: string, windowsStart: Date, windowsEnd: Date): Promise<Incident> => {
        const response = await api.get('/incident/find', {
            params: {
                user,
                windows_start: windowsStart,
                windows_end: windowsEnd,
            },
        });
        return response.data;
    },

    // Get incidents by score range
    getIncidentsByScoreRange: async (minScore: number, maxScore: number): Promise<Incident[]> => {
        const response = await api.get('/incident/score-range', {
            params: {
                min_score: minScore,
                max_score: maxScore,
            },
        });
        return response.data;
    },

    // Get incidents by threshold
    getIncidentsByThreshold: async (threshold: number): Promise<Incident[]> => {
        const response = await api.get(`/incident/threshold/${threshold}`);
        return response.data;
    },

    // Primary method to get an incident (using ID)
    getIncident: async (id: string): Promise<Incident> => {
        return IncidentService.getIncidentByID(id);
    },

    // Get related alerts for an incident
    getRelatedAlerts: async (incidentId: string): Promise<Alert[]> => {
        const response = await api.get(`/incident/${incidentId}/alerts`);
        return response.data;
    }
};