// frontend/src/components/incident-main-page/IncidentCard.tsx

import { StatusBadge } from "../ui/StatusBadge";
import { formatDate } from "@/constants/functions";
import { getScoreSeverityMapping, formatDuration } from "./constants/functions";

import { Alert } from "@/types/alert.types";
import { Incident } from "@/types/incident.types";

interface IncidentCardProps {
    incident: Incident;
    alerts: Alert[];
    onClick: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({incident, alerts = [], onClick }) => {
    const severityMap = getScoreSeverityMapping(incident.score);

    return (
        <div className = "border border-gray-200 rounded-lg mb-8 overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer" onClick = {onClick}>
            {/* HEADER */}
            <div className = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className = "font-mono text-sm font-medium flex flex-row gap-2">
                    <p className = "text-gray-900">
                        Incident No:
                    </p>
                    <p className = "text-blue-700 font-light">
                        {incident.ID}
                    </p>
                </div>
                <div className = "flex items-center space-x-2">
                    <StatusBadge status = {severityMap.status} />
                </div>
            </div>

            {/* INCIDENT DETAILS */}
            <div className = "p-5 grid grid-cols-12 gap-3">
                {/* SCORE */}
                <div className = "col-span-12 sm:col-span-1">
                    <div className = "text-xs font-semibold text-gray-700 mb-2"> Score </div>
                    <div className = "text-gray-600 text-2xl font-thin">
                        {incident.score}
                        <span className = "text-xs font-semibold text-gray-700">/10</span>
                    </div>
                </div>

                {/* RELATED ALERTS */}
                <div className = "col-span-12 sm:col-span-3">
                    <div className = "flex justify-between items-center mb-3">
                        <div className = "text-sm font-semibold text-gray-700"> Related Alerts ({alerts.length}) </div>
                    </div>
                    <div className = "space-y-2.5 max-h-32 overflow-y-auto pr-2">
                        {alerts.length === 0 ? (
                            <div className = "text-sm font-semibold text-gray-500 italic"> No related alerts </div>
                        ) : (
                            <>
                                {alerts.slice(0, Math.min(2, alerts.length)).map((alert) => (
                                    <div key = {alert.ID} className = "text-xs text-gray-700 border-l-2 border-blue-400 pl-2 py-1">
                                        {alert.MITRE_tactic} via {alert.MITRE_technique}
                                    </div>
                                ))}
                            </>
                        )}
                        <div className = "flex items-center justify-between mt-2">
                            <div className = "text-xs text-blue-600 font-light cursor-pointer hover:underline">
                                Show {alerts.length - 2} more alerts...
                            </div>
                        </div>
                    </div>
                </div>

                {/* USER */}
                <div className = "col-span-12 sm:col-span-2">
                    <div className = "text-sm font-semibold text-gray-700 mb-2"> User </div>
                    <div className = "text-xs text-gray-700 truncate" title = {incident.user}>
                        {incident.user}
                    </div>
                </div>

                {/* TIME DETAILS */}
                <div className = "col-span-12 sm:col-span-5 grid grid-cols-1 sm:grid-cols-3 sm:ml-10">
                    {/* START DATETIME */}
                    <div>
                        <div className = "text-sm font-semibold text-gray-700 mb-2"> Start Time </div>
                        <div className = "text-xs text-gray-700 truncate">
                            {formatDate(new Date(incident.windows_start))}
                        </div>
                    </div>
                    {/* END DATETIME */}
                    <div>
                        <div className = "text-sm font-semibold text-gray-700 mb-2"> End Time </div>
                        <div className = "text-xs text-gray-700 truncate" >
                            {formatDate(new Date(incident.windows_end))}
                        </div>
                    </div>
                    {/* DURATION */}
                    <div>
                        <div className = "text-sm font-semibold text-gray-700 mb-2"> Duration </div>
                        <div className = "text-xs text-gray-700 font-mono" >
                            {formatDuration(new Date(incident.windows_end), new Date(incident.windows_start))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};