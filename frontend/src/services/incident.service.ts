import { api } from "./api";
import { Alert } from "@/types/alert.types";
import { Incident, IncidentsResponse } from "@/types/incident.types";

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

    // Get a specific incident
    getIncident: async (user: string, windowsStart: Date, windowsEnd: Date): Promise<Incident> => {
        const reponse = await api.get('/incident/find', {
            params: {
                user,
                windows_start: windowsStart,
                windows_end: windowsEnd,
            },
        });
        return reponse.data;
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

    // Get alerts related to a specific incident by comparing datestr with windows_start and windows_end
    // In incident.service.ts, update the getRelatedAlerts method
getRelatedAlerts: async (incident: Incident, allAlerts?: Alert[]): Promise<Alert[]> => {
    // If alerts have already been provided, filter them
    if (allAlerts) {
        return allAlerts.filter(alert =>
            alert.user === incident.user &&
            new Date(alert.datestr) >= new Date(incident.windows_start) &&
            new Date(alert.datestr) <= new Date(incident.windows_end)
        );
    }

    // Else, fetch alerts from the date range and filter by user
    const startDate = new Date(incident.windows_start);
    const endDate = new Date(incident.windows_end);
    
    // Change this line - we need to call the alerts endpoint, not incidents
    const response = await api.get('/alert/date-range', {
        params: {
            startDate: startDate,
            endDate: endDate,
            user: incident.user,
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
};