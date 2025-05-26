// frontend/src/components/alerts/constants/functions.tsx

import { getMITREInformation } from "@/data/MITREData";

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