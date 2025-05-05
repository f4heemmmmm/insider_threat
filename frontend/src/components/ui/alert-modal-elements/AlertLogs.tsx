// src/components/ui/alert-modal-elements/AlertLogs.tsx
import React from 'react';
import { FileText } from 'lucide-react';

interface AlertLogsProps {
  logs: string;
}

const AlertLogs: React.FC<AlertLogsProps> = ({ logs }) => {
  return (
    <div className="px-6 pb-6">
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
        <FileText className="h-4 w-4 mr-2 text-indigo-600" />
        Logs
      </h4>
      <div className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto font-mono text-sm shadow-inner">
        <pre className="whitespace-pre-wrap">{logs}</pre>
      </div>
    </div>
  );
};

export default AlertLogs;