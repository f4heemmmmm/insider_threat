// frontend/src/app/alerts/[id]/page.tsx

"use client";

import { ArrowLeft } from "lucide-react";
import { Alert } from "@/types/alert.types";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertService } from "@/services/alert.service";
import { getScoreSeverity } from "@/constants/functions";

// Component Imports
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertLogs } from "@/components/alerts/id/AlertLogs";
import { AlertHeader } from "@/components/alerts/id/AlertHeader";
import { AlertEvidence } from "@/components/alerts/id/AlertEvidence";
import { AlertRawEvents } from "@/components/alerts/id/AlertRawEvents";
import { AlertMITREFramework } from "@/components/alerts/id/AlertMITREFramework";
import { AlertIncidentStatus } from "@/components/alerts/id/AlertIncidentStatus";

export default function AlertDetailPage() {
    const params = useParams();
    const router = useRouter();
    const alertID = params.id as string;
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        const fetchAlertDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await AlertService.getAlerts(1000, 0, "datestr", "desc");
                const foundAlert = response.alerts.find(alert => alert.ID === alertID);
                
                if (!foundAlert) {
                    setError("Alert not found");
                    setLoading(false);
                    return;
                }
                
                setAlert(foundAlert);
            } catch (err) {
                console.error("Error fetching alert details:", err);
                setError("Failed to load alert details");
            } finally {
                setLoading(false);
            }
        };
        
        if (alertID) {
            fetchAlertDetails();
        }
    }, [alertID]);
    
    const toggleEvidenceSection = (alertID: string, sectionName: string) => {
        const key = `${alertID}-${sectionName}`;
        setExpandedEvidenceSection(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleBackClick = () => {
        router.back();
    };
    
    if (loading) {
        return (
            <div className = "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className = "flex justify-center items-center h-64 w-full">
                    <div className = "relative">
                        <div className = "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                        <div className = "mt-6 text-center">
                            <p className = "text-gray-600 text-sm font-medium"> Loading alert details... </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className = "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className = "bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                    <div className = "flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className = "h-6 w-6 text-red-600" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
                            <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className = "text-lg font-semibold text-gray-900 text-center mb-2"> Error Loading Alert </h3>
                    <p className = "text-gray-600 text-center text-sm mb-6"> {error} </p>
                    <button
                        onClick = {handleBackClick}
                        className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className = "h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }
    
    if (!alert) {
        return (
            <div className = "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className = "bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className = "w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className = "w-8 h-8 text-gray-400" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
                            <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className = "text-xl font-semibold text-gray-900 mb-2"> Alert Not Found </h3>
                    <p className = "text-gray-600 text-sm mb-6"> The alert you"re looking for doesn"t exist or has been removed. </p>
                    <button
                        onClick = {handleBackClick}
                        className = "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className = "h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }
    
    const severity = getScoreSeverity(alert.score);
    
    return (
        <div className = "min-h-screen bg-gray-100">
            <div className = "z-10">
                <div className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className = "flex justify-between items-center h-16">
                        <div className = "flex items-center space-x-4">
                            <button
                                onClick = {handleBackClick}
                                className = "flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                                aria-label = "Go back"
                            >
                                    <ArrowLeft className = "h-5 w-5" />
                            </button>
                            <div className = "flex items-center space-x-3">
                                <StatusBadge status = {severity} />
                                <div className = "hidden sm:flex items-center space-x-2">
                                    <span className = "text-xl font-medium text-gray-700"> Alert ID: </span>
                                    <span className = "text-xl font-mono font-light text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                        {alert.ID}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className = "max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                <div className = "sm:hidden mb-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className = "flex items-center space-x-2">
                        <span className = "text-sm font-medium text-gray-700"> Alert ID: </span>
                        <span className = "text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {alert.ID}
                        </span>
                    </div>
                </div>
                <div className = "mb-6">
                    <div className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className = "p-6">
                            <AlertHeader alert = {alert} />
                        </div>
                    </div>
                </div>
                <div className = "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className = "p-6">
                            <AlertMITREFramework alert = {alert} />
                        </div>
                    </div>
                    <div className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className = "p-6">
                            <AlertIncidentStatus alert = {alert} />
                        </div>
                    </div>
                </div>
                {alert.Logs && (
                    <div className = "mb-6">
                        <div className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className = "p-6">
                                <AlertLogs logs = {alert.Logs} />
                            </div>
                        </div>
                    </div>
                )}
                <div className = "mb-6">
                    <div className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className = "p-6">
                            <AlertEvidence 
                                alert = {alert} 
                                expandedEvidenceSection = {expandedEvidenceSection} 
                                toggleEvidenceSection = {toggleEvidenceSection} 
                            />
                        </div>
                    </div>
                </div>
                {alert.evidence && alert.evidence.list_raw_events.length > 0 && (
                    <div className = "mb-6">
                        <div className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className = "p-6">
                                <AlertRawEvents 
                                    evidence = {alert.evidence} 
                                    alertID = {alert.ID} 
                                    expandedEvidenceSection = {expandedEvidenceSection} 
                                    toggleEvidenceSection = {toggleEvidenceSection} 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};