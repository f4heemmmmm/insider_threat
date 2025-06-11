// frontend/src/components/incidents/id/IncidentTimeline.tsx
import React, { useState } from "react";
import { ChevronRight, AlertCircle, CheckCircle, PlayCircle, PauseCircle, User, MessageSquare, Edit, Trash2, Save, X } from "lucide-react";
import { IncidentTimelineProps } from "../constants/interfaces";
import { handleMITRETacticClick, handleMITRETechniqueClick, isTacticClickable, isTechniqueClickable, truncateCommentContent } from "../constants/functions";

interface ExtendedIncidentTimelineProps extends IncidentTimelineProps {
    onAlertSelect?: (eventId: string) => void;
    onCommentEdit?: (commentId: string, newContent: string) => void;
    onCommentDelete?: (commentId: string) => void;
}

export const IncidentTimeline: React.FC<ExtendedIncidentTimelineProps> = ({ 
    events, 
    className = "", 
    onAlertSelect, 
    onCommentEdit,
    onCommentDelete 
}) => {
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAlertClick = (eventId: string): void => {
        if (onAlertSelect) {
            onAlertSelect(eventId);
        }
    };

    const handleEditStart = (commentId: string, currentContent: string) => {
        setEditingComment(commentId);
        setEditContent(currentContent);
    };

    const handleEditCancel = () => {
        setEditingComment(null);
        setEditContent("");
        setIsSubmitting(false);
    };

    const handleEditSave = async (commentId: string) => {
        if (!editContent.trim() || isSubmitting || !onCommentEdit) return;
        
        setIsSubmitting(true);
        try {
            await onCommentEdit(commentId, editContent.trim());
            setEditingComment(null);
            setEditContent("");
        } catch (error) {
            console.error("Failed to edit comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async (commentId: string) => {
        if (!onCommentDelete) return;
        
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await onCommentDelete(commentId);
            } catch (error) {
                console.error("Failed to delete comment:", error);
            }
        }
    };

    const getStatusChangeIcon = (action: string) => {
        switch (action) {
            case "created_open":
                return <PlayCircle className="h-4 w-4 text-blue-600" />;
            case "created_closed":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "closed":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "reopened":
                return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            default:
                return <PauseCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getEventBorderColor = (event: any) => {
        if (event.eventType === "status_change") {
            switch (event.statusChange?.action) {
                case "created_open":
                    return "border-blue-200 bg-blue-600";
                case "created_closed":
                    return "border-green-200 bg-green-600";
                case "closed":
                    return "border-green-200 bg-green-600";
                case "reopened":
                    return "border-yellow-200 bg-yellow-600";
                default:
                    return "border-gray-200 bg-gray-600";
            }
        } else if (event.eventType === "comment") {
            return "border-purple-200 bg-purple-600";
        }
        return "border-red-200 bg-red-600"; // Default for alerts
    };

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm p-8">
                No timeline events to display.
            </div>
        );
    }

    return (
        <div className={`${className} h-full`}>
            <div className="overflow-y-auto max-h-[calc(100vh-300px)] p-4">
                <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-12">
                        {events.map((event, index) => (
                            <div key={event.id} className="relative pl-10">
                                <div className="text-sm text-gray-900 mb-2 font-light">
                                    {event.date} {event.timestamp} 
                                </div>
                                <div className={`absolute left-2.5 top-1 transform w-3 h-3 rounded-full border-4 shadow-sm ${getEventBorderColor(event)}`} />
                                <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
                                    <div className="p-4 pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                {/* MITRE Information for Alerts */}
                                                {event.eventType === "alert" && event.MITRE_tactic && event.MITRE_technique && (
                                                    <div className="flex items-center flex-wrap gap-1">
                                                        {isTacticClickable(event.MITRE_tactic) ? (
                                                            <button
                                                                onClick={() => handleMITRETacticClick(event.MITRE_tactic!)}
                                                                className="text-gray-900 text-sm font-semibold hover:text-indigo-600 hover:underline transition-colors cursor-pointer inline-flex items-center"
                                                                aria-label={`Click for ${event.MITRE_tactic} MITRE details`}
                                                            >
                                                                {event.MITRE_tactic}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-900 text-sm font-semibold">
                                                                {event.MITRE_tactic}
                                                            </span>
                                                        )}
                                                        <span className="font-light text-xs text-gray-600"> via </span>
                                                        {isTechniqueClickable(event.MITRE_technique) ? (
                                                            <button
                                                                onClick={() => handleMITRETechniqueClick(event.MITRE_technique!)}
                                                                className="text-gray-900 text-sm font-semibold hover:text-indigo-600 hover:underline transition-colors cursor-pointer inline-flex items-center"
                                                                aria-label={`Click for ${event.MITRE_technique} MITRE details`}
                                                            >
                                                                {event.MITRE_technique}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-900 text-sm font-semibold">
                                                                {event.MITRE_technique}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Status Change Information */}
                                                {event.eventType === "status_change" && event.statusChange && (
                                                    <div className="flex items-center gap-2">
                                                        {getStatusChangeIcon(event.statusChange.action)}
                                                        <span className="text-gray-900 text-sm font-semibold">
                                                            {event.title}
                                                        </span>
                                                        {event.statusChange.userDisplayName && (
                                                            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-gray-100 rounded-md">
                                                                <User className="h-3 w-3 text-gray-500" />
                                                                <span className="text-xs text-gray-600 font-medium">
                                                                    {event.statusChange.userDisplayName}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Comment Information */}
                                                {event.eventType === "comment" && event.comment && (
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare className="h-4 w-4 text-purple-600" />
                                                        <span className="text-gray-900 text-sm font-semibold">
                                                            {event.title}
                                                        </span>
                                                        <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-purple-50 rounded-md">
                                                            <User className="h-3 w-3 text-purple-500" />
                                                            <span className="text-xs text-purple-700 font-medium">
                                                                {event.comment.userDisplayName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Action Button - Only for alerts */}
                                            {event.eventType === "alert" && (
                                                <button
                                                    onClick={() => handleAlertClick(event.id)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-all duration-200 cursor-pointer"
                                                    aria-label="View alert details"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* Comment Actions */}
                                            {event.eventType === "comment" && event.comment && (
                                                <div className="flex items-center gap-1">
                                                    {event.comment.canEdit && (
                                                        <button
                                                            onClick={() => handleEditStart(event.comment!.id, event.comment!.content)}
                                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-all duration-200"
                                                            aria-label="Edit comment"
                                                            disabled={editingComment === event.comment.id}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                    {event.comment.canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteClick(event.comment!.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                                                            aria-label="Delete comment"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-4 py-2">
                                        <div className="mb-3">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1"> Description </h4>
                                            
                                            {/* Regular description for non-comment events */}
                                            {event.eventType !== "comment" && (
                                                <p className="text-sm text-gray-700"> {event.description}. </p>
                                            )}

                                            {/* Comment content with editing capability */}
                                            {event.eventType === "comment" && event.comment && (
                                                <div className="space-y-2">
                                                    {editingComment === event.comment.id ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                rows={3}
                                                                maxLength={2000}
                                                                disabled={isSubmitting}
                                                            />
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-500">
                                                                    {editContent.length}/2000 characters
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={handleEditCancel}
                                                                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditSave(event.comment!.id)}
                                                                        disabled={!editContent.trim() || isSubmitting}
                                                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                                                                    >
                                                                        <Save className="h-3 w-3" />
                                                                        {isSubmitting ? "Saving..." : "Save"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                                {event.comment.content}
                                                            </p>
                                                            {event.comment.updatedAt && new Date(event.comment.updatedAt).getTime() > new Date(event.comment.createdAt).getTime() && (
                                                                <p className="text-xs text-gray-500 mt-2 italic">
                                                                    Edited {new Date(event.comment.updatedAt).toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Additional user context for status changes */}
                                            {event.eventType === "status_change" && event.statusChange?.userDisplayName && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded border-l-4 border-gray-300">
                                                    <p className="text-xs text-gray-600">
                                                        <strong>Action performed by:</strong> {event.statusChange.userDisplayName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Status changed from <strong>{event.statusChange.previousStatus ? 'Closed' : 'Open'}</strong> to <strong>{event.statusChange.newStatus ? 'Closed' : 'Open'}</strong>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};