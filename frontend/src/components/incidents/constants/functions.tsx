// frontend/src/incident-main/constants/functions.tsx
import { getMITREInformation } from "@/data/MITREData";

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

export const getWindowDuration = (windows_start: Date, windows_end: Date) => {
    const startTime = new Date(windows_start);
    const endTime = new Date(windows_end);
    const diffMs = endTime.getTime() - startTime.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
};

export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthShort = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
};

export const handleMITRETacticClick = (tactic: string) => {
    if (!tactic || tactic === "N/A" || tactic === "") {
        return;
    }
    const tacticInformation = getMITREInformation(tactic);
    if (tacticInformation) {
        window.open(tacticInformation.url, "_blank", "noopener,noreferrer");
    } else {
        console.error("No MITRE information found for the tactic specified.");
    }
};

export const handleMITRETechniqueClick = (technique: string) => {
    if (!technique || technique === "N/A" || technique === "") {
        return;
    }
    const techniqueInformation = getMITREInformation(technique);
    if (techniqueInformation) {
        window.open(techniqueInformation.url, "_blank", "noopener,noreferrer");
    } else {
        console.error("No MITRE information found for the technique specified.");
    }
};

export const isTacticClickable = (tactic: string) => {
    if (!tactic || tactic === "N/A" || tactic === "") {
        return false;
    }
    const tacticInformation = getMITREInformation(tactic);
    return Boolean(tacticInformation && tacticInformation.url);
};

export const isTechniqueClickable = (technique: string) => {
    if (!technique || technique === "N/A" || technique === "") {
        return false;
    }
    const techniqueInformation = getMITREInformation(technique);
    return Boolean(techniqueInformation && techniqueInformation.url);
};