// frontend/src/app/incidents/[id]/page.tsx

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { extractMitreTactics, formatDuration, getScoreSeverity, calculateIncidentDuration, mapAlertsToTimelineEvents } from "@/constants/functions";

import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";
import { IncidentService } from "@/services/incident.service";

import AlertModal from "@/components/ui/AlertModal";
import { AlertsModal } from "@/components/incident-id-page/AlertModal";
import IncidentTimeline, { TimelineEvent } from "@/components/ui/IncidentTimeline";
import { IncidentSummaryCard } from "@/components/incident-id-page/IncidentSummaryCard";

export default function IncidentDetailPage() {
    const params = useParams();
    const incidentId = params.id as string;
    
    const [incident, setIncident] = useState<Incident | null>(null);
    const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [mitreTactics, setMitreTactics] = useState<string[]>([]);
    
    // Fix 1: Updated state structure to match IncidentSummaryCard expectations
    const [incidentDuration, setIncidentDuration] = useState<{
      start_time: Date | null;
      end_time: Date | null;
      duration: string;
    }>({
      start_time: null,
      end_time: null,
      duration: ''
    });
    
    // Fix 2: Changed AlertModal state to match expected type
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});
  
    useEffect(() => {
      const fetchIncidentDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await IncidentService.getIncidents(100, 0);
          const foundIncident = response.incidents.find(inc => inc.ID === incidentId);
          
          if (!foundIncident) {
            setError('Incident not found');
            setLoading(false);
            return;
          }
  
          setIncident(foundIncident);
          
          const alerts = await IncidentService.getRelatedAlerts(foundIncident.ID);
          const sortedAlerts = [...alerts].sort((a, b) => 
            new Date(a.datestr).getTime() - new Date(b.datestr).getTime()
          );
          
          setRelatedAlerts(sortedAlerts);
          
          // Set timeline events
          const timelineEvents = mapAlertsToTimelineEvents(sortedAlerts);
          setTimelineEvents(timelineEvents);
          
          // Extract MITRE tactics
          const tactics = extractMitreTactics(sortedAlerts);
          setMitreTactics(tactics);
          
          // Fix 3: Update duration calculation to match expected format
          const duration = calculateIncidentDuration(sortedAlerts);
          // Transform the duration object to match IncidentSummaryCard expectations
          setIncidentDuration({
            start_time: duration.earliestAlert || duration.earliestAlert as Date | null,
            end_time: duration.latestAlert || duration.latestAlert as Date | null,
            duration: duration.duration
          });
          
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
  
    // Handle alert modal functions
    const handleAlertClick = (alert: Alert) => {
      setSelectedAlert(alert);
      setIsAlertModalOpen(true);
    };
  
    const handleCloseAlertModal = () => {
      setIsAlertModalOpen(false);
      setSelectedAlert(null);
      setExpandedEvidenceSection({});
    };
  
    // Fix 4: Updated toggleEvidenceSection to work with Record<string, boolean>
    const toggleEvidenceSection = (section: string) => {
      setExpandedEvidenceSection(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };
  
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
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Incident Details</h1>
          <Link href="/incidents" className="text-indigo-600 hover:text-indigo-900">
            ← Back to incidents
          </Link>
        </div>
  
        <IncidentSummaryCard
        incident={incident}
        incidentDuration={incidentDuration}
        MITRETactics={mitreTactics}  // ✅ Correct prop name
        totalAlerts={relatedAlerts.length}
        onShowAlerts={() => setIsAlertsModalOpen(true)}
        getScoreSeverity={getScoreSeverity}
        />
                
        <div className="w-full h-[calc(100vh-200px)] bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Incident Timeline Summary</h2>
          </div>
          <IncidentTimeline 
            events={timelineEvents} 
            className="flex-grow"
          />
        </div>
  
        <AlertsModal
          isOpen={isAlertsModalOpen}
          onClose={() => setIsAlertsModalOpen(false)}
          alerts={relatedAlerts}
          totalAlerts={relatedAlerts.length}
          loading={loading}
          onAlertClick={handleAlertClick}
        />
  
        <AlertModal
          alert={selectedAlert}
          open={isAlertModalOpen}
          onClose={handleCloseAlertModal}
          expandedEvidenceSection={expandedEvidenceSection}
          toggleEvidenceSection={toggleEvidenceSection}
        />
      </div>
    );
  }
