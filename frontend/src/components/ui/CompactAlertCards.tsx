// src/components/ui/CompactAlertCards.tsx
import React, { useState } from 'react';
import { Alert } from '../../types/alert.types';
import { CompactAlertCard } from './CompactAlertCard';
import { AlertPopup } from './AlertPopup';
import { AlertCircle } from 'lucide-react';

interface CompactAlertCardsProps {
  alerts: Alert[];
  loading?: boolean;
}

export const CompactAlertCards: React.FC<CompactAlertCardsProps> = ({ 
  alerts, 
  loading = false 
}) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    // Prevent page scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  const handleClosePopup = () => {
    setSelectedAlert(null);
    // Restore page scrolling
    document.body.style.overflow = 'auto';
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
    <div className="space-y-1 w-full mx-auto">
      {/* Render compact alert cards */}
      {alerts.map((alert) => (
        <CompactAlertCard 
          key={alert.ID}
          alert={alert}
          onViewDetails={handleViewDetails}
        />
      ))}
      
      {/* Alert detail popup */}
      {selectedAlert && (
        <AlertPopup 
          alert={selectedAlert}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};