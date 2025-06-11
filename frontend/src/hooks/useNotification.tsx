// frontend/src/hooks/useNotification.tsx

"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { NotificationContainer, NotificationProps, NotificationType } from "@/components/ui/Notification";

interface NotificationWithId extends NotificationProps {
    id: string;
}

interface NotificationContextType {
    notifications: NotificationWithId[];
    addNotification: (notification: Omit<NotificationProps, "id" | "onClose">) => string;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
    showSuccess: (message: string, title?: string, options?: Partial<NotificationProps>) => string;
    showError: (message: string, title?: string, options?: Partial<NotificationProps>) => string;
    showWarning: (message: string, title?: string, options?: Partial<NotificationProps>) => string;
    showInfo: (message: string, title?: string, options?: Partial<NotificationProps>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
    maxNotifications?: number;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

/**
 * NotificationProvider component that manages global notification state.
 * 
 * Features:
 * - Global notification management with context
 * - Automatic notification cleanup and limits
 * - Convenient helper methods for different notification types
 * - Configurable positioning and behavior
 * - Memory leak prevention with proper cleanup
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    maxNotifications = 5,
    position = "top-right",
}) => {
    const [notifications, setNotifications] = useState<NotificationWithId[]>([]);

    const generateId = useCallback(() => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const addNotification = useCallback((notification: Omit<NotificationProps, "id" | "onClose">) => {
        const id = generateId();
        const newNotification: NotificationWithId = {
            ...notification,
            id,
        };

        setNotifications(prev => {
            const updated = [newNotification, ...prev];
            // Limit the number of notifications
            return updated.slice(0, maxNotifications);
        });

        return id;
    }, [generateId, maxNotifications]);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const showSuccess = useCallback((
        message: string, 
        title?: string, 
        options?: Partial<NotificationProps>
    ) => {
        return addNotification({
            type: "success",
            message,
            title: title || "Success",
            duration: 4000,
            autoClose: true,
            ...options,
        });
    }, [addNotification]);

    const showError = useCallback((
        message: string, 
        title?: string, 
        options?: Partial<NotificationProps>
    ) => {
        return addNotification({
            type: "error",
            message,
            title: title || "Error",
            duration: 6000, // Errors stay longer
            autoClose: true,
            ...options,
        });
    }, [addNotification]);

    const showWarning = useCallback((
        message: string, 
        title?: string, 
        options?: Partial<NotificationProps>
    ) => {
        return addNotification({
            type: "warning",
            message,
            title: title || "Warning",
            duration: 5000,
            autoClose: true,
            ...options,
        });
    }, [addNotification]);

    const showInfo = useCallback((
        message: string, 
        title?: string, 
        options?: Partial<NotificationProps>
    ) => {
        return addNotification({
            type: "info",
            message,
            title: title || "Information",
            duration: 4000,
            autoClose: true,
            ...options,
        });
    }, [addNotification]);

    const contextValue: NotificationContextType = {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
                position={position}
            />
        </NotificationContext.Provider>
    );
};

/**
 * Hook to access notification functionality throughout the application.
 * 
 * Provides convenient methods for displaying different types of notifications:
 * - showSuccess: For successful operations
 * - showError: For error messages
 * - showWarning: For warning messages
 * - showInfo: For informational messages
 * 
 * Also provides access to notification management:
 * - addNotification: Add custom notification
 * - removeNotification: Remove specific notification
 * - clearAllNotifications: Clear all notifications
 */
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    
    return context;
};