// frontend/src/components/alerts/id/AlertLogs.tsx

import { FileText } from "lucide-react";
import { AlertLogsProps } from "../constants/interfaces";

export const AlertLogs: React.FC<AlertLogsProps> = ({ logs }) => {
    return (
        <div>
            <h4 className = "text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <FileText className = "h-4 w-4 mr-2 text-indigo-600" />
                Logs
            </h4>
            <div className = "bg-blue-950 text-gray-50 p-4 rounded-md border border-gray-200 shadow-sm font-mono">
                <span> {logs} </span>
            </div>
        </div>
    );
};