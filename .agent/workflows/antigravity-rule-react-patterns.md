---
description: React patterns for AT-DesignSystem. Covers React Context API, layout components, hooks, and composition patterns. Use when implementing context providers, layout systems, or custom hooks for components.
---

# React Patterns

## 1. React Context

### When to Use Context
- Component has deeply nested sub-components that share state.
- Parent-child communication would require excessive prop drilling.

### File Structure

```
ComponentName/
├── context/
│   └── ComponentNameContext.ts   # Context + Provider + hook
├── ComponentName.tsx
└── ...
```

### Implementation Pattern

```tsx
// context/ComponentNameContext.ts
import { createContext, useContext, useMemo, ReactNode } from "react";

interface ComponentNameContextValue {
  isOpen: boolean;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

const ComponentNameContext = createContext<ComponentNameContextValue | null>(null);

export interface ComponentNameProviderProps {
  children: ReactNode;
  isOpen: boolean;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export function ComponentNameProvider({
  children,
  isOpen,
  selectedValue,
  onSelect,
}: ComponentNameProviderProps) {
  // ALWAYS memoize the context value
  const value = useMemo(
    () => ({ isOpen, selectedValue, onSelect }),
    [isOpen, selectedValue, onSelect]
  );

  return (
    <ComponentNameContext.Provider value={value}>
      {children}
    </ComponentNameContext.Provider>
  );
}

// Custom hook with safety check
export function useComponentName(): ComponentNameContextValue {
  const context = useContext(ComponentNameContext);
  if (!context) {
    throw new Error(
      "useComponentName must be used within a ComponentNameProvider"
    );
  }
  return context;
}
```

### Context Rules

| Rule | Details |
|------|---------|
| Memoize value | Always wrap context value in `useMemo` |
| Custom hook | Always create a `useComponentName()` hook |
| Null check | Hook MUST throw if used outside Provider |
| Naming | `ComponentNameContext`, `ComponentNameProvider`, `useComponentName` |
| File location | `context/ComponentNameContext.ts` |
| Export | Export Provider and hook from `index.ts` |

## 2. Composition Patterns

### Compound Components

```tsx
// Menu component with compound pattern
import { MenuProvider, useMenu } from "./context/MenuContext";

function Menu({ children, ...props }: MenuProps) {
  return (
    <MenuProvider>
      <div className={styles.menu} {...props}>
        {children}
      </div>
    </MenuProvider>
  );
}

function MenuItem({ children, value }: MenuItemProps) {
  const { onSelect, selectedValue } = useMenu();
  return (
    <button
      className={cx(styles.menuItem, {
        [styles.selected]: selectedValue === value,
      })}
      onClick={() => onSelect(value)}
    >
      {children}
    </button>
  );
}

// Attach subcomponents
Menu.Item = MenuItem;

export default Menu;
```

### Render Props (when needed)

```tsx
interface RenderChildProps {
  isActive: boolean;
  toggle: () => void;
}

interface ToggleProps {
  children: (props: RenderChildProps) => ReactNode;
}

function Toggle({ children }: ToggleProps) {
  const [isActive, setActive] = useState(false);
  return <>{children({ isActive, toggle: () => setActive(!isActive) })}</>;
}
```

## 3. Custom Hooks

### Naming
- Always prefix with `use`: `useToggle`, `useClickOutside`, `useMediaQuery`.
- Keep hooks focused on a single responsibility.

### Pattern

```tsx
// hooks/useClickOutside.ts
import { useEffect, useRef, RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref;
}
```

### Hook Rules
- Co-locate component-specific hooks within the component directory.
- Shared hooks go in `packages/shared/src/hooks/`.
- Always clean up side effects in `useEffect` return.
- Memoize expensive computations with `useMemo`.
- Memoize callbacks with `useCallback` when passed as props or deps.

## 4. Ref Forwarding

**All components MUST forward refs:**

```tsx
const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);

ComponentName.displayName = "ComponentName";
```

### Rules
- Always specify the HTML element type as the first generic (`HTMLDivElement`, `HTMLButtonElement`, etc.).
- Always set `displayName`.
- Merge refs when the component also needs an internal ref:

```tsx
import { useMergeRefs } from "@at-design-system/shared";

const ComponentName = forwardRef<HTMLDivElement, Props>((props, externalRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(externalRef, internalRef);

  return <div ref={mergedRef} {...props} />;
});
```

## 5. Performance

- Use `React.memo` for components that receive stable props but re-render due to parent updates.
- Avoid creating new objects/arrays in render — memoize with `useMemo`.
- Avoid creating new functions in render — memoize with `useCallback`.
- Use `key` prop correctly for lists — never use array index as key for dynamic lists.
