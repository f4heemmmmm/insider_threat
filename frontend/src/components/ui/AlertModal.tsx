// src/components/ui/AlertModal.tsx
import React, { useEffect, useRef } from 'react';
import { Alert } from '../../types/alert.types';
import { 
  X,
  Calendar, 
  User, 
  ShieldAlert, 
  AlertCircle,
  Info,
  ExternalLink,
  FileText,
  Clock,
  List,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import RawEventsDisplay from './RawEventsDisplay';

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
  
  // Format functions
  const getScoreSeverity = (score: number) => {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };
  
  const formatEvidenceValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      // Check if it's an empty object or array
      if (
        (Array.isArray(value) && value.length === 0) || 
        (Object.keys(value).length === 0 && !Array.isArray(value))
      ) {
        return 'N/A';
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };
  
  // Check if evidence has raw events that are not empty
  const hasRawEvents = (evidence: any): boolean => {
    return evidence && 
           Object.prototype.hasOwnProperty.call(evidence, 'list_raw_events') && 
           evidence.list_raw_events &&
           // Check if it's not an empty array or object
           (
             (Array.isArray(evidence.list_raw_events) && evidence.list_raw_events.length > 0) ||
             (typeof evidence.list_raw_events === 'object' && 
              !Array.isArray(evidence.list_raw_events) && 
              Object.keys(evidence.list_raw_events).length > 0)
           );
  };
  
  // Get sorted evidence entries
  const getSortedEvidenceEntries = (evidence: any) => {
    if (!evidence) return [];
    
    return Object.entries(evidence)
      .filter(([key]) => key !== 'list_raw_events') // Filter out raw events as they'll be displayed separately
      .filter(([key, value]) => {
        // Filter out null, undefined, empty strings, or empty objects/arrays
        if (value === null || value === undefined) return false;
        if (value === '') return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
      .sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically by key
  };
  
  // If no alert or modal is closed, don't render
  if (!alert || !open) return null;
  
  const severity = getScoreSeverity(alert.score);
  const severityColor = getSeverityColor(severity);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30  backdrop-blur-md overflow-y-auto">
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
        <div className={`p-8`}>
          <div className="flex justify-between items-start">
            {/* Alert Name */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {alert.alert_name}
            </h3>
            
            {/* Score and Status Badge */}
            <div className={`flex items-center ${severityColor}`}>
              <span className="font-semibold text-2xl">{alert.score}</span>
              <div className="ml-2">
                <StatusBadge status={severity} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-5">
              {/* User info */}
              <div className="flex items-center text-sm font-light text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                {alert.user}
              </div>
              
              {/* Date */}
              <div className="flex items-center text-sm font-light text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {new Date(alert.datestr).toLocaleDateString()}
              </div>
              
              {/* Time */}
              <div className="flex items-center text-sm font-light text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                {new Date(alert.datestr).toLocaleTimeString()}
              </div>
            </div>
            
            {/* MITRE Information and Detection Model in a flex column layout */}
            <div className="flex flex-col gap-4">
              {(alert.MITRE_tactic || alert.MITRE_technique || alert.Detection_model) && (
                <div className="p-3">
                  <div className="flex flex-col gap-4">
                    {alert.MITRE_tactic && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-black mr-1">MITRE Tactic:</span>
                        <span className="text-gray-700 font-light bg-gray-50 px-3 py-1 rounded-md inline-block">{alert.MITRE_tactic}</span>
                      </div>
                    )}
                    
                    {alert.MITRE_technique && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-black mr-1">MITRE Technique:</span>
                        <span className="text-gray-700 font-light bg-gray-50 px-3 py-1 rounded-md inline-block">{alert.MITRE_technique}</span>
                      </div>
                    )}
                    
                    {alert.Detection_model && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-black mr-1">Detection Model:</span>
                        <span className="text-gray-700 font-light bg-gray-50 px-3 py-1 rounded-md inline-block">{alert.Detection_model}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Description aligned with MITRE info */}
              {alert.Description && (
                <div className="px-3">
                  <div className="text-sm text-black font-semibold mb-2">Description:</div>
                  <p className="font-light text-gray-700 text-sm inline-block py-1.5 rounded-md">
                    {alert.Description}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Expanded Details */}
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Evidence Details */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                Evidence Details
              </h4>
              {alert.evidence && Object.keys(alert.evidence).length > 0 ? (
                <div>
                  {/* Regular Evidence Table */}
                  <div className="border rounded-md overflow-hidden bg-white shadow-sm mb-4">
                    <div className="px-4 py-3 bg-gray-50 border-gray-200 flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-700">Evidence Properties</h5>
                      <button
                        onClick={() => toggleEvidenceSection(alert.ID, 'properties')}
                        className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        {expandedEvidenceSection[`${alert.ID}-properties`] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    {expandedEvidenceSection[`${alert.ID}-properties`] === true && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {getSortedEvidenceEntries(alert.evidence).map(([key, value]) => (
                            <tr key={key} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 align-middle w-1/4">
                                {key}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 break-all">
                                <div className="font-mono bg-gray-50 p-2 rounded">
                                  {formatEvidenceValue(value)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic bg-white p-4 rounded-md border border-gray-200">
                  No evidence details available
                </div>
              )}
            </div>

            {/* Incident Status */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-indigo-600" />
                Incident Status
              </h4>
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-700">Incident</span>
                  {alert.isUnderIncident ? 
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Incident Related
                    </span> : 
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Not Incident Related
                    </span>
                  }
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 w-1/2">Created</span>
                    <span className="font-medium text-gray-400">{new Date(alert.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 w-1/2">Last Updated</span>
                    <span className="font-medium text-gray-400">{new Date(alert.datestr).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* MITRE Details - This section is kept for additional details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <ExternalLink className="h-4 w-4 mr-2 text-indigo-600" />
                MITRE Framework Details
              </h4>
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 mb-2">Tactic</span>
                    <div className="flex items-center">
                      <span className="text-gray-600 bg-indigo-50 px-3 py-1.5 rounded-md block w-full">
                        {alert.MITRE_tactic || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 mb-2">Technique</span>
                    <div className="flex items-center">
                      <span className="text-gray-600 bg-purple-50 px-3 py-1.5 rounded-md block w-full">
                        {alert.MITRE_technique || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 mb-2">Detection Model</span>
                    <div className="flex items-center">
                      <span className="text-gray-600 bg-green-50 px-3 py-1.5 rounded-md block w-full">
                        {alert.Detection_model || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logs Section */}
          {alert.Logs && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                Logs
              </h4>
              <div className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto font-mono text-sm shadow-inner">
                <pre className="whitespace-pre-wrap">{alert.Logs}</pre>
              </div>
            </div>
          )}
          
          {/* Raw Events Section */}
          {hasRawEvents(alert.evidence) && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <List className="h-4 w-4 mr-2 text-indigo-600" />
                Raw Events
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                  {Array.isArray(alert.evidence.list_raw_events) 
                    ? alert.evidence.list_raw_events.length 
                    : '1'}
                </span>
              </h4>
              <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                <div className="px-4 py-3 border-gray-200 flex justify-between items-center">
                  <h5 className="text-sm font-medium text-gray-700">Event Details</h5>
                  <button
                    onClick={() => toggleEvidenceSection(alert.ID, 'rawEvents')}
                    className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    {expandedEvidenceSection[`${alert.ID}-rawEvents`] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {expandedEvidenceSection[`${alert.ID}-rawEvents`] === true && (
                  <div className="bg-white p-4">
                    <RawEventsDisplay rawEvents={alert.evidence.list_raw_events} />
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

export default AlertModal;