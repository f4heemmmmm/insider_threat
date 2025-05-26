// frontend/src/services/analytics.service.ts

import { api } from "./api";

export interface AlertsByDateData {
    date: string;
    count: number;
}

export interface IncidentsbyDateData {
    date: string;
    count: number;
}

export interface AlertsByMITRETacticData {
    tactic: string;
    count: number;
}

export interface AlertsByMITRETechniqueData {
    technique: string;
    count: number;
}

export interface AlertsByUserData {
    user: string;
    count: number;
}

export interface ScoreDistributionData {
    scoreRange: string;
    alertCount: number;
    incidentCount: number;
}

export interface TimelineData {
    date: string;
    alerts: number;
    incidents: number;
}

export interface TrendData {
    period: string;
    alerts: number;
    incidents: number;
    alertsChange: number;
    incidentsChange: number;
}

export const AnalyticsService = {
    getAlertsByDate: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<AlertsByDateData[]> => {
        const response = await api.get("/analytics/alerts-by-date", {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                groupBy
            }
        });
        return response.data;
    },

    getIncidentsByDate: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<IncidentsbyDateData[]> => {
        const response = await api.get("/analytics/incidents-by-date", {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                groupBy
            }
        });
        return response.data;
    },

    getAlertsByMITRETactic: async (): Promise<AlertsByMITRETacticData[]> => {
        const response = await api.get("/analytics/top-mitre-tactics");
        return response.data;
    },

    getAlertsByMITRETechnique: async (): Promise<AlertsByMITRETechniqueData[]> => {
        const response = await api.get("/analytics/top-mitre-techniques");
        return response.data;
    },

    getAlertsByUser: async (limit: number = 10): Promise<AlertsByUserData[]> => {
        const response = await api.get("/analytics/alerts-by-user", {
            params: {
                limit
            }
        });
        return response.data
    },

    getScoreDistribution: async (): Promise<ScoreDistributionData[]> => {
        const response = await api.get("/analytics/score-distribution");
        return response.data;
    },

    getTimeline: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<TimelineData[]> => {
        const response = await api.get("/analytics/timeline", {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                groupBy
            }
        });
        return response.data;
    },

    getTrends: async (
        startDate: Date,
        endDate: Date,
        groupBy: "day" | "week" | "month" = "day"
    ): Promise<TrendData[]> => {
        const response = await api.get("/analytics/trends", {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                groupBy
            }
        });
        return response.data;
    },

    getAlertSeverityDistribution: async (): Promise<{ severity: string, count: number }[]> => {
        const response = await api.get("/analytics/alert-severity");
        return response.data
    },

    getTopMITRETechniques: async (limit: number = 10): Promise<{ technique: string, count: number }[]> => {
        const response = await api.get("/analytics/top-mitre-techniques", {
            params: {
                limit
            }
        });
        return response.data;
    },

    getTopMITRETactics: async (limit: number = 10): Promise<{ tactic: string, count: number }[]> => {
        const response = await api.get("/analytics/top-mitre-tactics", {
            params: {
                limit
            }
        });
        return response.data;
    }
};