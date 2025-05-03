// src/components/ui/IncidentTimeline.tsx
import React, { useState } from 'react';
import { Clock, Terminal, ExternalLink } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  date: string;
  title: string;
  description: string;
  type: 'alert' | 'defense' | 'impact' | 'other';
  commandLine?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  MITRE_tactic?: string;
  MITRE_technique?: string;
  onClick?: () => void;
}

interface IncidentTimelineProps {
  events: TimelineEvent[];
  className?: string;
  title?: string;
}
const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
  };
  
const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ 
  events, 
  className = '', 
}) => {
  const [expandedCommands, setExpandedCommands] = useState<Record<string, boolean>>({});

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm p-8">
        No timeline events available
      </div>
    );
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'alert':
        return 'bg-red-500';
      case 'defense':
        return 'bg-blue-500';
      case 'impact':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };


  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`${className} h-full`}>
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] p-4">
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div key={event.id} className="relative pl-10">
                {/* Date and time */}
                <div className="text-sm text-black mb-2 font-mono">
                  {event.date} {event.timestamp}
                </div>
                
                {/* Timeline dot */}
                <div className={`absolute left-2.5 top-1 transform w-3 h-3 rounded-full border-4 border-white shadow-sm ${getTypeColor(event.type)}`}></div>
                
                {/* Content card */}
                <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                  {/* Event header with type */}
                  <div className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {event.MITRE_tactic && event.MITRE_technique && (
                            <span className="text-gray-900 text-sm font-semibold">
                            {event.MITRE_tactic}
                            <span className="font-light text-xs"> via </span>
                            {event.MITRE_technique}
                            </span>
                        )}
                        </div>

                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Event description */}
                  <div className="px-4 py-2">
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-700 mb-1">Description</h4>
                      <p className="text-xs text-gray-700">{event.description}.</p>
                    </div>
                    
                    {/* View details link if onClick is provided */}
                    {event.onClick && (
                      <button 
                        onClick={event.onClick}
                        className="mt-2 text-xs flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View details
                      </button>
                    )}
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

// Helper function to convert from old TimelineItem format to new TimelineEvent format
export const convertTimelineItemsToEvents = (items: any[]): TimelineEvent[] => {
  return items.map(item => {
    // Determine event type based on severity or MITRE tactic if available
    let eventType: 'alert' | 'defense' | 'impact' | 'other' = 'other';
    
    if (item.mitreTactic) {
      if (item.mitreTactic.toLowerCase().includes('defense evasion')) {
        eventType = 'defense';
      } else if (item.mitreTactic.toLowerCase().includes('impact')) {
        eventType = 'impact';
      } else {
        eventType = 'alert';
      }
    } else if (item.severity) {
      // Fallback to severity-based type determination
      if (item.severity === 'critical') {
        eventType = 'alert';
      } else if (item.severity === 'high') {
        eventType = 'defense';
      } else if (item.severity === 'medium') {
        eventType = 'impact';
      }
    }

    
    return {
      id: item.id,
      timestamp: item.time || new Date().toLocaleTimeString(),
      date: item.date ? formatDate(new Date(item.date)) : formatDate(new Date()),
      title: item.alertName || 'Unnamed Alert',
      description: item.description || 'No description available',
      type: eventType,
      severity: item.severity || 'low',
      MITRE_tactic: item.mitreTactic,
      MITRE_technique: item.mitreTechnique,
      onClick: item.onClick
    };
  });
};

export default IncidentTimeline;