// frontend/src/components/ui/alert-modal-elements/AlertLogs.tsx
import React from "react";
import { FileText } from "lucide-react";

interface AlertLogsProps {
    logs: string;
}

export const AlertLogs: React.FC<AlertLogsProps> = ({ logs }) => {
    return (
        <div>
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                <FileText className = "h-4 w-4 mr-2 text-indigo-600" />
                Logs
            </h4>
            <div className = "bg-blue-950 p-4 rounded-md border border-gray-200 shadow-sm font-mono">
                <span> {logs} </span>
            </div>
        </div>
    );
};