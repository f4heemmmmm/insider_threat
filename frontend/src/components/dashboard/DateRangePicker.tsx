// frontend/src/components/dashboard/DateRangePicker.tsx

import React, { useRef, useState, useEffect } from "react";
import { DateRangePickerProps } from "./constants/interfaces";

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange, onPresetSelect}) => {

    // Store initial dates when component first mounts (for reset preset)
    const initialDatesRef = useRef<{ startDate: Date, endDate: Date }>({
        startDate: new Date(startDate.getTime()),
        endDate: new Date(endDate.getTime())
    });

    // Function to validate the dates
    const validateDates = (start: Date, end: Date) => {
        const newErrors: {startDate?: string; endDate?: string} = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate start date is not in the future
        if (start > today) {
            newErrors.startDate = "Start date cannot be in the future!";
        }
        // Validate end date is not before the start date
        if (end < start) {
            newErrors.endDate = "End date cannot be before the start date!";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // State for date validation errors
    const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});

    // Ensures dates are valid when the component updates
    useEffect(() => {
        validateDates(startDate, endDate);
    }, [startDate, endDate]);

    // Format date to YYYY-MM-DD format for input field
    function formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // State to track the input values directly
    const [startDateInput, setStartDateInput] = useState(formatDateForInput(startDate));
    const [endDateInput, setEndDateInput] = useState(formatDateForInput(endDate));

    // Update the input values when the props change
    useEffect(() => {
        setStartDateInput(formatDateForInput(startDate));
        setEndDateInput(formatDateForInput(endDate));
    }, [startDate, endDate]);

    // Parse date 'String' from input to date 'Object'
    function createDateFromString(dateString: string): Date | null {
        if (dateString.length < 10) {
            return null;

        }
        const [year, month, day] = dateString.split("-").map(Number);

        // Validate that the year, month and day are valid numbers
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return null;
        }
        if (year < 1000 || year > 9999) {
            return null;
        }
        if (month < 1 || month > 12) {
            return null;
        }
        if (day < 1 || day > 31) {
            return null;
        }

        const date = new Date(year, month - 1, day);

        // Additional validation for valid date (ensure the month's number of days match)
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null;
        }

        // Set the time to 12PM to avoid timezone issues
        date.setHours(12, 0, 0, 0);
        return date;
    }

    // When users click on the reset button to reset the dates to the initial dates
    const handleReset = () => {
        onStartDateChange(new Date(initialDatesRef.current.startDate.getTime()));
        onEndDateChange(new Date(initialDatesRef.current.endDate.getTime()));
        setErrors({});
    }

    // When users change the start date in the input calendar
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue.length < 10) {
            return;
        }

        setStartDateInput(inputValue);
        const newStartDate = createDateFromString(inputValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Clear previous errors
        const updatedErrors = {...errors};
        delete updatedErrors.endDate;

        // Check if the date is valid
        if (!newStartDate) {
            updatedErrors.startDate = "Please enter a valid date!";
            setErrors(updatedErrors);
            return;   
        }
        
        // Check if the date is in the future
        if (newStartDate > today) {
            updatedErrors.startDate = "Start date cannot be in the future!";
            setErrors(updatedErrors);
            return;   
        }

        // Update the actual date states ONLY if the validation passes
        if (newStartDate > endDate) {
            onStartDateChange(newStartDate);
            onEndDateChange(newStartDate);
            setEndDateInput(formatDateForInput(newStartDate));
        } else {
            onStartDateChange(newStartDate);
        }
        setErrors(updatedErrors);
    }

    // When users change the end date in the input calendar
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue.length < 10) {
            return;
        }

        setEndDateInput(inputValue);
        const newEndDate = createDateFromString(inputValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Clear previous errors
        const updatedErrors = {...errors};
        delete updatedErrors.startDate;

        // Check if the date is valid
        if (!newEndDate) {
            updatedErrors.endDate = "Please enter a valid date!";
            setErrors(updatedErrors);
            return;   
        }
        
        // Check if the end date is before the start date
        if (newEndDate < startDate) {
            updatedErrors.endDate = "End date cannot be before start date!";
            setErrors(updatedErrors);
            return;   
        }

        // Check if the end date is in the future
        if (newEndDate > today) {
            updatedErrors.endDate = "End date cannot be in the future!";
            setErrors(updatedErrors);
            return;   
        }
        onEndDateChange(newEndDate);
        setErrors(updatedErrors);
    }

    // Calculate today's date for maximum constraint (input date cannot exceed this date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = formatDateForInput(today);

    const presets = [
        {
            label: "Last week",
            days: 7
        },
        {
            label: "Last month",
            days: 30
        },
        {
            label: "Last 6 months",
            days: 180
        }
    ];

    return (
        <div className = "bg-white rounded-lg p-4 shadow-md border">
            <div className = "flex flex-wrap items-center gap-4">
                {/* START DATE INPUT */}
                <div className = "flex flex-col">
                    <div className = "flex items-center gap-3">
                        <label className = "text-xs font-medium text-gray-700"> From: </label>
                        <input
                            type = "date"
                            value = {startDateInput}
                            onChange = {handleStartDateChange}
                            max = {todayFormatted}
                            className = {`text-xs font-semibold text-gray-500 px-3 py-2 border rounded-md ${
                                errors.startDate ? "border-red-500" : "border-gray-300"
                            } focus:outline-non focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                    </div>
                    {errors.startDate && (
                        <span className = "text-xs text-red-500 mt-1"> {errors.startDate}</span>
                    )}
                </div>
                {/* END DATE INPUT */}
                <div className = "flex flex-col">
                    <div className = "flex items-center gap-3">
                        <label className = "text-xs font-medium text-gray-700"> To: </label>
                        <input
                            type = "date"
                            value = {endDateInput}
                            onChange = {handleEndDateChange}
                            min = {formatDateForInput(startDate)}
                            max = {todayFormatted}
                            className = {`text-xs font-semibold text-gray-500 px-3 py-2 border rounded-md ${
                                errors.endDate ? "border-red-500" : "border-gray-300"
                            } focus:outline-non focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                    </div>
                    {errors.endDate && (
                        <span className = "text-xs text-red-500 mt-1"> {errors.endDate}</span>
                    )}
                </div>
                {/* PRESETS */}
                <div className = "flex gap-4">
                    {presets.map((preset) => (
                        <button
                            className = "px-2 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none hover:cursor-pointer"
                            key = {preset.days}
                            onClick = {() => onPresetSelect(preset.days)}
                        >
                            {preset.label}
                        </button>
                    ))}
                    <button
                        className = "px-2 py-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none hover:cursor-pointer"
                        onClick = {handleReset}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};