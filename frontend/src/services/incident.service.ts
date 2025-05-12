import { api } from "./api";
import { Alert } from "@/types/alert.types";
import { Incident, IncidentsResponse } from "@/types/incident.types";
import { AlertService } from "./alert.service";

export const IncidentService = {
    // Get all incidents with pagination
    getIncidents: async (limit = 10, offset = 0, filters = {}): Promise<IncidentsResponse> => {
        const response = await api.get("/incident", {
            params: {
                limit,
                offset,
                ...filters
            },
        });
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

    // Get all incidents by a user
    getIncidentsByUser: async (user: string): Promise<Incident[]> => {
        const response = await api.get(`/incident/user/${user}`);
        return response.data;
    },

    // Get incidents by date range
    getIncidentsByDateRange: async (startDate: Date, endDate: Date, user?: string): Promise<Incident[]> => {
        const response = await api.get('/incident/date-range', {
            params: {
                start_date: startDate,
                end_date: endDate, 
                user,
            },
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
    
    // Primary method to get an incident (using ID)
    getIncident: async (id: string): Promise<Incident> => {
        return IncidentService.getIncidentByID(id);
    },

    // Improved version of getRelatedAlerts that uses the backend relationship
    getRelatedAlerts: async (incident: Incident): Promise<Alert[]> => {
        // First try to use the direct relationship via incidentId
        try {
            // If we have the incident ID, fetch alerts directly related to this incident
            return await AlertService.getAlertsByIncidentID(incident.ID);
        } catch (error) {
            console.warn("Falling back to time-based alert matching", error);
            
            // Fallback: use the original date-range based method
            const startDate = new Date(incident.windows_start);
            const endDate = new Date(incident.windows_end);
            
            const response = await api.get('/alert/date-range', {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                    user: incident.user,
                },
            });
            
            return response.data;
        }
    }
};