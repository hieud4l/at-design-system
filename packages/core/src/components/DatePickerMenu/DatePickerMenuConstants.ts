import {
    subDays,
    subWeeks,
    subMonths,
    subYears,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
} from 'date-fns';
import type { QuickSelection } from './DatePickerMenu.types';

export const DEFAULT_QUICK_SELECTIONS: QuickSelection[] = [
    {
        label: 'Today',
        getValue: () => {
            const today = new Date();
            return { start: today, end: today };
        },
    },
    {
        label: 'Yesterday',
        getValue: () => {
            const yesterday = subDays(new Date(), 1);
            return { start: yesterday, end: yesterday };
        },
    },
    {
        label: 'This week',
        getValue: () => {
            const today = new Date();
            return {
                start: startOfWeek(today, { weekStartsOn: 1 }),
                end: today,
            };
        },
    },
    {
        label: 'Last week',
        getValue: () => {
            const lastWeek = subWeeks(new Date(), 1);
            return {
                start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
                end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
            };
        },
    },
    {
        label: 'This month',
        getValue: () => {
            const today = new Date();
            return {
                start: startOfMonth(today),
                end: today,
            };
        },
    },
    {
        label: 'Last month',
        getValue: () => {
            const lastMonth = subMonths(new Date(), 1);
            return {
                start: startOfMonth(lastMonth),
                end: endOfMonth(lastMonth),
            };
        },
    },
    {
        label: 'This year',
        getValue: () => {
            const today = new Date();
            return {
                start: startOfYear(today),
                end: today,
            };
        },
    },
    {
        label: 'Last year',
        getValue: () => {
            const lastYear = subYears(new Date(), 1);
            return {
                start: startOfYear(lastYear),
                end: endOfMonth(new Date(lastYear.getFullYear(), 11, 31)),
            };
        },
    },
    {
        label: 'All time',
        getValue: () => {
            return {
                start: new Date(2020, 0, 1),
                end: new Date(),
            };
        },
    },
];
