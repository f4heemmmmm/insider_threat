// frontend/src/components/ui/AlertModal.tsx

import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { AlertModalProps } from "@/constants/interface";
import { getSeverityColor, getScoreSeverity } from "@/constants/functions";

// Component Imports
import { StatusBadge } from "./StatusBadge";
import { AlertLogs } from "./alert-modal-elements/AlertLogs";
import { AlertHeader } from "./alert-modal-elements/AlertHeader";
import { AlertEvidence } from "./alert-modal-elements/AlertEvidence";
import { AlertRawEvents } from "./alert-modal-elements/AlertRawEvents";
import { AlertMITREFramework } from "./alert-modal-elements/AlertMITREFramework";
import { AlertIncidentStatus } from "./alert-modal-elements/AlertIncidentStatus";

const AlertModal: React.FC<AlertModalProps> = ({ alert, open, onClose, expandedEvidenceSection, toggleEvidenceSection }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const severity = alert ? getScoreSeverity(alert.score) : "unknown";

   // Handle pressing keyboard ESC key to close the alert modal (Keyboard Event)
   useEffect(() => {
        const handleESCKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleESCKey);
        return () => window.removeEventListener("keydown", handleESCKey);
    }, [open, onClose]);

    // Handle clicking outside of the modal to close the modal (Mouse Event)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    // Prevent scrolling when the modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    if (!alert || !open) {
        return null;
    }

    return (
        <div className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-90 backdrop-blur-lg overflow-y-auto">
            <div ref = {modalRef} className = "bg-white rounded-lg shadow-2xl w-full max-h-[90vh] max-w-6xl overflow-y-auto">
                <div className = "sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <div className = "flex flex-row items-center gap-4 px-4">
                        <div className = "flex items-center">
                            <StatusBadge status = {severity} />
                        </div>
                        <div className = "flex flex-row items-center gap-1">
                            <h3 className = "text-base font-semibold text-gray-900"> Alert ID: </h3>
                            <h3 className="text-base font-light text-gray-600"> {alert.ID} </h3>
                        </div>
                    </div>
                    <button
                        onClick = {onClose}
                        className = "p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label = "Close alert"
                    >
                        <X className = "h-6 w-6" />
                    </button>
                </div>
                
                <div className = "grid grid-cols-1 md:grid-cols-2">
                    <div className = "flex flex-col h-full">
                        <div className = "p-6 flex-grow">
                            <AlertHeader alert = {alert} />
                        </div>
                    </div>
                    <div className = "flex flex-col h-full">
                        <div className = "p-6 flex-grow">
                            <AlertMITREFramework alert = {alert} />
                        </div>
                    </div>
                </div>
                <div className = "border-t border-gray-200">
                    <div className = "p-6 space-y-6 flex flex-col gap-4">
                        <div className = "flex flex-row gap-5">
                            <div className = "w-1/2">
                                <AlertIncidentStatus alert = {alert} />
                            </div>
                            {alert.Logs && (
                                <div className = "w-1/2">
                                    <AlertLogs logs = {alert.Logs} />
                                </div>
                            )}
                        </div>
                        <div className="w-full">
                            <AlertEvidence 
                                alert = {alert} 
                                expandedEvidenceSection = {expandedEvidenceSection} 
                                toggleEvidenceSection = {toggleEvidenceSection} 
                            />
                        </div>
                        {alert.evidence && alert.evidence.list_raw_events.length > 0 && (
                            <div className = "w-full">
                                <AlertRawEvents 
                                    evidence = {alert.evidence} 
                                    alertID = {alert.ID} 
                                    expandedEvidenceSection = {expandedEvidenceSection} 
                                    toggleEvidenceSection = {toggleEvidenceSection} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;