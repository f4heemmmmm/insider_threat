// src/components/dashboard/IncidentsTable.tsx
import React from 'react';
import Link from 'next/link';
import { Incident } from '../../types/incident.types';
import { StatusBadge } from '../ui/StatusBadge';

interface IncidentsTableProps {
  incidents: Incident[];
  loading?: boolean;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({ incidents, loading = false }) => {
  const getScoreSeverity = (score: number) => {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  if (loading) {
    return <div className="text-center py-4">Loading incidents...</div>;
  }

  if (incidents.length === 0) {
    return <div className="text-center py-4 text-gray-500">No incidents found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Window
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incidents.map((incident) => (
            <tr key={incident.ID} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{incident.user}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(incident.windows_start).toLocaleString()} - 
                  {new Date(incident.windows_end).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={getScoreSeverity(incident.score)} />
                <span className="ml-2 text-sm text-gray-500">{incident.score}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(incident.created_at).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link 
                  href={`/incidents/${incident.ID}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

