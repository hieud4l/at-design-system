import { useMemo } from 'react';
import type { FC } from 'react';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    format,
    endOfWeek,
    startOfWeek as getStartOfWeek,
} from 'date-fns';
import styles from './DatePickerMenu.module.scss';
import { CalendarPickerProps } from './DatePickerMenu.types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const CalendarPicker: FC<CalendarPickerProps> = ({
    month,
    onPrevMonth,
    onNextMonth,
    onDateClick,
    onDateHover,
    isDateInRange,
    isDateSelected,
    isDateDisabled,
    hasEvent,
    isShowPrevButton,
    isShowNextButton,
    firstDayOfWeek,
}) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = getStartOfWeek(monthStart, { weekStartsOn: firstDayOfWeek });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeek });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = useMemo(() => {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)];
    }, [firstDayOfWeek]);

    const buildCellClassName = (date: Date) => {
        const isCurrentMonth = isSameMonth(date, month);
        const selected = isDateSelected(date);
        const inRange = isDateInRange(date);
        const disabled = isDateDisabled(date);
        const isToday = isSameDay(date, new Date());

        return [
            styles.cell,
            !isCurrentMonth && styles.cellOutsideMonth,
            selected && styles.cellSelected,
            inRange && !selected && styles.cellInRange,
            disabled && styles.cellDisabled,
            isToday && styles.cellToday,
        ]
            .filter(Boolean)
            .join(' ');
    };

    return (
        <div
            className={styles.calendarPicker}
            role="grid"
            aria-label={format(month, 'MMMM yyyy')}
        >
            <div className={styles.calendarHeader}>
                <button
                    className={`${styles.navButton} ${!isShowPrevButton ? styles.invisible : ''}`}
                    onClick={onPrevMonth}
                    disabled={!isShowPrevButton}
                    aria-label="Previous month"
                >
                    <ChevronLeftIcon />
                </button>
                <div className={styles.monthLabel}>{format(month, 'MMMM yyyy')}</div>
                <button
                    className={`${styles.navButton} ${!isShowNextButton ? styles.invisible : ''}`}
                    onClick={onNextMonth}
                    disabled={!isShowNextButton}
                    aria-label="Next month"
                >
                    <ChevronRightIcon />
                </button>
            </div>

            <div className={styles.calendarGrid}>
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className={`${styles.cell} ${styles.cellHeader}`}
                        role="columnheader"
                    >
                        {day}
                    </div>
                ))}

                {calendarDays.map((date) => {
                    const disabled = isDateDisabled(date);
                    const hasEventDot = hasEvent(date);

                    return (
                        <button
                            key={date.toISOString()}
                            className={buildCellClassName(date)}
                            onClick={() => !disabled && onDateClick(date)}
                            onMouseEnter={() => !disabled && onDateHover(date)}
                            onMouseLeave={() => onDateHover(null)}
                            disabled={disabled}
                            role="gridcell"
                            aria-label={format(date, 'MMMM d, yyyy')}
                            aria-selected={isDateSelected(date)}
                            aria-disabled={disabled}
                        >
                            <span className={styles.cellText}>{format(date, 'd')}</span>
                            {hasEventDot && <span className={styles.cellDot} aria-hidden="true" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

CalendarPicker.displayName = 'CalendarPicker';

export default CalendarPicker;
