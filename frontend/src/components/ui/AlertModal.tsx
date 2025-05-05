// src/components/ui/AlertModal.tsx
import React, { useEffect, useRef } from 'react';
import { Alert } from '../../types/alert.types';
import { X } from 'lucide-react';
import { AlertHeader } from './alert-modal-elements/AlertHeader';
import { AlertEvidence } from './alert-modal-elements/AlertEvidence';
import { AlertIncidentStatus } from './alert-modal-elements/AlertIncidentStatus';
import { AlertMITREFramework } from './alert-modal-elements/AlertMITREFramework';
import { AlertLogs } from './alert-modal-elements/AlertLogs';
import { AlertRawEvents } from './alert-modal-elements/AlertRawEvents';
interface AlertModalProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
  expandedEvidenceSection: Record<string, boolean>;
  toggleEvidenceSection: (alertId: string, sectionName: string) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ 
  alert, 
  open, 
  onClose,
  expandedEvidenceSection,
  toggleEvidenceSection
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle pressing ESC key to close the modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [open, onClose]);
  
  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);
  
  // If no alert or modal is closed, don't render
  if (!alert || !open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30 backdrop-blur-md overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Alert Details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Alert Header */}
        <AlertHeader alert={alert} />
        
        {/* Expanded Details */}
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Evidence Details */}
            <div className="md:col-span-2">
              <AlertEvidence 
                alert={alert} 
                expandedEvidenceSection={expandedEvidenceSection} 
                toggleEvidenceSection={toggleEvidenceSection} 
              />
            </div>

            {/* Incident Status */}
            <AlertIncidentStatus alert={alert} />
            
            {/* MITRE Details */}
            <AlertMITREFramework alert={alert} />
          </div>
          
          {/* Logs Section */}
          {alert.Logs && <AlertLogs logs={alert.Logs} />}
          
          {/* Raw Events Section */}
          {alert.evidence && (
            <AlertRawEvents 
              evidence={alert.evidence} 
              alertId={alert.ID} 
              expandedEvidenceSection={expandedEvidenceSection} 
              toggleEvidenceSection={toggleEvidenceSection} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;