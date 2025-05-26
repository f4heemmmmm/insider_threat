// Format the username (remove everything after the first @)
export const formatUsername = (username: string): string => {
    const atIndex = username.indexOf("@");
    if (atIndex > 0) {
        return username.substring(0, atIndex);
    }
    return username;
};

// Format the alert/incident ID (remove everything after the first 8 characters)
export const formatID = (id: string): string => {
    return id.slice(0, 8) + "...";
};

// Format MITRE tactics and techniques for display
export const formatMITREInformation = (tactic: string, technique: string): string => {
    if (!tactic && !technique) {
        return "N/A";
    }
    if (tactic && technique) {
        return `${tactic} - ${technique}`;
    }
    return tactic || technique;
};