---
description: Rules for component file structure, naming conventions, and internal organization in AT-DesignSystem. Use when creating, modifying, or reviewing any component under packages/core/src/components/.
---

# Component Structure & Naming Rules

## 1. Directory Structure

Every component MUST follow this directory structure:

```
packages/core/src/components/ComponentName/
├── ComponentName.tsx            # Main component implementation
├── ComponentName.types.ts       # TypeScript type definitions
├── ComponentName.module.scss    # SCSS Module styles
├── ComponentName.test.tsx       # Unit tests
├── ComponentName.stories.tsx    # Storybook stories
├── ComponentName.mdx            # MDX documentation (optional, can be in docs package)
├── ComponentNameConstants.ts    # Constants and deprecated enums (if needed)
├── index.ts                     # Barrel exports
├── context/                     # React Context files (if needed)
│   └── ComponentNameContext.ts
└── __tests__/                   # Additional test files (if needed)
```

## 2. File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase | `DatePickerMenu.tsx` |
| Type files | PascalCase + `.types.ts` | `DatePickerMenu.types.ts` |
| Style files | PascalCase + `.module.scss` | `DatePickerMenu.module.scss` |
| Test files | PascalCase + `.test.tsx` | `DatePickerMenu.test.tsx` |
| Story files | PascalCase + `.stories.tsx` | `DatePickerMenu.stories.tsx` |
| Constants | PascalCase + `Constants.ts` | `DatePickerMenuConstants.ts` |
| Index files | lowercase | `index.ts` |

## 3. Naming Conventions

### Props & Variables
- Use **camelCase** for all props, variables, and function names.
- Boolean props **MUST** use `is` or `has` prefix: `isOpen`, `hasError`, `isDisabled`.
- Event handler props **MUST** use `on` prefix: `onChange`, `onClose`, `onClick`.

### Component Names
- Use **PascalCase** for component names: `DatePickerMenu`, `Button`, `TextField`.
- Subcomponents use parent prefix: `DatePickerMenuHeader`, `DatePickerMenuFooter`.

### CSS Classes
- Use **camelCase** for all CSS class names: `.datePickerMenu`, `.headerWrapper`, `.activeState`.

## 4. Component Internal Structure

### Implementation Pattern

```tsx
import React, { forwardRef } from "react";
import styles from "./ComponentName.module.scss";
import { ComponentNameProps } from "./ComponentName.types";

const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={styles.componentName}
        data-testid="ComponentName"
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComponentName.displayName = "ComponentName";
export default ComponentName;
```

### Key Requirements
1. **Always use `forwardRef`** for all components.
2. **Always set `displayName`** on the component.
3. **Always add `data-testid`** for testing purposes.
4. **Always accept `className` prop** for consumer styling.
5. **Export as default** from the component file, then **re-export as named** from `index.ts`.

## 5. Type Definitions

Types MUST be in a separate `.types.ts` file:

```tsx
// ComponentName.types.ts
import { HTMLAttributes } from "react";

export type ComponentNameSize = "small" | "medium" | "large";

export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  /** The size variant */
  size?: ComponentNameSize;
  /** Whether the component is disabled */
  isDisabled?: boolean;
  /** Callback fired when value changes */
  onChange?: (value: string) => void;
}
```

### Type Rules
- Prefer **string union types** over enums for new code.
- If enums exist (legacy), mark them as `@deprecated`.
- Export all public types from `index.ts`.

## 6. Index File (Barrel Exports)

```tsx
// index.ts
export { default as ComponentName } from "./ComponentName";
export type { ComponentNameProps, ComponentNameSize } from "./ComponentName.types";
```

- Use **named exports** (not default) at the package level.
- Export the component AND all public types.
- Do NOT re-export internal utilities or constants.
