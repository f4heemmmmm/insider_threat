// frontend/src/components/dashboard/constants/functions.tsx

/**
 * Stores all the interfaces for the props needed for the dashboard's main page
 * Include props for:
 *      - DataCard.tsx
 *      - DateRangePicker.tsx
 *      - RecentIncidentsTable.tsx
 */

import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";

// DataCard.tsx
export interface DataCardProps {
    title: string;
    value: number;
    suffix?: string;
    href?: string;
    className?: string;
}

// DateRangePicker.tsx
export interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    onPresetSelect: (days: number) => void;
}

// RecentIncidentsTable.tsx
export interface RecentIncidentsTableProps {
    loading: boolean;
    recentIncidents: Incident[];
}

export interface IncidentWithAlertCount extends Incident {
    alertCount?: number;
}

// RecentAlertsTable.tsx
export interface RecentAlertsTableProps {
    loading: boolean;
    recentAlerts: Alert[];
}