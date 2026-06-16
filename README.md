# TQC Management System (Hệ thống Quản lý Vật liệu Xây dựng TQC)

Hệ thống quản lý bán hàng, vận chuyển vật liệu xây dựng (đá, vận chuyển) và xuất hóa đơn/phiếu xuất kho cho **Công ty TNHH Tư Vấn và Xây Dựng TQC**. Dự án được xây dựng và triển khai trên nền tảng **Google Apps Script** kết hợp **Google Sheets** làm cơ sở dữ liệu.

## 📁 Cấu trúc thư mục

Dự án được tổ chức như sau:

```text
TQC_Manage_System/
├── source/
│   ├── Code.gs      # Logic backend chạy trên Google Apps Script
│   └── Index.html   # Giao diện frontend SPA (Single Page Application)
├── doc/
│   └── design_and_architecture.md  # Tài liệu thiết kế chi tiết & kiến trúc
├── .gitignore       # Bỏ qua các file không cần thiết khi commit
└── README.md        # Tài liệu hướng dẫn sử dụng & triển khai
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: 
  - HTML5 & CSS3 (Giao diện hiện đại tối giản Pastel Blue & White, Font chữ Be Vietnam Pro).
  - Vanilla Javascript (Xử lý logic DOM, định dạng dữ liệu và quản lý trạng thái).
  - Thư viện `xlsx-js-style` (dùng CDN) để xuất file báo cáo Excel chất lượng cao có định dạng.
- **Backend**:
  - Google Apps Script (Javascript Engine của Google) để tiếp nhận yêu cầu từ client thông qua `doGet`/`doPost` hoặc `google.script.run`.
- **Database**:
  - Google Sheets (Bảng tính Google) được tổ chức thành các sheet dữ liệu: `CauHinh`, `KhachHang`, `SanPham`, và `VanChuyen`.

## 🚀 Hướng dẫn triển khai (Deployment)

Dự án này chạy trực tiếp trên môi trường Google Apps Script. Để triển khai hệ thống:

### Bước 1: Tạo Google Sheets mới
1. Truy cập vào [Google Sheets](https://sheets.google.com) và tạo một bảng tính trống mới.
2. Đặt tên cho bảng tính (ví dụ: `TQC Management Database`).

### Bước 2: Tạo dự án Google Apps Script
1. Tại bảng tính vừa tạo, chọn **Tiện ích mở rộng (Extensions)** → **Apps Script**.
2. Dự án Apps Script sẽ tự động liên kết với Google Sheets của bạn.

### Bước 3: Đưa mã nguồn lên Apps Script Editor
1. Trong trình biên soạn Apps Script, đổi tên file `Mã.gs` (`Code.gs`) mặc định thành `Code.gs`. Copy toàn bộ nội dung của file [source/Code.gs](file:///d:/Test/TQC_Prj/TQC_Manage_System/source/Code.gs) dán vào đây.
2. Nhấp vào nút **+** (Tạo file) → Chọn **HTML**, đặt tên file là `Index` (Apps Script sẽ tự tạo `Index.html`). Copy toàn bộ nội dung của file [source/Index.html](file:///d:/Test/TQC_Prj/TQC_Manage_System/source/Index.html) dán vào đây.
3. Nhấn nút **Lưu dự án (Save project)** (Biểu tượng đĩa mềm hoặc phím tắt `Ctrl + S`).

### Bước 4: Cấu hình và Deploy Web App
1. Chọn nút **Triển khai (Deploy)** ở góc trên bên phải → **Triển khai mới (New deployment)**.
2. Chọn loại triển khai là **Ứng dụng web (Web app)** bằng cách nhấn vào biểu tượng bánh răng bên cạnh chữ "Chọn loại".
3. Thiết lập thông số:
   - **Mô tả (Description)**: Phiên bản đầu tiên
   - **Thực thi dưới dạng (Execute as)**: Tôi (Email của bạn - Me)
   - **Ai có quyền truy cập (Who has access)**: Bất kỳ ai (Anyone)
4. Nhấp nút **Triển khai (Deploy)**.
5. Cấp quyền truy cập ứng dụng (nếu hệ thống yêu cầu xác thực tài khoản Google của bạn).
6. Sau khi triển khai thành công, hệ thống sẽ cấp cho bạn một **URL Ứng dụng web (Web App URL)**. Hãy copy URL này.

### Bước 5: Khởi tạo cơ sở dữ liệu
1. Mở ứng dụng web bằng URL bạn vừa copy.
2. Truy cập vào tab **Cài đặt (Settings)** (Biểu tượng bánh răng ở sidebar).
3. Tìm phần **Cấu hình API / Cơ sở dữ liệu** và bấm nút **Khởi tạo dữ liệu (Init Database)**. 
4. Hệ thống sẽ tự động tạo các Sheet dữ liệu cần thiết (`CauHinh`, `KhachHang`, `SanPham`, `VanChuyen`) kèm theo dữ liệu mặc định ban đầu trên bảng tính của bạn.

---

## 💻 Kiểm thử hoặc Chạy Local (Offline/Local Development)

Giao diện hệ thống hỗ trợ khả năng hoạt động độc lập (offline/local):
1. Bạn có thể mở trực tiếp file `source/Index.html` bằng trình duyệt trên máy tính cá nhân.
2. Truy cập vào mục **Cài đặt**, dán **URL Web App** (lấy được ở Bước 4) vào ô cấu hình URL API và bấm **Lưu cấu hình**.
3. Hệ thống local sẽ giao tiếp với Google Sheets của bạn qua HTTP requests (`fetch`), cho phép bạn kiểm thử giao diện mà không cần deploy lại liên tục trên Google Apps Script.

---

## 🔄 Tự động đồng bộ mã nguồn (Google Clasp)

Để không phải copy-paste thủ công mỗi khi sửa code, bạn có thể sử dụng **Clasp (Command Line Apps Script Projects)** - công cụ dòng lệnh chính thức từ Google. Nó giúp bạn kéo/đẩy (`clasp pull` / `clasp push`) mã nguồn giữa máy tính và dự án Apps Script trực tiếp từ terminal.

### Bước 1: Kích hoạt Google Apps Script API
1. Truy cập vào trang cài đặt của [Google Apps Script User Settings](https://script.google.com/home/settings).
2. Chuyển trạng thái **Google Apps Script API** sang **Bật (ON)**.

### Bước 2: Cài đặt Clasp trên máy tính
Mở Terminal/PowerShell và chạy lệnh cài đặt toàn cục (yêu cầu máy tính đã cài đặt [Node.js](https://nodejs.org/)):
```bash
npm install -g @google/clasp
```

### Bước 3: Đăng nhập tài khoản Google
Chạy lệnh đăng nhập và xác thực tài khoản Google của bạn trên trình duyệt:
```bash
clasp login
```

### Bước 4: Liên kết thư mục dự án cục bộ với Google Apps Script
1. Truy cập dự án Apps Script của bạn trên trình duyệt, vào phần **Cài đặt dự án (Project Settings)** (biểu tượng bánh răng bên trái) và sao chép **ID dự án (Script ID)**.
2. Tại thư mục gốc `TQC_Manage_System/` trên máy tính của bạn, tạo một file cấu hình tên là `.clasp.json` với nội dung sau:
   ```json
   {
     "scriptId": "MÃ_SCRIPT_ID_CỦA_BẠN",
     "rootDir": "source"
   }
   ```
3. Tạo thêm file cấu hình runtime của Apps Script là `source/appsscript.json` với nội dung mặc định như sau:
   ```json
   {
     "timeZone": "Asia/Ho_Chi_Minh",
     "dependencies": {
     },
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8"
   }
   ```

### Bước 5: Sử dụng Clasp để đồng bộ
Giờ đây bạn có thể mở terminal tại thư mục dự án và sử dụng các lệnh sau:
- **Đẩy code lên Apps Script (Push)**:
  ```bash
  clasp push
  ```
- **Tự động đẩy code ngay khi lưu file (Watch Mode)**:
  Lệnh này sẽ giám sát thư mục `source/` và tự động cập nhật lên Apps Script mỗi khi bạn nhấn Lưu (`Ctrl + S`):
  ```bash
  clasp push --watch
  ```
- **Tải code từ Apps Script về máy (Pull)**:
  ```bash
  clasp pull
  ```

