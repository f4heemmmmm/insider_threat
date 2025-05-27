// frontend/src/services/constants/interfaces.tsx 

import { DashboardData } from "@/types/dashboard.types";

export interface ExtendedDashboardData extends DashboardData {
    averageAlertScore: number;
    averageIncidentScore: number;
    alertsUnderIncidentCount: number;
    criticalSeverityAlertsCount: number;
    criticalIncidentsCount: number;
    activeUsersCount: number;
}

export interface AlertsByDateData {
    date: string;
    count: number;
}

export interface IncidentsByDateData {
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