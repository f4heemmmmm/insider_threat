// frontend/src/app/page.tsx - Main Page (Dashboard)

"use client";

import React, { JSX, useEffect, useState } from "react";

// Types
import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";
import { DashboardData } from "@/types/dashboard.types";

// Services
import { AlertService } from "@/services/alert.service";
import { IncidentService } from "@/services/incident.service";
import { DashboardService } from "@/services/dashboard.service";
import { TimelineData, AlertsByMITRETacticData, AlertsByMITRETechniqueData, ScoreDistributionData, AnalyticsService } from "@/services/analytics.service";

// Components and Charts
import { DataCard } from "@/components/dashboard/DataCard";
import { TimelineChart } from "@/components/charts/TimelineChart";
import { DigitalClock } from "@/components/dashboard/DigitalClock";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { RecentAlertsTable } from "@/components/dashboard/RecentAlertsTable";
import { RecentIncidentsTable } from "@/components/dashboard/RecentIncidentsTable";
import { ScoreDistributionChart } from "@/components/charts/ScoreDistributionChart";
import { MITRETacticsDistributionChart } from "@/components/charts/MITRETacticsDistributionChart";

export default function Home(): JSX.Element {
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
    }, []);

    // Basic statistics
    const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
    const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
    const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
    const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
    const [statisticsData, setStatisticsData] = useState<DashboardData | null>(null);

    // Chart data statistics
    const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
    const [MITRETacticData, setMITRETacticData] = useState<AlertsByMITRETacticData[]>([]);
    const [MITRETechniqueData, setMITRETechniqueData] = useState<AlertsByMITRETechniqueData[]>([]);
    const [scoreDistributionData, setScoreDistributionData] = useState<ScoreDistributionData[]>([]);

    // Date Ranges (for Date Range Picker)
    const [startDate, setStartDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);  // Default to last 1 week
        return date;
    });
    const [endDate, setEndDate] = useState<Date>(new Date());

    // Loading States
    const [loading, setLoading] = useState<boolean>(true);
    const [chartsLoading, setChartsLoading] = useState<boolean>(true);

    // Fetch the basic dashboard data
    const fetchDashboardData = async (): Promise<void> => {
        try {
            setLoading(true);
            const [dashboardStats, alertsResponse, incidentsResponse, allAlerts, allIncidents] = await Promise.all([
                DashboardService.getData(),
                AlertService.getAlerts(100),
                IncidentService.getIncidents(100),
                AlertService.getAllAlerts("alert_name", "asc"),
                IncidentService.getAllIncidents("score", "desc"),
            ]);
            setAllAlerts(allAlerts);
            setAllIncidents(allIncidents);
            setStatisticsData(dashboardStats);
            setRecentAlerts(alertsResponse.alerts);
            setRecentIncidents(incidentsResponse.incidents);
            
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch chart data
    const fetchChartData = async (): Promise<void> => {
        try {
            setChartsLoading(true);
            const [timeline, MITRETactic, MITRETechnique, alertsScoreDistribution] = await Promise.all([
                AnalyticsService.getTimeline(startDate, endDate, "day"),
                AnalyticsService.getTopMITRETactics(),
                AnalyticsService.getTopMITRETechniques(),
                AnalyticsService.getScoreDistribution(),
            ]);
            setTimelineData(timeline);
            setMITRETacticData(MITRETactic);
            setMITRETechniqueData(MITRETechnique);
            setScoreDistributionData(alertsScoreDistribution);
        } catch (error) {
            console.error("Error fetching chart data:", error);
        } finally {
            setChartsLoading(false);
        }
    };

    // Handle date range changes
    const handlePresetSelect = (days: number): void => {
        const newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - days);
        setStartDate(newStartDate);
        setEndDate(new Date());
    }

    // Initial data fetch
    useEffect(() => {
        fetchDashboardData();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // Refetch chart data when date range changes
    useEffect(() => {
        fetchChartData();
    }, [startDate, endDate]);

    // Calculate additional metrics
    const alertsUnderIncident: number = allAlerts.filter(alert => alert.isUnderIncident).length;
    const alertsPercentageUnderIncident: string = allAlerts.length > 0
        ? ((alertsUnderIncident / allAlerts.length) * 100).toFixed(2)
        : "0";

    // Critical Severity Incidents (score >= 9)
    const criticalSeverityIncidents: number = allIncidents.filter(incident => incident.score >= 9).length;

    if (loading) {
        return (
            <div className = "flex h-screen w-full items-center justify-center bg-gray-100">
                <div className = "text-center">
                    <div className = "inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent" />
                    <p className = "mt-4 text-lg font-semibold text-gray-700"> Loading dashboard... </p>
                </div>
            </div>
        );
    }

    return (
        <div className = "flex min-h-screen flex-col">
            {/* MAIN CONTENT */}
            <div className = "flex-1 overflow-auto p-10">
                {/* HEADER  */}
                <div className = "mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
                    {/* TITLE */}
                    <h1 className = "text-3xl font-semibold text-blue-900 md:text-4xl lg:text-4xl">
                        Insider Threat Dashboard
                    </h1>
                    {/* FILTERS */}
                    <div className = "mt-4 sm:mt-0">
                        <DateRangePicker
                            startDate = {startDate}
                            endDate = {endDate}
                            onStartDateChange = {setStartDate}
                            onEndDateChange = {setEndDate}
                            onPresetSelect = {handlePresetSelect}
                        />
                    </div>
                </div>

                {/* GRID LAYOUT */}
                <div className = "mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className = "grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* DATA CARD: TOTAL ALERTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg hover:scale-105 duration-300" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Total Alerts"
                                value = {allAlerts.length || 0}
                                href = "/alerts"
                                className = "bg-transparent"
                            />
                        </div>
                        {/* DATA CARD: TOTAL INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg hover:scale-105 duration-300" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Total Incidents"
                                value = {allIncidents.length || 0}
                                href = "/incidents"
                                className = "bg-transparent"
                            />
                        </div>
                        {/* DATA CARD: CRITICAL SEVERITY INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Critical Severity Incidents"
                                value = {criticalSeverityIncidents}
                                className = "bg-transparent"
                            />
                        </div>
                        {/* DATA CARD: PERCENTAGE OF ALERTS RELATED TO INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Alerts Related to Incidents"
                                value = {parseFloat(alertsPercentageUnderIncident)}
                                suffix = "%"
                                className = "bg-transparent"
                            />
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className = "col-span-1 rounded-lg bg-white p-6 shadow-md md:col-span-2 lg:col-span-2" style = {{ height: "500px" }}>
                        <h3 className = "mb-4 text-xl font-light text-gray-800"> Trend of Alerts and Incidents </h3>
                        {chartsLoading ? (
                            <div className = "flex h-[480px] w-full items-center justify-center">
                                <div className = "inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent" />
                            </div>
                        ) : (
                            <div className = "pr-4" style = {{ height: "350px", width: "100%"}}>
                                <TimelineChart data = {timelineData} height = {420} />
                            </div>
                        )}
                    </div>
                </div>

                <div className = "grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                    {/* RECENT INCIDENTS TABLE */}
                    <RecentIncidentsTable loading = {loading} recentIncidents = {recentIncidents} />
                    {/* MITRE TACTIC CHART */}
                    <div className = "col-span-1 rounded-lg bg-white p-6 shadow-md">
                        <h3 className = "mb-4 text-xl font-light text-gray-800"> MITRE Tactics Distribution (Alerts) </h3>
                        <div className = "p-2">
                            {chartsLoading ? (
                                <div className = "flex h-[480px] w-full items-center justify-center">
                                    <div className = "inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent" />
                                </div>
                            ) : (
                                <MITRETacticsDistributionChart data = {MITRETacticData} height = {300} type = "pie" />
                            )}
                        </div>
                    </div>
                </div>

                <div className = "grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* SCORE DISTRIBUTION TABLE */}
                    <div className = "col-span-1 rounded-lg bg-white p-6 shadow-md">
                        <h3 className = "mb-4 text-xl font-light text-gray-800"> Score Distribution of Alerts and Incidents </h3>
                        <div className = "p-2">
                            {chartsLoading ? (
                                <div className = "flex h-[480px] w-full items-center justify-center">
                                    <div className = "inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent" />
                                </div>
                            ) : (
                                <ScoreDistributionChart data = {scoreDistributionData} height = {400} />
                            )}
                        </div>
                    </div>
                    {/* RECENT ALERTS */}
                    <RecentAlertsTable loading = {loading} recentAlerts = {recentAlerts} />
                </div>

                <div className = "mt-6 p-4 text-center text-sm">
                    <div className = "flex flex-col md:flex-row justify-between items-center px-4">
                        <p className = "text-gray-500">
                            Showing data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                        </p>
                        <div className = "flex items-center mt-2 md:mt-0">
                            <p className = "text-gray-500 mr-2"> Current Time: </p>
                            <DigitalClock />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};