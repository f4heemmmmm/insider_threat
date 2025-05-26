import { Alert } from "@/types/alert.types";

export interface AlertProps {
    alert: Alert;
}

// AlertModal.tsx
export interface AlertModalProps {
    alert: Alert | null;
    open: boolean;
    onClose: () => void;
    expandedEvidenceSection: Record<string, boolean>;
    toggleEvidenceSection: (alertID: string, sectionName: string) => void;
}

// RawEventsDisplay.tsx
export interface AppAccessContext {
    // Common attributes under AppAccessContext
    AADSessionId?: string;
    ClientAppId?: string;
    ClientAppName?: string;
    CorrelationId?: string;
    UniqueTokenId?: string;
    // Generalized attribute format
    [key: string]: any;
}

export interface SharePointEvent {
    // Common attributes under SharePointEvent
    AppAccessContext?: AppAccessContext;
    ApplicationDisplayName?: string;
    ApplicationId?: string;
    AuthenticationType?: string;
    BrowserName?: string;
    BrowserVersion?: string;
    ClientIP?: string;
    CorrelationId?: string;
    CreationTime?: string;
    Operation?: string;
    UserId?: string;
    SourceFileName?: string;
    SiteUrl?: string;
    // Generalized attribute format
    [key: string]: any;
}

export interface IndexedSharePointEvent extends SharePointEvent {
    _originalIndex: number;
}

export interface RawEventsDisplayProps {
    rawEvents: any[] | any | string | null | undefined;
}

export interface ExtendedRawEventsDisplayProps extends RawEventsDisplayProps {
    resetScroll: boolean;
}

// AlertLogs.tsx
export interface AlertLogsProps {
    logs: string;
}

// AlertEvidence.tsx
export interface AlertEvidenceProps {
    alert: Alert;
    expandedEvidenceSection: Record<string, boolean>;
    toggleEvidenceSection: (alertID: string, sectionName: string) => void;
}

// EventsList.tsx
export interface EventsListProps {
    filteredEvents: IndexedSharePointEvent[];
}

// AlertRawEvents.tsx
export interface AlertRawEventsProps {
    evidence: any;
    alertID: string;
    expandedEvidenceSection: Record<string, boolean>;
    toggleEvidenceSection: (alertID: string, sectionName: string) => void;
}