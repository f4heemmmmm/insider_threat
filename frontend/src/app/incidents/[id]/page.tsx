// frontend/src/app/incidents/[id]/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";
import React, { useState, useEffect } from "react";
import { IncidentService } from "@/services/incident.service";
import { calculateIncidentDuration, extractMITRETactics, getScoreSeverity } from "@/constants/functions";
import { TimelineEvent, IncidentStatusChange, IncidentComment } from "@/components/incidents/constants/interfaces";
import { mapAlertsToTimelineEvents, mergeTimelineEvents, createStatusChangeEvent, createCommentEvent } from "@/components/incidents/constants/functions";
import { IncidentTimeline } from "@/components/incidents/id/IncidentTimeline";
import { RelatedAlertsModal } from "@/components/incidents/id/RelatedAlertsModal";
import { IncidentSummaryCard } from "@/components/incidents/id/IncidentSummaryCard";
import { AddCommentForm } from "@/components/incidents/id/AddCommentForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertHeader } from "@/components/alerts/id/AlertHeader";
import { AlertMITREFramework } from "@/components/alerts/id/AlertMITREFramework";
import { AlertIncidentStatus } from "@/components/alerts/id/AlertIncidentStatus";
import { AlertEvidence } from "@/components/alerts/id/AlertEvidence";
import { AlertLogs } from "@/components/alerts/id/AlertLogs";
import { AlertRawEvents } from "@/components/alerts/id/AlertRawEvents";

export default function IncidentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const incidentID = params.id as string;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [MITRETactics, setMITRETactics] = useState<string[]>([]);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [statusChangeHistory, setStatusChangeHistory] = useState<IncidentStatusChange[]>([]);
    const [comments, setComments] = useState<IncidentComment[]>([]);
    const [isRelatedAlertsModalOpen, setIsRelatedAlertsModalOpen] = useState(false);
    const [isUpdatingIncident, setIsUpdatingIncident] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isSplitViewOpen, setIsSplitViewOpen] = useState(false);
    const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});

    const [incidentDuration, setIncidentDuration] = useState<{
        start_time: Date | null;
        end_time: Date | null;
        duration: string;
    }>({
        start_time: null,
        end_time: null,
        duration: ""
    });

    // Handle back navigation
    const handleBackClick = () => {
        router.back();
    };

    // Update timeline events when alerts, status changes, or comments change
    useEffect(() => {
        if (relatedAlerts.length > 0 || statusChangeHistory.length > 0 || comments.length > 0) {
            const alertEvents = mapAlertsToTimelineEvents(relatedAlerts);
            const statusEvents = statusChangeHistory.map(createStatusChangeEvent);
            const commentEvents = comments.map(createCommentEvent);
            const mergedEvents = mergeTimelineEvents(alertEvents, statusEvents, commentEvents);
            setTimelineEvents(mergedEvents);
        }
    }, [relatedAlerts, statusChangeHistory, comments]);

    // Fetch status history from backend with user information
    const fetchStatusHistory = async (incidentId: string) => {
        try {
            const statusHistory = await IncidentService.getIncidentStatusHistory(incidentId);
            setStatusChangeHistory(statusHistory);
        } catch (err) {
            console.error("Error fetching status history:", err);
            setStatusChangeHistory([]);
        }
    };

    // Fetch comments from backend
    const fetchComments = async (incidentId: string) => {
        try {
            const commentsData = await IncidentService.getIncidentComments(incidentId);
            setComments(commentsData);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setComments([]);
        }
    };

    // Fetch incident details
    useEffect(() => {
        const fetchIncidentDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const foundIncident = await IncidentService.getIncidentByID(incidentID);

                if (!foundIncident) {
                    setError("Incident not found!");
                    setLoading(false);
                    return;
                }
                
                setIncident(foundIncident);

                const alerts = await IncidentService.getRelatedAlerts(foundIncident.ID);
                const sortedAlerts = [...alerts].sort((a, b) =>
                    new Date(a.datestr).getTime() - new Date(b.datestr).getTime()
                );

                setRelatedAlerts(sortedAlerts);

                const tactics = extractMITRETactics(sortedAlerts);
                setMITRETactics(tactics);
                const duration = calculateIncidentDuration(sortedAlerts);
                setIncidentDuration({
                    start_time: duration.earliestAlert || duration.latestAlert as Date | null,
                    end_time: duration.latestAlert || duration.latestAlert as Date | null,
                    duration: duration.duration
                });

                // Fetch status change history and comments
                await Promise.all([
                    fetchStatusHistory(foundIncident.ID),
                    fetchComments(foundIncident.ID)
                ]);
                
            } catch (err) {
                console.error("Error fetching incident details: ", err);
                setError("Failed to load incident details.");
            } finally {
                setLoading(false);
            }
        };

        if (incidentID) {
            fetchIncidentDetails();
        }
    }, [incidentID]);

    const handleToggleIncidentStatus = async () => {
        if (!incident) return;
        
        const newStatus = !incident.isClosed;
        
        try {
            setIsUpdatingIncident(true);
            
            // Update incident status on backend (user tracking handled automatically)
            const updatedIncident = await IncidentService.updateIncident(incident.ID, {
                isClosed: newStatus
            });
            
            // Update local incident state
            setIncident(updatedIncident);
            
            // Refetch status history from backend to get the new status change record with user info
            await fetchStatusHistory(incident.ID);
            
        } catch (err) {
            console.error("Error updating incident status:", err);
            setError("Failed to update incident status.");
        } finally {
            setIsUpdatingIncident(false);
        }
    };

    const handleShowRelatedAlertsModal = () => {
        setIsRelatedAlertsModalOpen(true);
    };

    const handleCloseRelatedAlertsModal = () => {
        setIsRelatedAlertsModalOpen(false);
    };

    const handleAlertSelect = (alertId: string) => {
        const alert = relatedAlerts.find(a => a.ID === alertId);
        if (alert) {
            setSelectedAlert(alert);
            setIsSplitViewOpen(true);
        }
    };

    const handleCloseSplitView = () => {
        setIsSplitViewOpen(false);
        setSelectedAlert(null);
    };

    const toggleEvidenceSection = (alertID: string, sectionName: string) => {
        const key = `${alertID}-${sectionName}`;
        setExpandedEvidenceSection(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Comment handling functions
    const handleAddComment = async (content: string) => {
        if (!incident) return;
        
        setIsSubmittingComment(true);
        try {
            const newComment = await IncidentService.createComment(incident.ID, content);
            setComments(prev => [...prev, newComment]);
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Failed to add comment.");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleEditComment = async (commentId: string, newContent: string) => {
        try {
            const updatedComment = await IncidentService.updateComment(commentId, newContent);
            setComments(prev => prev.map(comment => 
                comment.id === commentId ? updatedComment : comment
            ));
        } catch (err) {
            console.error("Error editing comment:", err);
            setError("Failed to edit comment.");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await IncidentService.deleteComment(commentId);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError("Failed to delete comment.");
        }
    };

    if (loading) {
        return (
            <div className = "flex justify-center items-center h-64 w-full">
                <div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className = "bg-red-50 p-4 my-4">
                <div className = "flex">
                    <div className = "flex-shrink-0">
                        <svg className = "h-5 w-5 text-red-400" viewBox = "0 0 20 20" fill = "currentColor">
                            <path fillRule = "evenodd" d = "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule = "evenodd" />
                        </svg>
                    </div>
                    <div className = "ml-3">
                        <p className = "text-sm text-red-700"> {error} </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!incident) {
        return (
            <div className = "text-center py-16 text-gray-500 bg-gray-50 rounded-md max-w-8xl">
                <h3 className = "mt-2 text-lg font-medium text-gray-900"> Incident not found </h3>
                <p className = "mt-1 text-sm text-gray-500"> The incident you're looking for does not exist or has been removed. </p>
                <div className = "mt-6" />
            </div>
        );
    }

    return (
        <div className = "p-8">
            <div className = "flex items-center gap-4 mb-6">
                <button
                    onClick={handleBackClick}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex justify-between items-center flex-1">
                    <h1 className = "text-2xl font-semibold text-gray-900"> Incident Details </h1>
                    <button
                        onClick={handleToggleIncidentStatus}
                        disabled={isUpdatingIncident}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            incident?.isClosed
                                ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 hover:border-green-300"
                                : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 hover:border-red-300"
                        } ${
                            isUpdatingIncident 
                                ? "opacity-50 cursor-not-allowed" 
                                : "hover:shadow-sm cursor-pointer"
                        }`}
                    >
                        {isUpdatingIncident 
                            ? "Updating..." 
                            : incident?.isClosed 
                                ? "Reopen Incident" 
                                : "Close Incident"
                        }
                    </button>
                </div>
            </div>
            <IncidentSummaryCard
                incident = {incident}
                incidentDuration = {incidentDuration}
                MITRETactics = {MITRETactics}
                totalAlerts = {relatedAlerts.length}
                onShowAlerts = {handleShowRelatedAlertsModal}
                getScoreSeverity = {getScoreSeverity}
            />
            <div className = "w-full h-[calc(100vh-200px)] bg-white shadow rounded-lg overflow-hidden">
                <div className = "px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className = "text-lg font-semibold text-gray-900"> Incident Timeline </h2>
                    {isSplitViewOpen && (
                        <button
                            onClick={handleCloseSplitView}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            Close Details
                        </button>
                    )}
                </div>
                <div className = "flex h-[calc(100%-60px)]">
                    {/* Timeline Section */}
                    <div className = {`transition-all duration-300 ease-in-out ${isSplitViewOpen ? 'w-1/2' : 'w-full'}`}>
                        <div className="h-full flex flex-col">
                            {/* Add Comment Form */}
                            <div className="border-b border-gray-200 p-4 bg-gray-50">
                                <AddCommentForm
                                    onSubmit={handleAddComment}
                                    isSubmitting={isSubmittingComment}
                                    placeholder="Add a comment to this incident..."
                                />
                            </div>
                            
                            {/* Timeline */}
                            <div className="flex-1 overflow-hidden p-6">
                                <IncidentTimeline
                                    events = {timelineEvents}
                                    className = "h-full"
                                    onAlertSelect = {handleAlertSelect}
                                    onCommentEdit = {handleEditComment}
                                    onCommentDelete = {handleDeleteComment}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Alert Details Split Section */}
                    <div className = {`transition-all duration-300 ease-in-out overflow-hidden ${
                        isSplitViewOpen ? 'w-1/2 border-l border-gray-200' : 'w-0'
                    }`}>
                        {isSplitViewOpen && selectedAlert && (
                            <div className = "h-full overflow-y-auto bg-gray-50">
                                <div className = "p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
                                    <div className = "flex items-center justify-between">
                                        <div className = "flex items-center space-x-3">
                                            <StatusBadge status={getScoreSeverity(selectedAlert.score)} />
                                            <span className = "text-lg font-medium text-gray-700">Alert ID: </span>
                                            <span className = "text-lg font-light text-blue-600"> {selectedAlert.ID} </span>
                                        </div>
                                        <button
                                            onClick={handleCloseSplitView}
                                            className = "text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            <svg className = "w-5 h-5" fill = "none" stroke = "currentColor" viewBox = "0 0 24 24">
                                                <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className = "p-4 space-y-4">
                                    {/* Alert Header */}
                                    <div className = "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className = "p-4">
                                            <AlertHeader alert={selectedAlert} />
                                        </div>
                                    </div>
                                    
                                   
                                    
                                    {/* Alert Logs */}
                                    {selectedAlert.Logs && (
                                        <div className = "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                            <div className = "p-4">
                                                <AlertLogs logs={selectedAlert.Logs} />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Alert Evidence */}
                                    <div className = "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className = "p-4">
                                            <AlertEvidence 
                                                alert={selectedAlert} 
                                                expandedEvidenceSection={expandedEvidenceSection} 
                                                toggleEvidenceSection={toggleEvidenceSection} 
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Raw Events */}
                                    {selectedAlert.evidence && selectedAlert.evidence.list_raw_events.length > 0 && (
                                        <div className = "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                            <div className = "p-4">
                                                <AlertRawEvents 
                                                    evidence={selectedAlert.evidence} 
                                                    alertID={selectedAlert.ID} 
                                                    expandedEvidenceSection={expandedEvidenceSection} 
                                                    toggleEvidenceSection={toggleEvidenceSection} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <RelatedAlertsModal
                isOpen = {isRelatedAlertsModalOpen}
                onClose = {handleCloseRelatedAlertsModal}
                alerts = {relatedAlerts}
                incidentID = {incidentID}
            />
        </div>
    );
};