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
