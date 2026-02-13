# Hướng dẫn Kiến trúc Token: Light/Dark Mode với Style Dictionary

Tài liệu này giải thích cơ chế hoạt động của hệ thống token đa chủ đề (multi-theme) và cách triển khai chúng bằng công cụ **Style Dictionary**.

---

## 1. Cơ chế hoạt động của Token (Primitive vs. Semantic)

Trong một Design System hiện đại, chúng ta thường chia token thành 2 tầng chính để dễ quản lý:

### Tầng 1: Primitives (Hằng số gốc)
Đây là nơi lưu trữ các giá trị code màu, khoảng cách cụ thể. Chúng thường được đặt tên theo màu sắc hoặc con số trung lập.
*   **Mục đích**: Lưu trữ "nguyên liệu thô".
*   **Ví dụ**: `blue-500: #007AFF`, `gray-100: #F5F5F5`.
*   **Đặc điểm**: Không thay đổi giữa các theme. `blue-500` luôn là `#007AFF` dù ở light hay dark mode.

### Tầng 2: Semantic Tokens (Token ý nghĩa)
Đây là các token được đặt tên dựa trên **công dụng** (nó dùng để làm gì?) thay vì **hình dáng** (nó trông như thế nào?). Các token này sẽ tham chiếu (alias) tới các Primitives.
*   **Mục đích**: Tạo ra một lớp trừu tượng cho phép thay đổi giá trị dựa trên theme.
*   **Ví dụ**: `button-bg-primary`.
    *   Trong **Light Mode**: `button-bg-primary` -> tham chiếu tới `blue-500`.
    *   Trong **Dark Mode**: `button-bg-primary` -> tham chiếu tới `blue-400`.
*   **Đặc điểm**: Đây chính là "chìa khóa" để làm Dark Mode. Khi code, bạn chỉ dùng `button-bg-primary`, và hệ thống sẽ tự đổi màu thật sự bên dưới.

---

## 2. Cách tạo hệ thống Theme bằng Style Dictionary

Style Dictionary giúp chúng ta gộp các file JSON lại và xuất ra các định dạng như CSS, SCSS, Android XML, hay iOS Swift.

### Cấu trúc thư mục đề xuất
```text
tokens/
├── base/
│   ├── color-primitives.json  (Chứa blue-500, gray-100...)
│   └── dimension.json         (Chứa spacing, border-radius...)
└── themes/
    ├── light/
    │   └── color-semantic.json (Mapping cho Light Mode)
    └── dark/
        └── color-semantic.json (Mapping cho Dark Mode)
```

### Cách triển khai "Dark Mode" (Cơ chế Overrides)

Cơ chế thông minh nhất là dùng **Light Mode làm gốc (Base)** và **Dark Mode làm phần ghi đè (Overrides)**.

1.  **File Light Semantic**: Định nghĩa đầy đủ tất cả các token hệ thống sử dụng.
2.  **File Dark Semantic**: Chỉ cần định nghĩa lại những token nào cần thay đổi màu sắc khi sang Dark Mode. Style Dictionary sẽ tự động ghi đè (merge) khi build.

---

## 3. Cấu hình Style Dictionary (Configuration)

Để tạo ra 2 file CSS riêng biệt cho Light và Dark, chúng ta cần 2 file cấu hình (hoặc 1 file build script chạy 2 lần).

### Workflow Build:
*   **Build Light**: Gộp (Base + Light Semantic) -> Xuất ra `variables-light.css` với selector `:root`.
*   **Build Dark**: Gộp (Base + Light Semantic + Dark Semantic Overrides) -> Xuất ra `variables-dark.css` với selector `[data-theme="dark"]`.

### Ví dụ file `sd.config.dark.mjs`:
```javascript
export default {
  source: [
    'tokens/base/**/*.json',
    'tokens/themes/light/color-semantic.json', // Nạp light trước làm base
    'tokens/themes/dark/color-semantic.json'   // Nạp dark sau để ghi đè
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables-dark.css',
        format: 'css/variables',
        options: {
          selector: '[data-theme="dark"]' // Selector để kích hoạt dark mode
        }
      }]
    }
  }
}
```

---

## 4. Cách sử dụng trên Web (Runtime)

Khi bạn đã có 2 file CSS, việc chuyển mode cực kỳ đơn giản:

1.  Nhúng cả 2 file CSS vào HTML.
2.  Mặc định hệ thống dùng CSS trong `:root` (Light).
3.  Khi người dùng bấm nút đổi theme, JS chỉ cần thêm attribute vào body:
    ```javascript
    document.body.setAttribute('data-theme', 'dark');
    ```
    Lúc này, các biến CSS trong `variables-dark.css` sẽ có ưu tiên cao hơn và ghi đè giá trị cũ, giao diện sẽ tự động chuyển sang Dark Mode ngay lập tức mà không cần reload trang.

---

---

## 5. Hướng dẫn thực hành: Cách biết và tạo Token cho Dark/Light

Để quản lý và tạo token mới, bạn cần nắm vững quy trình **Ghi đè (Overrides)**:

### Bước 1: Luôn bắt đầu từ Light Mode (Base)
Mọi token ý nghĩa (semantic) phải được định nghĩa ở `tokens/themes/light/color-semantic.json` trước.

**Ví dụ:** Bạn muốn tạo token `card-bg`:
```json
"background": {
    "card-bg": { 
        "value": "{color.base.white}", 
        "type": "color" 
    }
}
```

### Bước 2: Kiểm tra xem có cần đổi màu ở Dark Mode không?
- **Trường hợp A:** Nếu ở Dark Mode mà màu trắng (`white`) vẫn đẹp (ví dụ: các thông báo pop-up nổi lên), bạn **không cần làm gì thêm**. Hệ thống sẽ tự động lấy giá trị từ file Light.
- **Trường hợp B:** Nếu muốn cái Card đó có màu nền tối, hãy sang Bước 3.

### Bước 3: Ghi đè cho Dark Mode
Mở `tokens/themes/dark/color-semantic.json` và thêm đúng đường dẫn đó vào để ghi đè giá trị:
```json
"background": {
    "card-bg": { 
        "value": "{color.gray-dark-mode.900}", 
        "type": "color" 
    }
}
```

### 💡 Quy tắc quan trọng:
1.  **Tên Token phải khớp 100%**: Nếu ở Light là `button-primary`, thì ở Dark cũng phải là `button-primary`.
2.  **Ưu tiên Tham chiếu (Alias)**: Hạn chế viết mã hex (#FFFFFF) trực tiếp. Hãy tham chiếu tới primitives như `{color.gray-light-mode.500}` hoặc `{color.brand.500}`.
3.  **Hệ thống Fallback**: Nếu bạn quên khai báo ở file `dark`, Style Dictionary sẽ tự động dùng giá trị của `light`. Điều này giúp giao diện không bao giờ bị mất màu.
