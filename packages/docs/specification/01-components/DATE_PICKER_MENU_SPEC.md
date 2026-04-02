# Menu Chọn Ngày (Date Picker Menu) - Đặc tả Thành phần

## Tổng quan

### Tên thành phần
**Menu Chọn Ngày** (`_Date picker menu`)

### Mô tả
Một thành phần chọn phạm vi ngày toàn diện cho phép người dùng chọn các khoảng ngày thông qua các phím tắt xác định trước hoặc lựa chọn tùy chỉnh trên lịch. Thành phần này có giao diện lịch đôi với các tùy chọn chọn nhanh và các chỉ báo phạm vi trực quan.

### Hỗ trợ Nền tảng
- [x] Web
- [ ] iOS
- [ ] Android
- [ ] React Native

### Tham chiếu Figma
- **Node ID**: `1:5787`
- **File**: AT---DesignSystem
- **Liên kết**: [Figma Design](https://www.figma.com/design/04nXAUxjZO8WAiyxsS84aI/AT---DesignSystem?node-id=1-5787&m=dev)

---

## Thiết kế Giao diện

### Giải phẫu thành phần
Menu Chọn Ngày bao gồm ba phần chính:

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────────────────────────┐ │
│  │  Nội dung    │  │  Nội dung bên phải                       │ │
│  │  bên trái    │  │  ┌────────────┬────────────┐             │ │
│  │              │  │  │ Bộ chọn    │ Bộ chọn    │             │ │
│  │  - Hôm nay   │  │  │ bên trái   │ bên phải   │             │ │
│  │  - Hôm qua   │  │  │ (Th01 2025)│ (Th02 2025)│             │ │
│  │  - Tuần này  │  │  │            │            │             │ │
│  │  - Tuần trước│  │  │  Lưới      │  Lưới      │             │ │
│  │  - ...       │  │  │  Lịch      │  Lịch      │             │ │
│  │              │  │  └────────────┴────────────┘             │ │
│  │              │  │  ┌──────────────────────────┐             │ │
│  │              │  │  │  Bảng điều khiển dưới    │             │ │
│  │              │  │  │  [Bắt đầu] – [Kết thúc]  │             │ │
│  │              │  │  │  [Hành động]             │             │ │
│  │              │  │  └──────────────────────────┘             │ │
│  └──────────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Cấu trúc Thành phần

1. **Nội dung bên trái** (Rộng 152px)
   - Các mục danh sách chọn nhanh
   - Các phạm vi ngày xác định trước

2. **Nội dung bên phải**
   - **Bộ chọn ngày** (lịch đôi)
     - Bộ chọn trái (Rộng 328px)
     - Bộ chọn phải (Rộng 328px)
   - **Bảng điều khiển dưới**
     - Các trường nhập liệu (ngày bắt đầu/kết thúc)
     - Các nút hành động (Hủy/Áp dụng)

3. **Thành phần con**
   - `_Date picker list item` (Mục danh sách bộ chọn ngày)
   - `_Calendar cell` (Ô lịch)
   - `Cursor` (Chỉ báo trực quan)
   - `Buttons/Button` (Nút)
   - `Input field` (Trường nhập liệu)

### Biến thể
Thành phần này không có các biến thể rõ ràng nhưng hỗ trợ các trạng thái khác nhau thông qua các thành phần con:

| Thành phần con | Biến thể | Mô tả |
|----------------|----------|-------------|
| Date picker list item | Mặc định, Hoạt động | Các tùy chọn chọn nhanh |
| Calendar cell | Mặc định, Hoạt động, Được chọn, Ngày hôm nay, Vô hiệu hóa | Các ô ngày riêng lẻ |
| Calendar cell (trạng thái) | Mặc định, Hover, Vô hiệu hóa | Các trạng thái tương tác |

### Trạng thái

#### Trạng thái Mục Danh sách Chọn nhanh
| Trạng thái | Thay đổi Giao diện | Trường hợp Sử dụng |
|-------|----------------|----------|
| Mặc định | `bg-transparent`, `text-secondary` | Tùy chọn chưa được chọn |
| Hoạt động | `bg-active (#fafafa)`, `text-secondary_hover (#252b37)` | Phạm vi hiện đang được chọn |
| Hover | Làm nổi bật nền | Trạng thái khi di chuột qua |

#### Trạng thái Ô Lịch
| Trạng thái | Thay đổi Giao diện | Trường hợp Sử dụng |
|-------|----------------|----------|
| Mặc định | `text-secondary`, không có nền | Ngày bình thường |
| Hover | `bg-primary_hover (#fafafa)` | Khi di chuột qua |
| Hoạt động | `bg-active (#fafafa)` | Một phần của phạm vi được chọn |
| Được chọn (Đầu/Cuối) | `bg-brand-solid (#7f56d9)`, `text-white` | Ranh giới của phạm vi |
| Ngày hôm nay | Chỉ báo đặc biệt (dấu chấm) | Đánh dấu ngày hiện tại |
| Vô hiệu hóa | `text-disabled (#717680)` | Các ngày ngoài tháng hiện tại |
| Có Dấu chấm | Dấu chấm chỉ báo phía dưới | Có sự kiện/dữ liệu |

---

## Token Thiết kế

### Màu sắc

```css
/* Màu nền */
--datepicker-bg-primary: var(--colors/background/bg-primary, white);
--datepicker-bg-active: var(--colors/background/bg-active, #fafafa);
--datepicker-bg-hover: var(--colors/background/bg-primary_hover, #fafafa);
--datepicker-bg-brand: var(--colors/background/bg-brand-solid, #7f56d9);

/* Màu chữ */
--datepicker-text-primary: var(--colors/text/text-primary-(900), #181d27);
--datepicker-text-secondary: var(--colors/text/text-secondary-(700), #414651);
--datepicker-text-secondary-hover: var(--colors/text/text-secondary_hover, #252b37);
--datepicker-text-disabled: var(--colors/text/text-disabled, #717680);
--datepicker-text-white: var(--colors/text/text-white, white);
--datepicker-text-quaternary: var(--colors/foreground/fg-quaternary-(400), #a4a7ae);

/* Màu viền */
--datepicker-border-primary: var(--colors/border/border-primary, #d5d7da);
--datepicker-border-secondary: var(--colors/border/border-secondary, #e9eaeb);
```

### Kiểu chữ

```css
/* Kiểu chữ */
--datepicker-font-family: var(--font-family/font-family-body, 'Inter', sans-serif);

/* Text SM (14px) - Mục danh sách, ngày trên lịch */
--datepicker-text-sm-size: var(--font-size/text-sm, 14px);
--datepicker-text-sm-line-height: var(--line-height/text-sm, 20px);
--datepicker-text-sm-weight-regular: var(--font-weight/regular, 400);
--datepicker-text-sm-weight-medium: var(--font-weight/medium, 500);
--datepicker-text-sm-weight-semibold: var(--font-weight/semibold, 600);

/* Text MD (16px) - Các trường nhập liệu */
--datepicker-text-md-size: var(--font-size/text-md, 16px);
--datepicker-text-md-line-height: var(--line-height/text-md, 24px);
```

### Khoảng cách

```css
/* Khoảng cách thành phần */
--datepicker-spacing-xxs: var(--spacing-xxs, 2px);
--datepicker-spacing-xs: var(--spacing-xs, 4px);
--datepicker-spacing-sm: var(--spacing-sm, 6px);
--datepicker-spacing-md: var(--spacing-md, 8px);
--datepicker-spacing-lg: var(--spacing-lg, 12px);
--datepicker-spacing-xl: var(--spacing-xl, 16px);
--datepicker-spacing-2xl: var(--spacing-2xl, 20px);
--datepicker-spacing-3xl: var(--spacing-3xl, 24px);

/* Khoảng cách cụ thể */
--datepicker-list-gap: var(--spacing-xxs, 2px);
--datepicker-calendar-gap: var(--spacing-lg, 12px);
--datepicker-cell-gap: 4px 0px; /* hàng-khoảng-cách cột-khoảng-cách */
```

### Đường viền & Bo góc

```css
/* Bán kính bo góc */
--datepicker-radius-sm: var(--radius-sm, 6px);
--datepicker-radius-md: var(--radius-md, 8px);
--datepicker-radius-2xl: var(--radius-2xl, 16px);
--datepicker-radius-full: var(--radius-full, 9999px);

/* Độ dày viền */
--datepicker-border-width: 1px;
--datepicker-border-width-thick: 2px;
```

### Đổ bóng & Hiệu ứng

```css
/* Đổ bóng */
--datepicker-shadow-xs: 0px 1px 2px 0px var(--colors/effects/shadows/shadow-xs, rgba(10,13,18,0.05));

--datepicker-shadow-xl: 
  0px 20px 24px -4px var(--colors/effects/shadows/shadow-xl_01, rgba(10,13,18,0.08)),
  0px 8px 8px -4px var(--colors/effects/shadows/shadow-xl_02, rgba(10,13,18,0.03)),
  0px 3px 3px -1.5px var(--colors/effects/shadows/shadow-xl_03, rgba(10,13,18,0.04));

/* Hiệu ứng Skeumorphic */
--datepicker-shadow-skeumorphic: 
  inset 0px 0px 0px 1px var(--colors/effects/shadows/shadow-skeumorphic-inner-border, rgba(10,13,18,0.18)),
  inset 0px -2px 0px 0px var(--colors/effects/shadows/shadow-skeumorphic-inner, rgba(10,13,18,0.05));

/* Viền nút (Thương hiệu) */
--datepicker-button-brand-border: rgba(255,255,255,0.12);
```

### Kích thước

```css
/* Kích thước thành phần */
--datepicker-leading-width: 152px;
--datepicker-picker-width: 328px;
--datepicker-cell-size: 40px;
--datepicker-dot-size: 5px;
--datepicker-button-height: 32px;
--datepicker-input-width: 136px;

/* Lưới Lịch */
--datepicker-calendar-columns: 7; /* Các ngày trong tuần */
--datepicker-calendar-rows: 6; /* Số tuần tối đa trong tháng */
```

---

## API Thành phần

### Props/Tham số

#### Props bắt buộc
| Prop | Kiểu dữ liệu | Mô tả | Mặc định |
|------|------|-------------|---------|
| `onApply` | `(startDate: Date, endDate: Date) => void` | Callback khi phạm vi ngày được áp dụng | - |

#### Props tùy chọn
| Prop | Kiểu dữ liệu | Mô tả | Mặc định |
|------|------|-------------|---------|
| `defaultStartDate` | `Date \| null` | Ngày bắt đầu ban đầu | `null` |
| `defaultEndDate` | `Date \| null` | Ngày kết thúc ban đầu | `null` |
| `minDate` | `Date \| null` | Ngày tối thiểu có thể chọn | `null` |
| `maxDate` | `Date \| null` | Ngày tối đa có thể chọn | `null` |
| `quickSelections` | `QuickSelection[]` | Các tùy chọn chọn nhanh tùy chỉnh | Danh sách mặc định |
| `showQuickSelections` | `boolean` | Hiện/ẩn nội dung bên trái | `true` |
| `locale` | `string` | Ngôn ngữ cho định dạng ngày | `'en-US'` |
| `firstDayOfWeek` | `0-6` | Ngày đầu tuần (0=Chủ Nhật) | `1` (Thứ Hai) |
| `showDots` | `boolean` | Hiển thị các dấu chấm chỉ báo sự kiện | `false` |
| `eventDates` | `Date[]` | Các ngày có sự kiện (để hiện dấu chấm) | `[]` |
| `onCancel` | `() => void` | Callback khi nhấn Hủy | - |
| `className` | `string` | Lớp CSS tùy chỉnh | - |
| `style` | `CSSProperties` | Kiểu inline | - |

#### Kiểu dữ liệu QuickSelection
```typescript
interface QuickSelection {
  label: string;
  getValue: () => { start: Date; end: Date };
}
```

### Sự kiện (Events)
| Sự kiện | Tham số | Mô tả |
|-------|------------|-------------|
| `onApply` | `(startDate: Date, endDate: Date) => void` | Kích hoạt khi người dùng nhấn nút Áp dụng |
| `onCancel` | `() => void` | Kích hoạt khi người dùng nhấn nút Hủy |
| `onDateSelect` | `(date: Date) => void` | Kích hoạt khi một ngày được nhấn |
| `onQuickSelect` | `(selection: QuickSelection) => void` | Kích hoạt khi một lựa chọn nhanh được nhấn |
| `onMonthChange` | `(month: number, year: number, picker: 'left' \| 'right') => void` | Kích hoạt khi thay đổi tháng |

---

## Hành vi

### Tương tác

#### Quy trình Chọn Ngày
1. **Chọn Nhanh** (Nội dung bên trái)
   - Nhấn vào một phạm vi xác định trước → Làm nổi bật phạm vi trong lịch → Cập nhật các trường nhập liệu
   - Ví dụ: "Hôm nay", "Hôm qua", "Tuần này", "Tuần trước", "Tháng này", "Tháng trước", "Năm nay", "Năm trước", "Tất cả thời gian"

2. **Chọn Thủ công** (Lịch)
   - Nhấn ngày đầu tiên → Trở thành ngày bắt đầu (nền tím)
   - Nhấn ngày thứ hai → Trở thành ngày kết thúc (nền tím)
   - Các ngày ở giữa → Trạng thái hoạt động (nền xám nhạt)
   - Các chỉ báo trực quan kết nối thể hiện tính liên tục của phạm vi

3. **Các Trường Nhập liệu**
   - Hiển thị ngày bắt đầu và kết thúc đã chọn
   - Định dạng: "Jan 10, 2025" (tùy theo locale)
   - Có thể nhấn để tập trung vào bộ chọn lịch

4. **Hành động**
   - **Hủy**: Đóng bộ chọn mà không áp dụng thay đổi
   - **Áp dụng**: Xác nhận lựa chọn và kích hoạt callback `onApply`

#### Điều hướng Lịch
- **Bộ chọn Trái**: Cho phép điều hướng đến tháng trước
- **Bộ chọn Phải**: Cho phép điều hướng đến tháng sau
- **Hiển thị Tháng**: Hiển thị tháng và năm hiện tại
- **Các nút Chevron**: Điều hướng qua lại giữa các tháng

#### Phản hồi Trực quan
- **Trạng thái Hover**: Nền xám nhạt trên các ô lịch
- **Phạm vi Hoạt động**: Nền xám cho các ngày nằm trong phạm vi được chọn
- **Ranh giới Phạm vi**: Nền tím với chữ trắng
- **Kết nối**: Các đường trực quan kết nối các ngày trong phạm vi
- **Chỉ báo Con trỏ**: Biểu tượng bàn tay trên các thành phần có thể tương tác
- **Dấu chấm Sự kiện**: Các dấu chấm nhỏ ở dưới cùng của ô cho các ngày có sự kiện

### Điều hướng Bàn phím
- **Tab**: Di chuyển giữa các lựa chọn nhanh, ô lịch, trường nhập và nút
- **Enter/Space**: Chọn ngày hoặc kích hoạt nút
- **Phím Mũi tên**: Điều hướng lưới lịch
- **Escape**: Hủy và đóng bộ chọn
- **Home/End**: Nhảy đến đầu/cuối tuần
- **Page Up/Down**: Điều hướng giữa các tháng

### Hành vi Thích ứng (Responsive)
- **Desktop (>1024px)**: Bố cục đầy đủ với lịch đôi
- **Tablet (768px-1024px)**: Xếp chồng các lịch theo chiều dọc, giữ nguyên nội dung bên trái
- **Mobile (<768px)**: 
  - Ẩn nội dung bên trái (hiển thị dưới dạng dropdown hoặc modal riêng)
  - Xem lịch đơn
  - Xếp chồng các trường nhập liệu theo chiều dọc
  - Các nút có chiều rộng đầy đủ

### Hoạt ảnh & Chuyển cảnh

```css
/* Chuyển cảnh khi hover */
.calendar-cell {
  transition: background-color 200ms ease-in-out;
}

/* Hoạt ảnh khi đổi tháng */
.calendar-grid {
  transition: opacity 150ms ease-in-out;
}

/* Hoạt ảnh khi chọn phạm vi */
.range-connector {
  transition: opacity 200ms ease-in-out;
}
```

---

## Khả năng truy cập (a11y)

### Thuộc tính ARIA

```html
<!-- Container Chính -->
<div 
  role="dialog" 
  aria-label="Bộ chọn phạm vi ngày"
  aria-modal="true"
>
  <!-- Chọn nhanh -->
  <div role="list" aria-label="Các lựa chọn ngày nhanh">
    <button 
      role="listitem"
      aria-selected="true|false"
      aria-label="Chọn tuần trước"
    >
      Tuần trước
    </button>
  </div>

  <!-- Lịch -->
  <div role="grid" aria-label="Tháng 1 năm 2025">
    <div role="row">
      <button 
        role="gridcell"
        aria-label="Ngày 10 tháng 1 năm 2025"
        aria-selected="true"
        aria-disabled="false"
      >
        10
      </button>
    </div>
  </div>

  <!-- Các trường Nhập liệu -->
  <input
    type="text"
    aria-label="Ngày bắt đầu"
    aria-describedby="date-format-hint"
    readonly
  />

  <!-- Các nút -->
  <button aria-label="Áp dụng lựa chọn ngày">Áp dụng</button>
  <button aria-label="Hủy lựa chọn ngày">Hủy</button>
</div>
```

### Hỗ trợ Bàn phím

| Phím | Chức năng |
|-----|----------|
| `Tab` | Di chuyển tiêu điểm qua các phần tử tương tác |
| `Shift + Tab` | Di chuyển tiêu điểm ngược lại |
| `Enter` / `Space` | Kích hoạt phần tử đang được tập trung |
| `Escape` | Đóng bộ chọn, hủy lựa chọn |
| `Các phím mũi tên` | Điều hướng trong lưới lịch |
| `Home` | Di chuyển đến ngày đầu tuần |
| `End` | Di chuyển đến ngày cuối tuần |
| `Page Up` | Tháng trước |
| `Page Down` | Tháng sau |

### Hỗ trợ Trình đọc màn hình
- Thông báo phạm vi ngày đã chọn
- Thông báo tháng/năm khi điều hướng
- Thông báo lựa chọn nhanh khi được kích hoạt
- Thông báo "X ngày đã chọn" khi phạm vi được xác định
- Cung cấp nhãn rõ ràng cho tất cả các phần tử tương tác

### Quản lý Tiêu điểm (Focus Management)
- Giữ tiêu điểm (focus trap) trong modal khi đang mở
- Trả lại tiêu điểm về phần tử kích hoạt khi đóng
- Chỉ báo tiêu điểm rõ ràng (outline) trên tất cả thành phần tương tác
- Có thể bỏ qua nội dung bên trái để nhảy đến lịch chính

### Độ tương phản màu sắc
- **Văn bản trên nền trắng**: Tối thiểu 4.5:1
  - `#414651` trên `white` = 9.5:1 ✓
  - `#181d27` trên `white` = 14.8:1 ✓
- **Văn bản trắng trên màu thương hiệu**: Tối thiểu 4.5:1
  - `white` trên `#7f56d9` = 5.2:1 ✓
- **Văn bản bị vô hiệu hóa**: Tối thiểu 3:1
  - `#717680` trên `white` = 4.8:1 ✓

---

## Hướng dẫn Sử dụng

### Khi nào nên sử dụng
- **Chọn phạm vi ngày**: Khi người dùng cần chọn ngày bắt đầu và ngày kết thúc
- **Bảng điều khiển phân tích**: Lọc dữ liệu theo phạm vi ngày
- **Hệ thống đặt chỗ**: Chọn ngày nhận phòng/trả phòng
- **Tạo báo cáo**: Xác định khoảng thời gian báo cáo
- **Lên kế hoạch sự kiện**: Thiết lập thời lượng sự kiện
- **Lọc dữ liệu**: Thu hẹp dữ liệu dựa trên thời gian

### Khi nào KHÔNG nên sử dụng
- **Chọn ngày đơn lẻ**: Sử dụng bộ chọn ngày đơn giản
- **Chọn thời gian (giờ)**: Sử dụng thành phần chọn thời gian
- **Chỉ chọn ngày tương đối**: Sử dụng menu thả xuống với các tùy chọn có sẵn
- **Lịch luôn hiển thị**: Sử dụng thành phần lịch inline
- **Chọn đơn giản trên di động**: Cân nhắc sử dụng input ngày mặc định của hệ điều hành

### Thực hành tốt nhất

✅ **NÊN**
- Cung cấp các lựa chọn nhanh phổ biến để người dùng thuận tiện
- Hiển thị phản hồi trực quan cho phạm vi đã chọn
- Hiển thị ngày đã định dạng trong các trường nhập liệu
- Sử dụng nhãn rõ ràng, mang tính mô tả
- Cung cấp khả năng điều hướng bằng bàn phím
- Hiển thị tháng hiện tại theo mặc định
- Làm nổi bật ngày hôm nay
- Cho phép điều hướng tháng dễ dàng
- Xác thực phạm vi ngày (bắt đầu trước kết thúc)
- Hiển thị chỉ báo sự kiện khi liên quan

❌ **KHÔNG NÊN**
- Không cho phép ngày kết thúc trước ngày bắt đầu
- Không ẩn phạm vi đã chọn về mặt trực quan
- Không sử dụng định dạng ngày gây mơ hồ
- Không làm cho các lựa chọn nhanh quá cụ thể
- Không vô hiệu hóa điều hướng bàn phím
- Không tự động đóng khi mới chọn xong một ngày duy nhất
- Không hiển thị quá nhiều tháng cùng lúc (hiệu năng)
- Không quên xử lý các trường hợp đặc biệt (năm nhuận, ranh giới tháng)

### Hướng dẫn Nội dung

#### Nhãn Chọn Nhanh
- Sử dụng ngôn ngữ giao tiếp, rõ ràng
- Nhất quán về thì (quá khứ/hiện tại)
- Sắp xếp từ gần nhất đến xa nhất
- Ví dụ:
  - ✓ "Hôm nay", "Hôm qua", "7 ngày qua"
  - ✗ "Ngày hiện tại", "Ngày trước đó", "Tuần đã qua"

#### Định dạng Ngày
- Sử dụng định dạng phù hợp với locale
- Nhất quán trong toàn bộ thành phần
- Ví dụ:
  - VN: "10 thg 1, 2025" hoặc "10/01/2025"
  - US: "Jan 10, 2025"
  - ISO: "2025-01-10"

---

## Ví dụ Mã nguồn

### Cách sử dụng cơ bản

```tsx
import { DatePickerMenu } from '@/components/DatePickerMenu';

function MyComponent() {
  const handleApply = (startDate: Date, endDate: Date) => {
    console.log('Selected range:', startDate, endDate);
    // Fetch data, update state, etc.
  };

  return (
    <DatePickerMenu
      defaultStartDate={new Date('2025-01-10')}
      defaultEndDate={new Date('2025-01-16')}
      onApply={handleApply}
    />
  );
}
```

### Với các Lựa chọn Nhanh tùy chỉnh

```tsx
const customQuickSelections = [
  {
    label: '30 ngày qua',
    getValue: () => ({
      start: subDays(new Date(), 30),
      end: new Date()
    })
  },
  {
    label: 'Quý trước',
    getValue: () => ({
      start: startOfQuarter(subQuarters(new Date(), 1)),
      end: endOfQuarter(subQuarters(new Date(), 1))
    })
  }
];

<DatePickerMenu
  quickSelections={customQuickSelections}
  onApply={handleApply}
/>
```

### Với Chỉ báo Sự kiện

```tsx
const eventDates = [
  new Date('2025-01-01'),
  new Date('2025-01-04'),
  new Date('2025-01-30'),
  new Date('2025-02-04'),
  new Date('2025-02-14')
];

<DatePickerMenu
  showDots={true}
  eventDates={eventDates}
  onApply={handleApply}
/>
```

### Với Ràng buộc Min/Max

```tsx
<DatePickerMenu
  minDate={new Date('2024-01-01')}
  maxDate={new Date()}
  onApply={handleApply}
  onCancel={() => console.log('Đã hủy')}
/>
```

### Thành phần có Kiểm soát (Controlled Component)

```tsx
function ControlledDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {startDate && endDate
          ? `${format(startDate, 'dd/MM/yyyy')} – ${format(endDate, 'dd/MM/yyyy')}`
          : 'Chọn phạm vi ngày'}
      </button>

      {isOpen && (
        <DatePickerMenu
          defaultStartDate={startDate}
          defaultEndDate={endDate}
          onApply={handleApply}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

---

## Triển khai theo Nền tảng

### Web (React + TypeScript)

```tsx
import React, { useState } from 'react';
import './DatePickerMenu.css';

interface DatePickerMenuProps {
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  onApply: (startDate: Date, endDate: Date) => void;
  onCancel?: () => void;
  quickSelections?: QuickSelection[];
  showQuickSelections?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  locale?: string;
  firstDayOfWeek?: number;
  showDots?: boolean;
  eventDates?: Date[];
  className?: string;
}

export const DatePickerMenu: React.FC<DatePickerMenuProps> = ({
  defaultStartDate = null,
  defaultEndDate = null,
  onApply,
  onCancel,
  quickSelections = DEFAULT_QUICK_SELECTIONS,
  showQuickSelections = true,
  minDate = null,
  maxDate = null,
  locale = 'vi-VN',
  firstDayOfWeek = 1,
  showDots = false,
  eventDates = [],
  className = ''
}) => {
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(addMonths(new Date(), 1));
  const [selectedQuickSelection, setSelectedQuickSelection] = useState<string | null>(null);

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setSelectedQuickSelection(null);
    } else {
      if (isBefore(date, startDate)) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleQuickSelect = (selection: QuickSelection) => {
    const { start, end } = selection.getValue();
    setStartDate(start);
    setEndDate(end);
    setSelectedQuickSelection(selection.label);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    }
  };

  return (
    <div className={`date-picker-menu ${className}`} role="dialog" aria-label="Bộ chọn phạm vi ngày">
      {showQuickSelections && (
        <div className="date-picker-menu__leading">
          {quickSelections.map((selection) => (
            <button
              key={selection.label}
              className={`date-picker-list-item ${
                selectedQuickSelection === selection.label ? 'active' : ''
              }`}
              onClick={() => handleQuickSelect(selection)}
              aria-selected={selectedQuickSelection === selection.label}
            >
              {selection.label}
            </button>
          ))}
        </div>
      )}

      <div className="date-picker-menu__trailing">
        <div className="date-picker-menu__pickers">
          <CalendarPicker
            month={leftMonth}
            onMonthChange={setLeftMonth}
            startDate={startDate}
            endDate={endDate}
            onDateClick={handleDateClick}
            showPrevButton={true}
            showNextButton={false}
            eventDates={eventDates}
            showDots={showDots}
          />
          <CalendarPicker
            month={rightMonth}
            onMonthChange={setRightMonth}
            startDate={startDate}
            endDate={endDate}
            onDateClick={handleDateClick}
            showPrevButton={false}
            showNextButton={true}
            eventDates={eventDates}
            showDots={showDots}
          />
        </div>

        <div className="date-picker-menu__bottom">
          <div className="date-picker-menu__inputs">
            <input
              type="text"
              value={startDate ? format(startDate, 'dd/MM/yyyy') : ''}
              readOnly
              aria-label="Ngày bắt đầu"
            />
            <span>–</span>
            <input
              type="text"
              value={endDate ? format(endDate, 'dd/MM/yyyy') : ''}
              readOnly
              aria-label="Ngày kết thúc"
            />
          </div>

          <div className="date-picker-menu__actions">
            <button onClick={onCancel} className="button button--secondary">
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="button button--primary"
              disabled={!startDate || !endDate}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Triển khai CSS

```css
/* Container Chính */
.date-picker-menu {
  display: flex;
  background: var(--datepicker-bg-primary);
  border-radius: var(--datepicker-radius-2xl);
  box-shadow: var(--datepicker-shadow-xl);
  overflow: hidden;
}

/* Nội dung bên trái */
.date-picker-menu__leading {
  width: var(--datepicker-leading-width);
  padding: var(--datepicker-spacing-lg);
  border-right: 1px solid var(--datepicker-border-secondary);
  display: flex;
  flex-direction: column;
  gap: var(--datepicker-list-gap);
}

.date-picker-list-item {
  padding: var(--datepicker-spacing-md) var(--datepicker-spacing-lg);
  border-radius: var(--datepicker-radius-sm);
  font-size: var(--datepicker-text-sm-size);
  font-weight: var(--datepicker-text-sm-weight-medium);
  color: var(--datepicker-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 200ms ease;
}

.date-picker-list-item:hover {
  background: var(--datepicker-bg-hover);
}

.date-picker-list-item.active {
  background: var(--datepicker-bg-active);
  color: var(--datepicker-text-secondary-hover);
}
```

---

## Kiểm thử (Testing)

### Kiểm thử đơn vị (Unit Tests)

```typescript
describe('DatePickerMenu', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<DatePickerMenu onApply={jest.fn()} />);
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('gọi onApply với ngày đã chọn', () => {
    const onApply = jest.fn();
    const { getByText } = render(<DatePickerMenu onApply={onApply} />);
    
    // Chọn ngày
    fireEvent.click(getByText('10'));
    fireEvent.click(getByText('16'));
    fireEvent.click(getByText('Áp dụng'));
    
    expect(onApply).toHaveBeenCalledWith(
      expect.any(Date),
      expect.any(Date)
    );
  });

  it('làm nổi bật phạm vi được chọn', () => {
    const { getByText } = render(<DatePickerMenu onApply={jest.fn()} />);
    
    fireEvent.click(getByText('10'));
    fireEvent.click(getByText('16'));
    
    expect(getByText('11').closest('.calendar-cell')).toHaveClass('active');
    expect(getByText('15').closest('.calendar-cell')).toHaveClass('active');
  });

  it('áp dụng chọn nhanh', () => {
    const { getByText } = render(<DatePickerMenu onApply={jest.fn()} />);
    
    fireEvent.click(getByText('Tuần trước'));
    
    expect(getByText('Tuần trước').closest('button')).toHaveClass('active');
  });

  it('xác thực phạm vi ngày (bắt đầu trước kết thúc)', () => {
    const { getByText } = render(<DatePickerMenu onApply={jest.fn()} />);
    
    fireEvent.click(getByText('16'));
    fireEvent.click(getByText('10'));
    
    // Sẽ tự động hoán đổi ngày
    const inputs = document.querySelectorAll('input');
    expect(inputs[0].value).toContain('10');
    expect(inputs[1].value).toContain('16');
  });
});
```

### Kiểm thử Hồi quy Hình ảnh
- [ ] Chụp màn hình tất cả các trạng thái chọn nhanh
- [ ] Chụp màn hình lịch với phạm vi được chọn
- [ ] Chụp màn hình các trạng thái hover
- [ ] Chụp màn hình các ngày bị vô hiệu hóa
- [ ] Chụp màn hình với các dấu chấm sự kiện
- [ ] Chụp màn hình bố cục thích ứng trên di động
- [ ] Chụp màn hình các trạng thái tập trung bàn phím (focus states)

### Kiểm thử Tích hợp
- [ ] Quy trình chọn ngày (bắt đầu → kết thúc → áp dụng)
- [ ] Quy trình chọn nhanh
- [ ] Điều hướng tháng
- [ ] Chức năng Hủy
- [ ] Điều hướng bàn phím qua toàn bộ thành phần
- [ ] Thông báo trình đọc màn hình

### Kiểm thử Khả năng truy cập
- [ ] Thuộc tính ARIA có đầy đủ và chính xác
- [ ] Điều hướng bàn phím hoạt động
- [ ] Quản lý tiêu điểm chính xác
- [ ] Độ tương phản màu sắc đạt chuẩn WCAG AA
- [ ] Trình đọc màn hình thông báo các lựa chọn

---

## Phụ thuộc (Dependencies)

### Bắt buộc
- `date-fns`: `^2.30.0` - Thao tác và định dạng ngày tháng
- `react`: `^18.0.0`
- `react-dom`: `^18.0.0`

### Tùy chọn
- `@testing-library/react`: `^14.0.0` - Tiện ích kiểm thử
- `@testing-library/user-event`: `^14.0.0` - Kiểm thử tương tác người dùng

---

## Thành phần liên quan

- **Bộ chọn Ngày (Đơn)**: Để chọn một ngày duy nhất thay vì một phạm vi
- **Bộ chọn Thời gian**: Để chọn giờ cụ thể
- **Bộ chọn Ngày & Giờ**: Kết hợp chọn cả ngày và giờ
- **Ô Lịch**: Thành phần con được sử dụng trong bộ chọn này
- **Trường Nhập**: Được sử dụng để hiển thị các ngày đã chọn
- **Nút**: Được sử dụng cho các hành động (Hủy/Áp dụng)

---

## Tài nguyên

- [Figma Design](https://www.figma.com/design/04nXAUxjZO8WAiyxsS84aI/AT---DesignSystem?node-id=1-5787&m=dev)
- [Tài liệu Design Tokens](../02-design-tokens/README.md)
- [Hướng dẫn Khả năng truy cập](../06-accessibility/README.md)
- [Tài liệu date-fns](https://date-fns.org/)

---

## Nhật ký thay đổi

### Phiên bản 1.0.0 (2026-02-07)
- Khởi tạo đặc tả từ thiết kế Figma
- Xác định cấu trúc thành phần và API
- Tài liệu hóa tất cả các trạng thái và biến thể
- Thêm các yêu cầu về khả năng truy cập
- Tạo các ví dụ triển khai
