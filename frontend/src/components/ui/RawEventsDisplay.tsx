import React, { JSX, useState } from 'react';
import { ChevronDown, ChevronUp, Search, AlertCircle, Grid } from 'lucide-react';

// Define types for our raw events
interface AppAccessContext {
  AADSessionId?: string;
  ClientAppId?: string;
  ClientAppName?: string;
  CorrelationId?: string;
  UniqueTokenId?: string;
  [key: string]: any;
}

interface SharePointEvent {
  AppAccessContext?: AppAccessContext;
  ApplicationDisplayName?: string;
  ApplicationId?: string;
  AuthenticationType?: string;
  BrowserName?: string;
  BrowserVersion?: string;
  ClientIP?: string;
  CorrelationId?: string;
  CreationTime?: string;
  Operation?: string;
  UserId?: string;
  SourceFileName?: string;
  SiteUrl?: string;
  [key: string]: any;
}

// Add a new type for indexed events to preserve original positions
interface IndexedSharePointEvent extends SharePointEvent {
  _originalIndex: number;
}

interface RawEventsDisplayProps {
  rawEvents: any[] | any | string | null | undefined;
}

/**
 * Component to display nested list_raw_events from alert evidence
 */
const RawEventsDisplay: React.FC<RawEventsDisplayProps> = ({ rawEvents }) => {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [expandedProperties, setExpandedProperties] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Handle null or undefined input
  if (!rawEvents) {
    return (
      <div className="text-sm text-gray-500 italic bg-white p-4 rounded-md border border-gray-200">
        No raw events available
      </div>
    );
  }
  
  // Parse and clean AppAccessContext events
  const parseAppAccessEvents = (events: any): IndexedSharePointEvent[] => {
    try {
      // If events is already an array, we'll process each item
      if (Array.isArray(events)) {
        return events.map((event, index) => {
          if (typeof event === 'string') {
            try {
              // For strings that are escaped JSON, we need to clean and parse
              // Remove outer quotes if present
              let cleanEvent = event;
              if (cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) {
                cleanEvent = cleanEvent.slice(1, -1);
              }
              
              // Replace escaped quotes with actual quotes
              cleanEvent = cleanEvent.replace(/\\"/g, '"');
              
              // Parse the cleaned string and add original index
              const parsedEvent = JSON.parse(cleanEvent);
              return { ...parsedEvent, _originalIndex: index };
            } catch (error) {
              console.error(`Error parsing event at index ${index}:`, error);
              return { error: `Failed to parse event: ${error instanceof Error ? error.message : 'Unknown error'}`, _originalIndex: index };
            }
          } else if (typeof event === 'object') {
            // Already parsed objects can be returned with original index
            return { ...event, _originalIndex: index };
          } else {
            // Anything else we can't handle
            return { error: `Unsupported event type: ${typeof event}`, _originalIndex: index };
          }
        });
      } else if (typeof events === 'string') {
        // Try parsing as JSON string
        try {
          const parsed = JSON.parse(events);
          if (Array.isArray(parsed)) {
            return parseAppAccessEvents(parsed);
          } else {
            return [{ ...parsed, _originalIndex: 0 }];
          }
        } catch {
          // For single string event, try to clean and parse
          let cleanEvent = events;
          if (cleanEvent.startsWith('"') && cleanEvent.endsWith('"')) {
            cleanEvent = cleanEvent.slice(1, -1);
          }
          cleanEvent = cleanEvent.replace(/\\"/g, '"');
          try {
            const parsedEvent = JSON.parse(cleanEvent);
            return [{ ...parsedEvent, _originalIndex: 0 }];
          } catch (error) {
            console.error('Error parsing single string event:', error);
            return [{ error: `Failed to parse event: ${error instanceof Error ? error.message : 'Unknown error'}`, _originalIndex: 0 }];
          }
        }
      } else if (typeof events === 'object' && events !== null) {
        // Single object, just wrap in array
        return [{ ...events, _originalIndex: 0 }];
      }
      
      // Fallback for anything else
      return [{ error: 'Unsupported events format', _originalIndex: 0 }];
    } catch (error) {
      console.error('Error in parseAppAccessEvents:', error);
      return [{ error: `Global parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`, _originalIndex: 0 }];
    }
  };
  
  // Process the raw events
  const parsedEvents = parseAppAccessEvents(rawEvents);
  
  // Toggle expanded state for events
  const toggleEvent = (index: number): void => {
    setExpandedEvents(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Toggle expanded state for properties
  const toggleProperty = (eventIndex: number, propName: string): void => {
    const key = `${eventIndex}-${propName}`;
    setExpandedProperties(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter events based on search term
  const filteredEvents = !searchTerm.trim() 
    ? parsedEvents 
    : parsedEvents.filter(event => {
        const eventStr = JSON.stringify(event).toLowerCase();
        return eventStr.includes(searchTerm.toLowerCase());
      });
  
  // Format a value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };
  
  // Render a nested JSON object
  const renderNestedObject = (
    obj: any, 
    eventIndex: number, 
    propName: string, 
    level: number = 0
  ): JSX.Element => {
    if (!obj || typeof obj !== 'object') {
      return (
        <div className="font-mono text-sm pl-4">
          {formatValue(obj)}
        </div>
      );
    }
    
    return (
      <div className="pl-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.entries(obj).map(([key, val], i) => {
            // Skip the _originalIndex property when rendering nested objects
            if (key === '_originalIndex') return null;
            
            const isObject = val !== null && typeof val === 'object';
            const nestedKey = `${eventIndex}-${propName}-${key}`;
            const isExpanded = expandedProperties[nestedKey];
            
            return (
              <div key={`${nestedKey}-${i}`} className="font-mono text-sm">
                {isObject ? (
                  <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
                    <div 
                      className="flex items-center cursor-pointer hover:bg-gray-50 py-2 px-3"
                      onClick={() => toggleProperty(eventIndex, `${propName}-${key}`)}
                    >
                      {isExpanded ? 
                        <ChevronUp className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" /> : 
                        <ChevronDown className="h-3 w-3 mr-1 text-gray-500 flex-shrink-0" />
                      }
                      <span className="font-semibold text-indigo-600 truncate">{key}</span>
                      <span className="ml-2 text-gray-600 text-xs">
                        {Array.isArray(val) ? `Array(${val.length})` : 'Object'}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-2">
                        {renderNestedObject(val, eventIndex, `${propName}-${key}`, level + 1)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-3 h-full flex flex-col">
                    <span className="font-semibold text-indigo-600 text-xs mb-1 truncate">{key}</span>
                    <span className="text-gray-800 break-all text-sm overflow-hidden">{formatValue(val)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Get a summary of the event for display in the header
  const getEventSummary = (event: IndexedSharePointEvent, index: number): JSX.Element => {
    // Check if there was an error processing this event
    if ('error' in event) {
      return (
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          Error parsing event
        </div>
      );
    }
    
    // Show important fields first
    return (
      <div className="flex flex-col">
        {event.Operation && (
          <div className="flex items-center justify-end">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
              {event.Operation}
            </span>
          </div>
        )}
        
        <div className="flex flex-col mt-1">
          {event.CreationTime && (
            <div className="text-right text-xs">
              {new Date(event.CreationTime).toLocaleString()}
            </div>
          )}
          
          {event.UserId && (
            <div className="text-right text-xs truncate max-w-xs">
              {event.UserId}
            </div>
          )}
          
          {event.SourceFileName && (
            <div className="text-right text-xs truncate max-w-xs mt-1">
              {event.SourceFileName}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-md overflow-hidden bg-white">
      {/* Search Bar */}
      <div className="p-2 border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {filteredEvents.length} of {parsedEvents.length} events
        </div>
      </div>
      
      {/* Events List */}
      <div className="divide-y divide-gray-100">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const isExpanded = expandedEvents[index];
            // Get the original index (1-based for display)
            const originalEventNumber = event._originalIndex + 1;
            
            return (
              <div key={index} className="hover:bg-gray-50">
                {/* Event Header - Always visible */}
                <div 
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => toggleEvent(index)}
                >
                  <div className="flex items-center">
                    {isExpanded ? 
                      <ChevronUp className="h-4 w-4 mr-2 text-gray-500" /> : 
                      <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                    }
                    <div>
                      <div className="font-semibold text-xs text-gray-900">
                        Event #{originalEventNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Object.keys(event).filter(key => key !== '_originalIndex').length} properties
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {getEventSummary(event, index)}
                  </div>
                </div>
                
                {/* Expanded Event Details */}
                {isExpanded && (
                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                    {/* Special handling for AppAccessContext if available */}
                    {event.AppAccessContext && (
                      <div className="mb-4 rounded-md border border-indigo-200 bg-indigo-50 overflow-hidden">
                        <div className="px-3 py-2 bg-indigo-100 border-b border-indigo-200">
                          <h3 className="text-sm font-medium text-indigo-800">App Access Context</h3>
                        </div>
                        <div className="p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {Object.entries(event.AppAccessContext).map(([key, value]) => (
                              <div key={key} className="bg-white rounded-md shadow-sm border border-gray-100 p-3">
                                <span className="font-medium text-indigo-700 text-xs block mb-1 truncate">{key}</span>
                                <span className="text-gray-700 text-sm block truncate">{formatValue(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Object.entries(event)
                        .filter(([key]) => key !== 'AppAccessContext' && key !== '_originalIndex') // Skip AppAccessContext and _originalIndex
                        .map(([key, value], i) => {
                          const isObject = value !== null && typeof value === 'object';
                          const propKey = `${index}-${key}`;
                          const isPropExpanded = expandedProperties[propKey];
                          
                          return (
                            <div key={`${index}-${key}-${i}`} className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
                              <div 
                                className={`px-3 py-2 flex items-center justify-between ${isObject ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                onClick={isObject ? () => toggleProperty(index, key) : undefined}
                              >
                                <div className="font-medium text-xs text-gray-700 truncate">{key}</div>
                                {isObject && (
                                  <div className="flex items-center text-gray-500 text-xs">
                                    {Array.isArray(value) ? `Array(${value.length})` : 'Object'}
                                    {isPropExpanded ? 
                                      <ChevronUp className="h-4 w-4 ml-1" /> : 
                                      <ChevronDown className="h-4 w-4 ml-1" />
                                    }
                                  </div>
                                )}
                              </div>
                              
                              {!isObject && (
                                <div className="px-3 py-2">
                                  <div className="text-gray-600 font-mono text-xs break-all max-h-20 overflow-y-auto">
                                    {formatValue(value)}
                                  </div>
                                </div>
                              )}
                              
                              {isObject && isPropExpanded && (
                                <div className="overflow-x-auto p-3">
                                  {renderNestedObject(value, index, key)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No events match your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default RawEventsDisplay;