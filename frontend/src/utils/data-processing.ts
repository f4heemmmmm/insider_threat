// data-processing.ts
import { Alert } from "../types/alert.types";
import { Incident } from "../types/incident.types";

/**
 * Matches alerts to their corresponding incidents based on time window and user association.
 * Creates a mapping between incident IDs and their related alerts by checking if alerts
 * fall within the incident's time window and belong to the same user.
 * @param alerts - Array of alerts to process and match
 * @param incidents - Array of incidents to match alerts against
 * @returns Map where keys are incident IDs and values are arrays of related alerts
 */
export function matchAlertsToIncidents(alerts: Alert[], incidents: Incident[]): Map<string, Alert[]> {
    const incidentMap = new Map<string, Alert[]>();

    incidents.forEach((incident) => {
        incidentMap.set(incident.ID, []);
    });

    alerts.forEach((alert) => {
        const alertDate = new Date(alert.datestr);

        incidents.forEach((incident) => {
            const startDate = new Date(incident.windows_start);
            const endDate = new Date(incident.windows_end);

            if (
                alert.user === incident.user &&
                alertDate >= startDate &&
                alertDate <= endDate
            ) {
                const existingAlerts = incidentMap.get(incident.ID) || [];
                incidentMap.set(incident.ID, [...existingAlerts, alert]);
            }
        });
    });
    return incidentMap;
}

/**
 * Analyzes alerts to calculate the distribution of MITRE ATT&CK tactics.
 * Counts the frequency of each tactic appearing across all provided alerts.
 * @param alerts - Array of alerts to analyze for MITRE tactics
 * @returns Object with tactic names as keys and their occurrence counts as values
 */
export function getMITRETacticsDistribution(alerts: Alert[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    alerts.forEach((alert) => {
        const tactic = alert.MITRE_tactic;
        if (tactic) {
            distribution[tactic] = (distribution[tactic] || 0) + 1;
        }
    });
    return distribution;
}

/**
 * Analyzes alerts to calculate the distribution of MITRE ATT&CK techniques.
 * Counts the frequency of each technique appearing across all provided alerts.
 * @param alerts - Array of alerts to analyze for MITRE techniques
 * @returns Object with technique names as keys and their occurrence counts as values
 */
export function getMITRETechniquesDistribution(alerts: Alert[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    alerts.forEach((alert) => {
        const technique = alert.MITRE_technique;
        if (technique) {
            distribution[technique] = (distribution[technique] || 0) + 1;
        }
    });

    return distribution;
}

/**
 * Calculates severity distribution by categorizing items based on their score values.
 * Uses predefined score ranges: Critical (90+), High (70-89), Medium (50-69), Low (<50).
 * @param items - Array of objects containing a score property (alerts or incidents)
 * @returns Object with severity levels as keys and their counts as values
 */
export function getSeverityDistribution(items: Array<{ score: number }>): Record<"low" | "medium" | "high" | "critical", number> {
    const distribution: Record<"low" | "medium" | "high" | "critical", number> = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
    };

    items.forEach((item) => {
        if (item.score >= 90) {
            distribution.critical++;
        } else if (item.score >= 70) {
            distribution.high++;
        } else if (item.score >= 50) {
            distribution.medium++;
        } else {
            distribution.low++;
        }
    });

    return distribution;
}

/**
 * Calculates the distribution of alerts across different users.
 * Counts how many alerts are associated with each user in the system.
 * @param alerts - Array of alerts to analyze for user distribution
 * @returns Object with usernames as keys and their alert counts as values
 */
export function getAlertsPerUserDistribution(alerts: Alert[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    alerts.forEach((alert) => {
        const user = alert.user;
        distribution[user] = (distribution[user] || 0) + 1;
    });

    return distribution;
}

/**
 * Calculates the daily distribution of alerts over a specified time period.
 * Initializes all days in the range with zero counts and fills in actual alert data.
 * @param alerts - Array of alerts to analyze for daily distribution
 * @param days - Number of days to analyze from current date (default: 30)
 * @returns Object with ISO date strings as keys and alert counts as values
 */
export function getAlertsPerDayDistribution(alerts: Alert[], days = 30): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        distribution[dateString] = 0;
    }

    alerts.forEach((alert) => {
        const alertDate = new Date(alert.datestr);
        const dateString = alertDate.toISOString().split("T")[0];
        
        const daysAgo = Math.floor((today.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo <= days) {
            distribution[dateString] = (distribution[dateString] || 0) + 1;
        }
    });

    return distribution;
}