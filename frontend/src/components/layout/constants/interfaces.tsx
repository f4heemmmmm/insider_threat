export interface MainContentProps {
    children: React.ReactNode;
}

export interface SidebarContextType {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    isMobile: boolean;
}