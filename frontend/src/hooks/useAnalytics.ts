// src/hooks/useAnalytics.ts
import { useState, useEffect } from 'react';
import { AnalyticsService, TimelineData, AlertsByMitreData, AlertsByUserData, ScoreDistributionData, TrendData } from '../services/analytics.service';

export const useAnalytics = (startDate: Date, endDate: Date) => {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [mitreData, setMitreData] = useState<AlertsByMitreData[]>([]);
  const [userActivityData, setUserActivityData] = useState<AlertsByUserData[]>([]);
  const [scoreDistributionData, setScoreDistributionData] = useState<ScoreDistributionData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [timeline, mitre, userActivity, scoreDistribution, trends] = await Promise.all([
        AnalyticsService.getTimeline(startDate, endDate, 'day'),
        AnalyticsService.getAlertsByMitre(),
        AnalyticsService.getAlertsByUser(10),
        AnalyticsService.getScoreDistribution(),
        AnalyticsService.getTrends(startDate, endDate, 'week'),
      ]);

      setTimelineData(timeline);
      setMitreData(mitre);
      setUserActivityData(userActivity);
      setScoreDistributionData(scoreDistribution);
      setTrendData(trends);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate]);

  return {
    timelineData,
    mitreData,
    userActivityData,
    scoreDistributionData,
    trendData,
    loading,
    error,
    refetch: fetchAnalyticsData,
  };
};