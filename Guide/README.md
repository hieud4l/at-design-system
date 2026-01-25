# AT Design System

Design system built with [Style Dictionary v5](https://styledictionary.com/versions/v5/)

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Build Tokens

```bash
npm run build
```

This will generate design tokens in multiple formats:
- **CSS** → `build/css/variables.css`
- **SCSS** → `build/scss/_variables.scss`
- **JavaScript** → `build/js/tokens.js`
- **TypeScript** → `build/js/tokens.d.ts`
- **JSON** → `build/json/tokens.json`

### Clean Build

```bash
npm run clean
```

## 📁 Project Structure

```
AT-DesignSystem/
├── tokens/              # Design token source files
│   └── base.json       # Base tokens (colors, spacing, typography, etc.)
├── build/              # Generated output files
├── sd.config.mjs       # Style Dictionary v5 configuration
└── package.json
```

## 🎨 Design Tokens

### Colors
- **Primary**: 10 shades (50-900)
- **Neutral**: 10 shades (50-900)

### Spacing
- xs, sm, md, lg, xl, 2xl, 3xl

### Typography
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Font Weights**: light, regular, medium, semibold, bold
- **Font Families**: sans, mono

### Border Radius
- none, sm, md, lg, xl, full

### Shadows
- sm, md, lg, xl

## 🆕 Style Dictionary v5 Features

This project uses Style Dictionary v5 with the following features:

1. **ESM Configuration** - Using `sd.config.mjs` instead of CommonJS
2. **Preprocessors** - Support for tokens-studio format
3. **Multiple Platforms** - CSS, SCSS, JavaScript, TypeScript, JSON outputs
4. **Output References** - CSS variables reference each other for better maintainability

## 📚 Resources

- [Style Dictionary v5 Documentation](https://styledictionary.com/versions/v5/)
- [Migration Guide](https://styledictionary.com/versions/v5/migration/)
- [GitHub Repository](https://github.com/amzn/style-dictionary)

## 📝 License

MIT
