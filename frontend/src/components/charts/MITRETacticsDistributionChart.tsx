// frontend/src/components/charts/MITRETacticsDistributionChart.tsx

import React, { useMemo } from "react";
import { CHARTCOLORS, MITRETacticsChartProps } from "./interfaces";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className = "bg-gray-50 border border-gray-200 rounded p-2 shadow-sm items-center flex flex-row text-gray-800 text-xs">
                <p className = "font-medium mb-1"> {label} </p>
                <p className = "text-blue-900">
                    Alerts: <span className = "font-semibold">{payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

export const MITRETacticsDistributionChart: React.FC<MITRETacticsChartProps> = ({ data, type = "bar", height = 300, showTitle = false }) => {
    const processedData = useMemo(() => {
        if (!data || data.length === 0) {
            return [];
        }
        return data.map(item => ({
            ...item,
            count: Math.max(0, item.count || 0)
        }));
    }, [data]);

    const statistics = useMemo(() => {
        const totalAlerts = processedData.reduce((sum, item) => sum + item.count, 0);
        const maxCount = Math.max(...processedData.map(data => data.count), 1);
        return {totalAlerts, maxCount };
    }, [processedData]);

    // Empty state
    if (!processedData || processedData.length === 0) {
        return (
            <div className = "bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                {showTitle && (
                    <h3 className = "text-sm font-semibold text-gray-700 mb-3"> MITRE ATT&CK Tactics </h3>
                )}
                <div className = "flex items-center justify-center h-64 text-gray-500">
                    <div className = "text-3xl mb-2"> 📊 </div>
                    <p className = "text-sm"> No MITRE Tactics data available </p>
                </div>
            </div>
        );
    }

    if (type === "pie") {
        return (
            <div className = "bg-white py-2 pr-8">
                {showTitle && (
                    <h3 className = "text-sm font-semibold text-gray-700 mb-3"> MITRE ATT&CK Tactics </h3>
                )}
                {/* SUMMARY STATISTICS */}
                <ResponsiveContainer width = "100%" height = {height}>
                    <PieChart>
                        <Pie
                            data = {processedData}
                            cx = "40%"
                            cy = "50%"
                            labelLine = {false}
                            label = {({ tactic, percent }) => `${tactic} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius = {80}
                            fill = "#8884D8"
                            dataKey = "count"
                            paddingAngle = {2}
                            cornerRadius = {3}
                            fontSize = {12}
                        >
                            {processedData.map((entry, index) => (
                                <Cell 
                                    key = {`cell-${index}`} 
                                    fill = {CHARTCOLORS[index % CHARTCOLORS.length]} 
                                    stroke = "#FFFFFF"
                                    strokeWidth = {1}
                                />
                            ))}
                        </Pie>
                        <Tooltip content = {<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className = "flex flex-row items-center justify-end gap-3 mb-3 text-sm text-gray-500">
                    <span className = "font-light"> Total Alerts: </span>
                    <span className = "font-semibold"> {statistics.totalAlerts.toLocaleString()} </span>
                </div>
                <div className = "flex flex-row items-center justify-end gap-3 mb-3 text-sm text-gray-500">
                    <span className = "font-light"> Total Tactics Used: </span>
                    <span className = "font-semibold"> {processedData.length} </span>                    
                </div>
            </div>
        );
    }

    return (
        <div className = "bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            {showTitle && (
                <h3 className = "text-sm font-semibold text-gray-700 mb-3"> MITRE ATT&CK Tactics </h3>
            )}
            {/* SUMMARY STATISTICS */}
            <div className = "flex items-center gap-3 mb-3 text-xs text-gray-500">
                <span> Total: {statistics.totalAlerts.toLocaleString()} </span>
                <span> Max: {statistics.maxCount.toLocaleString()} </span>
            </div>
            <ResponsiveContainer width = "100%" height = {height}>
                <BarChart 
                    data = {processedData} 
                    margin = {{ top: 5, right: 20, left: 10, bottom: 60 }}
                    barSize = {32}
                >
                    <CartesianGrid strokeDasharray = "3 3" stroke = "#eee" vertical = {false} />
                    <XAxis 
                        dataKey = "tactic" 
                        tick = {{ fill: "#555", fontSize: 10 }}
                        angle = {-45}
                        textAnchor = "end"
                        height = {100}
                        stroke = "#ccc"
                    />
                    <YAxis 
                        tick = {{ fill: "#555", fontSize: 10 }} 
                        stroke = "#ccc"
                    />
                    <Tooltip content = {<CustomTooltip />} />
                    <Bar 
                        dataKey = "count" 
                        radius = {[3, 3, 0, 0]}
                    >
                        {processedData.map((entry, index) => (
                            <Cell 
                                key = {`cell-${index}`} 
                                fill = {CHARTCOLORS[index % CHARTCOLORS.length]} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};