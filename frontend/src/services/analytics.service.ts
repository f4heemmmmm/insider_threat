// frontend/src/services/analytics.service.ts

import { api } from "./api";
import { handleApiError } from "./apiErrorHandle";
import { AlertsByDateData, AlertsByMITRETacticData, AlertsByMITRETechniqueData, AlertsByUserData, IncidentsByDateData, ScoreDistributionData, TimelineData, TrendData } from "./constants/interfaces";

export const AnalyticsService = {
    /**
     * Retrieves alerts grouped by date within a specified date range
     * @param startDate - The start date for the query
     * @param endDate - The end date for the query
     * @param groupBy - How to group the data: by day, week, or month
     * @returns Promise containing array of alerts by date data
     */
    getAlertsByDate: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<AlertsByDateData[]> => {
        try {
            const response = await api.get("/analytics/alerts-by-date", {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    groupBy
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts by date:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves incidents grouped by date within a specified date range
     * @param startDate - The start date for the query
     * @param endDate - The end date for the query
     * @param groupBy - How to group the data: by day, week, or month
     * @returns Promise containing array of incidents by date data
     */
    getIncidentsByDate: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<IncidentsByDateData[]> => {
        try {
            const response = await api.get("/analytics/incidents-by-date", {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    groupBy
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch incidents by date:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the top MITRE tactics associated with alerts
     * @returns Promise containing array of alerts grouped by MITRE tactic
     */
    getAlertsByMITRETactic: async (): Promise<AlertsByMITRETacticData[]> => {
        try {
            const response = await api.get("/analytics/top-mitre-tactics");
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts by MITRE tactic:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the top MITRE techniques associated with alerts
     * @returns Promise containing array of alerts grouped by MITRE technique
     */
    getAlertsByMITRETechnique: async (): Promise<AlertsByMITRETechniqueData[]> => {
        try {
            const response = await api.get("/analytics/top-mitre-techniques");
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alerts by MITRE technique:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves alerts grouped by user with optional limit
     * @param limit - Maximum number of users to return (default: 10)
     * @returns Promise containing array of alerts by user data
     */
    getAlertsByUser: async (limit: number = 10): Promise<AlertsByUserData[]> => {
        try {
            const response = await api.get("/analytics/alerts-by-user", {
                params: {
                    limit
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
     * Retrieves the distribution of alerts and incidents by score ranges
     * @returns Promise containing array of score distribution data
     */
    getScoreDistribution: async (): Promise<ScoreDistributionData[]> => {
        try {
            const response = await api.get("/analytics/score-distribution");
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch score distribution:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves timeline data showing alerts and incidents over time
     * @param startDate - The start date for the timeline
     * @param endDate - The end date for the timeline
     * @param groupBy - How to group the timeline data: by day, week, or month
     * @returns Promise containing array of timeline data
     */
    getTimeline: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<TimelineData[]> => {
        try {
            const response = await api.get("/analytics/timeline", {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    groupBy
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch timeline data:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves trend data showing changes in alerts and incidents over time
     * @param startDate - The start date for trend analysis
     * @param endDate - The end date for trend analysis
     * @param groupBy - How to group the trend data: by day, week, or month
     * @returns Promise containing array of trend data
     */
    getTrends: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<TrendData[]> => {
        try {
            const response = await api.get("/analytics/trends", {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    groupBy
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch trends data:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the distribution of alerts by severity level
     * @returns Promise containing array of severity distribution data
     */
    getAlertSeverityDistribution: async (): Promise<{ severity: string, count: number }[]> => {
        try {
            const response = await api.get("/analytics/alert-severity");
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch alert severity distribution:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the top MITRE techniques with optional limit
     * @param limit - Maximum number of techniques to return (default: 10)
     * @returns Promise containing array of top MITRE techniques
     */
    getTopMITRETechniques: async (limit: number = 10): Promise<{ technique: string, count: number }[]> => {
        try {
            const response = await api.get("/analytics/top-mitre-techniques", {
                params: {
                    limit
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch top MITRE techniques:', apiError);
            throw apiError;
        }
    },

    /**
     * Retrieves the top MITRE tactics with optional limit
     * @param limit - Maximum number of tactics to return (default: 10)
     * @returns Promise containing array of top MITRE tactics
     */
    getTopMITRETactics: async (limit: number = 10): Promise<{ tactic: string, count: number }[]> => {
        try {
            const response = await api.get("/analytics/top-mitre-tactics", {
                params: {
                    limit
                }
            });
            return response.data;
        } catch (error) {
            const apiError = handleApiError(error);
            console.error('Failed to fetch top MITRE tactics:', apiError);
            throw apiError;
        }
    }
};