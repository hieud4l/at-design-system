# Quy Trình Bàn Giao Design System qua GitHub

Tài liệu này hướng dẫn chi tiết quy trình phối hợp giữa **Product Designer (Design Team)** và **Front-End Developer (Dev Team)** để bàn giao và cập nhật Design System thông qua GitHub.

## 🔄 Tổng Quan Quy Trình

1.  **Designer** cập nhật Tokens trong code (file JSON).
2.  **Designer** build tokens và kiểm tra.
3.  **Designer** commit và push thay đổi lên GitHub.
4.  **Dev Team** pull code mới về và sử dụng.

---

## 🧑‍🎨 Dành Cho Product Designer (Người Bàn Giao)

Nhiệm vụ của bạn là đảm bảo các file tokens (JSON) và các file build (CSS, JS, v.v.) luôn được cập nhật và đồng bộ trên GitHub.

### Bước 1: Cập Nhật Tokens

*   Chỉnh sửa các file trong thư mục `tokens/`.
*   Ví dụ: Thêm màu mới vào `tokens/base.json`.

### Bước 2: Build Tokens (Tạo File Code)

Mở Terminal tại thư mục project và chạy lệnh:

```bash
npm run build
```

Lệnh này sẽ tự động cập nhật các file trong thư mục `build/` (ví dụ: `build/css/variables.css`).

### Bước 3: Commit và Push Lên GitHub

Sau khi build xong, bạn cần đưa các thay đổi này lên GitHub để Dev Team có thể thấy.

1.  **Kiểm tra trạng thái:**
    ```bash
    git status
    ```
    *Bạn sẽ thấy danh sách các file đã thay đổi (cả trong `tokens/` và `build/`).*

2.  **Add tất cả thay đổi:**
    ```bash
    git add .
    ```

3.  **Commit với thông điệp rõ ràng:**
    ```bash
    git commit -m "update: add success-500 color token"
    ```
    *Quy tắc đặt tên commit: `update: <nội dung thay đổi>`, `feat: <tính năng mới>`, `fix: <sửa lỗi>`.*

4.  **Push lên GitHub:**
    ```bash
    git push origin main
    ```

🎉 **Xong!** Bạn đã bàn giao thành công phiên bản mới nhất lên "kho chứa" chung.

### (Nâng Cao) Đánh Dấu Phiên Bản (Versioning)

Khi có một bản cập nhật lớn hoặc chốt một giai đoạn, hãy tạo **Tag** để đánh dấu phiên bản (ví dụ: v1.0.0, v1.1.0). Việc này giúp Dev Team biết chính xác họ đang dùng phiên bản nào.

```bash
# Tạo tag
git tag v1.0.0

# Push tag lên GitHub
git push origin v1.0.0
```

---

## 👨‍💻 Dành Cho Front-End Developer (Người Nhận)

### Lần Đầu Tiên (Setup)

1.  **Clone repositories:**
    ```bash
    git clone https://github.com/hieud4l/design-system.git
    cd design-system
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```

### Cập Nhật Mới Nhất

Mỗi khi Designer thông báo có update, hoặc trước khi bắt đầu task mới:

1.  **Pull code mới về:**
    ```bash
    git pull origin main
    ```

2.  **Build lại (nếu cần thiết để đảm bảo local environment đồng bộ):**
    ```bash
    npm run build
    ```

### Tích Hợp Vào Dự Án Front-End

Có 2 cách chính để sử dụng Design System này trong dự án thật (React, Vue, Website, v.v.):

#### Cách 1: Copy File (Thủ Công - Đơn Giản)

Copy file từ thư mục `build/` của Design System sang dự án của bạn.
*   Web: Copy `build/css/variables.css`.
*   JS/React: Copy `build/js/tokens.js`.
*   iOS/Android: Copy các file tương ứng trong `build/ios` hoặc `build/android`.

#### Cách 2: Git Submodule (Tự Động & Chuyên Nghiệp)

Thêm repo Design System này vào dự án của bạn như một module con.

```bash
# Trong dự án Front-End chính của bạn
git submodule add https://github.com/hieud4l/design-system.git src/design-system
```

Khi Design System có update:
```bash
# Cập nhật submodule
git submodule update --remote
```

---

## 🤝 Quy Tắc Phối Hợp

*   **Không sửa trực tiếp file trong `build/`**: Thư mục này được tạo tự động. Nếu cần sửa, hãy sửa file JSON trong `tokens/` và chạy build lại.
*   **Giao tiếp**: Khi Designer push code mới, hãy nhắn tin hoặc báo cho Dev Team biết (kèm theo Version Tag nếu có) để họ update.

---

## 💡 Các Kịch Bản Bàn Giao (FAQ)

### Q: Tôi chỉ muốn bàn giao file CSS Variables thôi có được không?

**A: Hoàn toàn ĐƯỢC!** 

Design System này generate ra rất nhiều format (SCSS, JS, Android, iOS), nhưng Dev Team **chỉ cần lấy đúng file họ cần**.

Nếu bạn làm Web và chỉ dùng CSS thuần (hoặc Tailwind):
1.  Dev chỉ cần copy file `build/css/variables.css`.
2.  Import vào file CSS chính của dự án:
    ```css
    @import './path/to/variables.css';
    ```
3.  Bỏ qua tất cả các folder `scss/`, `js/`, `ios/`, `android/` khác.

👉 **Lời khuyên**: Bạn (Designer) vẫn nên push **toàn bộ** folder `build/` lên GitHub. Việc "lọc" lấy file nào là việc của Dev Frontend lúc họ sử dụng. Điều này giúp hệ thống của bạn vẫn sẵn sàng nếu sau này team muốn làm App Mobile (Android/iOS) thì đã có sẵn token mà không cần bạn làm lại từ đầu.
