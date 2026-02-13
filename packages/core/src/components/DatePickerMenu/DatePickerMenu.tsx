import { forwardRef, useState, useCallback } from 'react';
import {
    addMonths,
    subMonths,
    isSameDay,
    isAfter,
    isBefore,
    isWithinInterval,
    format,
} from 'date-fns';
import styles from './DatePickerMenu.module.scss';
import type { DatePickerMenuProps, QuickSelection } from './DatePickerMenu.types';
import { DEFAULT_QUICK_SELECTIONS } from './DatePickerMenuConstants';
import CalendarPicker from './CalendarPicker';

const DatePickerMenu = forwardRef<HTMLDivElement, DatePickerMenuProps>(
    (
        {
            defaultStartDate = null,
            defaultEndDate = null,
            onApply,
            onCancel,
            quickSelections = DEFAULT_QUICK_SELECTIONS,
            isShowQuickSelections = true,
            minDate = null,
            maxDate = null,
            firstDayOfWeek = 1,
            isShowDots = false,
            eventDates = [],
            className,
            style,
            ...rest
        },
        ref
    ) => {
        const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
        const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
        const [leftMonth, setLeftMonth] = useState(defaultStartDate || new Date());
        const [rightMonth, setRightMonth] = useState(
            addMonths(defaultStartDate || new Date(), 1)
        );
        const [selectedQuickSelection, setSelectedQuickSelection] = useState<string | null>(null);
        const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

        const handleDateClick = useCallback(
            (date: Date) => {
                if (minDate && isBefore(date, minDate)) return;
                if (maxDate && isAfter(date, maxDate)) return;

                if (!startDate || (startDate && endDate)) {
                    setStartDate(date);
                    setEndDate(null);
                    setSelectedQuickSelection(null);
                } else {
                    if (isBefore(date, startDate)) {
                        setEndDate(startDate);
                        setStartDate(date);
                    } else {
                        setEndDate(date);
                    }
                }
            },
            [startDate, endDate, minDate, maxDate]
        );

        const handleQuickSelect = useCallback((selection: QuickSelection) => {
            const { start, end } = selection.getValue();
            setStartDate(start);
            setEndDate(end);
            setSelectedQuickSelection(selection.label);
            setLeftMonth(start);
            setRightMonth(addMonths(start, 1));
        }, []);

        const handleApply = useCallback(() => {
            if (startDate && endDate) {
                onApply(startDate, endDate);
            }
        }, [startDate, endDate, onApply]);

        const handlePrevMonth = useCallback((picker: 'left' | 'right') => {
            if (picker === 'left') {
                setLeftMonth((prev) => subMonths(prev, 1));
                setRightMonth((prev) => subMonths(prev, 1));
            }
        }, []);

        const handleNextMonth = useCallback((picker: 'left' | 'right') => {
            if (picker === 'right') {
                setLeftMonth((prev) => addMonths(prev, 1));
                setRightMonth((prev) => addMonths(prev, 1));
            }
        }, []);

        const isDateInRange = useCallback(
            (date: Date) => {
                if (!startDate) return false;
                const rangeEnd = hoveredDate && !endDate ? hoveredDate : endDate;
                if (!rangeEnd) return false;

                const actualStart = isBefore(startDate, rangeEnd) ? startDate : rangeEnd;
                const actualEnd = isAfter(startDate, rangeEnd) ? startDate : rangeEnd;

                return isWithinInterval(date, { start: actualStart, end: actualEnd });
            },
            [startDate, endDate, hoveredDate]
        );

        const isDateSelected = useCallback(
            (date: Date) => {
                if (!startDate) return false;
                if (isSameDay(date, startDate)) return true;
                if (endDate && isSameDay(date, endDate)) return true;
                return false;
            },
            [startDate, endDate]
        );

        const isDateDisabled = useCallback(
            (date: Date) => {
                if (minDate && isBefore(date, minDate)) return true;
                if (maxDate && isAfter(date, maxDate)) return true;
                return false;
            },
            [minDate, maxDate]
        );

        const hasEvent = useCallback(
            (date: Date) => {
                return isShowDots && eventDates.some((eventDate) => isSameDay(eventDate, date));
            },
            [isShowDots, eventDates]
        );

        const rootClassName = [styles.datePickerMenu, className].filter(Boolean).join(' ');

        return (
            <div
                ref={ref}
                className={rootClassName}
                style={style}
                role="dialog"
                aria-label="Date range picker"
                aria-modal="true"
                data-testid="DatePickerMenu"
                {...rest}
            >
                {isShowQuickSelections && (
                    <div className={styles.leading} role="list" aria-label="Quick date selections">
                        {quickSelections.map((selection) => (
                            <button
                                key={selection.label}
                                className={`${styles.listItem} ${selectedQuickSelection === selection.label ? styles.active : ''
                                    }`}
                                onClick={() => handleQuickSelect(selection)}
                                role="listitem"
                                aria-selected={selectedQuickSelection === selection.label}
                                aria-label={`Select ${selection.label.toLowerCase()}`}
                            >
                                {selection.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className={styles.trailing}>
                    <div className={styles.pickers}>
                        <CalendarPicker
                            month={leftMonth}
                            onPrevMonth={() => handlePrevMonth('left')}
                            onNextMonth={() => handleNextMonth('left')}
                            onDateClick={handleDateClick}
                            onDateHover={setHoveredDate}
                            isDateInRange={isDateInRange}
                            isDateSelected={isDateSelected}
                            isDateDisabled={isDateDisabled}
                            hasEvent={hasEvent}
                            isShowPrevButton={true}
                            isShowNextButton={false}
                            firstDayOfWeek={firstDayOfWeek}
                        />
                        <CalendarPicker
                            month={rightMonth}
                            onPrevMonth={() => handlePrevMonth('right')}
                            onNextMonth={() => handleNextMonth('right')}
                            onDateClick={handleDateClick}
                            onDateHover={setHoveredDate}
                            isDateInRange={isDateInRange}
                            isDateSelected={isDateSelected}
                            isDateDisabled={isDateDisabled}
                            hasEvent={hasEvent}
                            isShowPrevButton={false}
                            isShowNextButton={true}
                            firstDayOfWeek={firstDayOfWeek}
                        />
                    </div>

                    <div className={styles.bottom}>
                        <div className={styles.inputs}>
                            <input
                                type="text"
                                className={styles.dateInput}
                                value={startDate ? format(startDate, 'MMM d, yyyy') : ''}
                                readOnly
                                aria-label="Start date"
                                placeholder="Start date"
                            />
                            <span className={styles.separator}>–</span>
                            <input
                                type="text"
                                className={styles.dateInput}
                                value={endDate ? format(endDate, 'MMM d, yyyy') : ''}
                                readOnly
                                aria-label="End date"
                                placeholder="End date"
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                onClick={onCancel}
                                className={`${styles.button} ${styles.buttonSecondary}`}
                                aria-label="Cancel date selection"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                className={`${styles.button} ${styles.buttonPrimary}`}
                                disabled={!startDate || !endDate}
                                aria-label="Apply date selection"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

DatePickerMenu.displayName = 'DatePickerMenu';

export default DatePickerMenu;
