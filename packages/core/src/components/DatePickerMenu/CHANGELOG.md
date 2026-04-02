# Changelog

All notable changes to the DatePickerMenu component will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-07

### Added
- Initial release of DatePickerMenu component
- Dual calendar view for date range selection
- Quick selection shortcuts (Today, Yesterday, This week, etc.)
- Visual range indicators with hover preview
- Event indicator dots for dates with events
- Keyboard navigation support (Tab, Arrow keys, Enter, Escape)
- Responsive design for mobile, tablet, and desktop
- Min/Max date constraints
- Custom quick selections support
- Accessibility features (ARIA attributes, screen reader support)
- Dark mode support via CSS variables
- TypeScript support with full type definitions
- Comprehensive unit tests
- Usage examples and documentation
- CSS variables for easy theming
- Print-friendly styles
- High contrast mode support
- Reduced motion support

### Features
- **Date Selection**: Click to select start and end dates
- **Quick Selections**: Predefined date ranges for common use cases
- **Range Preview**: Hover to preview date range before selection
- **Calendar Navigation**: Navigate between months with arrow buttons
- **Input Fields**: Display selected dates in formatted inputs
- **Actions**: Apply or cancel date selection
- **Event Indicators**: Show dots on dates with events
- **Constraints**: Limit selectable dates with min/max
- **Customization**: Custom quick selections, styling, and first day of week
- **Accessibility**: Full keyboard support and ARIA attributes
- **Responsive**: Adapts to mobile, tablet, and desktop screens
- **Dark Mode**: Automatic dark mode detection and support
- **Theming**: CSS variables for easy customization

### Dependencies
- react: ^18.0.0
- date-fns: ^2.30.0

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility
- WCAG 2.1 Level AA compliant
- Full keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

### Documentation
- Component specification
- API reference
- Usage examples
- TypeScript definitions
- Unit tests
- README with installation and usage guide

---

## Future Enhancements (Planned)

### [1.1.0] - TBD
- [ ] Time selection support
- [ ] Multiple date range selection
- [ ] Custom date formats
- [ ] Localization support (i18n)
- [ ] Custom calendar cell rendering
- [ ] Preset date ranges (e.g., "Last 7 days", "Last 30 days")
- [ ] Integration with form libraries (React Hook Form, Formik)
- [ ] Storybook stories
- [ ] Visual regression tests
- [ ] Performance optimizations

### [1.2.0] - TBD
- [ ] Year/Month picker mode
- [ ] Week picker mode
- [ ] Quarter picker mode
- [ ] Custom event rendering
- [ ] Drag to select range
- [ ] Touch gestures for mobile
- [ ] Animation customization
- [ ] Custom icons support

### [2.0.0] - TBD
- [ ] Headless component variant
- [ ] Unstyled component variant
- [ ] Custom calendar layouts
- [ ] Advanced filtering options
- [ ] Integration with analytics
- [ ] Server-side rendering (SSR) support
- [ ] React Server Components support

---

## Migration Guides

### Migrating to 1.0.0
This is the initial release. No migration needed.

---

## Notes

### Breaking Changes
None (initial release)

### Deprecations
None (initial release)

### Known Issues
None

### Security
No security issues reported

---

## Contributors
- Initial implementation based on AT Design System specification
- Design by AT Design System team
- Development by Hieu Tran

---

## License
MIT License - See LICENSE file for details
