---
description: Monorepo structure, dependency management, and package separation guidelines for AT-DesignSystem. Use when adding packages, managing dependencies, or understanding the project organization.
---

# Monorepo & Package Management

## 1. Monorepo Architecture

AT-DesignSystem uses npm workspaces:

```
at-design-system/
├── package.json              # Root with workspaces config
├── tsconfig.base.json        # Shared TypeScript config
├── packages/
│   ├── core/                 # @at-design-system/core — UI components
│   │   ├── src/components/   # Component source code
│   │   ├── .storybook/       # Storybook configuration
│   │   └── package.json
│   ├── tokens/               # @at-design-system/tokens — Design tokens
│   │   ├── src/              # Token definitions (JSON/JS)
│   │   ├── dist/             # Generated CSS custom properties
│   │   └── package.json
│   ├── shared/               # @at-design-system/shared — Shared utilities
│   │   └── package.json
│   ├── docs/                 # Storybook docs site
│   │   └── package.json
│   ├── config/               # Shared configuration (ESLint, Prettier, etc.)
│   │   └── package.json
│   └── mcp/                  # MCP tools
│       └── package.json
```

## 2. Package Scoping

- All packages use the `@at-design-system/` scope.
- Package names are lowercase, hyphenated: `@at-design-system/core`, `@at-design-system/tokens`.

## 3. Dependency Rules

### Internal Dependencies
- Use workspace protocol for internal deps: `"@at-design-system/tokens": "*"`.
- `core` depends on `tokens` and `shared`.
- `docs` depends on `core`.

### External Dependencies
- **React/React-DOM**: Always `peerDependencies`, never `dependencies`.
- **Dev tools** (storybook, testing): Always `devDependencies`.
- **Runtime utilities** (classnames, date-fns): Put in `dependencies`.

### Dependency Best Practices

| Rule | Details |
|------|---------|
| Audit regularly | Remove unused packages |
| Pin major versions | Use `^` for minor/patch, pin major |
| Peer deps for React | React is ALWAYS a peer dependency |
| No duplicate deps | Same version across all packages |
| Minimal deps | Prefer zero-dependency implementations when simple |

## 4. Package Exports

Each package's `package.json` should have explicit exports:

```json
{
  "name": "@at-design-system/core",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css"
  }
}
```

## 5. Package Separation Guidelines

When extracting a component into its own package:

1. Create new package directory under `packages/`.
2. Set up `package.json` with correct peer/dev dependencies.
3. Move component source code.
4. **Re-export from `core`** for backwards compatibility:
   ```tsx
   // packages/core/src/components/index.ts
   export { ComponentName } from "@at-design-system/component-name";
   ```
5. Update all internal imports.
6. Ensure design tokens are accessed via `@at-design-system/tokens`.

## 6. Scripts Convention

Root `package.json` scripts orchestrate across workspaces:

```json
{
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "build:tokens": "npm run build --workspace=packages/tokens",
    "test": "npm run test --workspaces --if-present",
    "clean": "npm run clean --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "storybook": "npm run storybook --workspace=packages/core"
  }
}
```

## 7. TypeScript Configuration

- Base config at root: `tsconfig.base.json`.
- Each package extends the base: `"extends": "../../tsconfig.base.json"`.
- Use project references for cross-package type checking.
