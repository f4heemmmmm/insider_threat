// frontend/src/components/ui/constants/interfaces.tsx

// Badge.tsx
export interface BadgeProps {
    variant?: "default" | "outline";
    className?: string;
    children: React.ReactNode;
}

// StatusBadge.tsx
export interface StatusBadgeProps {
    status: "low" | "medium" | "high" | "critical" | "unknown";
    className?: string;
}