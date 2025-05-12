// src/services/alert.service.ts
import { api } from "./api";
import { Alert, AlertsResponse } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";

export type SortField = 'datestr' | 'score' | 'alert_name';
export type SortOrder = 'asc' | 'desc';

export const AlertService = {
    // Get all alerts with pagination and sorting
    getAlerts: async (
        limit = 10, 
        offset = 0, 
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc',
        isUnderIncident?: boolean
    ): Promise<AlertsResponse> => {
        const params: any = {
            limit,
            offset,
            sortField,
            sortOrder
        };
        
        if (isUnderIncident !== undefined) {
            params.isUnderIncident = isUnderIncident;
        }
        
        const response = await api.get("/alert", {
            params
        });
        return response.data;
    },

    // Search alerts by query string with sorting
    searchAlerts: async (
        query: string, 
        limit = 10, 
        offset = 0,
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc',
        isUnderIncident?: boolean
    ): Promise<AlertsResponse> => {
        const params: any = {
            query,
            limit,
            offset,
            sortField,
            sortOrder
        };
        
        if (isUnderIncident !== undefined) {
            params.isUnderIncident = isUnderIncident;
        }
        
        const response = await api.get("/alert/search", {
            params
        });
        return response.data;
    },

    // Get alerts by the date range
    getAlertsByDateRange: async (
        startDate: Date, 
        endDate: Date, 
        user?: string,
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc'
    ): Promise<AlertsResponse> => {
        const response = await api.get("/alert/date-range", {
            params: {
                startDate,
                endDate,
                user,
                sortField,
                sortOrder
            },
        });
        return response.data;
    },
    
    // Get alerts by user
    getAlertsByUser: async (
        user: string,
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc'
    ): Promise<Alert[]> => {
        const response = await api.get(`/alert/user/${user}`, {
            params: {
                sortField,
                sortOrder
            }
        });
        return response.data;
    },

    // Get alerts under incident
    getAlertsUnderIncident: async (
        isUnderIncident: boolean = true,
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc'
    ): Promise<Alert[]> => {
        const response = await api.get(`/alert/incident/${isUnderIncident}`, {
            params: {
                sortField,
                sortOrder
            }
        });
        return response.data;
    },

    // Get alert count
    getAlertCount: async (): Promise<number> => {
        const response = await api.get('/alert', {
            params: {
                limit: 1,
                offset: 0,
            },
        });
        return response.data.total;
    },

    // Get alert by ID
    getAlertById: async (id: string): Promise<Alert> => {
        const response = await api.get(`/alert/${id}`);
        return response.data;
    },

    // Get the incident associated with an alert
    getIncidentForAlert: async (alertId: string): Promise<Incident | null> => {
        try {
            const response = await api.get(`/alert/${alertId}/incident`);
            return response.data;
        } catch (error) {
            console.error("Error fetching incident for alert:", error);
            return null;
        }
    },

    // Associate an alert with an incident
    associateWithIncident: async (alertId: string, incidentId: string): Promise<Alert> => {
        const response = await api.put(`/alert/${alertId}/associate/${incidentId}`);
        return response.data;
    },

    // Get alerts by incident ID
    getAlertsByIncidentID: async (
        incidentId: string,
        sortField: SortField = 'datestr',
        sortOrder: SortOrder = 'desc'
    ): Promise<Alert[]> => {
        const response = await api.get(`/alert/incident-id/${incidentId}`, {
            params: {
                sortField,
                sortOrder
            }
        });
        return response.data;
    }
};