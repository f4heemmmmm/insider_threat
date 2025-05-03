// src/components/ui/AlertCards.tsx
import React, { useState } from 'react';
import { Alert } from '../../types/alert.types';
import { StatusBadge } from './StatusBadge';
import AlertModal from './AlertModal';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  Calendar, 
  User, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface AlertCardsProps {
  alerts: Alert[];
  loading?: boolean;
}

export const AlertCards: React.FC<AlertCardsProps> = ({ alerts, loading = false }) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [expandedEvidenceSection, setExpandedEvidenceSection] = useState<Record<string, boolean>>({});

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

  const openAlertModal = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalOpen(true);
  };

  const closeAlertModal = () => {
    setModalOpen(false);
  };

  const toggleEvidenceSection = (alertId: string, sectionName: string) => {
    const key = `${alertId}-${sectionName}`;
    setExpandedEvidenceSection(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Empty state
  if (alerts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-lg w-full shadow-sm border border-gray-200">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No alerts found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 w-full mx-auto">
        {alerts.map((alert) => {
          const severity = getScoreSeverity(alert.score);
          const severityColor = getSeverityColor(severity);
          
          return (
            <div 
              key={alert.ID}
              id={`alert-${alert.ID}`}
              className={`mb-6 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 border border-gray-200 
                hover:shadow-md cursor-pointer transform hover:translate-y-[-2px] 
                ${severity === 'critical' ? 'border-l-4 border-l-red-600' :
                  severity === 'high' ? 'border-l-4 border-l-orange-500' :
                  severity === 'medium' ? 'border-l-4 border-l-amber-500' :
                  'border-l-4 border-l-blue-500'}`}
              onClick={() => openAlertModal(alert)}
            >
              {/* Alert Header */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  {/* Alert Name */}
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {alert.alert_name}
                  </h3>
                  
                  {/* Score and Status Badge */}
                  <div className={`flex items-center ${severityColor}`}>
                    <span className="font-semibold text-xl">{alert.score}</span>
                    <div className="ml-2">
                      <StatusBadge status={severity} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-5 text-sm">
                  {/* User */}
                  <div className="flex items-center text-sm font-light text-gray-600">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    {alert.user}
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    {/* Date */}
                    <div className="flex items-center text-sm font-light text-gray-600">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {new Date(alert.datestr).toLocaleDateString()}
                    </div>
                    
                    {/* Time */}
                    <div className="flex items-center text-sm font-light text-gray-600">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {new Date(alert.datestr).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Alert Summary */}
              <div className="px-6 py-4 border-t border-gray-200 mb-3">
                <div className="flex flex-wrap items-center">
                  {alert.MITRE_tactic && (
                    <div className="py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                      <span className="mr-1 font-semibold">MITRE Tactic:</span>
                      {alert.MITRE_tactic}
                    </div>
                  )}
                  
                  {alert.MITRE_tactic && alert.MITRE_technique && (
                    <div className="h-6 border-r border-gray-300 mx-2"></div>
                  )}
                  
                  {alert.MITRE_technique && (
                    <div className="py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                      <span className="mr-1 font-semibold">MITRE Technique:</span>
                      {alert.MITRE_technique}
                    </div>
                  )}
                  
                  {alert.MITRE_technique && alert.Detection_model && (
                    <div className="h-6 border-r border-gray-300 mx-2"></div>
                  )}
                  
                  {alert.Detection_model && (
                    <div className="py-2 px-4 text-sm font-light text-gray-600 flex items-center">
                      <span className="mr-1 font-semibold">Model:</span>
                      {alert.Detection_model}
                    </div>
                  )}
                </div>

                {alert.Description && (
                  <div className="text-sm text-gray-700 mt-4 px-4">
                    <div className="text-sm font-semibold mb-1">Description:</div>
                    <div className="flex items-start">
                      <p className="font-light">
                        {alert.Description.length > 250 ? 
                          `${alert.Description.substring(0, 250)}...` : 
                          alert.Description
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Alert Modal */}
      <AlertModal 
        alert={selectedAlert}
        open={modalOpen}
        onClose={closeAlertModal}
        expandedEvidenceSection={expandedEvidenceSection}
        toggleEvidenceSection={toggleEvidenceSection}
      />
    </>
  );
};