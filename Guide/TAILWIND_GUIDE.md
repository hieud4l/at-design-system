# Hướng Dẫn Tích Hợp Design Tokens với Tailwind CSS

Tài liệu này sẽ hướng dẫn bạn cách tích hợp hệ thống Design Tokens vào dự án sử dụng Tailwind CSS một cách tự động và hiệu quả.

## 🎯 Mục Tiêu
- Tự động hóa việc cập nhật cấu hình Tailwind khi tokens thay đổi.
- Sử dụng được các class utility của Tailwind (ví dụ: `bg-brand-primary`, `text-semantic-success`) dựa trên tokens.
- Giảm thiểu việc copy-paste thủ công.

---

## 🚀 Phương Pháp 1: Token as CSS Variables (Khuyên Dùng cho Tailwind v4)

Tailwind CSS v4 hỗ trợ rất tốt CSS Variables. Cách đơn giản nhất là build tokens ra CSS variables và import vào dự án.

### 1. Cấu hình Style Dictionary
Đảm bảo `sd.config.mjs` đã có cấu hình build cho CSS (như mặc định):

```javascript
// sd.config.mjs
export default {
    platforms: {
        css: {
            transformGroup: 'css',
            buildPath: 'build/css/',
            files: [{
                destination: 'variables.css',
                format: 'css/variables',
                options: { outputReferences: true }
            }]
        }
    }
}
```

### 2. Import vào CSS chính
Trong file CSS chính của ứng dụng (ví dụ `app.css`):

```css
@import "./build/css/variables.css";
@import "tailwindcss";
```

### 3. Sử dụng
Tailwind v4 sẽ tự động nhận diện các biến CSS nếu bạn cấu hình đúng theme, hoặc bạn có thể map thủ công trong v3:

**Với Tailwind v3 (Legacy):**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)', // Mapping thủ công
        }
      }
    }
  }
}
```

---

## 🛠 Phương Pháp 2: Tự Động Tạo Tailwind Preset (Nâng Cao - Tự Động Hoàn Toàn)

Phương pháp này sẽ tạo ra một file cấu hình JavaScript mà Tailwind có thể hiểu trực tiếp, không cần map thủ công từng biến.

### Bước 1: Tạo Custom Format cho Style Dictionary

Chúng ta cần tạo một formatter để chuyển đổi tokens JSON thành format mà Tailwind hiểu được (Nested Object).

Tạo file `sd.config.mjs` (hoặc cập nhật file hiện tại) với nội dung sau:

```javascript
// Thêm hàm helper để tạo nested object
function filterTokens(token) {
  // Loại bỏ các token không cần thiết cho tailwind nếu muốn
  return true; 
}

// Custom format để tạo tailwind preset
StyleDictionary.registerFormat({
  name: 'tailwind/preset',
  formatter: ({ dictionary }) => {
    // Hàm chuyển đổi flat tokens sang nested object
    const theme = {
      colors: {},
      fontSize: {},
      spacing: {},
      // Thêm các category khác nếu cần
    };

    dictionary.allTokens.forEach(token => {
      // Logic mapping tùy thuộc vào cấu trúc token của bạn
      // Ví dụ: token.path = ['color', 'brand', 'primary']
      // Thì sẽ map vào theme.colors.brand.primary
      
      if (token.path[0] === 'color') {
        // Simple nesting logic (bạn có thể cần lodash.set để xử lý sâu hơn)
        // Đây là ví dụ đơn giản mapping 2 cấp
        const category = token.path[1]; // brand
        const name = token.path[2];     // primary
        
        if (!theme.colors[category]) theme.colors[category] = {};
        theme.colors[category][name] = token.value;
      }
      
      // Tương tự cho spacing, typography...
    });

    return `module.exports = {
      theme: {
        extend: {
          colors: ${JSON.stringify(theme.colors, null, 2)},
          // Add other sections
        }
      }
    }`;
  }
});
```

*Lưu ý: Đoạn code trên là minh họa logic. Để sử dụng robust hơn, bạn nên dùng thư viện hoặc script chuyên dụng.*

### Giải Pháp Tối Ưu Nhất: Sử dụng `sd-transforms` (Khuyên Dùng)

Thay vì viết formatter thủ công rất phức tạp, cộng đồng thường dùng cách build ra **Flat JSON** hoặc **ES Module** rồi import vào `tailwind.config.js`.

#### 1. Cấu hình Style Dictionary để build ra JS Object
Chúng ta sẽ dùng format `javascript/module` (CommonJS) để Tailwind có thể đọc được.

Trong `sd.config.mjs`:
```javascript
platforms: {
    tailwind: {
        transformGroup: 'js',
        buildPath: 'build/tailwind/',
        files: [
            {
                destination: 'tokens.js',
                format: 'javascript/module-flat' // Flat structure: export const ColorBrandPrimary = ...
            },
            // Hoặc dùng nested structure nếu custom
             {
                destination: 'tokens-nested.js',
                format: 'javascript/module'
            }
        ]
    }
}
```

#### 2. Cấu hình `tailwind.config.js`
Sau khi chạy build, bạn sẽ có file `build/tailwind/tokens-nested.js` (cần custom) hoặc bạn có thể import file JSON build sẵn.

Cách dễ nhất là import **Tokens JSON** trực tiếp:

1. Thêm platform `json` vào config (đã có sẵn trong project của bạn).
2. Chạy `npm run build`.
3. Sửa `tailwind.config.js`:

```javascript
// tailwind.config.js
const tokens = require('./build/json/tokens.json');

// Hàm helper để lấy giá trị từ object nested (nếu token cấu trúc sâu)
// Hoặc map thủ công cho an toàn
module.exports = {
  theme: {
    extend: {
      colors: {
        // Tự động map toàn bộ object color từ tokens
        ...tokens.color
      },
      spacing: {
        ...tokens.spacing
      },
      fontSize: {
        ...tokens.typography.fontSize
      }
    }
  }
}
```

### ✅ Ví dụ Cụ Thể (Copy-Paste được)

Giả sử file `tokens/base.json` của bạn như sau:
```json
{
  "color": {
    "primary": { "value": "#2563eb" },
    "secondary": { "value": "#475569" }
  }
}
```

Khi build ra `build/json/tokens.json`, nó sẽ giữ nguyên cấu trúc.

File `tailwind.config.js` của bạn:

```javascript
const tokens = require('./build/json/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Cách 1: Map từng cái (An toàn, dễ kiểm soát)
        primary: tokens.color.primary.value, 
        secondary: tokens.color.secondary.value,
        
        // Cách 2: Map cả object (Nhanh, nhưng cấu trúc token phải chuẩn Tailwind)
        brand: {
             DEFAULT: tokens.color.primary.value,
             ...tokens.color // Cần transform value object thành string nếu tokens có metadata
        }
      }
    },
  },
  plugins: [],
}
```

**⚠️ LƯU Ý QUAN TRỌNG:**
Style Dictionary mặc định output ra object có dạng `{ value: "#...", path: [...] }` trong file JSON gốc, nhưng nếu dùng format `json/flat` thì nó ra key-value. Nếu dùng `json/nested`, nó ra cấu trúc sâu.

Để Tailwind hiểu, bạn cần **Clean Objects** (chỉ lấy value, bỏ metadata).
Bạn nên dùng format custom để clean object trước khi đưa vào Tailwind.

### Script `transform-tokens.js` (Tiện ích nên dùng)

Tạo một helper file `utils/transform-tokens.js` để dọn dẹp tokens tham chiếu trong Tailwind:

```javascript
// utils/transform-tokens.js
// Hàm đệ quy để biến { value: "#fff", ... } thành "#fff"
function flattenValue(obj) {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (obj[key].value) {
      result[key] = obj[key].value;
    } else if (typeof obj[key] === 'object') {
      result[key] = flattenValue(obj[key]);
    }
  });
  return result;
}

module.exports = flattenValue;
```

**Sử dụng trong Tailwind:**
```javascript
const tokens = require('./build/json/tokens.json'); // Dùng format json/nested
const flattenValue = require('./utils/transform-tokens.js');

const colors = flattenValue(tokens.color);

module.exports = {
  theme: {
    extend: {
      colors: colors
    }
  }
}
```

---

## 📝 Tóm Tắt Quy Trình

1. **Định nghĩa tokens** trong `tokens/*.json`.
2. **Build tokens** ra file JSON nested (`npm run build`).
3. **Tạo helper function** để loại bỏ key `value` thừa.
4. **Import và trải (spread)** vào `tailwind.config.js`.
5. **Sử dụng** trong HTML: `class="bg-primary text-white"`.
