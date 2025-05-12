// src/app/incidents/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IncidentService } from '@/services/incident.service';
import { AlertService, SortField, SortOrder } from '@/services/alert.service';
import { Incident } from '@/types/incident.types';
import { Alert } from '@/types/alert.types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CompactAlertCards } from '@/components/ui/CompactAlertCards';
import Link from 'next/link';
import { ArrowUpDown, Calendar, Shield, Flag, Clock, AlertCircle, X } from 'lucide-react';
import IncidentTimeline, { TimelineEvent, convertTimelineItemsToEvents } from '@/components/ui/IncidentTimeline';

export default function IncidentDetailPage() {
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${monthShort} ${year}`;
  };
    
  const params = useParams();
  const incidentId = params.id as string;
  
  const [incident, setIncident] = useState<Incident | null>(null);
  const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the alerts modal
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  
  // Sorting states
  const [sortField, setSortField] = useState<SortField>('datestr');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Increased to 10 alerts per page
  const [total, setTotal] = useState(0);
  const [originalAlerts, setOriginalAlerts] = useState<Alert[]>([]);

  // Timeline data state
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  // State for MITRE tactics collection
  const [mitreTactics, setMitreTactics] = useState<string[]>([]);
  
  // State for duration calculation
  const [incidentDuration, setIncidentDuration] = useState<{
    earliestAlert: Date | null;
    latestAlert: Date | null;
    duration: string;
  }>({
    earliestAlert: null,
    latestAlert: null,
    duration: ''
  });

  // Handle modal open/close
  const openAlertsModal = () => setIsAlertsModalOpen(true);
  const closeAlertsModal = () => setIsAlertsModalOpen(false);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get all incidents to find the one with matching ID
        const response = await IncidentService.getIncidents(100, 0);
        const foundIncident = response.incidents.find(inc => inc.ID === incidentId);
        
        if (!foundIncident) {
          setError('Incident not found');
          setLoading(false);
          return;
        }

        console.log("Incident:");
        console.log(foundIncident);
        
        setIncident(foundIncident);
                                                  
        // Then fetch related alerts for this incident
        const alerts = await IncidentService.getRelatedAlerts(foundIncident);
        
        // Sort alerts by date chronologically for timeline
        const sortedAlerts = [...alerts].sort((a, b) => 
          new Date(a.datestr).getTime() - new Date(b.datestr).getTime()
        );
        
        setOriginalAlerts(sortedAlerts);
        
        // For display, default to descending (newest first)
        const displayAlerts = [...sortedAlerts].reverse();
        setRelatedAlerts(displayAlerts);
        setTotal(alerts.length);
        
        // Create timeline events from the alerts data
        const timelineEvents = mapAlertsToTimelineEvents(sortedAlerts);
        setTimelineEvents(timelineEvents);
        
        // Extract MITRE tactics from alerts
        const tactics = extractMitreTactics(sortedAlerts);
        setMitreTactics(tactics);
        
        // Calculate incident duration
        calculateIncidentDuration(sortedAlerts);
        
      } catch (err) {
        console.error('Error fetching incident details:', err);
        setError('Failed to load incident details');
      } finally {
        setLoading(false);
      }
    };

    if (incidentId) {
      fetchIncidentDetails();
    }
  }, [incidentId]);
  
  // Extract unique MITRE tactics from alerts
  const extractMitreTactics = (alerts: Alert[]): string[] => {
    const uniqueTactics = new Set<string>();
    
    alerts.forEach(alert => {
      if (alert.MITRE_tactic && alert.MITRE_tactic.trim() !== '') {
        uniqueTactics.add(alert.MITRE_tactic);
      }
    });
    
    return Array.from(uniqueTactics);
  };
  
  // Calculate duration between earliest and latest alerts
  const calculateIncidentDuration = (alerts: Alert[]): void => {
    if (alerts.length === 0) {
      setIncidentDuration({
        earliestAlert: null,
        latestAlert: null,
        duration: 'No alerts found'
      });
      return;
    }
    
    // Alerts are already sorted by date chronologically
    const earliestAlert = new Date(alerts[0].datestr);
    const latestAlert = new Date(alerts[alerts.length - 1].datestr);
    
    // Calculate duration
    const durationMs = latestAlert.getTime() - earliestAlert.getTime();
    const durationFormatted = formatDuration(durationMs);
    
    setIncidentDuration({
      earliestAlert,
      latestAlert,
      duration: durationFormatted
    });
  };
  
  // Format duration from milliseconds to human-readable string
  const formatDuration = (ms: number): string => {
    // Less than a minute
    if (ms < 60000) {
      return `${Math.floor(ms / 1000)} seconds`;
    }
    
    // Less than an hour
    if (ms < 3600000) {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds > 0 ? `${seconds} second${seconds !== 1 ? 's' : ''}` : ''}`;
    }
    
    // Less than a day
    if (ms < 86400000) {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
    }
    
    // More than a day
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    return `${days} day${days !== 1 ? 's' : ''} ${hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : ''}`;
  };
  
  // Map alerts to timeline events with proper format
  const mapAlertsToTimelineEvents = (alerts: Alert[]): TimelineEvent[] => {
    return alerts.map(alert => {
      const alertDate = new Date(alert.datestr);
      
      // Determine the event type based on MITRE tactic or other data
      let eventType: 'alert' | 'defense' | 'impact' | 'other' = 'other';
      if (alert.MITRE_tactic) {
        if (alert.MITRE_tactic.includes('Defense Evasion')) {
          eventType = 'defense';
        } else if (alert.MITRE_tactic.includes('Impact')) {
          eventType = 'impact';
        } else {
          eventType = 'alert';
        }
      } else {
        // Fallback to determine type by score severity
        if (alert.score >= 90) eventType = 'alert';
        else if (alert.score >= 70) eventType = 'defense';
        else if (alert.score >= 50) eventType = 'impact';
      }
      
      return {
        id: alert.ID,
        timestamp: alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: formatDate(alertDate),
        title: alert.alert_name,
        description: alert.Description || 'No description available',
        type: eventType,
        severity: getScoreSeverity(alert.score) as 'critical' | 'high' | 'medium' | 'low',
        MITRE_tactic: alert.MITRE_tactic,
        MITRE_technique: alert.MITRE_technique,
        onClick: () => {
          const alertElement = document.getElementById(`alert-${alert.ID}`);
          if (alertElement) {
            alertElement.scrollIntoView({ behavior: 'smooth' });
            // Highlight the alert briefly
            alertElement.classList.add('ring-2', 'ring-indigo-500');
            setTimeout(() => {
              alertElement.classList.remove('ring-2', 'ring-indigo-500');
            }, 2000);
          }
        }
      };
    });
  };
  
  // Sort handling
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending order
      setSortField(field);
      setSortOrder('desc');
    }
    
    // Sort the alerts
    const sortedAlerts = [...relatedAlerts].sort((a, b) => {
      let comparison = 0;
      if (field === 'datestr') {
        comparison = new Date(a.datestr).getTime() - new Date(b.datestr).getTime();
      } else if (field === 'score') {
        comparison = a.score - b.score;
      } else if (field === 'alert_name') {
        comparison = a.alert_name.localeCompare(b.alert_name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setRelatedAlerts(sortedAlerts);
    // Reset to first page on sort
    setPage(1);
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <span className="text-indigo-600">↑</span> : 
      <span className="text-indigo-600">↓</span>;
  };
  
  const getScoreSeverity = (score: number) => {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  // Calculate pagination values
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const paginatedAlerts = relatedAlerts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-md max-w-8xl">
        <h3 className="mt-2 text-lg font-medium text-gray-900">Incident not found</h3>
        <p className="mt-1 text-sm text-gray-500">The incident you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Link href="/incidents" className="text-indigo-600 hover:text-indigo-900">
            ← Back to incidents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className = "p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Incident Details</h1>
        <Link href="/incidents" className="text-indigo-600 hover:text-indigo-900">
          ← Back to incidents
        </Link>
      </div>

      {/* Incident Summary Card */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Incident Summary</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">User</h3>
              <p className="mt-1 text-sm text-gray-900">{incident.user}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Score</h3>
              <p className="mt-1 text-sm text-gray-900 flex items-center">
                <StatusBadge status={getScoreSeverity(incident.score)} />
                <span className="ml-2">{incident.score}</span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-sm text-gray-900">{new Date(incident.created_at).toLocaleString()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <p className="mt-1 text-sm text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                {incidentDuration.duration}
              </p>
              {incidentDuration.earliestAlert && incidentDuration.latestAlert && (
                <p className="mt-1 text-xs text-gray-500">
                  {incidentDuration.earliestAlert.toLocaleString()} - {incidentDuration.latestAlert.toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Time Window</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(incident.windows_start).toLocaleString()} - {new Date(incident.windows_end).toLocaleString()}
              </p>
            </div>
            
            {/* Related Alerts Button */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Related Alerts</h3>
              <button
                onClick={openAlertsModal}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Show all related alerts ({total})
              </button>
            </div>
            
            {/* MITRE Tactics Used */}
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-500">MITRE Tactics Used</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {mitreTactics.length > 0 ? (
                  mitreTactics.map((tactic, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-800"
                    >
                      {tactic}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 italic">No MITRE tactics found</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline - Full Width */}
      <div className="w-full h-[calc(100vh-200px)] bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Incident Timeline Summary</h2>
        </div>
        <IncidentTimeline 
          events={timelineEvents} 
          className="flex-grow"
        />
      </div>

      {/* Alerts Modal */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeAlertsModal}></div>
            </div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Related Alerts ({total})
                  </h3>
                  <button
                    onClick={closeAlertsModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Sort Controls */}
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => handleSort('datestr')}
                    className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                      sortField === 'datestr' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Date</span>
                    {getSortIcon('datestr')}
                  </button>
                  <button
                    onClick={() => handleSort('score')}
                    className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                      sortField === 'score' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Score</span>
                    {getSortIcon('score')}
                  </button>
                  <button
                    onClick={() => handleSort('alert_name')}
                    className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                      sortField === 'alert_name' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Alert Name</span>
                    {getSortIcon('alert_name')}
                  </button>
                </div>
                
                {/* Alerts List */}
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  <CompactAlertCards alerts={paginatedAlerts} loading={loading} />
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          page === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          page === totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{total === 0 ? 0 : startIndex + 1}</span> to{' '}
                          <span className="font-medium">{endIndex}</span> of{' '}
                          <span className="font-medium">{total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                              page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            &larr;
                          </button>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              // Show all pages if 5 or fewer
                              pageNumber = i + 1;
                            } else if (page <= 3) {
                              // At the beginning, show first 5 pages
                              pageNumber = i + 1;
                            } else if (page >= totalPages - 2) {
                              // At the end, show last 5 pages
                              pageNumber = totalPages - 4 + i;
                            } else {
                              // In the middle, show 2 before and 2 after current page
                              pageNumber = page - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border ${
                                  page === pageNumber
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                } text-sm font-medium`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                              page === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            &rarr;
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeAlertsModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}