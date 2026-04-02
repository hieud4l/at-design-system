---
description: Styling conventions for AT-DesignSystem components. Use when writing, reviewing, or modifying SCSS/CSS files under packages/core/src/components/. Covers SCSS Modules, design tokens, naming, and anti-patterns.
---

# Styling Conventions

## 1. SCSS Modules Only

- All component styling **MUST** use SCSS Modules (`.module.scss`).
- File naming: `ComponentName.module.scss` (PascalCase, co-located with the component).
- Do NOT use global CSS files, plain `.scss`, or `.css` files for component styles.

## 2. CSS Class Naming

- All class names **MUST** be `camelCase`.
- Be descriptive and clear: `.datePickerHeader`, `.menuItemActive`, `.buttonDisabled`.
- NO BEM notation. The module scoping replaces it.

```scss
// ✅ Correct
.myComponent { }
.headerWrapper { }
.activeState { }

// ❌ Wrong
.my-component { }
.header_wrapper { }
.MyComponent { }
```

## 3. Nesting & Structure

Use CSS nesting for child elements and modifiers:

```scss
.myComponent {
  color: var(--color-text-primary-900);
  padding: var(--dimension-spacing-semantic-md);

  .childElement {
    margin-block-start: var(--dimension-spacing-semantic-xs);
  }

  &.active {
    background: var(--color-background-active);
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

## 4. Design Tokens from `@at/tokens`

### Token Source & Import

All design tokens come from the `@at/tokens` package (`packages/tokens`).
The package exports CSS custom properties and SCSS variables in multiple formats:

| Export path             | Format   | Usage                                |
|-------------------------|----------|--------------------------------------|
| `@at/tokens/css/light`  | CSS      | Runtime CSS custom properties (`:root`) |
| `@at/tokens/css/dark`   | CSS      | Dark theme CSS custom properties     |
| `@at/tokens/scss/light` | SCSS     | SCSS variables (`$variable-name`)    |
| `@at/tokens/scss/dark`  | SCSS     | SCSS dark variables                  |

### How to Import

**In SCSS Module files** — Use the `@use` directive to access SCSS variables:

```scss
@use '@at/tokens/scss/light' as tokens;

.myComponent {
  // Use CSS custom properties (preferred for theming)
  color: var(--color-text-primary-900);

  // Or SCSS variables when compile-time values are needed
  border: 1px solid tokens.$color-border-primary;
}
```

**In Storybook preview** — Import CSS tokens so they're available at runtime:

```ts
// packages/core/.storybook/preview.ts
import '@at/tokens/css/light';
```

### NEVER Hardcode Values

- **NEVER** hardcode colors, spacing, radii, shadows, or font values.
- **ALWAYS** use CSS custom properties from `@at/tokens`:

```scss
// ✅ Correct
.button {
  color: var(--color-text-primary-900);
  background: var(--color-background-primary);
  padding: var(--dimension-spacing-semantic-md) var(--dimension-spacing-semantic-lg);
  border-radius: var(--dimension-radius-md);
  box-shadow: var(--shadow-xs);
  font: var(--typography-text-sm-semibold);
}

// ❌ Wrong — hardcoded values
.button {
  color: #333333;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

// ❌ Wrong — invented token names
.button {
  color: var(--at-color-text-primary);
  padding: var(--at-space-8);
  border-radius: var(--at-radius-medium);
}
```

### Token Naming Convention Reference

All token names below are the **actual** CSS custom property names from `@at/tokens`.
Do **NOT** invent your own naming like `--at-*`. Always refer to this reference.

#### Colors

| Category       | Token Pattern                             | Example                                        |
|----------------|-------------------------------------------|-------------------------------------------------|
| **Text**       | `--color-text-{role}`                     | `--color-text-primary-900`, `--color-text-secondary-700`, `--color-text-disabled`, `--color-text-white`, `--color-text-placeholder` |
| **Foreground** | `--color-foreground-{role}`               | `--color-foreground-primary-900`, `--color-foreground-secondary-700`, `--color-foreground-quaternary-400`, `--color-foreground-disabled`, `--color-foreground-brand-primary-600` |
| **Background** | `--color-background-{role}`               | `--color-background-primary`, `--color-background-primary-hover`, `--color-background-secondary`, `--color-background-active`, `--color-background-disabled`, `--color-background-brand-solid`, `--color-background-brand-solid-hover` |
| **Border**     | `--color-border-{role}`                   | `--color-border-primary`, `--color-border-secondary`, `--color-border-brand`, `--color-border-error`, `--color-border-disabled` |
| **Error**      | `--color-text-error-primary-600`          | `--color-background-error-primary`, `--color-foreground-error-primary` |
| **Warning**    | `--color-text-warning-primary-600`        | `--color-background-warning-primary` |
| **Success**    | `--color-text-success-primary-600`        | `--color-background-success-primary` |
| **Brand**      | `--color-brand-{50-950}`                  | `--color-brand-500`, `--color-brand-600` |
| **Alpha**      | `--color-components-alpha-alpha-{color}-{value}` | `--color-components-alpha-alpha-white-10`, `--color-components-alpha-alpha-black-50` |
| **Focus Ring** | `--color-effects-focus-rings-focus-ring`  | For focus states |
| **Shadows**    | `--color-effects-shadows-shadow-{name}`   | `--color-effects-shadows-shadow-xs` |

#### Spacing

| Category              | Token Pattern                             | Example                                    |
|-----------------------|-------------------------------------------|--------------------------------------------|
| **Semantic (preferred)** | `--dimension-spacing-semantic-{size}`  | `--dimension-spacing-semantic-none` (0), `--dimension-spacing-semantic-xxs` (2px), `--dimension-spacing-semantic-xs` (4px), `--dimension-spacing-semantic-sm` (6px), `--dimension-spacing-semantic-md` (8px), `--dimension-spacing-semantic-lg` (12px), `--dimension-spacing-semantic-xl` (16px), `--dimension-spacing-semantic-2xl` (20px), `--dimension-spacing-semantic-3xl` (24px), `--dimension-spacing-semantic-4xl` (32px), `--dimension-spacing-semantic-5xl` (40px) |
| **Numeric**           | `--dimension-spacing-{scale}-{px}px`      | `--dimension-spacing-0-0px` (0), `--dimension-spacing-1-4px` (4px), `--dimension-spacing-2-8px` (8px), `--dimension-spacing-4-16px` (16px), `--dimension-spacing-10-40px` (40px) |
| **Special**           | `--dimension-spacing-2-5-10px`            | 10px |

Use **semantic spacing** tokens first. Fall back to numeric spacing only when semantic doesn't fit.

#### Border Radius

| Token                        | Value   |
|------------------------------|---------|
| `--dimension-radius-none`    | 0px     |
| `--dimension-radius-xxs`     | 2px     |
| `--dimension-radius-xs`      | 4px     |
| `--dimension-radius-sm`      | 6px     |
| `--dimension-radius-md`      | 8px     |
| `--dimension-radius-lg`      | 10px    |
| `--dimension-radius-xl`      | 12px    |
| `--dimension-radius-2xl`     | 16px    |
| `--dimension-radius-3xl`     | 20px    |
| `--dimension-radius-4xl`     | 24px    |
| `--dimension-radius-full`    | 9999px  |

#### Typography

Typography tokens use the CSS shorthand `font` property format: `{weight} {size}/{line-height} {family}`.

| Token Pattern                           | Example Value             |
|-----------------------------------------|---------------------------|
| `--typography-display-{size}-{weight}`  | `--typography-display-xl-bold` → `700 60px/72px Inter` |
| `--typography-text-{size}-{weight}`     | `--typography-text-sm-medium` → `500 14px/20px Inter` |

Available sizes: `2xl`, `xl`, `lg`, `md`, `sm`, `xs`
Available weights: `regular`, `medium`, `semibold`, `bold`

Usage:
```scss
.heading {
  font: var(--typography-display-sm-semibold);
}

.body {
  font: var(--typography-text-md-regular);
}

.label {
  font: var(--typography-text-sm-medium);
}
```

#### Shadows

| Token           | Description               |
|-----------------|---------------------------|
| `--shadow-xs`   | Extra small shadow        |
| `--shadow-sm`   | Small shadow              |
| `--shadow-md`   | Medium shadow             |
| `--shadow-lg`   | Large shadow              |
| `--shadow-xl`   | Extra large shadow        |
| `--shadow-2xl`  | 2× extra large shadow     |
| `--shadow-3xl`  | 3× extra large shadow     |
| `--shadow-focus-rings-standard` | Focus ring shadow |
| `--shadow-focus-rings-error`    | Error focus ring  |

#### Font Family & Weight

| Token                                 | Value             |
|---------------------------------------|-------------------|
| `--string-font-family-display`        | Inter             |
| `--string-font-family-body`           | Inter             |
| `--string-font-weight-regular`        | Regular           |
| `--string-font-weight-medium`         | Medium            |
| `--string-font-weight-semibold`       | Semibold          |
| `--string-font-weight-bold`           | Bold              |

#### Individual Font Size & Line Height

| Token                                  | Value   |
|----------------------------------------|---------|
| `--dimension-font-size-text-xs`        | 12px    |
| `--dimension-font-size-text-sm`        | 14px    |
| `--dimension-font-size-text-md`        | 16px    |
| `--dimension-font-size-text-lg`        | 18px    |
| `--dimension-font-size-text-xl`        | 20px    |
| `--dimension-font-size-display-xs`     | 24px    |
| `--dimension-font-size-display-sm`     | 30px    |
| `--dimension-font-size-display-md`     | 36px    |
| `--dimension-font-size-display-lg`     | 48px    |
| `--dimension-font-size-display-xl`     | 60px    |
| `--dimension-font-size-display-2xl`    | 72px    |
| `--dimension-line-height-text-xs`      | 18px    |
| `--dimension-line-height-text-sm`      | 20px    |
| `--dimension-line-height-text-md`      | 24px    |

> **Tip:** Prefer `--typography-text-{size}-{weight}` shorthand over individual font-size + line-height tokens.

### Quick Token Lookup

For common styling needs:

```scss
// Background & borders
background: var(--color-background-primary);           // white
background: var(--color-background-primary-hover);      // hover state
background: var(--color-background-active);             // active state
background: var(--color-background-brand-solid);        // brand purple
border-color: var(--color-border-primary);              // main border
border-color: var(--color-border-secondary);            // subtle border

// Text
color: var(--color-text-primary-900);                   // primary text
color: var(--color-text-secondary-700);                 // secondary text
color: var(--color-text-disabled);                      // disabled text
color: var(--color-text-white);                         // white text

// Spacing (semantic — preferred)
padding: var(--dimension-spacing-semantic-md);          // 8px
padding: var(--dimension-spacing-semantic-lg);          // 12px
padding: var(--dimension-spacing-semantic-xl);          // 16px
gap: var(--dimension-spacing-semantic-lg);              // 12px

// Radius
border-radius: var(--dimension-radius-sm);              // 6px
border-radius: var(--dimension-radius-md);              // 8px
border-radius: var(--dimension-radius-2xl);             // 16px
border-radius: var(--dimension-radius-full);            // pill

// Shadow
box-shadow: var(--shadow-xs);                           // subtle
box-shadow: var(--shadow-md);                           // medium
box-shadow: var(--shadow-xl);                           // prominent

// Typography
font: var(--typography-text-sm-regular);                // body small
font: var(--typography-text-sm-medium);                 // label
font: var(--typography-text-sm-semibold);               // strong label
font: var(--typography-text-md-regular);                // body
font: var(--typography-display-sm-semibold);            // heading

// Focus ring
outline: 2px solid var(--color-effects-focus-rings-focus-ring);
outline-offset: 2px;

// Transitions
transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
```

## 5. TypeScript Support for SCSS Modules

A global type declaration file **MUST** exist at `packages/core/src/global.d.ts`:

```ts
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

This ensures `import styles from './Component.module.scss'` works without TypeScript errors.

## 6. Logical CSS Properties

**ALWAYS** use logical properties for RTL/internationalization support:

| ❌ Physical Property | ✅ Logical Property |
|---------------------|-------------------|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `top` | `inset-block-start` |
| `bottom` | `inset-block-end` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |

## 7. Accessibility Styles

**ALWAYS** include these accessibility considerations:

```scss
// Focus states — required on ALL interactive elements
.interactiveElement {
  &:focus-visible {
    outline: 2px solid var(--color-effects-focus-rings-focus-ring);
    outline-offset: 2px;
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .container {
    border: 2px solid currentColor;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
    animation: none;
  }
}
```

## 8. Browser Compatibility

- Target **Chrome 85+** minimum.
- For newer CSS APIs, use `@supports` with fallbacks:

```scss
.element {
  display: flex; // fallback

  @supports (display: grid) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## 9. Anti-Patterns (NEVER DO)

| Anti-Pattern | Why |
|---|---|
| `:global()` | Defeats module scoping, causes side effects |
| `!important` | Causes specificity wars, unmaintainable |
| Theme-specific overrides in component SCSS (e.g., `.dark-theme &`) | Components must be theme-agnostic via tokens |
| Targeting internal components with `[data-*]`, element selectors | Use `className` prop instead |
| Media queries / responsive styles | Only when explicitly requested |
| Mixins from external packages | Write CSS directly, keep styles self-contained |
| Hardcoded colors or spacing values | Always use design tokens |
| Invented token names like `--at-*` | Use the **exact** names from `@at/tokens` |
| Using raw hex/rgb/hsl colors | Use `var(--color-*)` tokens |

## 10. Component className Prop

When styling internal/child components, **ALWAYS** pass styles via `className` prop:

```tsx
// ✅ Correct
<ChildComponent className={styles.childOverride} />

// ❌ Wrong (targeting child's internals in parent SCSS)
.parent {
  [data-testid="ChildComponent"] {
    color: red;
  }
}
```
