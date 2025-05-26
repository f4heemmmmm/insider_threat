// frontend/src/components/alerts/AlertMainDetails.tsx
import { AlertProps } from "./constants/interfaces";
import { Calendar, Badge, User, Clock } from "lucide-react";

export const AlertMainDetails: React.FC<AlertProps> = ({ alert }) => {
    return (
        <div className = "flex flex-col gap-5 text-sm px-2 py-2">
            {/* ALERT NAME */}
            <div className = "flex items-center text-sm font-semibold text-gray-700 gap-2">
                <Badge className = "h-4 w-4 mr-1 text-gray-600" />
                {alert.alert_name}
            </div>

            {/* USER*/}
            <div className = "flex items-center text-sm font-light text-gray-700 gap-2">
                <User className = "h-4 w-4 mr-1 text-gray-600" />
                {alert.user}
            </div>

            {/* DATE */}
            <div className = "flex items-center text-sm font-light text-gray-700 gap-2">
                <Calendar className = "h-4 w-4 mr-1 text-gray-600" />
                {new Date(alert.datestr).toLocaleDateString()}
            </div>

            {/* TIME */}
            <div className = "flex items-center text-sm font-light text-gray-700 gap-2">
                <Clock className = "h-4 w-4 mr-1 text-gray-600" />
                {new Date(alert.datestr).toLocaleTimeString()}
            </div>
        </div>
    );
};