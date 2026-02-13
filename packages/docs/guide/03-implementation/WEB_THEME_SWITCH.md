# Theme Switching Guide - Light/Dark Mode

Hướng dẫn triển khai chuyển đổi theme Light/Dark trong ứng dụng sử dụng AT Design System tokens.

## 📁 Cấu trúc file

```
build/
├── css/
│   ├── variables-light.css    # CSS variables cho Light theme
│   └── variables-dark.css     # CSS variables cho Dark theme
├── scss/
│   ├── _variables-light.scss  # SCSS variables cho Light theme
│   └── _variables-dark.scss   # SCSS variables cho Dark theme
├── js/
│   ├── tokens-light.js        # JS tokens cho Light theme
│   └── tokens-dark.js         # JS tokens cho Dark theme
└── ...
```

---

## 🌐 Web (CSS/JavaScript)

### Cách 1: Class-based switching (Khuyến nghị)

**HTML:**
```html
<!DOCTYPE html>
<html class="light" data-theme="light">
<head>
  <link rel="stylesheet" href="path/to/variables-light.css" id="theme-light">
  <link rel="stylesheet" href="path/to/variables-dark.css" id="theme-dark" disabled>
  <link rel="stylesheet" href="path/to/your-styles.css">
</head>
<body>
  <button onclick="toggleTheme()">🌓 Toggle Theme</button>
</body>
</html>
```

**JavaScript:**
```javascript
function toggleTheme() {
  const html = document.documentElement;
  const lightCSS = document.getElementById('theme-light');
  const darkCSS = document.getElementById('theme-dark');
  
  if (html.dataset.theme === 'light') {
    html.dataset.theme = 'dark';
    html.classList.replace('light', 'dark');
    lightCSS.disabled = true;
    darkCSS.disabled = false;
  } else {
    html.dataset.theme = 'light';
    html.classList.replace('dark', 'light');
    lightCSS.disabled = false;
    darkCSS.disabled = true;
  }
  
  // Lưu preference
  localStorage.setItem('theme', html.dataset.theme);
}

// Khởi tạo từ localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  if (theme === 'dark') {
    toggleTheme();
  }
}

document.addEventListener('DOMContentLoaded', initTheme);
```

### Cách 2: Dynamic CSS Import

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-css');
  link.href = `path/to/variables-${theme}.css`;
  localStorage.setItem('theme', theme);
  document.documentElement.dataset.theme = theme;
}

// Toggle
function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}
```

### Cách 3: Auto theo System Preference

```css
/* Mặc định light */
@import 'variables-light.css';

/* Auto switch khi OS ở dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    /* Ghi đè các biến với giá trị dark */
  }
}
```

```javascript
// Lắng nghe thay đổi system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  setTheme(e.matches ? 'dark' : 'light');
});
```

---

## 🎨 SCSS Usage

**styles.scss:**
```scss
// Mixin để import theme
@mixin use-light-theme {
  @import 'build/scss/variables-light';
}

@mixin use-dark-theme {
  @import 'build/scss/variables-dark';
}

// Áp dụng
:root, html.light {
  @include use-light-theme;
}

html.dark {
  @include use-dark-theme;
}

// Components sử dụng semantic tokens
.card {
  background: $color-background-primary;
  color: $color-text-primary-900;
  border: 1px solid $color-border-primary;
  border-radius: $dimension-radius-lg;
  box-shadow: $shadow-md;
}

.button-primary {
  background: $color-background-brand-solid;
  color: $color-text-primary-on-brand;
  
  &:hover {
    background: $color-background-brand-solid-hover;
  }
}
```

---

## ⚛️ React

**ThemeProvider.jsx:**
```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Dynamically load CSS
    const link = document.getElementById('theme-css');
    link.href = `/path/to/variables-${theme}.css`;
    
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**ThemeToggle.jsx:**
```jsx
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

---

## 📱 iOS (Swift/SwiftUI)

**ThemeManager.swift:**
```swift
import SwiftUI

class ThemeManager: ObservableObject {
    @Published var isDarkMode: Bool {
        didSet {
            UserDefaults.standard.set(isDarkMode, forKey: "isDarkMode")
        }
    }
    
    init() {
        self.isDarkMode = UserDefaults.standard.bool(forKey: "isDarkMode")
    }
    
    // Sử dụng các tokens tương ứng
    var backgroundColor: Color {
        isDarkMode ? StyleDictionaryDark.colorBackgroundPrimary : StyleDictionaryLight.colorBackgroundPrimary
    }
    
    var textColor: Color {
        isDarkMode ? StyleDictionaryDark.colorTextPrimary900 : StyleDictionaryLight.colorTextPrimary900
    }
}
```

**Usage:**
```swift
struct ContentView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack {
            Text("Hello World")
                .foregroundColor(themeManager.textColor)
            
            Button("Toggle Theme") {
                themeManager.isDarkMode.toggle()
            }
        }
        .background(themeManager.backgroundColor)
    }
}
```

---

## 🤖 Android (Kotlin/Compose)

**ThemeManager.kt:**
```kotlin
object ThemeManager {
    var isDarkMode by mutableStateOf(false)
    
    val backgroundColor: Color
        get() = if (isDarkMode) {
            StyleDictionaryColorDark.colorBackgroundPrimary
        } else {
            StyleDictionaryColorLight.colorBackgroundPrimary
        }
    
    val textColor: Color
        get() = if (isDarkMode) {
            StyleDictionaryColorDark.colorTextPrimary900
        } else {
            StyleDictionaryColorLight.colorTextPrimary900
        }
}
```

**Usage:**
```kotlin
@Composable
fun MyScreen() {
    Column(
        modifier = Modifier.background(ThemeManager.backgroundColor)
    ) {
        Text(
            text = "Hello World",
            color = ThemeManager.textColor
        )
        
        Button(onClick = { ThemeManager.isDarkMode = !ThemeManager.isDarkMode }) {
            Text("Toggle Theme")
        }
    }
}
```

---

## 🔧 Best Practices

1. **Luôn sử dụng semantic tokens** thay vì primitive tokens:
   - ✅ `$color-background-primary`
   - ❌ `$color-gray-light-mode-50`

2. **Lưu user preference** vào localStorage/UserDefaults

3. **Hỗ trợ system preference** với `prefers-color-scheme`

4. **Thêm transition** để chuyển đổi mượt mà:
   ```css
   * {
     transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
   }
   ```

5. **Test cả 2 themes** khi phát triển components

---

## 📋 Semantic Token Reference

| Purpose | Token | Light Value | Dark Value |
|---------|-------|-------------|------------|
| Background | `background-primary` | white | gray-950 |
| Background | `background-secondary` | gray-50 | gray-800 |
| Text | `text-primary-900` | gray-900 | gray-900* |
| Text | `text-secondary-700` | gray-700 | gray-700* |
| Border | `border-primary` | gray-300 | gray-300* |

*\* Giá trị từ gray-dark-mode palette, khác với gray-light-mode*
