import React, { useState } from 'react';
import { DatePickerMenu, QuickSelection } from './DatePickerMenu';
import { subDays, subWeeks, subMonths, subQuarters, startOfQuarter, endOfQuarter, format } from 'date-fns';

/**
 * DatePickerMenu Examples
 * 
 * This file demonstrates various usage patterns for the DatePickerMenu component.
 */

// Example 1: Basic Usage
export const BasicExample: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<{ start: Date; end: Date } | null>(null);

    const handleApply = (startDate: Date, endDate: Date) => {
        setSelectedRange({ start: startDate, end: endDate });
        console.log('Selected range:', startDate, endDate);
    };

    return (
        <div>
            <h2>Basic Example</h2>
            <DatePickerMenu
                defaultStartDate={new Date('2025-01-10')}
                defaultEndDate={new Date('2025-01-16')}
                onApply={handleApply}
            />
            {selectedRange && (
                <p>
                    Selected: {format(selectedRange.start, 'MMM d, yyyy')} – {format(selectedRange.end, 'MMM d, yyyy')}
                </p>
            )}
        </div>
    );
};

// Example 2: Custom Quick Selections
export const CustomQuickSelectionsExample: React.FC = () => {
    const customQuickSelections: QuickSelection[] = [
        {
            label: 'Last 7 days',
            getValue: () => ({
                start: subDays(new Date(), 7),
                end: new Date(),
            }),
        },
        {
            label: 'Last 30 days',
            getValue: () => ({
                start: subDays(new Date(), 30),
                end: new Date(),
            }),
        },
        {
            label: 'Last 90 days',
            getValue: () => ({
                start: subDays(new Date(), 90),
                end: new Date(),
            }),
        },
        {
            label: 'Last quarter',
            getValue: () => ({
                start: startOfQuarter(subQuarters(new Date(), 1)),
                end: endOfQuarter(subQuarters(new Date(), 1)),
            }),
        },
    ];

    return (
        <div>
            <h2>Custom Quick Selections</h2>
            <DatePickerMenu
                quickSelections={customQuickSelections}
                onApply={(start, end) => console.log('Custom range:', start, end)}
            />
        </div>
    );
};

// Example 3: With Event Indicators
export const WithEventIndicatorsExample: React.FC = () => {
    const eventDates = [
        new Date('2025-01-01'), // New Year
        new Date('2025-01-04'), // Meeting
        new Date('2025-01-15'), // Deadline
        new Date('2025-01-30'), // Review
        new Date('2025-02-04'), // Presentation
        new Date('2025-02-14'), // Valentine's Day
    ];

    return (
        <div>
            <h2>With Event Indicators</h2>
            <DatePickerMenu
                showDots={true}
                eventDates={eventDates}
                onApply={(start, end) => console.log('Range with events:', start, end)}
            />
        </div>
    );
};

// Example 4: With Min/Max Constraints
export const WithConstraintsExample: React.FC = () => {
    const minDate = new Date('2024-01-01');
    const maxDate = new Date(); // Today

    return (
        <div>
            <h2>With Min/Max Constraints</h2>
            <p>Can only select dates from Jan 1, 2024 to today</p>
            <DatePickerMenu
                minDate={minDate}
                maxDate={maxDate}
                onApply={(start, end) => console.log('Constrained range:', start, end)}
                onCancel={() => console.log('Cancelled')}
            />
        </div>
    );
};

// Example 5: Controlled Component with Modal
export const ControlledModalExample: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleApply = (start: Date, end: Date) => {
        setStartDate(start);
        setEndDate(end);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <h2>Controlled Component with Modal</h2>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #d5d7da',
                    background: 'white',
                    cursor: 'pointer',
                }}
            >
                {startDate && endDate
                    ? `${format(startDate, 'MMM d, yyyy')} – ${format(endDate, 'MMM d, yyyy')}`
                    : 'Select date range'}
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={handleCancel}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <DatePickerMenu
                            defaultStartDate={startDate}
                            defaultEndDate={endDate}
                            onApply={handleApply}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Example 6: Without Quick Selections
export const WithoutQuickSelectionsExample: React.FC = () => {
    return (
        <div>
            <h2>Without Quick Selections</h2>
            <DatePickerMenu
                showQuickSelections={false}
                onApply={(start, end) => console.log('Range:', start, end)}
            />
        </div>
    );
};

// Example 7: Custom First Day of Week (Sunday)
export const CustomFirstDayExample: React.FC = () => {
    return (
        <div>
            <h2>Custom First Day of Week (Sunday)</h2>
            <DatePickerMenu
                firstDayOfWeek={0} // 0 = Sunday
                onApply={(start, end) => console.log('Range:', start, end)}
            />
        </div>
    );
};

// Example 8: With Custom Styling
export const CustomStylingExample: React.FC = () => {
    return (
        <div>
            <h2>Custom Styling</h2>
            <DatePickerMenu
                className="custom-date-picker"
                style={{
                    border: '2px solid #7f56d9',
                    boxShadow: '0 10px 40px rgba(127, 86, 217, 0.2)',
                }}
                onApply={(start, end) => console.log('Range:', start, end)}
            />
        </div>
    );
};

// Example 9: Analytics Dashboard Use Case
export const AnalyticsDashboardExample: React.FC = () => {
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
        start: subDays(new Date(), 7),
        end: new Date(),
    });
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const analyticsQuickSelections: QuickSelection[] = [
        {
            label: 'Today',
            getValue: () => {
                const today = new Date();
                return { start: today, end: today };
            },
        },
        {
            label: 'Last 7 days',
            getValue: () => ({
                start: subDays(new Date(), 7),
                end: new Date(),
            }),
        },
        {
            label: 'Last 30 days',
            getValue: () => ({
                start: subDays(new Date(), 30),
                end: new Date(),
            }),
        },
        {
            label: 'This month',
            getValue: () => ({
                start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                end: new Date(),
            }),
        },
        {
            label: 'Last month',
            getValue: () => {
                const lastMonth = subMonths(new Date(), 1);
                return {
                    start: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
                    end: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
                };
            },
        },
    ];

    const handleApply = (start: Date, end: Date) => {
        setDateRange({ start, end });
        setIsPickerOpen(false);
        // Fetch analytics data for the selected range
        console.log('Fetching analytics for:', start, 'to', end);
    };

    return (
        <div>
            <h2>Analytics Dashboard Use Case</h2>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '1px solid #d5d7da',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span>📅</span>
                    <span>
                        {format(dateRange.start, 'MMM d, yyyy')} – {format(dateRange.end, 'MMM d, yyyy')}
                    </span>
                </button>
            </div>

            {isPickerOpen && (
                <DatePickerMenu
                    defaultStartDate={dateRange.start}
                    defaultEndDate={dateRange.end}
                    quickSelections={analyticsQuickSelections}
                    maxDate={new Date()}
                    onApply={handleApply}
                    onCancel={() => setIsPickerOpen(false)}
                />
            )}

            <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Analytics Data</h3>
                <p>Showing data from {format(dateRange.start, 'MMM d, yyyy')} to {format(dateRange.end, 'MMM d, yyyy')}</p>
                <p>Total days: {Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1}</p>
            </div>
        </div>
    );
};

// Main Demo Component
export const DatePickerMenuDemo: React.FC = () => {
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>DatePickerMenu Component Examples</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                <BasicExample />
                <CustomQuickSelectionsExample />
                <WithEventIndicatorsExample />
                <WithConstraintsExample />
                <ControlledModalExample />
                <WithoutQuickSelectionsExample />
                <CustomFirstDayExample />
                <CustomStylingExample />
                <AnalyticsDashboardExample />
            </div>
        </div>
    );
};

export default DatePickerMenuDemo;
