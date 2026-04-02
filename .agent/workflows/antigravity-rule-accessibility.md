---
description: Accessibility guidelines for AT-DesignSystem components. Use when creating or reviewing components to ensure they meet accessibility standards (WCAG).
---

# Accessibility Guidelines

## 1. Core Principles

Every component in AT-DesignSystem **MUST** be accessible. This includes:
- Keyboard navigable
- Screen reader compatible
- Sufficient color contrast
- Meaningful ARIA attributes

## 2. Required Attributes

### Data Test ID
Every component root element MUST have a `data-testid` attribute:

```tsx
<div data-testid="ComponentName" {...props}>
```

### ARIA Labels
- Interactive components MUST accept an `ariaLabel` prop.
- If the component has no visible text, `aria-label` is **REQUIRED**.
- Use `aria-labelledby` when a visible label exists elsewhere.

```tsx
// ✅ Button with visible text — label implicit
<button>Submit</button>

// ✅ Icon button — needs aria-label
<button aria-label="Close dialog">
  <CloseIcon />
</button>

// ✅ Linked label
<label id="search-label">Search</label>
<input aria-labelledby="search-label" />
```

### ARIA States
Map component states to ARIA attributes:

| Component State | ARIA Attribute |
|----------------|----------------|
| Disabled | `aria-disabled="true"` |
| Expanded | `aria-expanded="true/false"` |
| Selected | `aria-selected="true"` |
| Checked | `aria-checked="true/false"` |
| Loading | `aria-busy="true"` |
| Has popup | `aria-haspopup="true"` |
| Required | `aria-required="true"` |
| Invalid | `aria-invalid="true"` |

## 3. Keyboard Navigation

### Focus Management
- All interactive elements **MUST** be focusable.
- Use `tabIndex={0}` for custom interactive elements.
- Use `tabIndex={-1}` for programmatic focus only.
- Never set `tabIndex` higher than 0.

### Keyboard Patterns
- **Escape**: Close modals, popups, dropdowns.
- **Enter / Space**: Activate buttons, toggle checkboxes.
- **Arrow keys**: Navigate within lists, menus, tabs.
- **Tab**: Move between interactive elements.
- **Home / End**: Jump to first/last item in a list.

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case "Escape":
      onClose?.();
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      onActivate?.();
      break;
    case "ArrowDown":
      e.preventDefault();
      focusNextItem();
      break;
    case "ArrowUp":
      e.preventDefault();
      focusPreviousItem();
      break;
  }
};
```

### Focus Styles
- **NEVER** remove `outline` without providing a visible alternative.
- Use design tokens for focus ring styling:

```scss
// Use the actual token names from @at/tokens
.interactive {
  &:focus-visible {
    outline: 2px solid var(--color-effects-focus-rings-focus-ring);
    outline-offset: 2px;
    // Alternative: use focus ring shadow token
    // box-shadow: var(--shadow-focus-rings-standard);
  }
}
```

## 4. Semantic HTML

- Use the correct HTML element for the job.
- Prefer `<button>` over `<div onClick>`.
- Use `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>` landmarks.
- Use heading hierarchy correctly (`<h1>` → `<h2>` → `<h3>`).

| Need | Use |
|------|-----|
| Clickable action | `<button>` |
| Navigation link | `<a href>` |
| List of items | `<ul>/<ol>` with `<li>` |
| Tabular data | `<table>` |
| Form input | `<input>`, `<select>`, `<textarea>` |
| Section heading | `<h2>`, `<h3>`, etc. |

## 5. Color Contrast

- Text must meet WCAG AA standards: **4.5:1** for normal text, **3:1** for large text.
- Use design tokens — they are designed to meet contrast requirements.
- Never rely on color alone to convey information (add icons, text, or patterns).

## 6. Testing Accessibility

Always test:
- [ ] Tab through all interactive elements
- [ ] Verify screen reader announces component purpose
- [ ] Check focus is visible on every interactive element
- [ ] Verify Escape closes overlays/popups
- [ ] Check color contrast with browser devtools
