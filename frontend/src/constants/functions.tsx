// src/constants/functions.tsx
import { IndexedSharePointEvent } from "@/constants/interface";
import { Alert } from '@/types/alert.types';
import { TimelineEvent } from '@/components/ui/IncidentTimeline';

export const getScoreSeverity = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score >= 90) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "critical":
            return "text-red-400";
        case "high":
            return "text-orange-400";
        case "medium":
            return "text-amber-400";
        case "low":
            return "text-blue-400";
        default:
            return "text-gray-500";
    }
};

export const formatEvidenceValue = (value: any): string => {
    if (value === null || value === undefined) {
        return "N/A";
    }
    if (typeof value === "object") {
        if ((Array.isArray(value) && value.length === 0) || Object.keys(value).length === 0 && !Array.isArray(value)) {
            return "N/A";
        }
        return JSON.stringify(value, null, 2);
    }
    return String(value);
};

export const getSortedEvidenceEntries = (evidence: any) => {
    if (!evidence) {
        return [];
    }
    return Object.entries(evidence)
        .filter(([key]) => key !== "list_raw_events")       // Filtering out the raw events (displayed separately)
        .filter(([key, value]) => {                         // Filtering out null or undefined values
            if (value === null || value === undefined) {
                return false;
            }
            if (value === "") {
                return false;
            }
            if (typeof value === "object" && Object.keys(value).length === 0) {
                return false;
            }
            if (Array.isArray(value) && value.length === 0) {
                return false;
            }
            return true;
        })
        .sort((a, b) => a[0].localeCompare(b[0]));          // Sorting alphabetically by key
};

export const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
        return "null";
    }
    if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
};

// Parse and clean AppAccessContext events
export const parseAppAccessEvents = (events: any): IndexedSharePointEvent[] => {
    try {
        if (Array.isArray(events)) {
            return events.map((event, index) => {
                if (typeof event === "string") {
                    // For strings that are escaped JSON, we need to clean and parse them
                    try {
                        // Remove outer quotes if present
                        let cleanEvent = event;
                        if (cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) {
                            cleanEvent = cleanEvent.slice(1, -1);
                        }
                        
                        // Replace escaped quotes with actual quotes
                        cleanEvent = cleanEvent.replace(/\\"/g, '"');

                        // Parse the cleaned string and add original index
                        const parsedEvent = JSON.parse(cleanEvent);
                        return { ...parsedEvent, _originalIndex: index };
                    } catch (error) {
                        console.error(`Error parsing event at index ${index}:`, error);
                        return { error: `Failed to parse event: ${error instanceof Error ? error.message : "Unknown error"}`, _originalIndex: index };
                    }
                } else if (typeof event === "object") {
                    return { ...event, _originalIndex: index };
                } else {
                    return { error: `Unsupported event type: ${typeof event}`, _originalIndex: index };
                }
            });
        } else if (typeof events === "string") {
            try {
                const parsed = JSON.parse(events);
                if (Array.isArray(parsed)) {
                    return parseAppAccessEvents(parsed);
                } else {
                    return [{ ...parsed, _originalIndex: 0 }];
                }
            } catch {
                let cleanEvent = events;
                if (cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) {
                    cleanEvent = cleanEvent.slice(1, -1);
                }
                cleanEvent = cleanEvent.replace(/\\"/g, '"');
                try {
                    const parsedEvent = JSON.parse(cleanEvent);
                    return [{ ...parsedEvent, _originalIndex: 0 }];
                } catch (error) {
                    console.error("Error parsing single string event:", error);
                    return [{ error: `Failed to parse event: ${error instanceof Error ? error.message : "Unknown error"}`, _originalIndex: 0 }];
                }
            }
        } else if (typeof events === "object" && events !== null) {
            return [{ ...events, _originalIndex: 0 }];
        }
        return [{ error: 'Unsupported events format', _originalIndex: 0 }];
    } catch (error) {
        console.error("Error in parseAppAccessEvents:", error);
        return [{ error: `Global parsing error: ${error instanceof Error ? error.message : "Unknown error"}`, _originalIndex: 0 }];
    }
};

  // Extract unique MITRE tactics from alerts
 export const extractMitreTactics = (alerts: Alert[]): string[] => {
    const uniqueTactics = new Set<string>();
    
    alerts.forEach(alert => {
      if (alert.MITRE_tactic && alert.MITRE_tactic.trim() !== '') {
        uniqueTactics.add(alert.MITRE_tactic);
      }
    });
    
    return Array.from(uniqueTactics);
  };

export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
};

export const formatDuration = (end: Date, start: Date): string => {
    const diffMS = new Date(end).getTime() - new Date(start).getTime();
    const seconds = Math.floor(diffMS / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let result = "";
    
    if (days > 0) {
        result += `${days}d `;
    }
    if (hours > 0 || days > 0) {
        const remainingHours = hours % 24;
        result += `${remainingHours}h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        const remainingMinutes = minutes % 60;
        result += `${remainingMinutes}m `;
    }
    const remainingSeconds = seconds % 60;
    result += `${remainingSeconds}s`;
    return result.trim();
};
  
  export const calculateIncidentDuration = (alerts: Alert[]) => {
    if (alerts.length === 0) {
      return {
        earliestAlert: null,
        latestAlert: null,
        duration: 'No alerts found'
      };
    }
    
    const earliestAlert = new Date(alerts[0].datestr);
    const latestAlert = new Date(alerts[alerts.length - 1].datestr);
    
    // Using the existing formatDuration function which expects (end, start) parameters
    const durationFormatted = formatDuration(latestAlert, earliestAlert);
    
    return {
      earliestAlert,
      latestAlert,
      duration: durationFormatted
    };
  };
  
  export const mapAlertsToTimelineEvents = (alerts: Alert[]): TimelineEvent[] => {
    return alerts.map(alert => {
      const alertDate = new Date(alert.datestr);
      
      let eventType: 'alert' | 'defense' | 'impact' | 'other' = 'other';
      if (alert.MITRE_tactic) {
        if (alert.MITRE_tactic.includes('Defense Evasion')) {
          eventType = 'defense';
        } else if (alert.MITRE_tactic.includes('Impact')) {
          eventType = 'impact';
        } else {
          eventType = 'alert';
        }
      } else {
        if (alert.score >= 90) eventType = 'alert';
        else if (alert.score >= 70) eventType = 'defense';
        else if (alert.score >= 50) eventType = 'impact';
      }
      
      return {
        id: alert.ID,
        timestamp: alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: formatDate(alertDate),
        title: alert.alert_name,
        description: alert.Description || 'No description available',
        type: eventType,
        severity: getScoreSeverity(alert.score) as 'critical' | 'high' | 'medium' | 'low',
        MITRE_tactic: alert.MITRE_tactic,
        MITRE_technique: alert.MITRE_technique,
        onClick: () => {
          const alertElement = document.getElementById(`alert-${alert.ID}`);
          if (alertElement) {
            alertElement.scrollIntoView({ behavior: 'smooth' });
            alertElement.classList.add('ring-2', 'ring-indigo-500');
            setTimeout(() => {
              alertElement.classList.remove('ring-2', 'ring-indigo-500');
            }, 2000);
          }
        }
      };
    });
  };