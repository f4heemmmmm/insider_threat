// frontend/src/components/ui/alert-modal-elements/AlertHeader.tsx

import React from 'react';
import { Alert } from '@/types/alert.types';
import { StatusBadge } from '../StatusBadge';
import { AlertProps } from '@/constants/interface';
import { Calendar, User, Clock } from 'lucide-react';

// Function Imports
import { getScoreSeverity, getSeverityColor } from '@/constants/functions';

export const AlertHeader: React.FC<AlertProps> = ({ alert }) => {
    const severity = getScoreSeverity(alert.score);
    const severityColor = getSeverityColor(severity);

    return (
        <div className = "p-8">
            <div className = "flex justify-between items-start">
                <h3 className = "text-xl font-semibold text-gray-900 mb-3"> {alert.alert_name} </h3>
                <div className = {`flex items-center ${severityColor}`}>
                    <span className = "font-semibold text-2xl"> {alert.score} </span> <span className = "text-sm">/10</span>
                    <div className = "ml-2">
                        <StatusBadge status = {severity} />
                    </div>
                </div>
            </div>

            <div className = "flex flex-col gap-4 mt-4">
                <div className = "flex flex-col gap-5">
                    <div className = "flex items-center text-sm font-light text-gray-600">
                        <User className = "h-4 w-4 mr-2 text-gray-500" />
                        {alert.user}
                    </div>
                    <div className = "flex items-center text-sm font-light text-gray-600">
                        <Calendar className = "h-4 w-4 mr-2 text-gray-500" />
                        {new Date(alert.datestr).toLocaleDateString()}
                    </div>
                    <div className = "flex items-center text-sm font-light text-gray-600">
                        <Clock className = "h-4 w-4 mr-2 text-gray-500" />
                        {new Date(alert.datestr).toLocaleTimeString()}
                    </div>
                </div>

                <div className = "flex flex-col gap-4">
                    {(alert.MITRE_tactic || alert.MITRE_technique || alert.Detection_model || alert.Description) && (
                        <div className = "p-3">
                            <div className = "flex flex-col gap-4">
                                {alert.MITRE_tactic && (
                                    <div className = "flex items-start text-sm">
                                        <span className = "font-medium text-black mr-1 w-32"> MITRE Tactic: </span>
                                        <span className = "text-gray-700 font-light bg-gray-50 px-3 py-1 rounded-md inline-block"> {alert.MITRE_tactic} </span>
                                    </div>
                                )}
                                {alert.MITRE_technique && (
                                    <div className = "flex items-start text-sm">
                                        <span className = "font-medium text-black mr-1 w-32"> MITRE Technique: </span>
                                        <span className = "text-gray-700 font-light bg-gray-50 px-3 py-1 rounded-md inline-block"> {alert.MITRE_technique} </span>
                                    </div>
                                )}
                                {alert.Detection_model && (
                                    <div className = "flex items-start text-sm">
                                        <span className = "font-medium text-black mr-1 w-32"> Detection Model: </span>
                                        <span className = "text-gray-700 font-light bg-gray-50 px-3 py-1 rounded-md inline-block"> {alert.Detection_model} </span>
                                    </div>
                                )}
                                {alert.Description && (
                                    <div>
                                        <p className = "text-sm text-black font-medium mb-2"> Description: </p>
                                        <p className = "font-light text-gray-700 text-sm inline-block py-1.5 rounded-md"> {alert.Description}. </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};