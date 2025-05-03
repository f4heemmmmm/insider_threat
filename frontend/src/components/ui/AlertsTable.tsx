// src/components/ui/AlertsTable.tsx
import React, { useState } from 'react';
import { Alert } from '../../types/alert.types';
import { StatusBadge } from './StatusBadge';
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface AlertsTableProps {
  alerts: Alert[];
  loading?: boolean;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, loading = false }) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});

  const getScoreSeverity = (score: number) => {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const toggleExpandAlert = (alertId: string) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [alertId]: !prev[alertId],
    }));
  };

  const formatEvidenceValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-md w-full">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No alerts found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alert Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MITRE Tactic
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MITRE Technique
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alerts.map((alert) => (
            <React.Fragment key={alert.ID}>
              <tr className={`hover:bg-gray-50 ${expandedAlerts[alert.ID] ? 'bg-gray-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{alert.alert_name}</div>
                  {alert.Description && (
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                      {alert.Description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{alert.user}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(alert.datestr).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={getScoreSeverity(alert.score)} />
                  <span className="ml-2 text-sm text-gray-500">{alert.score}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{alert.MITRE_tactic || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{alert.MITRE_technique || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => toggleExpandAlert(alert.ID)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
                  >
                    {expandedAlerts[alert.ID] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <MoreHorizontal className="h-5 w-5" />
                    )}
                  </button>
                </td>
              </tr>
              {expandedAlerts[alert.ID] && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Evidence Details</div>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Field
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {alert.evidence && Object.entries(alert.evidence).map(([key, value]) => (
                            <tr key={key} className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {key}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500 break-all">
                                {formatEvidenceValue(value)}
                              </td>
                            </tr>
                          ))}
                          {(!alert.evidence || Object.keys(alert.evidence).length === 0) && (
                            <tr>
                              <td colSpan={2} className="px-4 py-2 text-sm text-gray-500 text-center">
                                No evidence details available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Additional Alert Details */}
                    <div className="text-sm font-medium text-gray-900 mt-4 mb-2">Additional Details</div>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              Detection Model
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {alert.Detection_model || 'N/A'}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              Under Incident
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {alert.isUnderIncident ? 'Yes' : 'No'}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              Created At
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {new Date(alert.created_at).toLocaleString()}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              Updated At
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {new Date(alert.updated_at).toLocaleString()}
                            </td>
                          </tr>
                          {alert.Logs && (
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                Logs
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500 break-all">
                                {alert.Logs}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};