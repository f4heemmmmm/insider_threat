// frontend/scripts/processMITREData.js

const fs = require("fs");
const path = require("path");
const https = require("https");

const CONFIG = {
    // URL for MITRE ATT&CK STIX data
    stixDataURL: 'https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json',
    // Output file paths
    outputDirectory: path.resolve(__dirname, "../src/data"),
    MITRETacticsOutputFile: "MITRETactics.json",
    MITRETechniquesOutputFile: "MITRETechniques.json",
    prettyPrint: true
};

/**
 * Get the MITRE ATT&CK ID from a STIX object
 * @param {Object} obj - MITRE STIX object 
 * @returns {string | null} - MITRE ATT&CK ID (or null if not found)
 */
function getAttackID(obj) {
    if (!obj.external_references || !Array.isArray(obj.external_references)) {
        return null;
    }
    const attackReferences = obj.external_references.find(ref => ref.source_name === "mitre-attack");

    return attackReferences ? attackReferences.external_id : null;
}

/**
 * Fetch JSON data from the URL
 * @param {string} url - The URL where data is to be fetched
 * @returns {Promise<Object>} - Parsed JSON data
 */
function fetchJSONFromURL(url) {
    return new Promise((resolve, reject) => {
        console.log(`Fetching data from ${url}...`);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to fetch data from ${url}: ${response.statusCode}`));
                return;
            }
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                try {
                    console.log("Data fetched SUCCESSFULLY");
                    const JSONData = JSON.parse(data);
                    resolve (JSONData);
                } catch(error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
            response.on("error", (error) => {
                reject(error);
            });
        }).on("error", (error) => {
            reject(error);
        });
    });
};

/**
 * Checks and ensures that the output directory exists
 * @param {string} directory - Output directory path
 */
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Created Directory: ${directory}`);
    }
};

/**
 * Save JSON data to a file
 * @param {Object} data - JSON data to be saved
 * @param {string} filePath - Path of file for JSON data to be saved on
 */
function saveJSONToFile(data, filePath) {
    const JSONString = CONFIG.prettyPrint
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);

    fs.writeFileSync(filePath, JSONString);
    console.log(`Saved data to ${filePath}`);
};

/**
 * Processs the STIX data, to retrieve MITRE tactics and techniques
 * @param {Object} stixData - Raw STIX data
 * @returns {Object} - Object containin the MITRE tactics and techniques 
 */
function processMITREStixData(stixData) {
    if (!stixData.objects || !Array.isArray(stixData.objects)) {
        throw new Error("Invalid STIX data format!");
    }
    console.log(`Processing ${stixData.objects.length} STIX objects...`);

    // Extract MITRE tactics
    const MITRETactics = {};
    const MITRETechniques = {};
    const MITRETacticsByID = {};    // Store MITRE Tactics by their pre-assigned ID for faster lookup

    // Process MITRE Tactics
    stixData.objects.forEach(obj => {
        if (obj.type === "x-mitre-tactic") {
            processMITRETactic(obj, MITRETactics, MITRETacticsByID);
        }
    });

    // Process MITRE Techniques
    stixData.objects.forEach(obj => {
        if (obj.type === "attack-pattern") {
            processMITRETechnique(obj, MITRETechniques, MITRETacticsByID);
        }
    });

    // Count processed items
    const MITRETacticCount = Object.keys(MITRETactics).length;
    const MITRETechniqueCount = Object.keys(MITRETechniques).length;
    console.log(`[SUCCESSFUL] Processed ${MITRETacticCount} MITRE Tactics and ${MITRETechniqueCount} MITRE Techniques.`);
    
    return { MITRETactics, MITRETechniques };
};

/**
 * Processes a MITRE Tactic object from STIX data
 * @param {Object} tactic - The MITRE tactic object
 * @param {Object} MITRETactics - The map to store processed MITRE tactics by name
 * @param {Object} MITRETacticsByID - The map to store processed MITRE tactics by MITRE ATT&CK ID
 */
function processMITRETactic(tactic, MITRETactics, MITRETacticsByID) {
    if (!tactic.name || !tactic.description) {
        return;
    }

    // Get MITRE tactic ATT&CK ID
    const attackID = getAttackID(tactic);
    if (!attackID) {
        return;
    }

    // Store MITRE tactic by name
    const MITRETacticInformation = {
        id: attackID,
        stixID: tactic.id,
        name: tactic.name,
        description: tactic.description,
        shortname: tactic.x_mitre_shortname,
        url: `https://attack.mitre.org/tactics/${attackID}/`
    };

    MITRETactics[tactic.name] = MITRETacticInformation;
    MITRETacticsByID[tactic.id] = MITRETacticInformation;

    const numericalID = attackID.replace("TA", "");
    MITRETactics[attackID] = MITRETacticInformation;
    MITRETactics[numericalID] = MITRETacticInformation;

    MITRETactics[`${attackID}: ${tactic.name}`] = MITRETacticInformation;
};

/**
 * Processes a MITRE Technique object from STIX data
 * @param {Object} technique - The MITRE tactic object
 * @param {Object} MITRETechniques - The map to store processed MITRE techniques by name
 * @param {Object} MITRETacticsByID - The map to store processed MITRE tactics by MITRE ATT&CK ID
 */
function processMITRETechnique(technique, MITRETechniques, MITRETacticsByID) {
    if (!technique.name || !technique.description) {
        return;
    }

    // Get MITRE technique ATT&CK ID
    const attackID = getAttackID(technique);
    if (!attackID) {
        return;
    }

    const isSubTechnique = technique.x_mitre_is_subtechnique === true;

    let url;
    let parentID;
    if (isSubTechnique && attackID.includes(".")) {
        const parts = attackID.split(".");
        parentID = parts[0];
        const subID = parts[1];
        url = `https://attack.mitre.org/techniques/${parentID}/${subID}/`;
    } else {
        url = `https://attack.mitre.org/techniques/${attackID}/`;
    }

    const tacticIDs = [];
    const tacticNames = [];

    if (technique.kill_chain_phases && Array.isArray(technique.kill_chain_phases)) {
        technique.kill_chain_phases.forEach(phase => {
            if (phase.kill_chain_name.includes("mitre-attack")) {
                for (const tacticID in MITRETacticsByID) {
                    const tactic = MITRETacticsByID[tacticID];
                    if (tactic.shortname === phase.phase_name) {
                        tacticIDs.push(tactic.id);
                        tacticNames.push(tactic.name);
                    }
                }
            }
        });
    }

    const MITRETechniqueInformation = {
        id: attackID,
        stixID: technique.id,
        name: technique.name,
        description: technique.description,
        isSubTechnique: isSubTechnique,
        parentID: parentID,
        url: url,
        tacticIDs: tacticIDs,
        tacticNames: tacticNames
    };

    MITRETechniques[technique.name] = MITRETechniqueInformation;
    const numericalID = attackID.replace("T", "");
    MITRETechniques[attackID] = MITRETechniqueInformation;
    MITRETechniques[numericalID] = MITRETechniqueInformation;
    MITRETechniques[`${attackID}: ${technique.name}`] = MITRETechniqueInformation;

    MITRETechniques[technique.name.toLowerCase()] = MITRETechniqueInformation;
    MITRETechniques[technique.name.toUpperCase()] = MITRETechniqueInformation;
};

async function main() {
    try {
        // Download the STIX data
        const stixData = await fetchJSONFromURL(CONFIG.stixDataURL);

        // Process the STIX data
        const { MITRETactics, MITRETechniques } = processMITREStixData(stixData);

        // Ensure that the output directory exists
        ensureDirectoryExists(CONFIG.outputDirectory);

        // Save the processed data
        const tacticsPath = path.join(CONFIG.outputDirectory, CONFIG.MITRETacticsOutputFile);
        const techniquesPath = path.join(CONFIG.outputDirectory, CONFIG.MITRETechniquesOutputFile);
        saveJSONToFile(MITRETactics, tacticsPath);
        saveJSONToFile(MITRETechniques, techniquesPath);

        console.log("[SUCCESSFUL] MITRE ATT&CK data processing complete!");
    } catch (error) {
        console.error("[X] Error processing MITRE ATT&CK data:", error);
        process.exit(1);
    }
}

main();