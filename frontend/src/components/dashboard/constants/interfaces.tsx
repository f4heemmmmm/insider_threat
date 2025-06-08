// frontend/src/components/dashboard/constants/interfaces.tsx

/**
 * Stores all the interfaces for the props needed for the dashboard's main page
 * Include props for:
 *      - DataCard.tsx
 *      - DateRangePicker.tsx
 *      - RecentIncidentsTable.tsx
 *      - RecentAlertsTable.tsx
 */
import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";

// RecentAlertsTable.tsx
export interface RecentAlertsTableProps {
    loading: boolean;
    recentAlerts: Alert[];
    startDate?: Date;
    endDate?: Date;
    isFiltered?: boolean;
}

// RecentIncidentsTable.tsx
export interface RecentIncidentsTableProps {
    loading: boolean;
    recentIncidents: IncidentWithAlertCount[];
    startDate?: Date;
    endDate?: Date;
    isFiltered?: boolean;
}

// Extended Incident interface with alert count
export interface IncidentWithAlertCount extends Incident {
    alertCount?: number;
}

// DataCard.tsx
export interface DataCardProps {
    title: string;
    value: number;
    suffix?: string;
    href?: string;
    subtitle?: string;
    className?: string;
}

// DateRangePicker.tsx
export interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    onPresetSelect: (days: number) => void;
    onReset?: () => void;
    earliestDate?: Date;
}