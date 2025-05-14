// frontend/src/app/alerts/[id]/page.tsx

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getScoreSeverity } from "@/constants/functions";

import { Alert } from "@/types/alert.types";
import { AlertService } from "@/services/alert.service";

// Component Imports
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertLogs } from "@/components/ui/alert-modal-elements/AlertLogs";
import { AlertHeader } from "@/components/ui/alert-modal-elements/AlertHeader";
import { AlertEvidence } from "@/components/ui/alert-modal-elements/AlertEvidence";
import { AlertRawEvents } from "@/components/ui/alert-modal-elements/AlertRawEvents";
import { AlertMITREFramework } from "@/components/ui/alert-modal-elements/AlertMITREFramework";
import { AlertIncidentStatus } from "@/components/ui/alert-modal-elements/AlertIncidentStatus";

export default function AlertDetailPage() {
    const params = useParams();
    const alertId = params.id as string;
    
    const [alert, setAlert] = useState<Alert | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        const fetchAlertDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await AlertService.getAlerts(1000, 0, "datestr", "desc");
                const foundAlert = response.alerts.find(alert => alert.ID === alertId);
                
                if (!foundAlert) {
                    setError('Alert not found');
                    setLoading(false);
                    return;
                }
                
                setAlert(foundAlert);
                
            } catch (err) {
                console.error('Error fetching alert details:', err);
                setError('Failed to load alert details');
            } finally {
                setLoading(false);
            }
        };
        
        if (alertId) {
            fetchAlertDetails();
        }
    }, [alertId]);
    
    const toggleEvidenceSection = (alertID: string, sectionName: string) => {
        const key = `${alertID}-${sectionName}`;
        setExpandedEvidenceSection(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex justify-center items-center h-64 w-full">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm font-medium">Loading alert details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Error Loading Alert</h3>
                    <p className="text-gray-600 text-center text-sm mb-6">{error}</p>
                    <Link 
                        href="/alerts" 
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition duration-200"
                    >
                        ← Back to alerts
                    </Link>
                </div>
            </div>
        );
    }
    
    if (!alert) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Alert Not Found</h3>
                    <p className="text-gray-600 text-sm mb-6">The alert you're looking for doesn't exist or has been removed.</p>
                    <Link 
                        href="/alerts" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    >
                        ← Back to alerts
                    </Link>
                </div>
            </div>
        );
    }
    
    const severity = getScoreSeverity(alert.score);
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Enhanced Navigation Header */}
            <div className="sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <StatusBadge status={severity} />
                                <div className="hidden sm:flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-700">Alert ID:</span>
                                    <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                        {alert.ID}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link 
                            href="/alerts" 
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back to alerts</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Mobile Alert ID - shown only on small screens */}
                <div className="sm:hidden mb-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Alert ID:</span>
                        <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {alert.ID}
                        </span>
                    </div>
                </div>

                {/* Two-Column Layout for Header and MITRE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <AlertHeader alert={alert} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <AlertMITREFramework alert={alert} />
                        </div>
                    </div>
                </div>
                
                {/* Incident Status and Logs Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <AlertIncidentStatus alert={alert} />
                        </div>
                    </div>
                    {alert.Logs && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <AlertLogs logs={alert.Logs} />
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Evidence Section - Full Width */}
                <div className="mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <AlertEvidence 
                                alert={alert} 
                                expandedEvidenceSection={expandedEvidenceSection} 
                                toggleEvidenceSection={toggleEvidenceSection} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* Raw Events Section - Full Width */}
                {alert.evidence && alert.evidence.list_raw_events.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <AlertRawEvents 
                                    evidence={alert.evidence} 
                                    alertID={alert.ID} 
                                    expandedEvidenceSection={expandedEvidenceSection} 
                                    toggleEvidenceSection={toggleEvidenceSection} 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}