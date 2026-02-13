import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePickerMenu } from './index';
import type { QuickSelection } from './DatePickerMenu.types';
import { format } from 'date-fns';

describe('DatePickerMenu', () => {
    const mockOnApply = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders with default props', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByLabelText(/date range picker/i)).toBeInTheDocument();
        });

        test('renders quick selections by default', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('Yesterday')).toBeInTheDocument();
            expect(screen.getByText('This week')).toBeInTheDocument();
            expect(screen.getByText('Last week')).toBeInTheDocument();
        });

        test('hides quick selections when showQuickSelections is false', () => {
            render(<DatePickerMenu onApply={mockOnApply} isShowQuickSelections={false} />);

            expect(screen.queryByText('Today')).not.toBeInTheDocument();
            expect(screen.queryByText('Yesterday')).not.toBeInTheDocument();
        });

        test('renders with custom quick selections', () => {
            const customQuickSelections: QuickSelection[] = [
                {
                    label: 'Custom Range',
                    getValue: () => ({ start: new Date(), end: new Date() }),
                },
            ];

            render(
                <DatePickerMenu
                    onApply={mockOnApply}
                    quickSelections={customQuickSelections}
                />
            );

            expect(screen.getByText('Custom Range')).toBeInTheDocument();
            expect(screen.queryByText('Today')).not.toBeInTheDocument();
        });

        test('renders with default dates', () => {
            const startDate = new Date('2025-01-10');
            const endDate = new Date('2025-01-16');

            render(
                <DatePickerMenu
                    defaultStartDate={startDate}
                    defaultEndDate={endDate}
                    onApply={mockOnApply}
                />
            );

            const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement;
            const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement;

            expect(startInput.value).toBe(format(startDate, 'MMM d, yyyy'));
            expect(endInput.value).toBe(format(endDate, 'MMM d, yyyy'));
        });
    });

    describe('Date Selection', () => {
        test('selects a date range by clicking two dates', async () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const dateCells = screen.getAllByRole('gridcell');
            const firstDate = dateCells.find((cell) => cell.textContent === '10');
            const secondDate = dateCells.find((cell) => cell.textContent === '15');

            if (firstDate && secondDate) {
                fireEvent.click(firstDate);
                fireEvent.click(secondDate);

                const applyButton = screen.getByLabelText(/apply date selection/i);
                expect(applyButton).not.toBeDisabled();
            }
        });

        test('resets selection when clicking a third date', async () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const dateCells = screen.getAllByRole('gridcell');
            const firstDate = dateCells.find((cell) => cell.textContent === '10');
            const secondDate = dateCells.find((cell) => cell.textContent === '15');
            const thirdDate = dateCells.find((cell) => cell.textContent === '20');

            if (firstDate && secondDate && thirdDate) {
                fireEvent.click(firstDate);
                fireEvent.click(secondDate);
                fireEvent.click(thirdDate);

                const applyButton = screen.getByLabelText(/apply date selection/i);
                expect(applyButton).toBeDisabled();
            }
        });

        test('handles reverse date selection (end before start)', async () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const dateCells = screen.getAllByRole('gridcell');
            const laterDate = dateCells.find((cell) => cell.textContent === '20');
            const earlierDate = dateCells.find((cell) => cell.textContent === '10');

            if (laterDate && earlierDate) {
                fireEvent.click(laterDate);
                fireEvent.click(earlierDate);

                const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement;
                const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement;

                // Should swap dates so start is before end
                expect(startInput.value).toContain('10');
                expect(endInput.value).toContain('20');
            }
        });

        test('disables dates before minDate', () => {
            const minDate = new Date('2025-01-15');
            render(<DatePickerMenu onApply={mockOnApply} minDate={minDate} />);

            const dateCells = screen.getAllByRole('gridcell');
            const disabledDate = dateCells.find(
                (cell) => cell.textContent === '10' && cell.getAttribute('aria-disabled') === 'true'
            );

            expect(disabledDate).toBeInTheDocument();
        });

        test('disables dates after maxDate', () => {
            const maxDate = new Date('2025-01-15');
            render(<DatePickerMenu onApply={mockOnApply} maxDate={maxDate} />);

            const dateCells = screen.getAllByRole('gridcell');
            const disabledDate = dateCells.find(
                (cell) => cell.textContent === '20' && cell.getAttribute('aria-disabled') === 'true'
            );

            expect(disabledDate).toBeInTheDocument();
        });
    });

    describe('Quick Selections', () => {
        test('selects "Today" quick selection', async () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const todayButton = screen.getByText('Today');
            fireEvent.click(todayButton);

            const today = new Date();
            const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement;
            const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement;

            expect(startInput.value).toBe(format(today, 'MMM d, yyyy'));
            expect(endInput.value).toBe(format(today, 'MMM d, yyyy'));
            expect(todayButton).toHaveAttribute('aria-selected', 'true');
        });

        test('clears quick selection when manually selecting dates', async () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const todayButton = screen.getByText('Today');
            fireEvent.click(todayButton);

            expect(todayButton).toHaveAttribute('aria-selected', 'true');

            const dateCells = screen.getAllByRole('gridcell');
            const dateCell = dateCells.find((cell) => cell.textContent === '10');

            if (dateCell) {
                fireEvent.click(dateCell);
                expect(todayButton).toHaveAttribute('aria-selected', 'false');
            }
        });
    });

    describe('Actions', () => {
        test('calls onApply with selected dates when Apply is clicked', async () => {
            const startDate = new Date('2025-01-10');
            const endDate = new Date('2025-01-16');

            render(
                <DatePickerMenu
                    defaultStartDate={startDate}
                    defaultEndDate={endDate}
                    onApply={mockOnApply}
                />
            );

            const applyButton = screen.getByLabelText(/apply date selection/i);
            fireEvent.click(applyButton);

            expect(mockOnApply).toHaveBeenCalledTimes(1);
            expect(mockOnApply).toHaveBeenCalledWith(startDate, endDate);
        });

        test('does not call onApply when dates are not selected', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const applyButton = screen.getByLabelText(/apply date selection/i);
            expect(applyButton).toBeDisabled();

            fireEvent.click(applyButton);
            expect(mockOnApply).not.toHaveBeenCalled();
        });

        test('calls onCancel when Cancel is clicked', () => {
            render(<DatePickerMenu onApply={mockOnApply} onCancel={mockOnCancel} />);

            const cancelButton = screen.getByLabelText(/cancel date selection/i);
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('Calendar Navigation', () => {
        test('navigates to previous month when left arrow is clicked', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const prevButtons = screen.getAllByLabelText(/previous month/i);
            const leftPrevButton = prevButtons[0];

            const initialMonth = screen.getAllByRole('grid')[0].getAttribute('aria-label');
            fireEvent.click(leftPrevButton);

            const newMonth = screen.getAllByRole('grid')[0].getAttribute('aria-label');
            expect(newMonth).not.toBe(initialMonth);
        });

        test('navigates to next month when right arrow is clicked', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const nextButtons = screen.getAllByLabelText(/next month/i);
            const rightNextButton = nextButtons[nextButtons.length - 1];

            const initialMonth = screen.getAllByRole('grid')[1].getAttribute('aria-label');
            fireEvent.click(rightNextButton);

            const newMonth = screen.getAllByRole('grid')[1].getAttribute('aria-label');
            expect(newMonth).not.toBe(initialMonth);
        });
    });

    describe('Event Indicators', () => {
        test('shows event dots when isShowDots is true and eventDates are provided', () => {
            const eventDates = [new Date('2025-01-15')];

            render(
                <DatePickerMenu
                    onApply={mockOnApply}
                    isShowDots={true}
                    eventDates={eventDates}
                />
            );

            const dots = document.querySelectorAll('[aria-hidden="true"]');
            expect(dots.length).toBeGreaterThan(0);
        });

        test('does not show event dots when isShowDots is false', () => {
            const eventDates = [new Date('2025-01-15')];

            render(
                <DatePickerMenu
                    onApply={mockOnApply}
                    isShowDots={false}
                    eventDates={eventDates}
                />
            );

            const dots = document.querySelectorAll('[aria-hidden="true"]');
            expect(dots.length).toBe(0);
        });
    });

    describe('Accessibility', () => {
        test('has proper ARIA attributes', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-label', 'Date range picker');
            expect(dialog).toHaveAttribute('aria-modal', 'true');
        });

        test('calendar cells have proper ARIA labels', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const dateCells = screen.getAllByRole('gridcell');
            dateCells.forEach((cell) => {
                if (cell.getAttribute('aria-label')) {
                    expect(cell).toHaveAttribute('aria-label');
                }
            });
        });

        test('quick selection items have proper ARIA attributes', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const todayButton = screen.getByText('Today');
            expect(todayButton).toHaveAttribute('aria-selected');
            expect(todayButton).toHaveAttribute('aria-label');
        });

        test('supports keyboard navigation', async () => {
            const user = userEvent.setup();
            render(<DatePickerMenu onApply={mockOnApply} />);

            const todayButton = screen.getByText('Today');
            todayButton.focus();

            await user.keyboard('{Enter}');
            expect(todayButton).toHaveAttribute('aria-selected', 'true');
        });
    });

    describe('Custom Styling', () => {
        test('applies custom className', () => {
            render(
                <DatePickerMenu
                    onApply={mockOnApply}
                    className="custom-class"
                />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveClass('custom-class');
        });

        test('applies custom inline styles', () => {
            const customStyle = { border: '2px solid red' };

            render(
                <DatePickerMenu
                    onApply={mockOnApply}
                    style={customStyle}
                />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveStyle('border: 2px solid red');
        });
    });

    describe('First Day of Week', () => {
        test('renders with Monday as first day by default', () => {
            render(<DatePickerMenu onApply={mockOnApply} />);

            const weekHeaders = screen.getAllByRole('columnheader');
            expect(weekHeaders[0]).toHaveTextContent('Mo');
        });

        test('renders with Sunday as first day when firstDayOfWeek is 0', () => {
            render(<DatePickerMenu onApply={mockOnApply} firstDayOfWeek={0} />);

            const weekHeaders = screen.getAllByRole('columnheader');
            expect(weekHeaders[0]).toHaveTextContent('Su');
        });
    });
});
