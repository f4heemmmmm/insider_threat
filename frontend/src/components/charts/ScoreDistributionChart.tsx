// frontend/src/components/charts/ScoreDistributionChart.tsx

import React from "react";
import { ScoreDistributionChartProps } from "./interfaces";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className = "bg-white p-4 shadow-lg rounded-md border border-gray-200">
                <p className = "font-medium text-xs text-gray-900 mb-2">
                    Range: {label}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key = {`item-${index}`} className = "flex items-center gap-2 my-1">
                        <div 
                            className = "w-2 h-2 rounded-full" 
                            style = {{ backgroundColor: entry.color }}
                        />
                        <span className = "font-light text-xs text-gray-700">
                            {entry.name}:
                        </span>
                        <span className = "text-gray-900 text-xs font-semibold"> {entry.value} </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data, height = 400, showTitle = false }) => {
    return (
        <div className = "bg-white py-4 pr-8">
            {showTitle && (
                <h3 className = "text-sm font-semibold text-gray-700 mb-3"> Score Distribution </h3>
            )}
            <ResponsiveContainer width = "100%" height = {height}>
                <BarChart data = {data} margin = {{ top: 5, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray = "3 3" stroke = "#eee" />
                    <XAxis 
                        dataKey = "scoreRange" 
                        tick = {{ fontSize: 10 }}
                        stroke = "#ccc"
                    />
                    <YAxis 
                        tick = {{ fontSize: 10 }} 
                        stroke = "#ccc"
                    />
                    <Tooltip 
                        content = {<CustomTooltip />}
                        wrapperStyle = {{ outline: "none" }}
                    />
                    <Legend wrapperStyle = {{ fontSize: "10px" }} />
                    <Bar dataKey = "alertCount" fill = "#3B5998" name = "Alerts" radius = {[3, 3, 0, 0]} />
                    <Bar dataKey = "incidentCount" fill = "#B22222" name = "Incidents" radius = {[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};