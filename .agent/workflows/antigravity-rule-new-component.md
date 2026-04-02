---
description: Step-by-step guide for implementing a new component in AT-DesignSystem. Use when asked to create, scaffold, or add a new component to the design system.
---

# New Component Implementation Guide

## Pre-Implementation Checklist

Before creating a new component, verify:
- [ ] Component name follows PascalCase convention
- [ ] No existing component with the same name
- [ ] Component purpose and API are well-defined
- [ ] Design tokens exist in `packages/tokens` for any new visual patterns

## Step-by-Step Process

### Step 1: Create Directory Structure

// turbo
```bash
mkdir -p packages/core/src/components/ComponentName
```

### Step 2: Create Type Definitions

Create `ComponentName.types.ts`:

```tsx
import { HTMLAttributes, ReactNode } from "react";

export type ComponentNameVariant = "primary" | "secondary" | "tertiary";
export type ComponentNameSize = "small" | "medium" | "large";

export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to render inside the component */
  children?: ReactNode;
  /** Visual variant of the component */
  variant?: ComponentNameVariant;
  /** Size of the component */
  size?: ComponentNameSize;
  /** Whether the component is disabled */
  isDisabled?: boolean;
  /** Additional class name for custom styling */
  className?: string;
  /** Accessible label for the component */
  ariaLabel?: string;
}
```

**Rules:**
- Use string union types (NOT enums) for all new prop types.
- Extend appropriate HTML element attributes.
- Document every prop with JSDoc comments.
- Boolean props MUST have `is` or `has` prefix.
- Include `className` and `ariaLabel` props.

### Step 3: Create SCSS Module

Create `ComponentName.module.scss`:

> **IMPORTANT:** All CSS custom property names MUST match the actual names in `@at/tokens`.
> See `/antigravity-rule-styling` for the full token reference.
> Do **NOT** invent names like `--at-*`.

```scss
.componentName {
  // Use design tokens from @at/tokens — these are the ACTUAL token names
  color: var(--color-text-primary-900);
  background: var(--color-background-primary);
  padding: var(--dimension-spacing-semantic-md);
  border-radius: var(--dimension-radius-md);
  font: var(--typography-text-md-regular);

  &.small {
    padding: var(--dimension-spacing-semantic-xs);
    font: var(--typography-text-sm-regular);
  }

  &.medium {
    padding: var(--dimension-spacing-semantic-md);
  }

  &.large {
    padding: var(--dimension-spacing-semantic-lg);
    font: var(--typography-text-lg-regular);
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
    color: var(--color-text-disabled);
  }

  // Focus state — required for accessibility
  &:focus-visible {
    outline: 2px solid var(--color-effects-focus-rings-focus-ring);
    outline-offset: 2px;
  }
}
```

**Rules:**
- Use `.module.scss` extension ONLY.
- camelCase class names.
- Always use design tokens via CSS custom properties from `@at/tokens`.
- Use logical CSS properties for RTL support (e.g., `margin-inline-start` not `margin-left`).
- Include `:focus-visible` styles on interactive elements.
- NO `:global`, NO `!important`, NO theme-specific overrides.
- NO invented token names.

### Step 4: Create Component Implementation

Create `ComponentName.tsx`:

```tsx
import { forwardRef } from "react";
import cx from "classnames"; // or build className manually
import styles from "./ComponentName.module.scss";
import { ComponentNameProps } from "./ComponentName.types";

const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      isDisabled = false,
      className,
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    const rootClassName = cx(
      styles.componentName,
      styles[variant],
      styles[size],
      {
        [styles.disabled]: isDisabled,
      },
      className
    );

    return (
      <div
        ref={ref}
        className={rootClassName}
        aria-label={ariaLabel}
        aria-disabled={isDisabled || undefined}
        data-testid="ComponentName"
        {...rest}
      >
        {children}
      </div>
    );
  }
);

ComponentName.displayName = "ComponentName";
export default ComponentName;
```

**Rules:**
- Always use `forwardRef`.
- Set sensible default prop values.
- Add `data-testid` for testing.
- Spread remaining props (`...rest`) on the root element.
- Use `aria-*` attributes for accessibility.

### Step 5: Create Barrel Export

Create `index.ts`:

```tsx
export { ComponentName } from "./ComponentName";
export type {
  ComponentNameProps,
  ComponentNameVariant,
  ComponentNameSize,
} from "./ComponentName.types";
```

**Rules:**
- Use **named exports only** (no `default` re-export).
- Export types from the `.types.ts` file.

### Step 6: Register in Core Package

Update `packages/core/src/components/index.ts`:

```tsx
export * from "./ComponentName";
```

### Step 7: Create Storybook Story

Create `ComponentName.stories.tsx` (see `/antigravity-rule-storybook` for detailed guidelines):

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./index";

type Story = StoryObj<typeof ComponentName>;

export default {
  title: "Components/ComponentName",
  component: ComponentName,
} satisfies Meta<typeof ComponentName>;

export const Overview: Story = {
  render: (args) => <ComponentName {...args}>Hello World</ComponentName>,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="tertiary">Tertiary</ComponentName>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <ComponentName size="small">Small</ComponentName>
      <ComponentName size="medium">Medium</ComponentName>
      <ComponentName size="large">Large</ComponentName>
    </div>
  ),
};
```

### Step 8: Create Unit Tests

Create `ComponentName.test.tsx`:

```tsx
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentName } from "./index";

describe("ComponentName", () => {
  it("renders children correctly", () => {
    render(<ComponentName>Test content</ComponentName>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ComponentName className="custom">Content</ComponentName>);
    expect(screen.getByTestId("ComponentName")).toHaveClass("custom");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ComponentName ref={ref}>Content</ComponentName>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies disabled state", () => {
    render(<ComponentName isDisabled>Content</ComponentName>);
    expect(screen.getByTestId("ComponentName")).toHaveAttribute("aria-disabled", "true");
  });
});
```

## Post-Implementation Checklist

- [ ] Component renders correctly in Storybook
- [ ] All props work as documented
- [ ] Tests pass (`npm test --workspace=packages/core`)
- [ ] TypeScript passes (`npx tsc --noEmit`)
- [ ] Accessibility attributes are present (aria-*, focus-visible, data-testid)
- [ ] Design tokens from `@at/tokens` are used (no hardcoded colors/spacing)
- [ ] No unused imports (especially no `import React`)
- [ ] Component is exported from `packages/core/src/components/index.ts`
- [ ] `global.d.ts` exists for SCSS module type declarations
