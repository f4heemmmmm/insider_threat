// frontend/src/components/charts/interfaces.tsx

import { AlertsByMITRETacticData, ScoreDistributionData, TimelineData } from "@/services/constants/interfaces";

export interface MITRETacticsChartProps {
    data: AlertsByMITRETacticData[];
    type?: "bar" | "pie";
    height?: number;
    showTitle?: boolean;
};

export const CHARTCOLORS = [
    '#3B5998',
    '#8B0000',
    '#1E4D2B',
    '#B8860B',
    '#4B0082',
    '#005F73',
    '#A0522D',
    '#4169E1',
    '#C71585',
    '#3A3A3C',
];

export interface ScoreDistributionChartProps {
    data: ScoreDistributionData[],
    height?: number;
    showTitle?: boolean;
};

export interface TimelineChartProps {
    data: TimelineData[],
    height?: number,
    showTitle?: boolean,
    title?: string,
};