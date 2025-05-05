// src/components/ui/alert-modal-elements/AlertRawEvents.tsx
import React from 'react';
import { List, ChevronUp, ChevronDown } from 'lucide-react';
import RawEventsDisplay from '../RawEventsDisplay';

interface AlertRawEventsProps {
  evidence: any;
  alertId: string;
  expandedEvidenceSection: Record<string, boolean>;
  toggleEvidenceSection: (alertId: string, sectionName: string) => void;
}

const AlertRawEvents: React.FC<AlertRawEventsProps> = ({ 
  evidence, 
  alertId, 
  expandedEvidenceSection, 
  toggleEvidenceSection 
}) => {
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

  if (!hasRawEvents(evidence)) {
    return null;
  }

  return (
    <div className="px-6 pb-6">
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
        <List className="h-4 w-4 mr-2 text-indigo-600" />
        Raw Events
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
          {Array.isArray(evidence.list_raw_events) 
            ? evidence.list_raw_events.length 
            : '1'}
        </span>
      </h4>
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-gray-200 flex justify-between items-center">
          <h5 className="text-sm font-medium text-gray-700">Event Details</h5>
          <button
            onClick={() => toggleEvidenceSection(alertId, 'rawEvents')}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            {expandedEvidenceSection[`${alertId}-rawEvents`] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {expandedEvidenceSection[`${alertId}-rawEvents`] === true && (
          <div className="bg-white p-4">
            <RawEventsDisplay rawEvents={evidence.list_raw_events} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertRawEvents;