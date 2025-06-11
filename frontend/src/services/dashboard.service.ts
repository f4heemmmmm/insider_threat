// frontend/src/services/dashboard.service.ts

import { AlertService } from "./alert.service";
import { IncidentService } from "./incident.service";
import { DashboardData } from "@/types/dashboard.types";
import { ExtendedDashboardData } from "./constants/interfaces";
export const DashboardService = {
    /**
     * Retrieves basic dashboard data including total alerts and incidents
     * @returns Promise containing basic dashboard metrics
     */
    getData: async(): Promise<DashboardData> => {
        const [totalAlerts, totalIncidents] = await Promise.all([
            AlertService.getAlertCount(),
            IncidentService.getIncidentCount(),
        ]);
        
        return {
            totalAlerts,
            totalIncidents,
        };
    },

    /**
     * Retrieves extended dashboard data with additional calculated metrics
     * @returns Promise containing comprehensive dashboard analytics
     */
    getExtendedData: async (): Promise<ExtendedDashboardData> => {
        const [
            totalAlerts,
            totalIncidents,
            recentAlerts,
            recentIncidents,
        ] = await Promise.all([
            AlertService.getAlertCount(),
            IncidentService.getIncidentCount(),
            AlertService.getAlerts(100),
            IncidentService.getIncidents(100),
        ]);

        const averageAlertScore = recentAlerts.alerts.length > 0
        ? recentAlerts.alerts.reduce((sum, alert) => sum + alert.score, 0) / recentAlerts.alerts.length
        : 0;

        const averageIncidentScore = recentIncidents.incidents.length > 0
        ? recentIncidents.incidents.reduce((sum, incident) => sum + incident.score, 0) / recentIncidents.incidents.length
        : 0;

        const alertsUnderIncidentCount = recentAlerts.alerts.filter(alert => alert.is_under_incident).length;
        const criticalSeverityAlertsCount = recentAlerts.alerts.filter(alert => alert.score >= 9).length;
        const criticalIncidentsCount = recentIncidents.incidents.filter(incident => incident.score >= 9).length;
        const activeUsersCount = new Set(recentAlerts.alerts.map(alert => alert.user)).size;
        
        return {
            totalAlerts,
            totalIncidents,
            averageAlertScore: parseFloat(averageAlertScore.toFixed(2)),
            averageIncidentScore: parseFloat(averageIncidentScore.toFixed(2)),
            alertsUnderIncidentCount,
            criticalSeverityAlertsCount,
            criticalIncidentsCount, 
            activeUsersCount,
        };
    }
};