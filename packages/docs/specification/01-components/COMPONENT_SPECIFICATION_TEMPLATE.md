# Component Specification Template

## Overview

### Component Name
[Tên component]

### Description
[Mô tả ngắn gọn về mục đích và chức năng của component]

### Platform Support
- [ ] Web
- [ ] iOS
- [ ] Android
- [ ] React Native

---

## Visual Design

### Anatomy
[Mô tả cấu trúc component, các phần tử con]

```
┌─────────────────────────────┐
│  [Phần tử 1]                │
│  ┌───────────────────────┐  │
│  │  [Phần tử 2]          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Variants
| Variant | Description | Use Case |
|---------|-------------|----------|
| Primary | Variant chính | Hành động chính trong UI |
| Secondary | Variant phụ | Hành động phụ |
| ... | ... | ... |

### States
| State | Description | Visual Changes |
|-------|-------------|----------------|
| Default | Trạng thái mặc định | - |
| Hover | Khi hover chuột | Thay đổi màu nền, border, etc. |
| Active/Pressed | Khi click/nhấn | Thay đổi màu, shadow, etc. |
| Disabled | Không thể tương tác | Opacity giảm, cursor not-allowed |
| Focus | Khi focus (keyboard) | Border highlight, outline |
| Loading | Đang xử lý | Hiển thị spinner/skeleton |
| Error | Trạng thái lỗi | Border đỏ, icon cảnh báo |

---

## Design Tokens

### Colors
```css
/* Primary Variant */
--component-bg-primary: [token-name];
--component-text-primary: [token-name];
--component-border-primary: [token-name];

/* Secondary Variant */
--component-bg-secondary: [token-name];
--component-text-secondary: [token-name];

/* States */
--component-bg-hover: [token-name];
--component-bg-active: [token-name];
--component-bg-disabled: [token-name];
```

### Typography
```css
--component-font-family: [token-name];
--component-font-size: [token-name];
--component-font-weight: [token-name];
--component-line-height: [token-name];
--component-letter-spacing: [token-name];
```

### Spacing
```css
--component-padding-x: [token-name];
--component-padding-y: [token-name];
--component-gap: [token-name];
--component-margin: [token-name];
```

### Border & Radius
```css
--component-border-width: [token-name];
--component-border-radius: [token-name];
```

### Shadow & Effects
```css
--component-shadow: [token-name];
--component-transition: [token-name];
```

### Sizing
```css
/* Size Variants */
--component-height-small: [value];
--component-height-medium: [value];
--component-height-large: [value];

--component-min-width: [value];
--component-max-width: [value];
```

---

## Component API

### Props/Parameters

#### Required Props
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `label` | `string` | Nhãn hiển thị | - |
| ... | ... | ... | - |

#### Optional Props
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `variant` | `'primary' \| 'secondary'` | Kiểu hiển thị | `'primary'` |
| `size` | `'small' \| 'medium' \| 'large'` | Kích thước | `'medium'` |
| `disabled` | `boolean` | Vô hiệu hóa component | `false` |
| `loading` | `boolean` | Trạng thái loading | `false` |
| `icon` | `ReactNode \| string` | Icon hiển thị | `null` |
| `iconPosition` | `'left' \| 'right'` | Vị trí icon | `'left'` |
| `onClick` | `() => void` | Callback khi click | - |
| `className` | `string` | Custom CSS class | - |
| `style` | `CSSProperties` | Inline styles | - |
| ... | ... | ... | ... |

### Events
| Event | Parameters | Description |
|-------|------------|-------------|
| `onClick` | `(event: Event) => void` | Khi click vào component |
| `onFocus` | `(event: Event) => void` | Khi component được focus |
| `onBlur` | `(event: Event) => void` | Khi component mất focus |
| ... | ... | ... |

---

## Behavior

### Interaction
- **Click/Tap**: [Mô tả hành vi khi click]
- **Keyboard**: [Mô tả hỗ trợ keyboard - Tab, Enter, Space, etc.]
- **Touch**: [Mô tả hành vi trên mobile - tap, long press, etc.]

### Responsive Behavior
- **Mobile**: [Thay đổi trên mobile]
- **Tablet**: [Thay đổi trên tablet]
- **Desktop**: [Thay đổi trên desktop]

### Animation & Transitions
```css
/* Transition timing */
transition: all 200ms ease-in-out;

/* Hover animation */
transform: scale(1.02);

/* Loading animation */
@keyframes spin { ... }
```

---

## Accessibility (a11y)

### ARIA Attributes
```html
role="button"
aria-label="[Descriptive label]"
aria-disabled="true|false"
aria-pressed="true|false"
aria-busy="true|false"
tabindex="0"
```

### Keyboard Navigation
- **Tab**: Di chuyển focus đến component
- **Enter/Space**: Kích hoạt action
- **Esc**: [Nếu có - đóng modal, cancel, etc.]

### Screen Reader Support
- Đảm bảo có label rõ ràng
- Thông báo trạng thái (loading, error, success)
- Mô tả đầy đủ chức năng

### Color Contrast
- Đảm bảo contrast ratio >= 4.5:1 cho text
- Đảm bảo contrast ratio >= 3:1 cho UI elements

---

## Usage Guidelines

### When to Use
- [Tình huống 1]
- [Tình huống 2]
- [Tình huống 3]

### When NOT to Use
- [Tình huống không nên dùng 1]
- [Tình huống không nên dùng 2]

### Best Practices
✅ **DO**
- [Thực hành tốt 1]
- [Thực hành tốt 2]

❌ **DON'T**
- [Tránh làm 1]
- [Tránh làm 2]

---

## Code Examples

### Basic Usage
```tsx
<Component
  label="Click me"
  variant="primary"
  onClick={() => console.log('Clicked')}
/>
```

### With Icon
```tsx
<Component
  label="Submit"
  variant="primary"
  icon={<IconCheck />}
  iconPosition="left"
/>
```

### Loading State
```tsx
<Component
  label="Processing..."
  variant="primary"
  loading={true}
  disabled={true}
/>
```

### Disabled State
```tsx
<Component
  label="Disabled"
  variant="secondary"
  disabled={true}
/>
```

### Custom Styling
```tsx
<Component
  label="Custom"
  variant="primary"
  className="custom-class"
  style={{ width: '100%' }}
/>
```

---

## Platform-Specific Implementation

### Web (React)
```tsx
// Component structure
interface ComponentProps {
  label: string;
  variant?: 'primary' | 'secondary';
  // ... other props
}

export const Component: React.FC<ComponentProps> = ({
  label,
  variant = 'primary',
  ...props
}) => {
  return (
    <button className={`component component--${variant}`} {...props}>
      {label}
    </button>
  );
};
```

### iOS (SwiftUI)
```swift
struct Component: View {
    let label: String
    var variant: Variant = .primary
    
    var body: some View {
        Button(action: {}) {
            Text(label)
        }
        .buttonStyle(ComponentStyle(variant: variant))
    }
}
```

### Android (Jetpack Compose)
```kotlin
@Composable
fun Component(
    label: String,
    variant: Variant = Variant.Primary,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = {},
        modifier = modifier
    ) {
        Text(text = label)
    }
}
```

---

## Testing

### Unit Tests
- [ ] Render với props mặc định
- [ ] Render với tất cả variants
- [ ] Render với tất cả states
- [ ] Event handlers hoạt động đúng
- [ ] Accessibility attributes đúng

### Visual Regression Tests
- [ ] Screenshot tất cả variants
- [ ] Screenshot tất cả states
- [ ] Screenshot responsive breakpoints

### Integration Tests
- [ ] Tương tác với các components khác
- [ ] Form submission
- [ ] Navigation flows

---

## Dependencies

### Required
- [Dependency 1]: [version]
- [Dependency 2]: [version]

### Optional
- [Optional dependency 1]: [version]

---

## Migration Guide

### From Previous Version
```tsx
// Before (v1.0)
<OldComponent text="Click" type="main" />

// After (v2.0)
<Component label="Click" variant="primary" />
```

### Breaking Changes
- [Breaking change 1]
- [Breaking change 2]

---

## Related Components
- [Related Component 1]: [Mô tả mối quan hệ]
- [Related Component 2]: [Mô tả mối quan hệ]

---

## Resources
- [Figma Design](link-to-figma)
- [Storybook](link-to-storybook)
- [Code Repository](link-to-repo)
- [Design Tokens](link-to-tokens)

---

## Changelog

### Version 2.0.0 (2026-02-07)
- [Change 1]
- [Change 2]

### Version 1.0.0 (2026-01-01)
- Initial release
