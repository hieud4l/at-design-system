# Hướng Dẫn Sử Dụng GitHub Actions

Tài liệu này giải thích cách hoạt động của hệ thống tự động hóa (CI/CD) trong **AT-DesignSystem**, giúp tự động build và cập nhật Design Tokens mà không cần thao tác thủ công.

## 🤖 GitHub Actions là gì?

GitHub Actions là công cụ giúp tự động hóa các quy trình phát triển phần mềm. Trong dự án này, chúng ta sử dụng nó để đảm bảo rằng **file build luôn đồng bộ với source tokens**.

Mỗi khi bạn chỉnh sửa các giá trị thiết kế (màu sắc, khoảng cách, v.v...) trong thư mục `tokens/`, GitHub Actions sẽ tự động chạy lệnh build và cập nhật các file đầu ra (CSS, Android XML, iOS Swift...) vào thư mục `build/`.

---

## 🛠 Workflow: Build Design Tokens

File cấu hình nằm tại: `.github/workflows/build-tokens.yml`

### 1. Khi nào Workflow được kích hoạt? (Trigger)

Workflow này sẽ tự động chạy trong 2 trường hợp:

1.  **Tự động (Push Event)**:
    Khi bạn `push` code lên nhánh `main`, VÀ có sự thay đổi trong các file:
    -   Thư mục `tokens/**` (bất kỳ file json nào bên trong)
    -   File cấu hình `sd.config.mjs`

2.  **Thủ công (Manual Trigger)**:
    Bạn có thể bấm nút chạy trực tiếp từ giao diện GitHub (Tab Actions).

### 2. Các bước xử lý (Steps)

Khi được kích hoạt, "robot" của GitHub sẽ thực hiện các bước sau:

1.  **Checkout repository**: Tải mã nguồn mới nhất về.
2.  **Setup Node.js**: Cài đặt môi trường Node.js (version 20).
3.  **Install dependencies**: Chạy `npm ci` để cài các thư viện cần thiết (Style Dictionary).
4.  **Build tokens**: Chạy lệnh `npm run build:tokens` để tạo ra các file trong thư mục `build/`.
5.  **Check for changes**: Kiểm tra xem file trong thư mục `build/` có khác so với trước đó không.
6.  **Commit and push**:
    -   Nếu có thay đổi: Robot sẽ tự động `git commit` với message "🎨 Auto-build: Update design tokens" và `push` ngược lại vào repository.
    -   Nếu không có thay đổi: Không làm gì cả.

---

## 🚀 Hướng Dẫn Sử Dụng

### Cách 1: Tự động (Khuyên dùng)

Đây là quy trình làm việc chuẩn hàng ngày:

1.  Mở file token trên máy local (ví dụ `tokens/base.json`).
2.  Chỉnh sửa giá trị (ví dụ đổi mã màu Hex).
3.  Commit và Push thay đổi lên GitHub:
    ```bash
    git add tokens/base.json
    git commit -m "Update primary color"
    git push origin main
    ```
4.  **Xong!** Bạn có thể vào tab **Actions** trên GitHub để xem tiến trình. Sau khoảng 1-2 phút, thư mục `build/` trên GitHub sẽ tự động được cập nhật.

### Cách 2: Chạy Thủ công (Manual)

Dùng khi bạn muốn build lại toàn bộ mà không cần sửa code (ví dụ khi workflow trước đó bị lỗi do mạng).

1.  Truy cập trang repository trên GitHub.
2.  Bấm vào tab **Actions** trên thanh menu trên cùng.
3.  Chọn workflow **"Build Design Tokens"** ở cột bên trái.
4.  Bấm nút **Run workflow** (màu xanh bên phải).
5.  Chọn nhánh (**Branch**) là `main` và bấm nút **Run workflow** màu xanh.

---

## 🔍 Kiểm tra kết quả

1.  Vào tab **Actions**, bạn sẽ thấy một dòng trạng thái (xanh lá = thành công, đỏ = thất bại).
2.  Bấm vào lần chạy đó để xem chi tiết log của từng bước.
3.  Nếu thành công, quay lại tab **Code**, bạn sẽ thấy commit mới nhất được tạo bởi "GitHub Actions Bot".

## ⚠️ Lưu ý quan trọng

-   **Conflicts**: Hạn chế sửa trực tiếp file trong thư mục `build/` bằng tay trên GitHub hoặc máy local rồi push lên, vì có thể gây conflict với robot. Hãy để robot lo việc update thư mục `build/`.
-   **Token Quyền**: Workflow sử dụng `GITHUB_TOKEN` mặc định để push code. Nếu bạn bật chế độ bảo vệ nhánh (Branch Protection Rules), bạn có thể cần cấu hình thêm quyền cho bot.
