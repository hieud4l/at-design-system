import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerMenu } from './index';
import type { DatePickerMenuProps } from './DatePickerMenu.types';

const meta = {
    title: 'Components/DatePickerMenu',
    component: DatePickerMenu,
    parameters: {
        layout: 'centered',
    },

    argTypes: {
        defaultStartDate: {
            control: 'date',
            description: 'Initial start date',
        },
        defaultEndDate: {
            control: 'date',
            description: 'Initial end date',
        },
        isShowQuickSelections: {
            control: 'boolean',
            description: 'Whether to show the quick selections panel',
        },
        isShowDots: {
            control: 'boolean',
            description: 'Whether to show event indicator dots',
        },
        firstDayOfWeek: {
            control: { type: 'select' },
            options: [0, 1, 2, 3, 4, 5, 6],
            description: 'First day of the week (0=Sun, 1=Mon)',
        },
        onApply: {
            action: 'applied',
            description: 'Callback when Apply is clicked',
        },
        onCancel: {
            action: 'cancelled',
            description: 'Callback when Cancel is clicked',
        },
    },
} satisfies Meta<typeof DatePickerMenu>;

export default meta;
type Story = StoryObj<typeof DatePickerMenu>;

/**
 * Overview — Default interactive story.
 * Shows the date picker in its default state with quick selections panel.
 */
export const Overview: Story = {
    render: (args: DatePickerMenuProps) => <DatePickerMenu {...args} />,
};

/**
 * With preselected dates.
 * The date picker opens with a pre-set date range highlighted.
 */
export const WithPreselectedDates: Story = {
    render: () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        return (
            <DatePickerMenu
                defaultStartDate={sevenDaysAgo}
                defaultEndDate={today}
                onApply={(start, end) => console.log('Applied:', start, end)}
                onCancel={() => console.log('Cancelled')}
            />
        );
    },
};

/**
 * Without quick selections panel.
 * Shows only the dual calendar UI.
 */
export const WithoutQuickSelections: Story = {
    render: () => (
        <DatePickerMenu
            isShowQuickSelections={false}
            onApply={(start, end) => console.log('Applied:', start, end)}
            onCancel={() => console.log('Cancelled')}
        />
    ),
};

/**
 * With min/max date constraints.
 * Disables dates outside the allowed range.
 */
export const WithMinMaxDates: Story = {
    render: () => {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() - 30);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 30);

        return (
            <DatePickerMenu
                minDate={minDate}
                maxDate={maxDate}
                onApply={(start, end) => console.log('Applied:', start, end)}
                onCancel={() => console.log('Cancelled')}
            />
        );
    },
};

/**
 * With event dots visible.
 * Shows small dots beneath dates that have events.
 */
export const WithEventDots: Story = {
    render: () => {
        const today = new Date();
        const eventDates = [
            new Date(today.getFullYear(), today.getMonth(), 5),
            new Date(today.getFullYear(), today.getMonth(), 12),
            new Date(today.getFullYear(), today.getMonth(), 18),
            new Date(today.getFullYear(), today.getMonth(), 25),
        ];

        return (
            <DatePickerMenu
                isShowDots={true}
                eventDates={eventDates}
                onApply={(start, end) => console.log('Applied:', start, end)}
                onCancel={() => console.log('Cancelled')}
            />
        );
    },
};

/**
 * Week starting on Sunday.
 * Calendar grid starts with Sunday as the first column.
 */
export const SundayFirstDay: Story = {
    render: () => (
        <DatePickerMenu
            firstDayOfWeek={0}
            onApply={(start, end) => console.log('Applied:', start, end)}
            onCancel={() => console.log('Cancelled')}
        />
    ),
};
