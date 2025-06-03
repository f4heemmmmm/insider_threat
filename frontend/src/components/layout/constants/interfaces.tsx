// frontend/src/components/layout/constants/interfaces.tsx

import { ReactNode, createContext } from "react";

// AuthenticatedLayout.tsx
export interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

// MainContent.tsx
export interface MainContentProps {
    children: React.ReactNode;
}

// SidebarContext.tsx
export interface SidebarContextType {
    isExpanded: boolean;
    toggleSidebar: () => void;
    expandSidebar: () => void;
    collapseSidebar: () => void;
    expanded: boolean;
    isMobile: boolean;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export interface SidebarProviderProps {
    children: ReactNode;
}

// Sidebar.tsx
/**
 * SVG Icon Components for Navigation
 * These components provide consistent iconography throughout the sidebar
 * with both outline and solid variants for active/inactive states.
 */
export const HomeIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ArrowRightOnRectangleIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M15 19l-7-7 7-7" />
    </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M9 5l7 7-7 7" />
    </svg>
);

export const ShieldExclamationIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "none" viewBox = "0 0 24 24" stroke = "currentColor">
        <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
    </svg>
);

export const HomeSolidIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "currentColor" viewBox = "0 0 24 24">
        <path d = "M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d = "M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
);

export const ExclamationTriangleSolidIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "currentColor" viewBox = "0 0 24 24">
        <path fillRule="evenodd" d = "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);

export const ShieldExclamationSolidIcon = ({ className }: { className?: string }) => (
    <svg className = {className} fill = "currentColor" viewBox = "0 0 24 24">
        <path fillRule="evenodd" d = "M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 01.722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM12 15a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H12z" clipRule="evenodd" />
    </svg>
);

export interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    solidIcon: React.ComponentType<{ className?: string }>;
}