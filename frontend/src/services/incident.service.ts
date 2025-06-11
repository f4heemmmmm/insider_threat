// frontend/src/services/incident.service.ts
import { api } from "./api";
import { Alert } from "@/types/alert.types";
import { Incident, IncidentsResponse } from "@/types/incident.types";
import { IncidentStatusChange, IncidentComment } from "@/components/incidents/constants/interfaces";

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
        try {
            const response = await api.get("/incident/date-range", {
                params: {
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    user
                }
            });
            
            // Backend returns direct array of incidents
            const incidents = Array.isArray(response.data) ? response.data : [];
            
            // Apply frontend sorting since backend endpoint doesn't support it
            const sortedIncidents = incidents.sort((a, b) => {
                let aValue: any, bValue: any;
                
                switch (sortField) {
                    case "windows_start":
                        aValue = new Date(a.windows_start);
                        bValue = new Date(b.windows_start);
                        break;
                    case "score":
                        aValue = a.score;
                        bValue = b.score;
                        break;
                    case "user":
                        aValue = a.user;
                        bValue = b.user;
                        break;
                    default:
                        aValue = new Date(a.windows_start);
                        bValue = new Date(b.windows_start);
                }
                
                if (sortOrder === "asc") {
                    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                } else {
                    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                }
            });
            
            return {
                incidents: sortedIncidents,
                total: sortedIncidents.length
            };
        } catch (error) {
            console.error('Failed to fetch incidents by date range:', error);
            return {
                incidents: [],
                total: 0
            };
        }
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
     * Retrieves user information by user ID for status history display
     * @param userId - The unique identifier of the user
     * @returns Promise containing user display information
     */
    getUserById: async (userId: string): Promise<{ first_name: string; last_name: string; email: string } | null> => {
        try {
            const response = await api.get(`/auth/users`);
            const users = response.data;
            const user = users.find((u: any) => u.id === userId);
            return user || null;
        } catch (error) {
            console.error('Failed to fetch user information:', error);
            return null;
        }
    },

    /**
     * Enhanced method to retrieve status change history with user information
     */
    getIncidentStatusHistory: async (incidentID: string): Promise<IncidentStatusChange[]> => {
        try {
            const response = await api.get(`/incident/${incidentID}/status-history`);
            const statusHistory = response.data;
            
            // Enrich status history with user information
            const enrichedHistory = await Promise.all(
                statusHistory.map(async (item: any) => {
                    let userDisplayName = 'System';
                    
                    if (item.user_id) {
                        try {
                            const user = await IncidentService.getUserById(item.user_id);
                            if (user) {
                                userDisplayName = `${user.first_name} ${user.last_name}`.trim() || user.email;
                            }
                        } catch (error) {
                            console.warn(`Failed to fetch user details for ${item.user_id}:`, error);
                            userDisplayName = 'Unknown User';
                        }
                    }
                    
                    return {
                        id: item.id,
                        timestamp: new Date(item.created_at),
                        action: item.action,
                        previousStatus: item.previous_status,
                        newStatus: item.new_status,
                        userId: item.user_id,
                        userDisplayName // Add user display name for UI
                    };
                })
            );
            
            return enrichedHistory;
        } catch (error) {
            console.error('Failed to fetch incident status history:', error);
            throw new Error(`Failed to fetch status history for incident ${incidentID}: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    // =================== COMMENT METHODS ===================

    /**
     * Creates a new comment on an incident
     */
    createComment: async (incidentID: string, content: string): Promise<IncidentComment> => {
        try {
            const response = await api.post(`/incident/${incidentID}/comments`, {
                incident_id: incidentID,
                content: content
            });
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw new Error(`Failed to create comment: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    /**
     * Retrieves all comments for a specific incident
     */
    getIncidentComments: async (incidentID: string): Promise<IncidentComment[]> => {
        try {
            const response = await api.get(`/incident/${incidentID}/comments`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch incident comments:', error);
            throw new Error(`Failed to fetch comments for incident ${incidentID}: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    /**
     * Updates an existing comment
     */
    updateComment: async (commentId: string, content: string): Promise<IncidentComment> => {
        try {
            const response = await api.put(`/incident/comments/${commentId}`, {
                content: content
            });
            return response.data;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw new Error(`Failed to update comment: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    /**
     * Deletes a comment
     */
    deleteComment: async (commentId: string): Promise<boolean> => {
        try {
            await api.delete(`/incident/comments/${commentId}`);
            return true;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw new Error(`Failed to delete comment: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    /**
     * Gets a specific comment by ID
     */
    getCommentById: async (commentId: string): Promise<IncidentComment> => {
        try {
            const response = await api.get(`/incident/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch comment:', error);
            throw new Error(`Failed to fetch comment ${commentId}: ${error instanceof Error ? error.message : String(error)}`);
        }
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

    /**
     * Updates an incident by its ID with partial data
     * @param ID - The unique identifier of the incident
     * @param updateData - Partial incident data to update
     * @returns Promise containing the updated incident data
     */
    updateIncident: async (ID: string, updateData: Partial<Incident>): Promise<Incident> => {
        try {
            const response = await api.put(`/incident/${ID}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating incident:', error);
            throw error;
        }
    },
};