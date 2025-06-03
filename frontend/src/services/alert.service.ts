// frontend/src/services/alert.service.ts

import { api } from "./api";
import { handleApiError } from "./apiErrorHandle";
import { Incident } from "@/types/incident.types";
import { Alert, AlertsResponse } from "@/types/alert.types";

export type SortField = "datestr" | "score" | "alert_name";
export type SortOrder = "asc" | "desc";

export const AlertService = {
    /**
     * Retrieves all alerts with pagination, sorting, and optional incident filtering
     * @param limit - Maximum number of alerts to return (default: 10)
     * @param offset - Number of alerts to skip for pagination (default: 0)
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @param isUnderIncident - Optional filter for alerts under incidents
     * @returns Promise containing paginated alerts response
     */
    getAlerts: async (
        limit = 10, 
        offset = 0, 
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc",
        isUnderIncident?: boolean
    ): Promise<AlertsResponse> => {
        try {
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
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts:', apiError);
            throw apiError;
        }
    },

    /**
     * Searches alerts by query string with pagination and sorting
     * @param query - Search query string
     * @param limit - Maximum number of alerts to return (default: 10)
     * @param offset - Number of alerts to skip for pagination (default: 0)
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @param isUnderIncident - Optional filter for alerts under incidents
     * @returns Promise containing paginated search results
     */
    searchAlerts: async (
        query: string, 
        limit = 10, 
        offset = 0,
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc",
        isUnderIncident?: boolean
    ): Promise<AlertsResponse> => {
        try {
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
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to search alerts:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves alerts within a specific date range with optional user filtering
     * @param startDate - Start date for the range
     * @param endDate - End date for the range
     * @param user - Optional user filter
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing alerts within the date range
     */
    getAlertsByDateRange: async (
        startDate: Date, 
        endDate: Date, 
        user?: string,
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc"
    ): Promise<AlertsResponse> => {
        try {
            const response = await api.get("/alert/date-range", {
                params: {
                    startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                    endDate: endDate.toISOString().split('T')[0],
                    user,
                    sortField,
                    sortOrder
                },
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts by date range:', apiError);
            throw apiError;
        }
    },
    
    /**
     * Retrieves all alerts for a specific user
     * @param user - Username to filter alerts by
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing array of alerts for the user
     */
    getAlertsByUser: async (
        user: string,
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc"
    ): Promise<Alert[]> => {
        try {
            const response = await api.get(`/alert/user/${encodeURIComponent(user)}`, {
                params: {
                    sortField,
                    sortOrder
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts by user:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves alerts based on their incident association status
     * @param isUnderIncident - Whether to get alerts under incidents (default: true)
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing array of alerts matching the incident criteria
     */
    getAlertsUnderIncident: async (
        isUnderIncident: boolean = true,
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc"
    ): Promise<Alert[]> => {
        try {
            const response = await api.get(`/alert/incident/${isUnderIncident}`, {
                params: {
                    sortField,
                    sortOrder
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts under incident:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the total count of alerts in the system
     * @returns Promise containing the total number of alerts
     */
    getAlertCount: async (): Promise<number> => {
        try {
            const response = await api.get("/alert", {
                params: {
                    limit: 1,
                    offset: 0,
                },
            });
            return response.data.total;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alert count:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves a specific alert by its ID
     * @param ID - The unique identifier of the alert
     * @returns Promise containing the alert data
     */
    getAlertByID: async (ID: string): Promise<Alert> => {
        try {
            const response = await api.get(`/alert/${encodeURIComponent(ID)}`);
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alert by ID:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the incident associated with a specific alert
     * @param alertID - The unique identifier of the alert
     * @returns Promise containing the associated incident or null if not found
     */
    getIncidentForAlert: async (alertID: string): Promise<Incident | null> => {
        try {
            const response = await api.get(`/alert/${encodeURIComponent(alertID)}/incident`);
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            if (apiError.status === 404 || apiError.status === 204) {
                return null; // No incident found for this alert
            }
            console.error("Error fetching incident for alert:", apiError);
            throw apiError;
        }
    },

    /**
     * Associates an alert with an incident
     * @param alertID - The unique identifier of the alert
     * @param incidentID - The unique identifier of the incident
     * @returns Promise containing the updated alert data
     */
    associateWithIncident: async (alertID: string, incidentID: string): Promise<Alert> => {
        try {
            const response = await api.put(`/alert/${encodeURIComponent(alertID)}/associate/${encodeURIComponent(incidentID)}`);
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to associate alert with incident:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves all alerts associated with a specific incident
     * @param incidentID - The unique identifier of the incident
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing array of alerts for the incident
     */
    getAlertsByIncidentID: async (
        incidentID: string,
        sortField: SortField = "datestr",
        sortOrder: SortOrder = "desc"
    ): Promise<Alert[]> => {
        try {
            const response = await api.get(`/alert/incident-id/${encodeURIComponent(incidentID)}`, {
                params: {
                    sortField,
                    sortOrder
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts by incident ID:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves all alerts in the system without pagination or filtering
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing array of all alerts
     */
    getAllAlerts: async (
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc"
    ): Promise<Alert[]> => {
        try {
            const params: any = {
                sortField,
                sortOrder
            };
            
            const response = await api.get("/alert/all", {
                params
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch all alerts:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves all alerts with total count without pagination or filtering
     * @param sortField - Field to sort by (default: "datestr")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing all alerts with count information
     */
    getAllAlertsWithCount: async (
        sortField: SortField = "datestr", 
        sortOrder: SortOrder = "desc"
    ): Promise<AlertsResponse> => {
        try {
            const params: any = {
                sortField,
                sortOrder
            };
            
            const response = await api.get("/alert/all/with-count", {
                params
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch all alerts with count:', apiError);
            throw apiError;
        }
    },
};