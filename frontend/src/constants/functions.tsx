// src/constants/functions.tsx

export const getScoreSeverity = (score: number) => {
    if (score >= 90) {
        return "critical";
    }
    if (score >= 70) {
        return "high";
    }
    if (score >= 50) {
        return "medium";
    }
    return "low";
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
        .sort((a, b) => a[0].localeCompare(b[0]));
}