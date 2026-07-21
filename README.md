Dưới đây là file **`README.md`** chuẩn mực, chuyên nghiệp và được thiết kế tối ưu để tạo ấn tượng mạnh trên GitHub cũng như trong hồ sơ tuyển dụng (Portfolio / CV) của bạn.

---

#  Smart Retail Intelligence Platform

> **Enterprise Multi-Branch POS & Real-Time Analytics System**
> *Hệ thống Quản lý Bán hàng & Phân tích Doanh thu Đa chi nhánh Chuẩn Doanh nghiệp.*

---

##  Bảng mục lục

* [Giới thiệu dự án](https://www.google.com/search?q=%23-gi%E1%BB%9Bi-thi%E1%BB%87u-d%E1%BB%B1-%C3%A1n)
* [Kiến trúc & Điểm sáng Kỹ thuật](https://www.google.com/search?q=%23-ki%E1%BA%BFn-tr%C3%BAc--%C4%91i%E1%BB%83m-s%C3%A1ng-k%E1%BB%B9-thu%E1%BA%ADt)
* [Các tính năng cốt lõi](https://www.google.com/search?q=%23-c%C3%A1c-t%C3%ADnh-n%C4%83ng-c%E1%BB%91t-l%C3%B5i)
* [Cấu trúc Cơ sở Dữ liệu (Database Schema)](https://www.google.com/search?q=%23-c%E1%BA%A5u-tr%C3%BAc-c%C6%A1-s%E1%BB%9F-d%E1%BB%AF-li%E1%BB%87u-database-schema)
* [Công nghệ sử dụng](https://www.google.com/search?q=%23-c%C3%B4ng-ngh%E1%BB%87-s%E1%BB%AD-d%E1%BB%A5ng)
* [Hướng dẫn cài đặt & Chạy ứng dụng](https://www.google.com/search?q=%23-h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-c%C3%A0i-%C4%91%E1%BA%B7t--ch%E1%BA%A1y-%E1%BB%A9ng-d%E1%BB%A5ng)
* [Lộ trình phát triển (Roadmap)](https://www.google.com/search?q=%23-l%E1%BB%99-tr%C3%ACnh-ph%C3%A1t-tri%E1%BB%83n-roadmap)

---

##  Giới thiệu dự án

**Smart Retail Intelligence Platform** là giải pháp phần mềm quản lý bán hàng (POS) toàn diện dành cho chuỗi cửa hàng tiện lợi / bán lẻ nhiều chi nhánh[cite: 3, 7]. Hệ thống giải quyết các bài toán thực tế của doanh nghiệp:

1. **Quản lý đa chi nhánh độc lập:** Tách biệt danh mục sản phẩm dùng chung (Catalog) và tồn kho thực tế tại từng điểm bán[cite: 7].
2. **Kiểm soát dòng tiền & ca kíp:** Quản lý két tiền thu ngân, tự động tính chênh lệch tiền mặt khi chốt ca, phát hiện gian lận[cite: 7].
3. **An toàn dữ liệu kho (Audit Trail):** Lịch sử biến động kho dạng **Append-Only** chống sửa xóa lịch sử giao dịch[cite: 7].
4. **Gợi ý bán hàng thông minh:** Động cơ gợi ý sản phẩm mua kèm (Recommender System) giúp thu ngân Upsell/Cross-sell ngay tại quầy[cite: 7].
5. **Báo cáo hiệu suất tức thì:** Tách biệt hệ thống OLTP và OLAP giúp truy vấn Dashboard báo cáo với tốc độ $O(1)$[cite: 6].

---

##  Kiến trúc & Điểm sáng Kỹ thuật (Key Technical Feats)

Dự án áp dụng nhiều kỹ thuật nâng cao ở tầng Database & Backend:

* **Giải quyết Phụ thuộc Vòng (Circular Dependency Handling):** Khởi tạo mối quan hệ chéo giữa `branches` và `staff` bằng DDL mềm dẻo thông qua `ALTER TABLE`[cite: 7].
* **Giả lập Partial Unique Index (MySQL 8+):** Kết hợp *Virtual Generated Column* (`open_marker`) với `UNIQUE KEY` để ép buộc ràng buộc nghiệp vụ: *Mỗi thu ngân chỉ được mở duy nhất 1 ca tại một thời điểm*[cite: 7].
* **Quản lý Kho Append-Only & Row Locking:** Cấm sửa/xóa bảng nhật ký kho `stock_movements` bằng Trigger[cite: 7]. Sử dụng `CHECK (current_stock >= 0)` để chặn rủi ro tồn kho âm khi xảy ra tranh chấp dữ liệu (Race Condition)[cite: 7].
* **Tối ưu hóa Truy vấn SARGable:** Tối ưu các câu lệnh ETL bằng so sánh khoảng thời gian (`>=` và `<`), giúp MySQL dùng tối đa Index thay vì quét toàn bộ bảng (Full Table Scan)[cite: 6].
* **Kiến trúc Mini-OLAP & Event Scheduler:** Sử dụng `MySQL Event Scheduler` chạy tự động lúc 2:00 AM để tổng hợp doanh thu/lợi nhuận ngày theo từng chi nhánh, giúp Dashboard Admin tải nhanh vượt trội[cite: 6].
* **Audit Trail với Session Variables:** Bắt vết chính xác nhân sự thực hiện thay đổi giá sản phẩm thông qua Trigger đọc biến Session `@current_staff_id`[cite: 7].

---

##  Các tính năng cốt lõi

### 1. Quản trị Phân quyền RBAC (3 Cấp)

* **Admin (HQ):** Quản lý toàn chuỗi, xem tất cả báo cáo so sánh chi nhánh, quản lý danh mục sản phẩm chung và tài khoản hệ thống[cite: 3, 7].
* **Manager (Chi nhánh):** Quản lý tồn kho, nhập/xuất/chuyển kho, duyệt ca làm việc và xem báo cáo trong phạm vi chi nhánh[cite: 3, 7].
* **Cashier (Thu ngân):** Mở/đóng ca, kiểm két tiền mặt, thực hiện bán hàng tại quầy POS[cite: 3, 7].

### 2. Quản lý Ca làm việc & Két tiền (Cashier Shift)

* Bắt buộc thu ngân phải mở ca (`cashier_shifts`) trước khi tạo đơn hàng POS[cite: 7].
* Đếm tiền lẻ đầu ca (`opening_float_cash`) và tiền đếm tay cuối ca (`actual_cash_counted`)[cite: 7].
* Hệ thống tự động tính toán số tiền chênh lệch thừa/thiếu (`cash_discrepancy`)[cite: 7].
* Khóa cứng ca làm việc sau khi chốt để bảo vệ dữ liệu đối soát[cite: 7].

### 3. Động cơ Gợi ý Sản phẩm (Recommender Engine)

* Tự động tính toán ma trận đồng xuất hiện (`product_cooccurrence`) dựa trên lịch sử mua hàng[cite: 7].
* Tối ưu hóa lưu trữ 50% nhờ ràng buộc `CHECK (product_id_a < product_id_b)`[cite: 7].
* Chỉ mục 2 chiều hỗ trợ truy vấn top 5 sản phẩm hay được mua kèm nhất theo real-time[cite: 7].

---

##  Cấu trúc Cơ sở Dữ liệu (Database Schema)

Hệ thống bao gồm **15 bảng dữ liệu & 1 View đối soát**[cite: 6, 7]:

| Nhóm chức năng | Bảng dữ liệu | Vai trò chính |
| --- | --- | --- |
| **Hệ thống & Phân quyền** | `branches`, `staff`, `activity_logs` | Quản lý chi nhánh, tài khoản, phân quyền RBAC và nhật ký thao tác[cite: 7]. |
| **Sản phẩm & Tồn kho** | `suppliers`, `categories`, `products`, `product_price_history`, `branch_inventories`, `stock_movements` | Catalog trung tâm, nhật ký đổi giá, tồn kho riêng từng chi nhánh và nhật ký biến động kho append-only[cite: 7]. |
| **POS & Giao dịch** | `cashier_shifts`, `customers`, `orders`, `order_items`, `product_cooccurrence` | Ca làm việc, đơn hàng, chi tiết đơn hàng và ma trận gợi ý mua kèm[cite: 7]. |
| **Báo cáo OLAP** | `daily_sales_summary`, `product_sales_summary` | Bảng tổng hợp doanh thu/lợi nhuận theo ngày và chi nhánh do MySQL Event ETL tự động đổ dữ liệu[cite: 6]. |
| **Chẩn đoán** | `v_stock_reconciliation` | View phát hiện chênh lệch giữa tồn kho snapshot và nhật ký biến động[cite: 7]. |

---

##  Công nghệ sử dụng

* **Database:** MySQL 8.0+ (Engine InnoDB, Triggers, Generated Columns, Events)[cite: 6, 7]
* **Backend:** Node.js, Express.js, JWT Authentication, Mysql2 (Connection Pool)
* **Frontend:** React.js, Tailwind CSS, Recharts (Biểu đồ báo cáo)
* **Tools & Scripts:** Python (Faker, Pandas) — Sinh dữ liệu giả lập có chủ đích (Synthetic Data Generator)[cite: 3]

---

##  Hướng dẫn cài đặt & Chạy ứng dụng


##  Lộ trình phát triển (Roadmap)

* [x] **Phase 0:** Thiết kế Schema đa chi nhánh & Viết Script sinh dữ liệu giả lập[cite: 3].
* [x] **Phase 1:** Backend Lõi & Middleware Phân quyền RBAC 3 cấp[cite: 3].
* [x] **Phase 2:** Luồng POS, Ca làm việc (`cashier_shifts`) & Đối soát két tiền[cite: 3].
* [x] **Phase 3:** Động cơ Gợi ý Bán kèm (`product_cooccurrence`)[cite: 3].
* [x] **Phase 4:** Dashboard Báo cáo OLAP so sánh hiệu suất các chi nhánh[cite: 3].
* [x] **Phase 5:** Audit Trail (`activity_logs`), Tối ưu hóa truy vấn & Đóng gói Deploy[cite: 3].

---
