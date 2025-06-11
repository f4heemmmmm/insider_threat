// frontend/src/components/ui/Notification.tsx

"use client";

import React, { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps {
    id?: string;
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    onClose?: () => void;
    autoClose?: boolean;
    className?: string;
}

/**
 * Notification component for displaying user feedback messages.
 * 
 * Features:
 * - Multiple notification types (success, error, warning, info)
 * - Auto-dismiss functionality with customizable duration
 * - Manual close option with smooth animations
 * - Accessible design with proper ARIA attributes
 * - Consistent styling with the application theme
 */
export const Notification: React.FC<NotificationProps> = ({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose,
    autoClose = true,
    className = "",
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (autoClose && duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300); // Allow animation to complete
    };

    const getNotificationConfig = () => {
        switch (type) {
            case "success":
                return {
                    icon: CheckCircle,
                    bgColor: "bg-green-900/90",
                    borderColor: "border-green-500",
                    iconColor: "text-green-400",
                    titleColor: "text-green-300",
                    messageColor: "text-green-200",
                };
            case "error":
                return {
                    icon: AlertCircle,
                    bgColor: "bg-red-900/90",
                    borderColor: "border-red-500",
                    iconColor: "text-red-400",
                    titleColor: "text-red-300",
                    messageColor: "text-red-200",
                };
            case "warning":
                return {
                    icon: AlertTriangle,
                    bgColor: "bg-yellow-900/90",
                    borderColor: "border-yellow-500",
                    iconColor: "text-yellow-400",
                    titleColor: "text-yellow-300",
                    messageColor: "text-yellow-200",
                };
            case "info":
                return {
                    icon: Info,
                    bgColor: "bg-blue-900/90",
                    borderColor: "border-blue-500",
                    iconColor: "text-blue-400",
                    titleColor: "text-blue-300",
                    messageColor: "text-blue-200",
                };
            default:
                return {
                    icon: Info,
                    bgColor: "bg-gray-900/90",
                    borderColor: "border-gray-500",
                    iconColor: "text-gray-400",
                    titleColor: "text-gray-300",
                    messageColor: "text-gray-200",
                };
        }
    };

    if (!isVisible) return null;

    const config = getNotificationConfig();
    const IconComponent = config.icon;

    return (
        <div
            className={`
                ${config.bgColor} ${config.borderColor} backdrop-blur-md
                border-l-4 p-4 rounded-lg shadow-2xl max-w-md
                transform transition-all duration-300 ease-in-out
                ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
                ${className}
            `}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
                            {title}
                        </h3>
                    )}
                    <p className={`text-sm ${config.messageColor}`}>
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        type="button"
                        className={`
                            inline-flex rounded-md p-1.5 transition-colors duration-200
                            ${config.iconColor} hover:bg-white/10 focus:outline-none 
                            focus:ring-2 focus:ring-white/20
                        `}
                        onClick={handleClose}
                        aria-label="Close notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Notification Container for managing multiple notifications
export interface NotificationContainerProps {
    notifications: (NotificationProps & { id: string })[];
    onRemove: (id: string) => void;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    onRemove,
    position = "top-right",
}) => {
    const getPositionClasses = () => {
        switch (position) {
            case "top-right":
                return "top-4 right-4";
            case "top-left":
                return "top-4 left-4";
            case "bottom-right":
                return "bottom-4 right-4";
            case "bottom-left":
                return "bottom-4 left-4";
            case "top-center":
                return "top-4 left-1/2 transform -translate-x-1/2";
            case "bottom-center":
                return "bottom-4 left-1/2 transform -translate-x-1/2";
            default:
                return "top-4 right-4";
        }
    };

    return (
        <div className={`fixed z-50 ${getPositionClasses()}`}>
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        onClose={() => onRemove(notification.id)}
                    />
                ))}
            </div>
        </div>
    );
};