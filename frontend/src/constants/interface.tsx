import { Alert } from "@/types/alert.types";

export interface AlertProps {
    alert: Alert;
}

// Alert Modal Prop -> src/components/ui/AlertModal.tsx
export interface AlertModalProps {
    alert: Alert | null;
    open: boolean;
    onClose: () => void;
    expandedEvidenceSection: Record<string, boolean>;
    toggleEvidenceSection: (alertID: string, sectionName: string) => void;
}

// AppAccessContext -> src/components/ui/RawEventsDisplay.tsx
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

// SharePointEvent -> src/compoonents/ui/RawEventsDisplay.tsx
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

// Indexed Events Interface (for preserving original positions of events) -> src/compoonents/ui/RawEventsDisplay.tsx
export interface IndexedSharePointEvent extends SharePointEvent {
    _originalIndex: number;
}

export interface RawEventsDisplayProps {
    rawEvents: any[] | any | string | null | undefined;
}

