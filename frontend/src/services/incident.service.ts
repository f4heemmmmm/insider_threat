// frontend/src/services/incident.service.ts
import { api } from "./api";
import { Alert } from "@/types/alert.types";
import { Incident, IncidentsResponse } from "@/types/incident.types";

export type SortField = "windows_start" | "score" | "user";
export type SortOrder = "asc" | "desc";

export const IncidentService = {
    /**
     * Retrieves all incidents with pagination, sorting, and optional filtering
     * @param limit - Maximum number of incidents to return (default: 10)
     * @param offset - Number of incidents to skip for pagination (default: 0)
     * @param sortField - Field to sort by (default: "windows_start")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @param filters - Additional filters to apply to the query
     * @returns Promise containing paginated incidents response
     */
    getIncidents: async (
        limit = 10, 
        offset = 0, 
        sortField: SortField = "windows_start", 
        sortOrder: SortOrder = "desc",
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

    /**
     * Searches incidents by query string with pagination and sorting
     * @param query - Search query string
     * @param limit - Maximum number of incidents to return (default: 10)
     * @param offset - Number of incidents to skip for pagination (default: 0)
     * @param sortField - Field to sort by (default: "windows_start")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing paginated search results
     */
    searchIncidents: async (
        query: string, 
        limit = 10, 
        offset = 0,
        sortField: SortField = "windows_start", 
        sortOrder: SortOrder = "desc"
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

    /**
     * Retrieves incidents within a specific date range with optional user filtering
     * @param startDate - Start date for the range
     * @param endDate - End date for the range
     * @param user - Optional user filter
     * @param sortField - Field to sort by (default: "windows_start")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing incidents within the date range
     */
    getIncidentsByDateRange: async (
        startDate: Date, 
        endDate: Date, 
        user?: string,
        sortField: SortField = "windows_start", 
        sortOrder: SortOrder = "desc"
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
    
    /**
     * Retrieves all incidents for a specific user
     * @param user - Username to filter incidents by
     * @param sortField - Field to sort by (default: "windows_start")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing array of incidents for the user
     */
    getIncidentsByUser: async (
        user: string,
        sortField: SortField = "windows_start", 
        sortOrder: SortOrder = "desc"
    ): Promise<Incident[]> => {
        const response = await api.get(`/incident/user/${user}`, {
            params: {
                sortField,
                sortOrder
            }
        });
        return response.data;
    },

    /**
     * Retrieves the total count of incidents in the system
     * @returns Promise containing the total number of incidents
     */
    getIncidentCount: async (): Promise<number> => {
        const response = await api.get("/incident", {
            params: {
                limit: 1,
                offset: 0,
            },
        });
        return response.data.total;
    },

    /**
     * Retrieves a specific incident by its ID
     * @param ID - The unique identifier of the incident
     * @returns Promise containing the incident data
     */
    getIncidentByID: async (ID: string): Promise<Incident> => {
        const response = await api.get(`/incident/${ID}`);
        return response.data;
    },

    /**
     * @deprecated Use getIncidentByID instead
     * Retrieves a specific incident by composite key (user, windows start/end)
     * @param user - Username associated with the incident
     * @param windowsStart - Start time of the incident window
     * @param windowsEnd - End time of the incident window
     * @returns Promise containing the incident data
     */
    getIncidentByCompositeKey: async (user: string, windowsStart: Date, windowsEnd: Date): Promise<Incident> => {
        const response = await api.get("/incident/find", {
            params: {
                user,
                windows_start: windowsStart,
                windows_end: windowsEnd,
            },
        });
        return response.data;
    },

    /**
     * Retrieves incidents within a specific score range
     * @param minScore - Minimum score threshold
     * @param maxScore - Maximum score threshold
     * @returns Promise containing array of incidents within the score range
     */
    getIncidentsByScoreRange: async (minScore: number, maxScore: number): Promise<Incident[]> => {
        const response = await api.get("/incident/score-range", {
            params: {
                min_score: minScore,
                max_score: maxScore,
            },
        });
        return response.data;
    },

    /**
     * Retrieves incidents above a specific score threshold
     * @param threshold - Minimum score threshold
     * @returns Promise containing array of incidents above the threshold
     */
    getIncidentsByThreshold: async (threshold: number): Promise<Incident[]> => {
        const response = await api.get(`/incident/threshold/${threshold}`);
        return response.data;
    },

    /**
     * Primary method to retrieve an incident by its ID
     * @param ID - The unique identifier of the incident
     * @returns Promise containing the incident data
     */
    getIncident: async (ID: string): Promise<Incident> => {
        return IncidentService.getIncidentByID(ID);
    },

    /**
     * Retrieves all alerts related to a specific incident
     * @param incidentID - The unique identifier of the incident
     * @returns Promise containing array of related alerts
     */
    getRelatedAlerts: async (incidentID: string): Promise<Alert[]> => {
        const response = await api.get(`/incident/${incidentID}/alerts`);
        return response.data;
    },
    
    /**
     * Retrieves all incidents in the system without pagination or filtering
     * @param sortField - Field to sort by (default: "windows_start")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing array of all incidents
     */
    getAllIncidents: async (
        sortField: SortField = "windows_start", 
        sortOrder: SortOrder = "desc"
    ): Promise<Incident[]> => {
        const params: any = {
            sortField,
            sortOrder
        };
        
        const response = await api.get("/incident/all", {
            params
        });
        return response.data;
    },

    /**
     * Retrieves all incidents with total count without pagination or filtering
     * @param sortField - Field to sort by (default: "windows_start")
     * @param sortOrder - Sort order ascending or descending (default: "desc")
     * @returns Promise containing all incidents with count information
     */
    getAllIncidentsWithCount: async (
        sortField: SortField = "windows_start", 
        sortOrder: SortOrder = "desc"
    ): Promise<IncidentsResponse> => {
        const params: any = {
            sortField,
            sortOrder
        };
        
        const response = await api.get("/incident/all/with-count", {
            params
        });
        return response.data;
    },
};