import { HTMLAttributes, CSSProperties } from 'react';

/**
 * Quick selection option for predefined date ranges
 */
export interface QuickSelection {
    /** Display label for the quick selection */
    label: string;
    /** Function that returns the start and end dates for this selection */
    getValue: () => DateRange;
}

/**
 * Date range object
 */
export interface DateRange {
    /** Start date of the range */
    start: Date;
    /** End date of the range */
    end: Date;
}

/**
 * First day of the week
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Props for the DatePickerMenu component
 */
export interface DatePickerMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    /**
     * Initial start date for the date range
     * @default null
     */
    defaultStartDate?: Date | null;

    /**
     * Initial end date for the date range
     * @default null
     */
    defaultEndDate?: Date | null;

    /**
     * Callback function called when the user applies the selected date range
     * @param startDate - The selected start date
     * @param endDate - The selected end date
     */
    onApply: (startDate: Date, endDate: Date) => void;

    /**
     * Optional callback function called when the user cancels the selection
     */
    onCancel?: () => void;

    /**
     * Array of quick selection options
     * @default DEFAULT_QUICK_SELECTIONS
     */
    quickSelections?: QuickSelection[];

    /**
     * Whether to show the quick selections panel
     * @default true
     */
    isShowQuickSelections?: boolean;

    /**
     * Minimum selectable date. Dates before this will be disabled.
     * @default null
     */
    minDate?: Date | null;

    /**
     * Maximum selectable date. Dates after this will be disabled.
     * @default null
     */
    maxDate?: Date | null;

    /**
     * First day of the week
     * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
     * @default 1 (Monday)
     */
    firstDayOfWeek?: FirstDayOfWeek;

    /**
     * Whether to show event indicator dots on calendar cells
     * @default false
     */
    isShowDots?: boolean;

    /**
     * Array of dates that have events (will show dots if isShowDots is true)
     * @default []
     */
    eventDates?: Date[];

    /**
     * Custom CSS class name for the component
     */
    className?: string;

    /**
     * Custom inline styles for the component
     */
    style?: CSSProperties;
}

/**
 * Props for the CalendarPicker sub-component
 * @internal
 */
export interface CalendarPickerProps {
    /** The month to display */
    month: Date;
    /** Callback for previous month navigation */
    onPrevMonth: () => void;
    /** Callback for next month navigation */
    onNextMonth: () => void;
    /** Callback when a date is clicked */
    onDateClick: (date: Date) => void;
    /** Callback when a date is hovered */
    onDateHover: (date: Date | null) => void;
    /** Function to check if a date is in the selected range */
    isDateInRange: (date: Date) => boolean;
    /** Function to check if a date is selected (start or end) */
    isDateSelected: (date: Date) => boolean;
    /** Function to check if a date is disabled */
    isDateDisabled: (date: Date) => boolean;
    /** Function to check if a date has an event */
    hasEvent: (date: Date) => boolean;
    /** Whether to show the previous month button */
    isShowPrevButton: boolean;
    /** Whether to show the next month button */
    isShowNextButton: boolean;
    /** First day of the week */
    firstDayOfWeek: FirstDayOfWeek;
}
