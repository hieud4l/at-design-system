# DatePickerMenu Demo Page

## 🎯 Overview

This demo page showcases the **DatePickerMenu** component from the AT Design System in action. It provides three interactive demonstrations to help you understand how the component works.

## 🚀 How to Use

### Option 1: Open Directly
Simply open the `date-picker-demo.html` file in your web browser:

```bash
open demo/date-picker-demo.html
```

Or double-click the file in Finder.

### Option 2: Use a Local Server (Recommended)
For better performance and to avoid CORS issues:

```bash
# Using Python 3
cd /Users/tatrunghieu/Desktop/Vibe_coding/AT-DesignSystem
python3 -m http.server 8000

# Then open: http://localhost:8000/demo/date-picker-demo.html
```

Or using Node.js:

```bash
npx http-server -p 8000

# Then open: http://localhost:8000/demo/date-picker-demo.html
```

## 📋 Demo Sections

### 1. **Basic Date Range Picker**
- Click the button to open the date picker
- Select a start date and end date
- Click "Apply" to confirm your selection
- See the selected range displayed below

**Features demonstrated:**
- Date range selection
- Quick selections (Today, Yesterday, This week, etc.)
- Visual feedback
- Apply/Cancel actions

### 2. **Modal Date Picker**
- Opens the date picker in a modal overlay
- Better focus and user experience
- Click outside or "Cancel" to close

**Features demonstrated:**
- Modal integration
- Backdrop blur effect
- Smooth animations
- Focus management

### 3. **Customizable Date Picker**
- Configure various options
- Toggle quick selections
- Set min/max dates
- Enable event indicators

**Features demonstrated:**
- Configuration options
- Dynamic updates
- Constraints
- Event dots

## ✨ Features Showcased

### Visual Features
- ✅ Dual calendar view (side-by-side months)
- ✅ Quick selection sidebar
- ✅ Date range highlighting
- ✅ Hover effects
- ✅ Smooth animations
- ✅ Responsive design

### Functional Features
- ✅ Date range selection
- ✅ Quick date selections
- ✅ Month navigation
- ✅ Apply/Cancel actions
- ✅ Date formatting
- ✅ Duration calculation

### Design Features
- ✅ AT Design System tokens
- ✅ Beautiful gradient background
- ✅ Card-based layout
- ✅ Professional styling
- ✅ Mobile-responsive

## 🎨 Customization

The demo uses:
- **Design Tokens**: From `build/css/variables.css`
- **Component CSS**: From `src/components/DatePickerMenu/DatePickerMenu.css`
- **Date Library**: date-fns from CDN
- **Font**: Inter from Google Fonts

## 🔧 Technical Details

### Dependencies
- **date-fns**: Loaded from CDN (https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm)
- **Inter Font**: From Google Fonts
- **Design Tokens**: Local CSS variables

### Browser Support
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Implementation
- Pure HTML/CSS/JavaScript
- ES6 Modules
- Vanilla JavaScript (no framework)
- Responsive design

## 📱 Responsive Behavior

### Desktop (> 768px)
- Dual calendar side-by-side
- Full quick selections visible
- Spacious layout

### Tablet (768px - 480px)
- Stacked calendars
- Compact spacing
- Touch-friendly buttons

### Mobile (< 480px)
- Single column layout
- Full-width components
- Optimized for touch

## 🎯 Use Cases Demonstrated

1. **Basic Date Selection**
   - Simple start/end date picking
   - Quick selections for common ranges

2. **Modal Integration**
   - Date picker in overlay
   - Better UX for focused selection

3. **Custom Configuration**
   - Min/Max constraints
   - Event indicators
   - Configurable options

## 📝 Notes

### For React Implementation
This is a **vanilla JavaScript demo** for testing purposes. For production use with React, please use the actual React component:

```tsx
import { DatePickerMenu } from '@/components/DatePickerMenu';

<DatePickerMenu
  onApply={(start, end) => console.log(start, end)}
/>
```

### Design Tokens
Make sure you've built the design tokens first:

```bash
npm run build:tokens
```

This generates the CSS variables used by the demo.

## 🐛 Troubleshooting

### Issue: Styles not loading
**Solution**: Make sure design tokens are built:
```bash
npm run build:tokens
```

### Issue: Date picker not appearing
**Solution**: Check browser console for errors. Make sure date-fns CDN is accessible.

### Issue: Layout broken on mobile
**Solution**: Try refreshing the page or clearing browser cache.

## 🔗 Related Files

- **Component**: `src/components/DatePickerMenu/DatePickerMenu.tsx`
- **Styles**: `src/components/DatePickerMenu/DatePickerMenu.css`
- **Tests**: `src/components/DatePickerMenu/DatePickerMenu.test.tsx`
- **Examples**: `src/components/DatePickerMenu/DatePickerMenu.examples.tsx`
- **Docs**: `src/components/DatePickerMenu/README.md`

## 📚 Additional Resources

- [Component Specification](../guide/05-components/DATE_PICKER_MENU_SPEC.md)
- [Implementation Summary](../src/components/DatePickerMenu/IMPLEMENTATION_SUMMARY.md)
- [AT Design System Guide](../guide/)

## 💡 Tips

1. **Try Quick Selections**: Click on "Today", "This week", etc. for instant date ranges
2. **Navigate Months**: Use arrow buttons to browse different months
3. **Reverse Selection**: Click end date first, then start date - it auto-corrects!
4. **Keyboard Navigation**: Tab through elements, Enter to select
5. **Mobile Testing**: Resize browser to see responsive behavior

## 🎉 Enjoy Testing!

This demo showcases the full capabilities of the DatePickerMenu component. Feel free to interact with all the features and see how it works in different scenarios.

For questions or issues, please refer to the main documentation or component specification.

---

**Created:** 2026-02-07  
**Component Version:** 1.0.0  
**Demo Type:** Interactive HTML/JavaScript
