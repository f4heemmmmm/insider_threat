// frontend/src/components/ui/DateRangePicker.tsx

import React, { useState, useRef, useEffect } from "react";
import { Calendar, X, ChevronDown, AlertCircle } from "lucide-react";

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (dateRange: DateRange) => void;
    onClear: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    maxDaysRange?: number;
    maxPastDays?: number;
    earliestDate?: Date;
}

interface ValidationError {
    startDate?: string;
    endDate?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    value,
    onChange,
    onClear,
    placeholder = "Select date range",
    disabled = false,
    className = "",
    maxDaysRange = 365,
    maxPastDays = 1095,
    earliestDate
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState<ValidationError>({});
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Store initial dates for reset functionality
    const initialDatesRef = useRef<DateRange>({
        startDate: value.startDate ? new Date(value.startDate.getTime()) : null,
        endDate: value.endDate ? new Date(value.endDate.getTime()) : null
    });

    // Format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (date: Date | null): string => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Format date for display (dd/mm/yyyy format)
    const formatDateForDisplay = (date: Date | null): string => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // State for input values
    const [startDateInput, setStartDateInput] = useState(formatDateForInput(value.startDate));
    const [endDateInput, setEndDateInput] = useState(formatDateForInput(value.endDate));

    // Update input values when props change
    useEffect(() => {
        setStartDateInput(formatDateForInput(value.startDate));
        setEndDateInput(formatDateForInput(value.endDate));
    }, [value.startDate, value.endDate]);

    // Parse date string to Date object with validation
    const createDateFromString = (dateString: string): Date | null => {
        if (dateString.length < 10) return null;

        const [year, month, day] = dateString.split("-").map(Number);

        // Validate numbers
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        if (year < 1000 || year > 9999) return null;
        if (month < 1 || month > 12) return null;
        if (day < 1 || day > 31) return null;

        const date = new Date(year, month - 1, day);

        // Additional validation for valid date
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null;
        }

        // Set time to noon to avoid timezone issues
        date.setHours(12, 0, 0, 0);
        return date;
    };

    // Validate dates
    const validateDates = (startDate: Date | null, endDate: Date | null): ValidationError => {
        const newErrors: ValidationError = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate start date
        if (startDate) {
            if (startDate > today) {
                newErrors.startDate = "Start date cannot be in the future!";
            } else if (earliestDate && startDate < earliestDate) {
                newErrors.startDate = "Start date cannot be before the earliest available date!";
            }
        }

        // Validate end date
        if (endDate) {
            if (endDate > today) {
                newErrors.endDate = "End date cannot be in the future!";
            } else if (startDate && endDate < startDate) {
                newErrors.endDate = "End date cannot be before start date!";
            }
        }

        // Validate date range
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > maxDaysRange) {
                newErrors.endDate = `Date range cannot exceed ${maxDaysRange} days!`;
            }
        }

        return newErrors;
    };

    // Generate display text
    const getDisplayText = (): string => {
        if (value.startDate && value.endDate) {
            return `${formatDateForDisplay(value.startDate)} - ${formatDateForDisplay(value.endDate)}`;
        } else if (value.startDate) {
            return `From ${formatDateForDisplay(value.startDate)}`;
        } else if (value.endDate) {
            return `Until ${formatDateForDisplay(value.endDate)}`;
        }
        return placeholder;
    };

    // Handle start date change
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (inputValue.length < 10) return;

        setStartDateInput(inputValue);
        const newStartDate = createDateFromString(inputValue);

        if (!newStartDate) {
            setErrors({ ...errors, startDate: "Please enter a valid date!" });
            return;
        }

        // Clear previous errors and validate
        const updatedErrors = { ...errors };
        delete updatedErrors.startDate;
        delete updatedErrors.endDate;

        const validation = validateDates(newStartDate, value.endDate);
        setErrors({ ...updatedErrors, ...validation });

        if (Object.keys(validation).length === 0) {
            // If start date is after end date, update end date to match
            if (value.endDate && newStartDate > value.endDate) {
                onChange({ startDate: newStartDate, endDate: newStartDate });
                setEndDateInput(formatDateForInput(newStartDate));
            } else {
                onChange({ startDate: newStartDate, endDate: value.endDate });
            }
        }
    };

    // Handle end date change
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (inputValue.length < 10) return;

        setEndDateInput(inputValue);
        const newEndDate = createDateFromString(inputValue);

        if (!newEndDate) {
            setErrors({ ...errors, endDate: "Please enter a valid date!" });
            return;
        }

        // Clear previous errors and validate
        const updatedErrors = { ...errors };
        delete updatedErrors.startDate;
        delete updatedErrors.endDate;

        const validation = validateDates(value.startDate, newEndDate);
        setErrors({ ...updatedErrors, ...validation });

        if (Object.keys(validation).length === 0) {
            onChange({ startDate: value.startDate, endDate: newEndDate });
        }
    };

    // Handle preset selection
    const handlePresetSelect = (days: number) => {
        const endDate = new Date();
        endDate.setHours(12, 0, 0, 0);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - days);

        onChange({ startDate, endDate });
        setErrors({});
    };

    // Handle reset
    const handleReset = () => {
        onChange({ startDate: null, endDate: null });
        onClear();
        setErrors({});
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Calculate date constraints
    const today = new Date();
    const todayFormatted = formatDateForInput(today);
    const minDate = earliestDate ? formatDateForInput(earliestDate) : 
                   formatDateForInput(new Date(today.getTime() - maxPastDays * 24 * 60 * 60 * 1000));

    const hasValue = value.startDate || value.endDate;
    const hasErrors = Object.keys(errors).length > 0;

    const presets = [
        { label: "Last 7 days", days: 7 },
        { label: "Last 30 days", days: 30 },
        { label: "Last 6 months", days: 180 }
    ];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Trigger Display */}
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full px-3 py-2 text-sm
                    border rounded-[12px] bg-white cursor-pointer min-h-[40px]
                    hover:border-gray-400 focus-within:ring-1 
                    focus-within:ring-indigo-300 focus-within:border-indigo-400
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${hasValue ? 'text-gray-900' : 'text-gray-500'}
                    ${hasErrors ? 'border-red-300' : 'border-gray-300'}
                `}
            >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{getDisplayText()}</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    {hasValue && (
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReset();
                            }}
                            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                            <X className="h-3 w-3 text-gray-400" />
                        </div>
                    )}
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        <div className="space-y-4">
                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDateInput}
                                    onChange={handleStartDateChange}
                                    min={minDate}
                                    max={todayFormatted}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.startDate && (
                                    <span className="text-xs text-red-500 mt-1">{errors.startDate}</span>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDateInput}
                                    onChange={handleEndDateChange}
                                    min={value.startDate ? formatDateForInput(value.startDate) : minDate}
                                    max={todayFormatted}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.endDate && (
                                    <span className="text-xs text-red-500 mt-1">{errors.endDate}</span>
                                )}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => !hasErrors && setIsOpen(false)}
                                disabled={hasErrors}
                                className={`px-4 py-2 text-sm rounded-lg focus:outline-none ${
                                    hasErrors 
                                        ? 'text-gray-400 bg-gray-300 cursor-not-allowed' 
                                        : 'text-white bg-blue-500 hover:bg-blue-700 cursor-pointer'
                                }`}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};