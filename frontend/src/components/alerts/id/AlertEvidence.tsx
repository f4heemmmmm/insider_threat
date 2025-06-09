// frontend/src/components/alerts/id/AlertEvidence.tsx

import React, { useState } from "react";
import { AlertEvidenceProps } from "../constants/interfaces";
import { FileText, ChevronUp, ChevronDown, User, File, Mail, Shield, Server, Globe } from "lucide-react";
import { getSortedEvidenceEntries } from "@/constants/functions";

export const AlertEvidence: React.FC<AlertEvidenceProps> = ({ alert, expandedEvidenceSection, toggleEvidenceSection }) => {
    const [expandedProperties, setExpandedProperties] = useState<Record<string, boolean>>({});
    
    const hasEvidence = alert.evidence && Object.keys(alert.evidence).length > 0;
    const isExpanded = expandedEvidenceSection[`${alert.ID}-properties`];
    
    // Check if evidence is an array converted to object with numeric keys
    const isEvidenceArray = hasEvidence && 
        Object.keys(alert.evidence).length > 0 &&
        Object.keys(alert.evidence).every(key => /^\d+$/.test(key)) &&
        // Additional check to ensure it's not just a count property
        !('count' in alert.evidence && Object.keys(alert.evidence).length === 1);

    const handleToggle = () => {
        toggleEvidenceSection(alert.ID, "properties");
    };

    const toggleProperty = (propertyKey: string) => {
        setExpandedProperties(prev => ({
            ...prev,
            [propertyKey]: !prev[propertyKey]
        }));
    };

    // Convert object with numeric keys to array
    const convertNumericKeysToArray = (obj: any): any[] => {
        const keys = Object.keys(obj)
            .filter(key => /^\d+$/.test(key))
            .sort((a, b) => parseInt(a) - parseInt(b));
        return keys.map(key => obj[key]);
    };

    // Get icon for Microsoft Graph evidence type
    const getEvidenceIcon = (odataType: string) => {
        if (odataType?.includes('userEvidence')) return <User className="h-4 w-4 text-blue-500" />;
        if (odataType?.includes('fileEvidence')) return <File className="h-4 w-4 text-green-500" />;
        if (odataType?.includes('messageEvidence') || odataType?.includes('analyzedMessageEvidence')) return <Mail className="h-4 w-4 text-purple-500" />;
        if (odataType?.includes('deviceEvidence')) return <Server className="h-4 w-4 text-orange-500" />;
        if (odataType?.includes('ipEvidence')) return <Globe className="h-4 w-4 text-yellow-500" />;
        return <Shield className="h-4 w-4 text-gray-500" />;
    };

    // Render Microsoft Graph evidence objects
    const renderMicrosoftGraphEvidence = (evidenceArray: any[]) => {
        return (
            <div className="space-y-4">
                {evidenceArray.map((evidence, index) => {
                    // Handle case where evidence might be a string that needs parsing
                    if (typeof evidence === 'string') {
                        try {
                            evidence = JSON.parse(evidence);
                        } catch (e) {
                            console.error('Failed to parse evidence string:', e);
                            return null;
                        }
                    }

                    const odataType = evidence['@odata.type'] || '';
                    const evidenceType = odataType.split('.').pop()?.replace('Evidence', '') || 'Unknown';
                    
                    return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                    {getEvidenceIcon(odataType)}
                                    <span className="font-semibold text-sm text-gray-900">
                                        {evidenceType} Evidence #{index + 1}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {evidence.verdict || 'Unknown verdict'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4 space-y-3">
                                {/* Render key evidence details based on type */}
                                {evidence['@odata.type']?.includes('userEvidence') && evidence.userAccount && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-sm text-blue-900 mb-2">User Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                            <div><span className="font-medium">Display Name:</span> {evidence.userAccount.displayName || 'N/A'}</div>
                                            <div><span className="font-medium">Account Name:</span> {evidence.userAccount.accountName || 'N/A'}</div>
                                            <div><span className="font-medium">UPN:</span> {evidence.userAccount.userPrincipalName || 'N/A'}</div>
                                            <div><span className="font-medium">Domain:</span> {evidence.userAccount.domainName || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}

                                {evidence['@odata.type']?.includes('fileEvidence') && evidence.fileDetails && (
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-sm text-green-900 mb-2">File Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                            <div><span className="font-medium">File Name:</span> {evidence.fileDetails.fileName || 'N/A'}</div>
                                            <div><span className="font-medium">File Path:</span> {evidence.fileDetails.filePath || 'N/A'}</div>
                                            <div><span className="font-medium">SHA1:</span> {evidence.fileDetails.sha1 || 'N/A'}</div>
                                            <div><span className="font-medium">SHA256:</span> {evidence.fileDetails.sha256 || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}

                                {(evidence['@odata.type']?.includes('messageEvidence') || evidence['@odata.type']?.includes('analyzedMessageEvidence')) && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-sm text-purple-900 mb-2">Message Information</h4>
                                        <div className="space-y-2 text-xs">
                                            <div><span className="font-medium">Subject:</span> {evidence.subject || 'N/A'}</div>
                                            <div><span className="font-medium">Sender:</span> {evidence.p1Sender?.emailAddress || 'N/A'}</div>
                                            <div><span className="font-medium">Recipient:</span> {evidence.recipientEmailAddress || 'N/A'}</div>
                                            <div><span className="font-medium">Received:</span> {evidence.receivedDateTime ? new Date(evidence.receivedDateTime).toLocaleString() : 'N/A'}</div>
                                            {evidence.attachmentsCount !== undefined && (
                                                <div><span className="font-medium">Attachments:</span> {evidence.attachmentsCount}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Device evidence */}
                                {evidence['@odata.type']?.includes('deviceEvidence') && (
                                    <div className="bg-orange-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-sm text-orange-900 mb-2">Device Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                            <div><span className="font-medium">Device Name:</span> {evidence.deviceDnsName || 'N/A'}</div>
                                            <div><span className="font-medium">MDE Device ID:</span> {evidence.mdeDeviceId || 'N/A'}</div>
                                            <div><span className="font-medium">OS Platform:</span> {evidence.osPlatform || 'N/A'}</div>
                                            <div><span className="font-medium">Health Status:</span> {evidence.healthStatus || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}

                                {/* IP evidence */}
                                {evidence['@odata.type']?.includes('ipEvidence') && (
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-sm text-yellow-900 mb-2">IP Address Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                            <div><span className="font-medium">IP Address:</span> {evidence.ipAddress || 'N/A'}</div>
                                            <div><span className="font-medium">Country Code:</span> {evidence.countryLetterCode || 'N/A'}</div>
                                            {evidence.location && (
                                                <>
                                                    <div><span className="font-medium">Country:</span> {evidence.location.countryName || 'N/A'}</div>
                                                    <div><span className="font-medium">City:</span> {evidence.location.city || 'N/A'}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Common fields */}
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-sm text-gray-900 mb-2">Common Properties</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        <div><span className="font-medium">Created:</span> {evidence.createdDateTime ? new Date(evidence.createdDateTime).toLocaleString() : 'N/A'}</div>
                                        <div><span className="font-medium">Verdict:</span> {evidence.verdict || 'N/A'}</div>
                                        <div><span className="font-medium">Remediation Status:</span> {evidence.remediationStatus || 'N/A'}</div>
                                        {evidence.tags && evidence.tags.length > 0 && (
                                            <div className="md:col-span-2">
                                                <span className="font-medium">Tags:</span> 
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {evidence.tags.map((tag: string, tagIndex: number) => (
                                                        <span key={tagIndex} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expandable raw JSON */}
                                <div className="border-t pt-3">
                                    <button
                                        onClick={() => toggleProperty(`${alert.ID}-evidence-${index}`)}
                                        className="text-xs text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                                    >
                                        <span>View Raw JSON</span>
                                        {expandedProperties[`${alert.ID}-evidence-${index}`] ? 
                                            <ChevronUp className="h-3 w-3" /> : 
                                            <ChevronDown className="h-3 w-3" />
                                        }
                                    </button>
                                    {expandedProperties[`${alert.ID}-evidence-${index}`] && (
                                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                                            {JSON.stringify(evidence, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Enhanced JSON parsing specifically for evidence arrays with comprehensive strategies
    const parseEvidenceValue = (value: any): { isParsed: boolean; parsedValue: any; isArray: boolean } => {
        if (typeof value !== "string") {
            return { isParsed: false, parsedValue: value, isArray: Array.isArray(value) };
        }

        const trimmed = value.trim();
        
        // Check if it looks like a JSON array or object
        if (!((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
              (trimmed.startsWith('[') && trimmed.endsWith(']')))) {
            return { isParsed: false, parsedValue: value, isArray: false };
        }

        try {
            let parsed = null;
            
            // Comprehensive parsing strategies for complex CSV evidence
            const strategies = [
                // Strategy 1: Direct parse
                () => JSON.parse(value),
                
                // Strategy 2: Handle doubled quotes (most common in CSV exports)
                () => JSON.parse(value.replace(/""/g, '"')),
                
                // Strategy 3: Handle escaped quotes and surrounding quotes
                () => {
                    let cleaned = value.trim();
                    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
                        (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
                        cleaned = cleaned.slice(1, -1);
                    }
                    cleaned = cleaned
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\')
                        .replace(/""/g, '"');
                    return JSON.parse(cleaned);
                },
                
                // Strategy 4: Handle Microsoft Graph format with complex escaping
                () => {
                    let graphCleaned = value
                        .replace(/""/g, '"')
                        .replace(/\\""/g, '"')
                        .replace(/""@/g, '"@')
                        .replace(/""#/g, '"#')
                        .replace(/"":/g, '":')
                        .replace(/:""([^"]*)""/g, ':"$1"')
                        .trim();

                    if (graphCleaned.startsWith('"') && graphCleaned.endsWith('"')) {
                        graphCleaned = graphCleaned.slice(1, -1);
                    }

                    return JSON.parse(graphCleaned);
                },
                
                // Strategy 5: Handle nested escaping (common in complex CSV scenarios)
                () => {
                    let nestedEscaped = value;
                    // Handle multiple levels of escaping
                    for (let i = 0; i < 3; i++) {
                        try {
                            if (nestedEscaped.startsWith('"') && nestedEscaped.endsWith('"')) {
                                nestedEscaped = JSON.parse(nestedEscaped);
                            }
                        } catch (e) {
                            break;
                        }
                    }
                    return typeof nestedEscaped === 'string' ? JSON.parse(nestedEscaped) : nestedEscaped;
                },
                
                // Strategy 6: Handle CSV cell format with aggressive cleaning
                () => {
                    let aggressiveCleaned = value
                        .replace(/^""|""$/g, '') // Remove leading/trailing doubled quotes
                        .replace(/""/g, '"')      // Replace doubled quotes with single quotes
                        .replace(/\\"/g, '"')     // Replace escaped quotes
                        .replace(/\\\\/g, '\\')   // Replace escaped backslashes
                        .replace(/\\n/g, '\n')    // Replace escaped newlines
                        .replace(/\\r/g, '\r')    // Replace escaped carriage returns
                        .replace(/\\t/g, '\t')    // Replace escaped tabs
                        .trim();
                    
                    return JSON.parse(aggressiveCleaned);
                }
            ];

            for (const strategy of strategies) {
                try {
                    parsed = strategy();
                    console.log(`Evidence parsing succeeded with strategy ${strategies.indexOf(strategy) + 1}`);
                    break;
                } catch (e) {
                    console.debug(`Evidence parsing strategy ${strategies.indexOf(strategy) + 1} failed:`, e);
                    continue;
                }
            }

            if (parsed !== null) {
                return { 
                    isParsed: true, 
                    parsedValue: parsed, 
                    isArray: Array.isArray(parsed) 
                };
            }
        } catch (e) {
            console.error('All evidence parsing strategies failed:', e);
        }

        return { isParsed: false, parsedValue: value, isArray: false };
    };

    const renderPropertyValue = (key: string, value: any) => {
        const { isParsed, parsedValue, isArray } = parseEvidenceValue(value);
        const propertyKey = `${alert.ID}-${key}`;
        const isPropertyExpanded = expandedProperties[propertyKey];

        // Special handling for Microsoft Graph evidence arrays
        if (isParsed && isArray && parsedValue.length > 0) {
            // Check if all items have @odata.type (Microsoft Graph evidence)
            const isMicrosoftGraphEvidence = parsedValue.every((item: { [x: string]: any; } | null) => 
                typeof item === 'object' && item !== null && item['@odata.type']
            );

            if (isMicrosoftGraphEvidence) {
                return (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => toggleProperty(propertyKey)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 focus:outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-sm text-gray-900">{key}</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {parsedValue.length} Security Evidence Items
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-600">
                                        {isPropertyExpanded ? "Collapse" : "Expand"}
                                    </span>
                                    {isPropertyExpanded ? (
                                        <ChevronUp className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out ${
                            isPropertyExpanded ? 'max-h-[50rem] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                            <div className="border-t border-gray-200 p-4 bg-white overflow-y-auto max-h-[50rem]">
                                {renderMicrosoftGraphEvidence(parsedValue)}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        // Handle other parsed JSON objects/arrays
        if (isParsed && (typeof parsedValue === "object" && parsedValue !== null)) {
            return (
                <div key={key} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <button
                        onClick={() => toggleProperty(propertyKey)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm text-gray-900">{key}</span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {Array.isArray(parsedValue) ? `${parsedValue.length} items` : "Parsed Object"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                    {isPropertyExpanded ? "Collapse" : "Expand"}
                                </span>
                                {isPropertyExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${
                        isPropertyExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="border-t border-gray-200 p-4 bg-white overflow-y-auto max-h-80">
                            <pre className="text-xs font-mono bg-gray-100 p-3 rounded overflow-auto">
                                {JSON.stringify(parsedValue, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            );
        }

        // For non-JSON or simple values
        return (
            <div key={key} className="py-3 px-4 hover:bg-slate-50 rounded-md transition-all duration-300 border-l-2 border-transparent hover:border-slate-200">
                <div className="flex items-start gap-4">
                    <div className="text-sm font-medium text-slate-900 min-w-0 w-1/4 flex-shrink-0">
                        {key}
                    </div>
                    <div className="text-sm text-slate-600 font-mono bg-slate-50 px-3 py-2 rounded border flex-1 min-w-0 break-all">
                        {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                    </div>
                </div>
            </div>
        );
    };

    // Calculate evidence count
    let evidenceCount = 0;
    if (hasEvidence) {
        if (isEvidenceArray) {
            // Count numeric keys only
            evidenceCount = Object.keys(alert.evidence).filter(key => /^\d+$/.test(key)).length;
        } else {
            evidenceCount = getSortedEvidenceEntries(alert.evidence).length;
        }
    }

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                Evidence 
                {hasEvidence && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        {evidenceCount}
                    </span>
                )}
            </h4>
            {hasEvidence ? (
                <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                    <button
                        onClick={handleToggle}
                        className="group w-full px-4 py-3 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                    >
                        <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                Evidence Properties
                            </h5>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                                    {isExpanded ? "Collapse" : "Expand"}
                                </span>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
                                )}
                            </div>
                        </div>
                    </button>
                    <div 
                        className={`transition-all duration-300 ease-in-out bg-white ${isExpanded ? 'max-h-[60rem] opacity-100' : 'max-h-0 opacity-0'}`}
                        style={{ maxHeight: isExpanded ? "60rem" : "0rem"}}
                    >
                        <div className="border-t border-gray-200 overflow-y-auto max-h-[60rem] space-y-4 p-4">
                            {isEvidenceArray ? (
                                // Handle evidence that is an array stored as object with numeric keys
                                (() => {
                                    const evidenceArray = convertNumericKeysToArray(alert.evidence);
                                    const nonNumericKeys = Object.keys(alert.evidence).filter(key => !/^\d+$/.test(key));
                                    
                                    return (
                                        <>
                                            {/* Render the main evidence array */}
                                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                                    <div className="flex items-center space-x-2">
                                                        <Shield className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium text-sm text-gray-900">Security Evidence</span>
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            {evidenceArray.length} Evidence Items
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    {(() => {
                                                        // Check if all items have @odata.type
                                                        const isAllMicrosoftGraph = evidenceArray.every(item => 
                                                            typeof item === 'object' && item !== null && item['@odata.type']
                                                        );
                                                        
                                                        if (isAllMicrosoftGraph) {
                                                            return renderMicrosoftGraphEvidence(evidenceArray);
                                                        } else {
                                                            // Fallback rendering for non-Microsoft Graph arrays
                                                            return (
                                                                <div className="space-y-3">
                                                                    {evidenceArray.map((item, index) => (
                                                                        <div key={index} className="border border-gray-200 rounded p-3">
                                                                            <div className="font-medium text-sm text-gray-700 mb-2">Item #{index + 1}</div>
                                                                            <pre className="text-xs font-mono bg-gray-100 p-2 rounded overflow-auto">
                                                                                {JSON.stringify(item, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                            
                                            {/* Render any non-numeric properties separately */}
                                            {nonNumericKeys.map(key => renderPropertyValue(key, alert.evidence[key]))}
                                        </>
                                    );
                                })()
                            ) : (
                                // Handle regular evidence object properties
                                getSortedEvidenceEntries(alert.evidence).map(([key, value]) => renderPropertyValue(key, value))
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                    <div className="py-6 text-center text-sm text-slate-500">
                        No evidence details available
                    </div>
                </div>
            )}
        </div>
    );
};