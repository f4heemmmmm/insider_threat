// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { DashboardService } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { IncidentService } from '../services/incident.service';
import { StatCard } from '../components/ui/StatCard';
import { AlertsTable } from '@/components/ui/AlertsTable';
import { DashboardStats } from '../types/dashboard.types';
import { Alert } from '../types/alert.types';
import { Incident } from '../types/incident.types';

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, alertsResponse, incidentsResponse] = await Promise.all([
          DashboardService.getStats(),
          AlertService.getAlerts(5), // Get 5 most recent alerts
          IncidentService.getIncidents(5), // Get 5 most recent incidents
        ]);

        setStats(dashboardStats);
        setRecentAlerts(alertsResponse.alerts);
        setRecentIncidents(incidentsResponse.incidents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Insider Threat Monitoring Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Alerts"
          value={stats?.totalAlerts || 0}
          description="All detected security alerts"
          href="/alerts"
        />
        <StatCard
          title="Total Incidents"
          value={stats?.totalIncidents || 0}
          description="Security incidents under investigation"
          href="/incidents"
        />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Alerts</h2>
        </div>
        <div className="px-6 py-4">
          <AlertsTable alerts={recentAlerts} />
          {recentAlerts.length > 0 && (
            <div className="mt-4 text-right">
              <a href="/alerts" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all alerts
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

