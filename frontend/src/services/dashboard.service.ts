import { AlertService } from "./alert.service";
import { IncidentService } from "./incident.service";
import { DashboardStats } from "@/types/dashboard.types";

export const DashboardService = {
    // Get dashboard statistics
    getStats: async (): Promise<DashboardStats> => {
        const [totalAlerts, totalIncidents] = await Promise.all([
            AlertService.getAlertCount(),
            IncidentService.getIncidentCount(),
        ]);

        return {
            totalAlerts,
            totalIncidents,
        };
    },
};