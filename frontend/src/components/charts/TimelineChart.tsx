// frontend/src/components/charts/TimelineChart.tsx

import React from "react";
import { TimelineChartProps } from "./interfaces";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className = "bg-white p-4 shadow-lg rounded-md border border-gray-200">
                <p className = "font-medium text-xs text-gray-900 mb-2">
                    {new Date(label).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key = {`item-${index}`} className = "flex items-center gap-1 my-1">
                        <div 
                            className = "w-2 h-2 rounded-full" 
                            style = {{ backgroundColor: entry.color }}
                        />
                        <span className = "font-light text-xs text-gray-700">
                            {entry.dataKey === "alerts" ? "Alerts" : "Incidents"}:
                        </span>
                        <span className = "text-gray-900 text-xs font-semibold"> {entry.value} </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const TimelineChart: React.FC<TimelineChartProps> = ({ data, height = 350, showTitle = false, title = "Alerts & Incidents Timeline" }) => {
    return (
        <div style = {{ width: "100%", height: height }}>
            {showTitle && (
                <h3 className = "text-lg font-semibold text-gray-900 mb-4"> {title} </h3>
            )}
            <ResponsiveContainer width = "100%" height = "100%">
                <LineChart 
                    data = {data} 
                    margin = {{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                    <CartesianGrid fontSize = {10} strokeDasharray = "3 3" />
                    <XAxis 
                        dataKey = "date" 
                        tick = {{ fontSize: 13 }}
                        tickFormatter = {(value) => new Date(value).toLocaleDateString()}
                        padding = {{ left: 20, right: 20 }}
                        fontSize = {8}
                    />
                    <YAxis 
                        tick = {{ fontSize: 13 }}
                        width = {40}
                    />
                    <Tooltip 
                        content = {<CustomTooltip />}
                        wrapperStyle = {{ outline: "none" }}
                    />
                    <Legend 
                        wrapperStyle={{ paddingTop: "15px" }}
                    />
                    <Line 
                        type = "monotone" 
                        dataKey = "alerts" 
                        stroke = "#3B5998" 
                        strokeWidth = {3}
                        dot = {{ r: 3 }}
                        activeDot = {{ r: 6 }}
                        name = "Alerts"
                        fontSize = {8}
                    />
                    <Line 
                        type = "monotone" 
                        dataKey = "incidents" 
                        stroke = "#B22222" 
                        strokeWidth = {3}
                        dot = {{ r: 3 }}
                        activeDot = {{ r: 6 }}
                        name = "Incidents"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};