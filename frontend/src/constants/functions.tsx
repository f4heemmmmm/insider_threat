// src/constants/functions.tsx

import { Alert } from '@/types/alert.types';
import { TimelineEvent } from "@/components/incidents/constants/interfaces";
import { IndexedSharePointEvent } from '@/components/alerts/constants/interfaces';

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

/**
 * Enhanced evidence value formatting with intelligent JSON parsing
 */
export const formatEvidenceValue = (value: any): string => {
    if (value === null || value === undefined) {
        return "N/A";
    }
    
    // If it's already an object, stringify it nicely
    if (typeof value === "object") {
        if ((Array.isArray(value) && value.length === 0) || (Object.keys(value).length === 0 && !Array.isArray(value))) {
            return "N/A";
        }
        return JSON.stringify(value, null, 2);
    }
    
    // If it's a string, check if it contains JSON data
    if (typeof value === "string") {
        // Skip empty strings
        if (value.trim() === "") {
            return "N/A";
        }
        
        // Try to detect and parse JSON strings
        const parsedValue = tryParseJSONString(value);
        if (parsedValue !== null) {
            return JSON.stringify(parsedValue, null, 2);
        }
        
        // Return as-is if not JSON
        return String(value);
    }
    
    return String(value);
};

/**
 * Attempts to parse a string as JSON with multiple strategies
 */
const tryParseJSONString = (str: string): any => {
    // Only attempt parsing if the string looks like JSON
    const trimmed = str.trim();
    if (!((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
          (trimmed.startsWith('[') && trimmed.endsWith(']')))) {
        return null;
    }
    
    // Strategy 1: Direct JSON parse
    try {
        return JSON.parse(str);
    } catch {
        // Continue to next strategy
    }
    
    // Strategy 2: Handle doubled quotes (common in CSV exports)
    try {
        const doubleQuotesCleaned = str.replace(/""/g, '"');
        return JSON.parse(doubleQuotesCleaned);
    } catch {
        // Continue to next strategy
    }
    
    // Strategy 3: Handle escaped quotes and surrounding quotes
    try {
        let cleaned = str.trim();
        
        // Remove surrounding quotes if present
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
            (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1);
        }
        
        // Handle escaped quotes
        cleaned = cleaned
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/""/g, '"');
        
        return JSON.parse(cleaned);
    } catch {
        // Continue to next strategy
    }
    
    // Strategy 4: Handle Microsoft Graph API format
    try {
        let graphCleaned = str
            .replace(/""/g, '"')
            .replace(/\\""/g, '"')
            .replace(/""@/g, '"@')
            .replace(/""#/g, '"#')
            .replace(/"":/g, '":')
            .replace(/:""([^"]*)""/g, ':"$1"')
            .trim();

        // Remove outer quotes if they exist
        if (graphCleaned.startsWith('"') && graphCleaned.endsWith('"')) {
            graphCleaned = graphCleaned.slice(1, -1);
        }

        return JSON.parse(graphCleaned);
    } catch {
        // All strategies failed
    }
    
    return null;
};

/**
 * Enhanced function to get sorted evidence entries with better JSON handling
 */
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

// Enhanced parsing for AppAccessContext events with sophisticated JSON handling
export const parseAppAccessEvents = (events: any): IndexedSharePointEvent[] => {
    try {
        if (Array.isArray(events)) {
            return events.map((event, index) => {
                if (typeof event === "string") {
                    // Enhanced multi-strategy parsing for complex JSON strings
                    try {
                        // Strategy 1: Direct JSON parse
                        try {
                            const parsedEvent = JSON.parse(event);
                            return { ...parsedEvent, _originalIndex: index };
                        } catch {
                            // Continue to next strategy
                        }

                        // Strategy 2: Handle doubled quotes (common in CSV exports)
                        try {
                            const doubleQuotesCleaned = event.replace(/""/g, '"');
                            const parsedEvent = JSON.parse(doubleQuotesCleaned);
                            return { ...parsedEvent, _originalIndex: index };
                        } catch {
                            // Continue to next strategy
                        }

                        // Strategy 3: Handle escaped quotes and surrounding quotes
                        let cleanEvent = event.trim();
                        
                        // Remove surrounding quotes if present
                        if ((cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) || 
                            (cleanEvent.startsWith("'") && cleanEvent.endsWith("'"))) {
                            cleanEvent = cleanEvent.slice(1, -1);
                        }
                        
                        // Handle escaped quotes
                        cleanEvent = cleanEvent
                            .replace(/\\"/g, '"')
                            .replace(/\\\\/g, '\\')
                            .replace(/""/g, '"');
                        
                        try {
                            const parsedEvent = JSON.parse(cleanEvent);
                            return { ...parsedEvent, _originalIndex: index };
                        } catch {
                            // Continue to next strategy
                        }

                        // Strategy 4: Handle Microsoft Graph API format with @odata.type
                        try {
                            let graphCleaned = event
                                .replace(/""/g, '"')
                                .replace(/\\""/g, '"')
                                .replace(/""@/g, '"@')
                                .replace(/""#/g, '"#')
                                .replace(/"":/g, '":')
                                .replace(/:""([^"]*)""/g, ':"$1"')
                                .trim();

                            // Remove outer quotes if they exist
                            if (graphCleaned.startsWith('"') && graphCleaned.endsWith('"')) {
                                graphCleaned = graphCleaned.slice(1, -1);
                            }

                            const parsedEvent = JSON.parse(graphCleaned);
                            return { ...parsedEvent, _originalIndex: index };
                        } catch {
                            // Continue to next strategy
                        }

                        // Strategy 5: Handle multiple levels of escaping
                        try {
                            const unescapedEvent = JSON.parse(`"${cleanEvent}"`);
                            const parsedEvent = JSON.parse(unescapedEvent);
                            return { ...parsedEvent, _originalIndex: index };
                        } catch {
                            // Continue to final strategy
                        }

                        // Strategy 6: Manual cleaning with comprehensive escape handling
                        let manuallyCleanedEvent = cleanEvent
                            .replace(/\\"/g, '"')
                            .replace(/\\\\/g, '\\')
                            .replace(/\\n/g, '\n')
                            .replace(/\\r/g, '\r')
                            .replace(/\\t/g, '\t')
                            .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

                        const parsedEvent = JSON.parse(manuallyCleanedEvent);
                        return { ...parsedEvent, _originalIndex: index };

                    } catch (error) {
                        console.error(`Error parsing event at index ${index}:`, error);
                        console.error(`Original event sample:`, event.substring(0, 300));
                        
                        // Try to extract some meaningful data even if parsing fails
                        const extractedData = extractBasicDataFromString(event);
                        
                        return { 
                            error: `Failed to parse event: ${error instanceof Error ? error.message : "Unknown error"}`, 
                            _originalIndex: index,
                            originalEventSample: event.substring(0, 200) + (event.length > 200 ? '...' : ''),
                            extractedData: extractedData
                        };
                    }
                } else if (typeof event === "object" && event !== null) {
                    return { ...event, _originalIndex: index };
                } else {
                    return { error: `Unsupported event type: ${typeof event}`, _originalIndex: index };
                }
            });
        } else if (typeof events === "string") {
            try {
                // Enhanced string parsing with multiple strategies
                
                // Strategy 1: Direct parse
                try {
                    const parsed = JSON.parse(events);
                    if (Array.isArray(parsed)) {
                        return parseAppAccessEvents(parsed);
                    } else {
                        return [{ ...parsed, _originalIndex: 0 }];
                    }
                } catch {
                    // Continue to enhanced strategies
                }

                // Strategy 2: Handle doubled quotes
                try {
                    const doubleQuotesCleaned = events.replace(/""/g, '"');
                    const parsed = JSON.parse(doubleQuotesCleaned);
                    if (Array.isArray(parsed)) {
                        return parseAppAccessEvents(parsed);
                    } else {
                        return [{ ...parsed, _originalIndex: 0 }];
                    }
                } catch {
                    // Fall back to treating as single event
                }

                // If all parsing fails, treat as single escaped event
                return parseAppAccessEvents([events]);
            } catch {
                // Final fallback
                return [{ 
                    error: 'Could not parse string events', 
                    _originalIndex: 0,
                    originalData: events.substring(0, 200) + (events.length > 200 ? '...' : '')
                }];
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

// Helper function to extract basic data from unparseable strings
const extractBasicDataFromString = (data: string): any => {
    const extracted: any = {};
    
    try {
        // Extract email addresses
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = data.match(emailRegex);
        if (emails && emails.length > 0) {
            extracted.emails = emails;
        }

        // Extract userPrincipalName values
        const upnRegex = /"?userPrincipalName"?\s*:\s*"?([^",\s}]+)"?/g;
        const upnMatches = [...data.matchAll(upnRegex)];
        if (upnMatches.length > 0) {
            extracted.userPrincipalNames = upnMatches.map(match => match[1]);
        }

        // Extract displayName values
        const displayNameRegex = /"?displayName"?\s*:\s*"?([^",\s}]+)"?/g;
        const displayNameMatches = [...data.matchAll(displayNameRegex)];
        if (displayNameMatches.length > 0) {
            extracted.displayNames = displayNameMatches.map(match => match[1]);
        }

        // Extract fileName values
        const fileNameRegex = /"?fileName"?\s*:\s*"?([^",\s}]+)"?/g;
        const fileNameMatches = [...data.matchAll(fileNameRegex)];
        if (fileNameMatches.length > 0) {
            extracted.fileNames = fileNameMatches.map(match => match[1]);
        }

        // Extract dates
        const dateRegex = /"?createdDateTime"?\s*:\s*"?([^",\s}]+)"?/g;
        const dateMatches = [...data.matchAll(dateRegex)];
        if (dateMatches.length > 0) {
            extracted.timestamps = dateMatches.map(match => match[1]);
        }

        // Count approximate objects
        const objectCount = (data.match(/@odata\.type/g) || []).length;
        if (objectCount > 0) {
            extracted.approximateObjectCount = objectCount;
        }

    } catch (error) {
        console.warn("Error extracting basic data:", error);
    }

    return Object.keys(extracted).length > 0 ? extracted : null;
};

  // Extract unique MITRE tactics from alerts
 export const extractMITRETactics = (alerts: Alert[]): string[] => {
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
        id: alert.id,
        timestamp: alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: formatDate(alertDate),
        title: alert.alert_name,
        description: alert.Description || 'No description available',
        type: eventType,
        severity: getScoreSeverity(alert.score) as 'critical' | 'high' | 'medium' | 'low',
        MITRE_tactic: alert.MITRE_tactic,
        MITRE_technique: alert.MITRE_technique,
        onClick: () => {
          const alertElement = document.getElementById(`alert-${alert.id}`);
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

// MITRE ATT&CK Framework helper functions
export const isTacticClickable = (tactic: string): boolean => {
    if (!tactic) return false;
    const normalizedTactic = tactic.toLowerCase().trim();
    const knownTactics = [
        'reconnaissance', 'resource development', 'initial access', 'execution',
        'persistence', 'privilege escalation', 'defense evasion', 'credential access',
        'discovery', 'lateral movement', 'collection', 'command and control',
        'exfiltration', 'impact'
    ];
    return knownTactics.some(known => normalizedTactic.includes(known));
};

export const isTechniqueClickable = (technique: string): boolean => {
    if (!technique) return false;
    // Check if it matches the pattern T#### or T####.###
    const techniquePattern = /^T\d{4}(\.\d{3})?$/;
    return techniquePattern.test(technique.trim());
};

export const handleMITRETacticClick = (tactic: string): void => {
    if (!isTacticClickable(tactic)) return;
    
    const normalizedTactic = tactic.toLowerCase().trim().replace(/\s+/g, '-');
    const url = `https://attack.mitre.org/tactics/${normalizedTactic}/`;
    window.open(url, '_blank', 'noopener,noreferrer');
};

export const handleMITRETechniqueClick = (technique: string): void => {
    if (!isTechniqueClickable(technique)) return;
    
    const url = `https://attack.mitre.org/techniques/${technique}/`;
    window.open(url, '_blank', 'noopener,noreferrer');
};