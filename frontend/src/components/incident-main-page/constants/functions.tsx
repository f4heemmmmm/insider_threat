// frontend/src/incident-main/constants/functions.tsx

export const getScoreSeverityMapping = (score: number) => {
    if (score >= 90) {
        return {
            status: "critical" as const,
            label: "Critical"
        };
    }
    if (score >= 70) {
        return {
            status: "high" as const,
            label: "High"
        };
    }
    if (score >= 50) {
        return {
            status: "medium" as const,
            label: "Medium"
        };
    }
    return {
        status: "low" as const,
        label: "Low"
    }
};

export const formatDuration = (end: Date, start: Date): string => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let result = "";

    if (days > 0) {
        result += `${days}d `
    }
    if (hours % 24 > 0) {
        result += `${hours % 24}h `;
    }
    if (minutes % 60 > 0) {
        result += `${minutes % 60}m `
    }
    if (seconds % 60 > 0) {
        result += `${seconds % 60}s `
    }
    if (result === "") {
        result = "0s";
    }
    return result.trim()
};