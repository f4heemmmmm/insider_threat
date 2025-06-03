// src/hooks/useAnalytics.ts

import { useState, useEffect } from "react";
import { AnalyticsService } from "@/services/analytics.service";
import { TrendData, TimelineData, AlertsByUserData, ScoreDistributionData, AlertsByMITRETacticData } from "@/services/constants/interfaces";

/**
 * Custom React hook for managing analytics data fetching and state management.
 * Provides comprehensive analytics data including timeline, MITRE tactics, user activity,
 * score distribution, and trend analysis within a specified date range.
 * @param startDate - The start date for analytics data filtering
 * @param endDate - The end date for analytics data filtering
 * @returns Object containing analytics data states, loading state, error state, and refetch function
 */
export const useAnalytics = (startDate: Date, endDate: Date) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trendData, setTrendData] = useState<TrendData[]>([]);
    const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
    const [userActivityData, setUserActivityData] = useState<AlertsByUserData[]>([]);
    const [MITRETacticData, setMITRETacticData] = useState<AlertsByMITRETacticData[]>([]);
    const [scoreDistributionData, setScoreDistributionData] = useState<ScoreDistributionData[]>([]);
    
    /**
     * Fetches all analytics data concurrently from the AnalyticsService.
     * Handles loading states and error management for the data fetching process.
     */
    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [timeline, MITRETactic, userActivity, scoreDistribution, trends] = await Promise.all([
                AnalyticsService.getTimeline(startDate, endDate, "day"),
                AnalyticsService.getAlertsByMITRETactic(),
                AnalyticsService.getAlertsByUser(10),
                AnalyticsService.getScoreDistribution(),
                AnalyticsService.getTrends(startDate, endDate, "week"),
            ]);

            setTimelineData(timeline);
            setMITRETacticData(MITRETactic);
            setUserActivityData(userActivity);
            setScoreDistributionData(scoreDistribution);
            setTrendData(trends);
        } catch (err) {
            console.error("Error fetching analytics data:", err);
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [startDate, endDate]);

    return {
        timelineData,
        MITRETacticData, 
        userActivityData,
        scoreDistributionData,
        trendData,
        loading,
        error,
        refetch: fetchAnalyticsData,
    };
};