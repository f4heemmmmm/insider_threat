// src/components/incident/AlertsModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowUpDown } from 'lucide-react';
import { Alert } from '@/types/alert.types';
import { CompactAlertCards } from '@/components/ui/CompactAlertCards';
import { SortField, SortOrder } from '@/services/alert.service';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  totalAlerts: number;
  loading: boolean;
  onAlertClick?: (alert: Alert) => void;
}

// Wrapper component to add click functionality to CompactAlertCards
const ClickableAlertCards: React.FC<{
  alerts: Alert[];
  loading: boolean;
  onAlertClick?: (alert: Alert) => void;
}> = ({ alerts, loading, onAlertClick }) => {
  
  // If no click handler provided, render original component
  if (!onAlertClick) {
    return <CompactAlertCards alerts={alerts} loading={loading} />;
  }

  // Create a custom render with click handlers
  return (
    <div onClick={(e) => {
      // Find the clicked alert card
      const alertCard = (e.target as Element).closest('[data-alert-id]');
      if (alertCard && onAlertClick) {
        const alertId = alertCard.getAttribute('data-alert-id');
        const alert = alerts.find(a => a.ID === alertId);
        if (alert) {
          onAlertClick(alert);
        }
      }
    }}>
      <CompactAlertCards alerts={alerts} loading={loading} />
    </div>
  );
};

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  totalAlerts,
  loading,
  onAlertClick
}) => {
  const [sortField, setSortField] = useState<SortField>('datestr');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [sortedAlerts, setSortedAlerts] = useState(alerts);
  const limit = 10;

  // Update sorted alerts when alerts prop changes
  useEffect(() => {
    setSortedAlerts(alerts);
  }, [alerts]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    
    const sorted = [...alerts].sort((a, b) => {
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
    
    setSortedAlerts(sorted);
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

  if (!isOpen) return null;

  const totalPages = Math.ceil(totalAlerts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalAlerts);
  const paginatedAlerts = sortedAlerts.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Related Alerts ({totalAlerts})
              </h3>
              <button
                onClick={onClose}
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
              <ClickableAlertCards 
                alerts={paginatedAlerts} 
                loading={loading}
                onAlertClick={onAlertClick}
              />
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
                      Showing <span className="font-medium">{totalAlerts === 0 ? 0 : startIndex + 1}</span> to{' '}
                      <span className="font-medium">{endIndex}</span> of{' '}
                      <span className="font-medium">{totalAlerts}</span> results
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
                          pageNumber = i + 1;
                        } else if (page <= 3) {
                          pageNumber = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
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
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

