// src/components/ui/CompactAlertCard.tsx
import React from 'react';
import { Alert } from '../../types/alert.types';
import { StatusBadge } from './StatusBadge';
import { 
  Calendar, 
  User, 
  Clock,
  Shield
} from 'lucide-react';

interface CompactAlertCardProps {
  alert: Alert;
  onViewDetails: (alert: Alert) => void;
}

export const CompactAlertCard: React.FC<CompactAlertCardProps> = ({ 
  alert, 
  onViewDetails 
}) => {
  const getScoreSeverity = (score: number) => {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-600';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };
  
  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const severity = getScoreSeverity(alert.score);
  const severityColorClass = getSeverityColor(severity);
  const severityTextColor = getSeverityTextColor(severity);

  return (
    <div 
      id={`alert-${alert.ID}`}
      className="mb-7 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 
                border border-gray-200 hover:shadow-md cursor-pointer"
      onClick={() => onViewDetails(alert)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[70%]">
            {alert.alert_name}
          </h3>
          <div className={`flex items-center ${severityTextColor}`}>
            <span className="font-semibold text-sm mr-1">{alert.score}</span>
            <StatusBadge status={severity} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-gray-500" />
            <span className="truncate">{alert.user}</span>
          </div>
          <div className="flex items-center justify-end">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>{new Date(alert.datestr).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1 text-gray-500" />
            <span className="truncate">{alert.MITRE_tactic || 'No MITRE tactic'}</span>
          </div>
          <div className="flex items-center justify-end">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{new Date(alert.datestr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>
    </div>
  );
};