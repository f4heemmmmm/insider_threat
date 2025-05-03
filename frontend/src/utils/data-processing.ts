// src/utils/data-processing.ts
import { Alert } from '../types/alert.types';
import { Incident } from '../types/incident.types';

/**
 * Match alerts to their corresponding incidents based on time window and user
 * @param alerts List of alerts to process
 * @param incidents List of incidents to match against
 * @returns A map of incident IDs to arrays of related alerts
 */
export function matchAlertsToIncidents(
  alerts: Alert[],
  incidents: Incident[]
): Map<string, Alert[]> {
  const incidentMap = new Map<string, Alert[]>();

  // Initialize the map with empty arrays for each incident
  incidents.forEach((incident) => {
    incidentMap.set(incident.ID, []);
  });

  // For each alert, find matching incidents
  alerts.forEach((alert) => {
    const alertDate = new Date(alert.datestr);

    incidents.forEach((incident) => {
      const startDate = new Date(incident.windows_start);
      const endDate = new Date(incident.windows_end);

      // Check if the alert falls within the incident's time window and belongs to the same user
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
 * Get MITRE tactics distribution from a list of alerts
 * @param alerts List of alerts to analyze
 * @returns Object with tactic names as keys and counts as values
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
 * Get MITRE techniques distribution from a list of alerts
 * @param alerts List of alerts to analyze
 * @returns Object with technique names as keys and counts as values
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
 * Calculate severity distribution from a list of alerts or incidents
 * @param items List of alerts or incidents with score property
 * @returns Object with severity levels as keys and counts as values
 */
export function getSeverityDistribution(
  items: Array<{ score: number }>
): Record<'low' | 'medium' | 'high' | 'critical', number> {
  const distribution: Record<'low' | 'medium' | 'high' | 'critical', number> = {
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
 * Get alerts per user distribution
 * @param alerts List of alerts to analyze
 * @returns Object with usernames as keys and counts as values
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
 * Get alerts per day distribution over a time period
 * @param alerts List of alerts to analyze
 * @param days Number of days to analyze (default: 30)
 * @returns Object with dates as keys and counts as values
 */
export function getAlertsPerDayDistribution(alerts: Alert[], days = 30): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  // Initialize with last N days
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    distribution[dateString] = 0;
  }

  // Fill in actual alert counts
  alerts.forEach((alert) => {
    const alertDate = new Date(alert.datestr);
    const dateString = alertDate.toISOString().split('T')[0];
    
    // Only count if within our time window
    const daysAgo = Math.floor((today.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo <= days) {
      distribution[dateString] = (distribution[dateString] || 0) + 1;
    }
  });

  return distribution;
}