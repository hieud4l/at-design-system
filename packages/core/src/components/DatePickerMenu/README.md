# DatePickerMenu Component

A comprehensive date range picker component for selecting date ranges with quick selection shortcuts and dual calendar interface.

## Installation

```bash
npm install date-fns
```

## Usage

### Basic Example

```tsx
import { DatePickerMenu } from '@/components/DatePickerMenu';

function MyComponent() {
  const handleApply = (startDate: Date, endDate: Date) => {
    console.log('Selected range:', startDate, endDate);
  };

  return (
    <DatePickerMenu
      defaultStartDate={new Date('2025-01-10')}
      defaultEndDate={new Date('2025-01-16')}
      onApply={handleApply}
    />
  );
}
```

### With Custom Quick Selections

```tsx
import { DatePickerMenu, QuickSelection } from '@/components/DatePickerMenu';
import { subDays, subQuarters, startOfQuarter, endOfQuarter } from 'date-fns';

const customQuickSelections: QuickSelection[] = [
  {
    label: 'Last 30 days',
    getValue: () => ({
      start: subDays(new Date(), 30),
      end: new Date()
    })
  },
  {
    label: 'Last quarter',
    getValue: () => ({
      start: startOfQuarter(subQuarters(new Date(), 1)),
      end: endOfQuarter(subQuarters(new Date(), 1))
    })
  }
];

function MyComponent() {
  return (
    <DatePickerMenu
      quickSelections={customQuickSelections}
      onApply={(start, end) => console.log(start, end)}
    />
  );
}
```

### With Event Indicators

```tsx
const eventDates = [
  new Date('2025-01-01'),
  new Date('2025-01-04'),
  new Date('2025-01-30'),
  new Date('2025-02-04'),
  new Date('2025-02-14')
];

<DatePickerMenu
  showDots={true}
  eventDates={eventDates}
  onApply={handleApply}
/>
```

### With Min/Max Constraints

```tsx
<DatePickerMenu
  minDate={new Date('2024-01-01')}
  maxDate={new Date()}
  onApply={handleApply}
  onCancel={() => console.log('Cancelled')}
/>
```

### Controlled Component

```tsx
import { useState } from 'react';
import { format } from 'date-fns';

function ControlledDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {startDate && endDate
          ? `${format(startDate, 'MMM d, yyyy')} – ${format(endDate, 'MMM d, yyyy')}`
          : 'Select date range'}
      </button>

      {isOpen && (
        <DatePickerMenu
          defaultStartDate={startDate}
          defaultEndDate={endDate}
          onApply={handleApply}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `onApply` | `(startDate: Date, endDate: Date) => void` | Callback when date range is applied |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultStartDate` | `Date \| null` | `null` | Initial start date |
| `defaultEndDate` | `Date \| null` | `null` | Initial end date |
| `minDate` | `Date \| null` | `null` | Minimum selectable date |
| `maxDate` | `Date \| null` | `null` | Maximum selectable date |
| `quickSelections` | `QuickSelection[]` | Default list | Custom quick selection options |
| `showQuickSelections` | `boolean` | `true` | Show/hide leading content |
| `locale` | `string` | `'en-US'` | Locale for date formatting |
| `firstDayOfWeek` | `0-6` | `1` | First day of week (0=Sunday, 1=Monday) |
| `showDots` | `boolean` | `false` | Show event indicators |
| `eventDates` | `Date[]` | `[]` | Dates with events (for dots) |
| `onCancel` | `() => void` | - | Callback when cancelled |
| `className` | `string` | `''` | Custom CSS class |
| `style` | `CSSProperties` | - | Inline styles |

## Types

### QuickSelection

```typescript
interface QuickSelection {
  label: string;
  getValue: () => { start: Date; end: Date };
}
```

## Features

- ✅ **Dual Calendar View**: Side-by-side month views for easy range selection
- ✅ **Quick Selections**: Predefined date ranges (Today, Yesterday, This week, etc.)
- ✅ **Visual Range Indicators**: Clear visual feedback for selected ranges
- ✅ **Event Dots**: Optional indicators for dates with events
- ✅ **Keyboard Navigation**: Full keyboard support for accessibility
- ✅ **Responsive Design**: Mobile, tablet, and desktop layouts
- ✅ **Min/Max Constraints**: Limit selectable date ranges
- ✅ **Custom Styling**: CSS variables for easy theming
- ✅ **Dark Mode Support**: Automatic dark mode detection
- ✅ **Accessibility**: WCAG AA compliant with ARIA attributes
- ✅ **TypeScript**: Full type safety

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` / `Space` | Select date or activate button |
| `Escape` | Cancel and close picker |
| `Arrow Keys` | Navigate calendar grid |
| `Home` | Move to first day of week |
| `End` | Move to last day of week |
| `Page Up` | Previous month |
| `Page Down` | Next month |

## Styling

The component uses CSS variables for theming. You can customize the appearance by overriding these variables:

```css
:root {
  /* Colors */
  --colors-background-bg-primary: #ffffff;
  --colors-background-bg-active: #fafafa;
  --colors-background-bg-brand-solid: #7f56d9;
  --colors-text-text-secondary-700: #414651;
  --colors-text-text-white: #ffffff;
  --colors-border-border-secondary: #e9eaeb;
  
  /* Spacing */
  --spacing-sm: 6px;
  --spacing-md: 8px;
  --spacing-lg: 12px;
  --spacing-xl: 16px;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
  
  /* Typography */
  --font-family-font-family-body: 'Inter', sans-serif;
  --font-size-text-sm: 14px;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
}
```

## Accessibility

The component follows WCAG 2.1 Level AA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Meets 4.5:1 ratio for text
- **Semantic HTML**: Proper use of semantic elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- `react`: ^18.0.0
- `date-fns`: ^2.30.0

## License

MIT

## Related Components

- **DatePicker**: Single date selection
- **TimePicker**: Time selection
- **DateTimePicker**: Combined date and time selection

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/your-repo/at-design-system).
