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
import { AnalyticsService } from "@/services/analytics.service";
import { DashboardService } from "@/services/dashboard.service";
import { TimelineData, AlertsByMITRETacticData, AlertsByMITRETechniqueData, ScoreDistributionData } from "@/services/constants/interfaces";

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
        date.setDate(date.getDate() - 7);  // Temporary default, will be updated after data loads
        return date;
    });
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [earliestIncidentDate, setEarliestIncidentDate] = useState<Date | undefined>();
    const [isDateRangeFiltered, setIsDateRangeFiltered] = useState<boolean>(false);

    // Loading States
    const [loading, setLoading] = useState<boolean>(true);
    const [chartsLoading, setChartsLoading] = useState<boolean>(true);

    // Helper function to find the earliest incident date
    const findEarliestIncidentDate = (incidents: Incident[]): Date | null => {
        if (incidents.length === 0) return null;
        
        // Find the earliest date among both windows_start and windows_end
        const allDates = incidents.flatMap(incident => [
            new Date(incident.windows_start),
            new Date(incident.windows_end)
        ]);
        
        const earliestDate = new Date(Math.min(...allDates.map(date => date.getTime())));
        
        // Set the time to the beginning of the day to avoid timezone issues
        earliestDate.setHours(0, 0, 0, 0);
        
        return earliestDate;
    };

    // Helper function to filter incidents by date range
    const filterIncidentsByDateRange = (incidents: Incident[], startDate: Date, endDate: Date): Incident[] => {
        return incidents.filter(incident => {
            const incidentStartDate = new Date(incident.windows_start);
            const incidentEndDate = new Date(incident.windows_end);
            
            // Check if the incident overlaps with the selected date range
            // An incident is included if it starts before the end date and ends after the start date
            return incidentStartDate <= endDate && incidentEndDate >= startDate;
        });
    };

    // Helper function to get date range text for display
    const getDateRangeText = (startDate: Date, endDate: Date): string => {
        const formatDate = (date: Date): string => {
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };
        return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    };

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
            
            // Find and set the earliest incident date
            const earliestDate = findEarliestIncidentDate(allIncidents);
            if (earliestDate) {
                setEarliestIncidentDate(earliestDate);
                // Update the start date to be the earliest incident date
                setStartDate(earliestDate);
                // Since we're setting to earliest date on load, consider this as "default" not filtered
                setIsDateRangeFiltered(false);
            }
            
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
        
        // Ensure the new start date is not before the earliest incident date
        if (earliestIncidentDate && newStartDate < earliestIncidentDate) {
            setStartDate(earliestIncidentDate);
        } else {
            setStartDate(newStartDate);
        }
        setEndDate(new Date());
        // Mark as filtered since user actively selected a preset
        setIsDateRangeFiltered(true);
    }

    // Handle manual date changes
    const handleStartDateChange = (date: Date): void => {
        setStartDate(date);
        // Mark as filtered if the date is different from earliest incident date
        setIsDateRangeFiltered(earliestIncidentDate ? date.getTime() !== earliestIncidentDate.getTime() : true);
    };

    const handleEndDateChange = (date: Date): void => {
        setEndDate(date);
        // Mark as filtered if the end date is not today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        setIsDateRangeFiltered(selectedDate.getTime() !== today.getTime() || isDateRangeFiltered);
    };

    // Handle reset to default (earliest incident date to today)
    const handleResetDateRange = (): void => {
        if (earliestIncidentDate) {
            setStartDate(earliestIncidentDate);
            setEndDate(new Date());
            setIsDateRangeFiltered(false); // Reset to default state
        }
    };

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

    // Calculate additional metrics (filtered by date range if applicable)
    const filteredIncidents = isDateRangeFiltered ? filterIncidentsByDateRange(allIncidents, startDate, endDate) : allIncidents;
    const filteredAlerts = allAlerts.filter(alert => alert.is_under_incident);
    
    const alertsUnderIncident: number = filteredAlerts.length;
    const alertsPercentageUnderIncident: string = allAlerts.length > 0
        ? ((alertsUnderIncident / allAlerts.length) * 100).toFixed(2)
        : "0";

    // Calculate severity metrics from filtered incidents
    const lowSeverityIncidents: number = filteredIncidents.filter(incident => incident.score >= 0 && incident.score <= 3).length;
    const mediumSeverityIncidents: number = filteredIncidents.filter(incident => incident.score >= 4 && incident.score <= 7).length;
    const highSeverityIncidents: number = filteredIncidents.filter(incident => incident.score >= 8 && incident.score <= 10).length;

    // Generate dynamic titles for data cards with better formatting
    const getDataCardTitle = (baseTitle: string): string => {
        return baseTitle; // Return just the base title
    };

    // Generate subtitle with date range for data cards
    const getDataCardSubtitle = (): string | undefined => {
        if (!isDateRangeFiltered) {
            return undefined; // No subtitle for default state
        }
        return getDateRangeText(startDate, endDate);
    };

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
                            onStartDateChange = {handleStartDateChange}
                            onEndDateChange = {handleEndDateChange}
                            onPresetSelect = {handlePresetSelect}
                            onReset = {handleResetDateRange}
                            earliestDate = {earliestIncidentDate}
                        />
                    </div>
                </div>

                {/* GRID LAYOUT */}
                <div className = "mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className = "grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* DATA CARD: TOTAL INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg hover:scale-105 duration-300" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Total Incidents"
                                subtitle = {getDataCardSubtitle()}
                                value = {filteredIncidents.length || 0}
                                href = "/incidents"
                                className = "bg-transparent"
                            />
                        </div>
                        {/* DATA CARD: LOW SEVERITY INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Low Severity Incidents"
                                subtitle = {getDataCardSubtitle()}
                                value = {lowSeverityIncidents}
                                className = "bg-transparent"
                            />
                        </div>
                        {/* DATA CARD: MEDIUM SEVERITY INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all" style = {{ height: "240px" }}>
                            <DataCard
                                title = "Medium Severity Incidents"
                                subtitle = {getDataCardSubtitle()}
                                value = {mediumSeverityIncidents}
                                className = "bg-transparent"
                            />
                        </div>
                        {/* DATA CARD: HIGH SEVERITY INCIDENTS */}
                        <div className = "rounded-lg bg-white p-6 shadow-md transition-all" style = {{ height: "240px" }}>
                            <DataCard
                                title = "High Severity Incidents"
                                subtitle = {getDataCardSubtitle()}
                                value = {highSeverityIncidents}
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
                    <RecentIncidentsTable 
                        loading = {loading} 
                        recentIncidents = {recentIncidents}
                        startDate = {startDate}
                        endDate = {endDate}
                        isFiltered = {isDateRangeFiltered}
                    />
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
                            Showing incidents from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
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