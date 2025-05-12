// src/components/ui/AlertPopup.tsx
import React, { useState } from 'react';
import { Alert } from '../../types/alert.types';
import { StatusBadge } from './StatusBadge';
import RawEventsDisplay from './alert-modal-elements/RawEventsDisplay';
import { 
  X, 
  Calendar, 
  User, 
  ShieldAlert, 
  AlertCircle,
  FileText,
  Clock,
  List,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

interface AlertPopupProps {
  alert: Alert | null;
  onClose: () => void;
}

export const AlertPopup: React.FC<AlertPopupProps> = ({ 
  alert, 
  onClose 
}) => {
  const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});

  if (!alert) return null;

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

  const toggleEvidenceSection = (sectionName: string) => {
    setExpandedEvidenceSection(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const formatEvidenceValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
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

  const hasRawEvents = (evidence: any): boolean => {
    return evidence && 
           Object.prototype.hasOwnProperty.call(evidence, 'list_raw_events') && 
           evidence.list_raw_events &&
           (
             (Array.isArray(evidence.list_raw_events) && evidence.list_raw_events.length > 0) ||
             (typeof evidence.list_raw_events === 'object' && 
              !Array.isArray(evidence.list_raw_events) && 
              Object.keys(evidence.list_raw_events).length > 0)
           );
  };

  const getSortedEvidenceEntries = (evidence: any) => {
    if (!evidence) return [];
    
    return Object.entries(evidence)
      .filter(([key]) => key !== 'list_raw_events')
      .filter(([key, value]) => {
        if (value === null || value === undefined) return false;
        if (value === '') return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
      .sort((a, b) => a[0].localeCompare(b[0]));
  };

  const severity = getScoreSeverity(alert.score);
  const severityColor = getSeverityColor(severity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Popup Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">{alert.alert_name}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Alert Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">User</h3>
              <p className="text-base text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                {alert.user}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-base text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {new Date(alert.datestr).toLocaleDateString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Score</h3>
              <p className="text-base text-gray-900 flex items-center">
                <span className={`font-semibold text-xl mr-2 ${severityColor}`}>{alert.score}</span>
                <StatusBadge status={severity} />
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex flex-wrap items-center mb-4">
              {alert.MITRE_tactic && (
                <div className="py-1 px-3 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full mr-2 mb-2">
                  {alert.MITRE_tactic}
                </div>
              )}
              
              {alert.MITRE_technique && (
                <div className="py-1 px-3 text-sm font-medium bg-purple-50 text-purple-700 rounded-full mr-2 mb-2">
                  {alert.MITRE_technique}
                </div>
              )}
              
              {alert.Detection_model && (
                <div className="py-1 px-3 text-sm font-medium bg-green-50 text-green-700 rounded-full mr-2 mb-2">
                  {alert.Detection_model}
                </div>
              )}
            </div>
            
            {alert.Description && (
              <div className="text-sm text-gray-700 mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="font-light bg-gray-50 p-4 rounded-md">
                  {alert.Description}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Evidence Details */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-indigo-600" />
              Evidence Details
            </h4>
            {alert.evidence && Object.keys(alert.evidence).length > 0 ? (
              <div>
                {/* Evidence Properties */}
                <div className="border rounded-md overflow-hidden bg-white shadow-sm mb-4">
                  <div className="px-4 py-3 bg-gray-50 border-gray-200 flex justify-between items-center">
                    <h5 className="text-sm font-medium text-gray-700">Evidence Properties</h5>
                    <button
                      onClick={() => toggleEvidenceSection('properties')}
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      {expandedEvidenceSection['properties'] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {expandedEvidenceSection['properties'] === true && (
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
          
          {/* MITRE Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
              <ExternalLink className="h-4 w-4 mr-2 text-indigo-600" />
              MITRE Framework
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
            <div className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto font-mono text-sm shadow-inner max-h-64">
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
                  onClick={() => toggleEvidenceSection('rawEvents')}
                  className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {expandedEvidenceSection['rawEvents'] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {expandedEvidenceSection['rawEvents'] === true && (
                <div className="bg-white p-4">
                  <RawEventsDisplay rawEvents={alert.evidence.list_raw_events} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};