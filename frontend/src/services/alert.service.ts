// src/services/alert.service.ts
import { api } from "./api";
import { Alert, AlertsResponse } from "@/types/alert.types";

export type SortField = 'datestr' | 'score' | 'alert_name';
export type SortOrder = 'asc' | 'desc';

export const AlertService = {
    // Get all alerts with pagination and sorting
    getAlerts: async (
        limit = 10, 
        offset = 0, 
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc'
    ): Promise<AlertsResponse> => {
        const response = await api.get("/alert", {
            params: {
                limit,
                offset,
                sortField,
                sortOrder
            },
        });
        return response.data;
    },

    // Search alerts by query string with sorting
    searchAlerts: async (
        query: string, 
        limit = 10, 
        offset = 0,
        sortField: SortField = 'datestr', 
        sortOrder: SortOrder = 'desc'
    ): Promise<AlertsResponse> => {
        const response = await api.get("/alert/search", {
            params: {
                query,
                limit,
                offset,
                sortField,
                sortOrder
            },
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
};