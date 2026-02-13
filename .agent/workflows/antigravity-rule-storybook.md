---
description: Storybook conventions for AT-DesignSystem. Use when writing, reviewing, or modifying Storybook stories (.stories.tsx) or MDX documentation files for components.
---

# Storybook Conventions

## 1. File Format

- Stories MUST use **CSF 3.0** format with TypeScript.
- File extension: `ComponentName.stories.tsx`.
- Documentation (optional): `ComponentName.mdx`.
- Co-locate with the component in its directory.

## 2. Story File Structure

```tsx
import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./index";

type Story = StoryObj<typeof ComponentName>;

export default {
  title: "Components/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

// First story MUST be "Overview" — interactive with args
export const Overview: Story = {
  render: (args) => <ComponentName {...args}>Default content</ComponentName>,
};

// Additional stories show specific use cases
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
    </div>
  ),
};
```

## 3. Story Rules

| Rule | Details |
|------|---------|
| First story is `Overview` | Must use `render: (args) => ...` pattern for interactivity |
| All stories have `render` | Every story must explicitly define a `render` function |
| No `args` in stories | Do NOT define `args` on individual story objects |
| Use `satisfies Meta` | Ensures type safety on the default export |
| Use named exports | Each story is a named export (`export const StoryName`) |

## 4. Story Organization

Stories should cover these cases (when applicable):

1. **Overview** — Interactive playground (always first)
2. **Variants** — All visual variants side by side
3. **Sizes** — All size options
4. **States** — Disabled, loading, error, active states
5. **WithIcons** / **WithContent** — Component composition examples
6. **Controlled** — Controlled behavior demo (if applicable)

## 5. Meta Configuration

```tsx
export default {
  title: "Components/ComponentName",  // Category/Name hierarchy
  component: ComponentName,
  tags: ["autodocs"],                 // Enable auto-generated docs page
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select", 
      options: ["small", "medium", "large"],
    },
    isDisabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ComponentName>;
```

## 6. Examples File (Optional)

For complex components, you can also create a `ComponentName.examples.tsx` file with reusable example components:

```tsx
// ComponentName.examples.tsx
import React from "react";
import { ComponentName } from "./index";

export const BasicExample = () => (
  <ComponentName variant="primary">Basic usage</ComponentName>
);

export const ComplexExample = () => {
  const [value, setValue] = React.useState("");
  return (
    <ComponentName
      variant="primary"
      onChange={setValue}
    >
      {value || "Type something..."}
    </ComponentName>
  );
};
```

## 7. MDX Documentation (`ComponentName.mdx`)

An MDX file **MUST** accompany each `ComponentName.stories.tsx` to provide documentation.

### Template

```mdx
import { Meta, Canvas, Controls } from "@storybook/blocks";
import * as ComponentStories from "./ComponentName.stories";
import { ComponentName } from "./index";

<Meta of={ComponentStories} />

# ComponentName

Brief description of the component.

## Import

```tsx
import { ComponentName } from "@at/core";
```

## Overview

<Canvas of={ComponentStories.Overview} />
<Controls of={ComponentStories.Overview} />

## Props

<Controls />

## Usage

### When to use
- Use case 1
- Use case 2

## Variants

### Variant Name
Brief description.
<Canvas of={ComponentStories.VariantName} />

## Do's and Don'ts

| Do | Don't |
|----|-------|
| ✅ Do this... | ❌ Don't do this... |
```

## 8. Story Design & Styling

- **Inline Styles**: PREFERRED for story layout (e.g., `<div style={{ display: 'flex' }}>`).
- **No External CSS**: Avoid creating `.scss` files just for stories.
- **Self-Contained**: Stories should be copy-pasteable examples.

## 9. Anti-Patterns

- ❌ Do NOT use `args` property on individual story objects.
- ❌ Do NOT use `Template.bind({})` pattern (CSF 2.0 legacy).
- ❌ Do NOT use `storyName` property — use the export name instead.
