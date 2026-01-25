# Hướng Dẫn Sử Dụng Style Dictionary v5

## 📚 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Cấu Trúc Project](#cấu-trúc-project)
3. [Làm Việc Với Design Tokens](#làm-việc-với-design-tokens)
4. [Build Tokens](#build-tokens)
5. [Sử Dụng Tokens Trong Dự Án](#sử-dụng-tokens-trong-dự-án)
6. [Tùy Chỉnh Nâng Cao](#tùy-chỉnh-nâng-cao)
7. [Best Practices](#best-practices)

---

## Giới Thiệu

Style Dictionary v5 là công cụ giúp bạn quản lý design tokens (màu sắc, khoảng cách, typography, v.v.) và tự động chuyển đổi chúng sang nhiều định dạng khác nhau (CSS, SCSS, JavaScript, iOS, Android, v.v.).

### Lợi Ích
- ✅ **Single Source of Truth**: Quản lý tất cả design tokens ở một nơi
- ✅ **Multi-Platform**: Tự động generate cho web, iOS, Android, React Native
- ✅ **Type-Safe**: Hỗ trợ TypeScript declarations
- ✅ **Scalable**: Dễ dàng mở rộng và maintain

---

## Cấu Trúc Project

```
AT-DesignSystem/
├── tokens/                 # 📁 Nơi định nghĩa design tokens
│   └── base.json          # Token definitions
├── build/                 # 📁 Output files (auto-generated)
│   ├── css/
│   ├── scss/
│   ├── js/
│   └── json/
├── sd.config.mjs          # ⚙️ Style Dictionary configuration
└── package.json
```

---

## Làm Việc Với Design Tokens

### 1. Định Nghĩa Tokens

Tokens được định nghĩa trong file JSON tại thư mục `tokens/`. Mỗi token có cấu trúc:

```json
{
  "category": {
    "item": {
      "value": "actual-value"
    }
  }
}
```

### 2. Ví Dụ: Thêm Màu Mới

Mở file [tokens/base.json](file:///Users/tatrunghieu/Desktop/Vibe_coding/AT-DesignSystem/tokens/base.json) và thêm:

```json
{
  "color": {
    "success": {
      "50": { "value": "#f0fdf4" },
      "500": { "value": "#22c55e" },
      "900": { "value": "#14532d" }
    },
    "error": {
      "50": { "value": "#fef2f2" },
      "500": { "value": "#ef4444" },
      "900": { "value": "#7f1d1d" }
    }
  }
}
```

### 3. Token References (Tham Chiếu)

Bạn có thể tham chiếu đến tokens khác:

```json
{
  "color": {
    "primary": {
      "500": { "value": "#0ea5e9" }
    },
    "button": {
      "background": { "value": "{color.primary.500}" }
    }
  }
}
```

### 4. Tổ Chức Tokens Theo File

Tạo nhiều file để tổ chức tốt hơn:

```
tokens/
├── colors.json       # Màu sắc
├── spacing.json      # Khoảng cách
├── typography.json   # Typography
└── components.json   # Component-specific tokens
```

Cập nhật `sd.config.mjs`:

```javascript
export default {
  source: ['tokens/**/*.json'],  // Đọc tất cả file JSON
  // ...
};
```

---

## Build Tokens

### Lệnh Build Cơ Bản

```bash
# Build tất cả platforms
npm run build

# Build một platform cụ thể (ví dụ: css)
npx style-dictionary build --config sd.config.mjs --platform css

# Xóa build folder
npm run clean
```

### Output Files

Sau khi build, bạn sẽ có:

| Format | File | Mục Đích |
|--------|------|----------|
| **CSS** | `build/css/variables.css` | CSS Variables cho web |
| **SCSS** | `build/scss/_variables.scss` | SCSS variables |
| **JavaScript** | `build/js/tokens.js` | ES6 modules |
| **TypeScript** | `build/js/tokens.d.ts` | Type definitions |
| **JSON** | `build/json/tokens.json` | Flat JSON format |

---

## Sử Dụng Tokens Trong Dự Án

### 1. Trong HTML/CSS

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="build/css/variables.css">
  <style>
    .button {
      background-color: var(--color-primary-500);
      color: white;
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--border-radius-md);
      font-size: var(--typography-font-size-base);
      font-weight: var(--typography-font-weight-medium);
      box-shadow: var(--shadow-md);
    }

    .button:hover {
      background-color: var(--color-primary-600);
      box-shadow: var(--shadow-lg);
    }
  </style>
</head>
<body>
  <button class="button">Click Me</button>
</body>
</html>
```

### 2. Trong SCSS

```scss
@import '../build/scss/variables';

.card {
  background: $color-neutral-50;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;

  &__title {
    font-size: $typography-font-size-2xl;
    font-weight: $typography-font-weight-bold;
    color: $color-neutral-900;
    margin-bottom: $spacing-md;
  }

  &__content {
    font-size: $typography-font-size-base;
    color: $color-neutral-700;
    line-height: 1.5;
  }
}
```

### 3. Trong JavaScript/React

```javascript
import tokens from './build/js/tokens.js';

// Sử dụng trực tiếp
const Button = () => {
  const styles = {
    backgroundColor: tokens.color.primary[500],
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    borderRadius: tokens.borderRadius.md,
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.medium,
    boxShadow: tokens.shadow.md,
  };

  return <button style={styles}>Click Me</button>;
};
```

### 4. Trong TypeScript

```typescript
import tokens from './build/js/tokens.js';
import type { DesignTokens } from './build/js/tokens';

// Type-safe access
const primaryColor: string = tokens.color.primary[500];
const spacing: string = tokens.spacing.md;

// Với autocomplete
function getTokenValue(path: keyof DesignTokens) {
  return tokens[path];
}
```

---


## Sử Dụng Tokens Trong Dự Án

Chúng tôi có hướng dẫn chi tiết riêng cho **Tailwind CSS**, vui lòng xem tại:
👉 **[Hướng Dẫn Tích Hợp Tailwind CSS](./TAILWIND_GUIDE.md)**

## Quy Trình Bàn Giao (Handover)

Để biết cách bàn giao và đồng bộ Design System giữa Design Team và Dev Team qua GitHub:
👉 **[Xem Hướng Dẫn Bàn Giao](./HANDOVER.md)**


## Tùy Chỉnh Nâng Cao

### 1. Thêm Platform Mới

Chỉnh sửa [sd.config.mjs](file:///Users/tatrunghieu/Desktop/Vibe_coding/AT-DesignSystem/sd.config.mjs):

```javascript
export default {
  source: ['tokens/**/*.json'],
  
  platforms: {
    // Existing platforms...
    
    // Thêm Android
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/colors',
        },
        {
          destination: 'dimens.xml',
          format: 'android/dimens',
        },
      ],
    },
    
    // Thêm iOS
    ios: {
      transformGroup: 'ios',
      buildPath: 'build/ios/',
      files: [
        {
          destination: 'StyleDictionary.h',
          format: 'ios/macros',
        },
        {
          destination: 'StyleDictionary.m',
          format: 'ios/strings',
        },
      ],
    },
  },
};
```

### 2. Custom Transform

Tạo transform tùy chỉnh:

```javascript
import StyleDictionary from 'style-dictionary';

// Register custom transform
StyleDictionary.registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  matcher: (token) => {
    return token.type === 'dimension';
  },
  transformer: (token) => {
    const val = parseFloat(token.value);
    return `${val / 16}rem`;
  },
});

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transforms: ['size/pxToRem', 'color/css'],
      // ...
    },
  },
};
```

### 3. Custom Format

```javascript
StyleDictionary.registerFormat({
  name: 'custom/json-flat',
  formatter: ({ dictionary }) => {
    const tokens = {};
    dictionary.allTokens.forEach(token => {
      tokens[token.name] = token.value;
    });
    return JSON.stringify(tokens, null, 2);
  },
});
```

### 4. Filters

Chỉ build một số tokens cụ thể:

```javascript
export default {
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'colors-only.css',
          format: 'css/variables',
          filter: (token) => token.type === 'color',
        },
      ],
    },
  },
};
```

---

## Best Practices

### 1. Naming Convention

Sử dụng naming convention nhất quán:

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#0ea5e9" }
    },
    "semantic": {
      "success": { "value": "#22c55e" },
      "error": { "value": "#ef4444" },
      "warning": { "value": "#f59e0b" }
    }
  }
}
```

### 2. Token Hierarchy

Tổ chức theo tầng:

```json
{
  "color": {
    "base": {
      "blue": {
        "500": { "value": "#0ea5e9" }
      }
    },
    "semantic": {
      "primary": { "value": "{color.base.blue.500}" }
    },
    "component": {
      "button": {
        "background": { "value": "{color.semantic.primary}" }
      }
    }
  }
}
```

### 3. Documentation

Thêm description cho tokens:

```json
{
  "color": {
    "primary": {
      "500": {
        "value": "#0ea5e9",
        "comment": "Main brand color - used for primary buttons and links"
      }
    }
  }
}
```

### 4. Version Control

```bash
# Commit token changes
git add tokens/
git commit -m "feat: add success and error colors"

# Rebuild và commit output
npm run build
git add build/
git commit -m "build: regenerate tokens"
```

### 5. CI/CD Integration

Tạo file `.github/workflows/build-tokens.yml`:

```yaml
name: Build Design Tokens

on:
  push:
    paths:
      - 'tokens/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm install
      - run: npm run build
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'build: regenerate design tokens'
```

---

## Ví Dụ Thực Tế

### Tạo Design System Hoàn Chỉnh

#### 1. Tạo file `tokens/colors.json`:

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#0ea5e9" },
      "secondary": { "value": "#8b5cf6" }
    },
    "semantic": {
      "success": { "value": "#22c55e" },
      "error": { "value": "#ef4444" },
      "warning": { "value": "#f59e0b" },
      "info": { "value": "#3b82f6" }
    },
    "text": {
      "primary": { "value": "{color.neutral.900}" },
      "secondary": { "value": "{color.neutral.600}" },
      "disabled": { "value": "{color.neutral.400}" }
    }
  }
}
```

#### 2. Tạo file `tokens/components.json`:

```json
{
  "button": {
    "primary": {
      "background": { "value": "{color.brand.primary}" },
      "text": { "value": "#ffffff" },
      "padding": { "value": "{spacing.md} {spacing.lg}" },
      "borderRadius": { "value": "{borderRadius.md}" }
    },
    "secondary": {
      "background": { "value": "transparent" },
      "text": { "value": "{color.brand.primary}" },
      "border": { "value": "1px solid {color.brand.primary}" }
    }
  },
  "card": {
    "background": { "value": "{color.neutral.50}" },
    "padding": { "value": "{spacing.lg}" },
    "borderRadius": { "value": "{borderRadius.lg}" },
    "shadow": { "value": "{shadow.md}" }
  }
}
```

#### 3. Build và sử dụng:

```bash
npm run build
```

```css
/* Tự động generate */
:root {
  --button-primary-background: #0ea5e9;
  --button-primary-text: #ffffff;
  --card-background: #fafafa;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

---

## Troubleshooting

### Lỗi Build

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build folder
npm run clean
npm run build
```

### Token Không Hiển Thị

1. Kiểm tra syntax JSON
2. Verify token path trong config
3. Check build output folder

---

## Resources

- 📖 [Style Dictionary v5 Docs](https://styledictionary.com/versions/v5/)
- 🔄 [Migration Guide](https://styledictionary.com/versions/v5/migration/)
- 💡 [Examples](https://github.com/amzn/style-dictionary/tree/main/examples)
- 🎨 [Tokens Studio](https://tokens.studio/)

---

## Liên Hệ & Hỗ Trợ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng tạo issue trên GitHub repository.

**Happy Token Building! 🎨**
