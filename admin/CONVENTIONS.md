# 🤖 ADMIN DASHBOARD — AI AGENT GUIDELINES & CONVENTIONS

Dự án này là trang Quản trị (Admin) thuộc hệ thống **Smart Retail Intelligence Platform**. 
File này chứa toàn bộ các quy tắc bắt buộc để AI tuân thủ khi viết code, refactor hoặc khởi tạo module mới.

---

## 🛠️ 1. Tech Stack & Công cụ

- **Framework:** React 18+ (TypeScript)
- **Build Tool:** Vite (Vite v8+)
- **Styling:** Tailwind CSS v4
- **Dev Server Port:** `8443` (`0.0.0.0`)

---

## 📁 2. Quy tắc Cấu trúc Thư mục (Directory Structure)

⚠️ **QUY TẮC VÀNG:** Tất cả code xử lý logic, giao diện, dữ liệu TẤT CẢ PHẢI NẰM TRONG THƯ MỤC `src/`. Tuyệt đối không tạo thư mục mã nguồn ngang hàng với `package.json`.

```text
admin/
├── src/
│   ├── components/       # Các UI Component
│   │   ├── charts/       # Biểu đồ (BranchChart, OrdersWave, CapsuleBars, v.v.)
│   │   ├── common/       # Component dùng chung (Icon, PillDropdown, Button, v.v.)
│   │   ├── dashboard/    # Component đặc thù Dashboard (KpiCard, ActivityTable, LowStockAlert)
│   │   └── layout/       # Khung giao diện (Header, Sidebar)
│   ├── constants/        # Hằng số, Theme, Mock Data, Config Menu
│   │   ├── mockData.ts   # Dữ liệu giả định phục vụ giao diện
│   │   ├── navigation.ts # Cấu hình danh mục menu
│   │   └── theme.ts      # Cấu hình màu sắc, theme hệ thống
│   ├── pages/            # Các trang chính của Admin (DashboardPage, v.v.)
│   ├── types/            # Định nghĩa TypeScript (Interfaces/Types)
│   │   └── dashboard.ts
│   ├── App.tsx           # Layout wrapper & điều hướng chính
│   ├── main.tsx          # App Entry point
│   └── index.css         # Import Tailwind & CSS toàn cục
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
🔗 3. Quy tắc Import & Path Alias
Path Alias @: Đã được cấu hình trỏ thẳng vào thư mục src/.

Ưu tiên sử dụng @/: Luôn ưu tiên dùng @/ cho các import liên thư mục thay vì đường dẫn tương đối dài.

🟢 NÊN: import { T } from "@/constants/theme";

🟢 NÊN: import { KpiCard } from "@/components/dashboard/KpiCard";

🔴 TRÁNH: import { T } from "../../constants/theme";

💻 4. Quy chuẩn Viết Code (Coding Standards)
TypeScript & Types
Không dùng any: Mọi props, state, dữ liệu API/mock đều phải khai báo Type/Interface rõ ràng trong src/types/.

Mọi component đều phải định nghĩa Props interface riêng nếu có nhận tham số.

React Components
Sử dụng Functional Components với cú pháp export const ComponentName = (...) => {} hoặc export function.

Đảm bảo tính chia nhỏ (Modularization): Gom nhóm các sub-component vào đúng thư mục (charts/, common/, dashboard/, layout/).

Styling (Tailwind CSS v4)
Sử dụng utility classes của Tailwind CSS trực tiếp trên JSX.

Nếu có thiết lập màu sắc/theme dùng chung, khai báo hoặc lấy từ src/constants/theme.ts.
