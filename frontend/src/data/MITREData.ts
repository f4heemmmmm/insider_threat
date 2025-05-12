// frontend/src/data/MITREData.ts

import MITRETactics from "./MITRETactics.json"
import MITRETechniques from "./MITRETechniques.json"

export interface MITRETactic {
    id: string;                 // ATT&CK ID (e.g., "TA0001") 
    stixID: string;             // STIX ID
    name: string;               // Name of the tactic (e.g., "Initial Access")
    description: string;        // Description of the tactic
    shortname: string;          // Shortname used in the kill chain phases
    url: string;                // URL to the MITRE ATT&CK website for the tactic
}

export interface MITRETechnique {
    id: string;                 // ATT&CK ID (e.g., "T1001" or "T1001.001")
    stixID: string;             // STIX ID
    name: string;               // Name of the technique (e.g., "Phishing")
    description: string;        // Description of the technique
    isSubTechnique: boolean;    // Whether the technique is a sub-technique
    parentID?: string;          // Parent technique ID (for sub-techniques)
    url: string;                // URL to the MITRE ATT&CK website for the technique
    tacticIDs: string[];        // Array of tactic IDs associated with the technique
    tacticNames: string[];      // Array of tactic names associated with the technique
}


export interface MITRETacticWithType extends MITRETactic  {
    type: "tactic";
}

export interface MITRETechniqueWithType extends MITRETechnique {
    type: "technique";
}

export type MITREInformationWithType = MITRETacticWithType | MITRETechniqueWithType | null;

const tactics = MITRETactics as Record<string, MITRETactic>;
const techniques = MITRETechniques as Record<string, MITRETechnique>;

// Helper function to normalize string comparison of case differences or minor variations.
function normalizeString(str: string): string {
    if (!str) {
        return "";
    }
    return str.toLowerCase().trim();
};

/**
 * Get information about a MITRE ATT&CK tactic or technique by its name or ATT&CK ID
 * @param nameOrID - The name or ATT&CK ID of the tactic or technique
 * @returns Information about the tactic or techniques (or null if not found)
 */
export function getMITREInformation(nameOrID: string): MITREInformationWithType {
    if (!nameOrID || nameOrID === "N/A") {
        return null;
    }
    
    // Direct lookup
    if (tactics[nameOrID]) {
        return {
            ...tactics[nameOrID],
            type: "tactic",
        } as MITRETacticWithType;
    }
    if (techniques[nameOrID]) {
        return {
            ...techniques[nameOrID],
            type: "technique",
        } as MITRETechniqueWithType;
    }

    // Normalized lookup
    const normalizedNameOrID = normalizeString(nameOrID);
    for (const key in tactics) {
        if (normalizeString(key) === normalizedNameOrID || normalizeString(tactics[key].name) === normalizedNameOrID) {
            return {
                ...tactics[key],
                type: "tactic",
            } as MITRETacticWithType;
        }   
    }
    for (const key in techniques) {
        if (normalizeString(key) === normalizedNameOrID || normalizeString(techniques[key].name) === normalizedNameOrID) {
            return {
                ...techniques[key],
                type: "technique",
            } as MITRETechniqueWithType;
        }   
    }

    if (nameOrID.includes(".")) {
        const IDPart = nameOrID.split(".")[0].trim();

        // Find by ID part
        if (tactics[IDPart]) {
            return {
                ...tactics[IDPart],
                type: "tactic",
            } as MITRETacticWithType;
        }
        if (techniques[IDPart]) {
            return {
                ...techniques[IDPart],
                type: "technique",
            } as MITRETechniqueWithType;
        }
    }
    return null;
};

// Retrieve all MITRE ATT&CK tactics
export function getAllMITRETactics(): Record<string, MITRETactic> {
    return tactics;
};

// Retrieve all MITRE ATT&CK techniques
export function getAllMITRETechniques(): Record<string, MITRETechnique> {
    return techniques;
};

export function searchMITREInformation(searchTerm: string): MITREInformationWithType[] {
    if (!searchTerm) {
        return [];
    }

    const results: MITREInformationWithType[] = [];
    const normalizedSearchTerm = normalizeString(searchTerm);

    // Search tactics
    for (const key in tactics) {
        const tactic = tactics[key];
        if (normalizeString(tactic.name).includes(normalizedSearchTerm) || normalizeString(tactic.id).includes(normalizedSearchTerm)) {
            results.push({
                ...tactic,
                type: "tactic",
            } as MITRETacticWithType);
        }
    }

    // Search techniques
    for (const key in techniques) {
        const technique = techniques[key];
        if (normalizeString(technique.name).includes(normalizedSearchTerm) || normalizeString(technique.id).includes(normalizedSearchTerm)) {
            results.push({
                ...technique,
                type: "technique",
            } as MITRETechniqueWithType);
        }
    }

    // Remove all duplicates by STIX ID
    const uniqueResults: MITREInformationWithType[] = [];
    const seenIDs = new Set<string>();

    results.forEach(result => {
        if (result && !seenIDs.has(result.stixID)) {
            uniqueResults.push(result);
            seenIDs.add(result.stixID);
        }
    });
    return uniqueResults; // Return the resul
};

export default {
    getMITREInformation,
    getAllMITRETactics,
    getAllMITRETechniques,
    searchMITREInformation,
};