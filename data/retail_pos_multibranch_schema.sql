-- ============================================================
-- SMART RETAIL INTELLIGENCE PLATFORM — MULTI-BRANCH SCHEMA (MySQL 8+)
-- Nâng cấp từ single-store lên chuỗi cửa hàng: tách catalog khỏi
-- tồn kho theo chi nhánh, RBAC 3 cấp, quản lý ca/két tiền, audit log.
-- ============================================================

CREATE DATABASE IF NOT EXISTS retail_pos
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE retail_pos;

-- ------------------------------------------------------------
-- 1. BRANCHES (Chi nhánh)
--    manager_id CHƯA gắn FK ở đây vì staff chưa tồn tại (circular
--    dependency: branches cần staff.id, staff cần branches.id).
--    FK sẽ được gắn bằng ALTER TABLE sau khi tạo xong bảng staff.
-- ------------------------------------------------------------
CREATE TABLE branches (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    address     VARCHAR(255),
    phone       VARCHAR(20),
    manager_id  INT DEFAULT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. STAFF (Nhân sự — RBAC 3 cấp)
--    branch_id = NULL nghĩa là Admin quản lý toàn chuỗi (HQ).
--    Manager/Cashier bắt buộc gắn với 1 branch_id cụ thể (ràng buộc
--    này thực thi ở tầng ứng dụng khi tạo tài khoản, không ép bằng
--    CHECK vì MySQL CHECK không so sánh chéo cột theo điều kiện role
--    một cách gọn gàng — xử lý ở Express khi validate input).
-- ------------------------------------------------------------
CREATE TABLE staff (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    branch_id     INT DEFAULT NULL,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin', 'manager', 'cashier') NOT NULL DEFAULT 'cashier',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_staff_branch (branch_id)
);

-- Gắn FK manager_id sau khi staff đã tồn tại (giải quyết circular FK)
ALTER TABLE branches
    ADD CONSTRAINT fk_branches_manager
    FOREIGN KEY (manager_id) REFERENCES staff(id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- 3. SUPPLIERS (Nhà cung cấp — chung toàn chuỗi)
-- ------------------------------------------------------------
CREATE TABLE suppliers (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    phone      VARCHAR(20),
    email      VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. CATEGORIES (Danh mục — chung toàn chuỗi)
-- ------------------------------------------------------------
CREATE TABLE categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- ------------------------------------------------------------
-- 5. PRODUCTS (Catalog CHUNG toàn chuỗi — chỉ thông tin định danh
--    và giá niêm yết. KHÔNG còn current_stock/reorder_level ở đây
--    nữa — 2 khái niệm đó giờ thuộc về từng chi nhánh riêng, xem
--    bảng branch_inventories bên dưới.)
-- ------------------------------------------------------------
CREATE TABLE products (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    sku           VARCHAR(50) NOT NULL UNIQUE,
    name          VARCHAR(150) NOT NULL,
    category_id   INT,
    brand         VARCHAR(100) DEFAULT NULL,
    supplier_id   INT,
    unit          VARCHAR(20) NOT NULL DEFAULT 'cái',
    cost_price    DECIMAL(12,2) NOT NULL DEFAULT 0,   -- giá vốn tham khảo chung
    selling_price DECIMAL(12,2) NOT NULL,             -- giá niêm yết áp dụng toàn chuỗi
    expiry_date   DATE DEFAULT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    INDEX idx_products_category (category_id),
    INDEX idx_products_expiry (expiry_date)
);

-- ------------------------------------------------------------
-- 6. PRODUCT_PRICE_HISTORY (Nhật ký biến động giá — tự động)
--    changed_by đọc từ session variable @current_staff_id do
--    backend SET trước khi UPDATE (xem trigger bên dưới).
-- ------------------------------------------------------------
CREATE TABLE product_price_history (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    old_price  DECIMAL(12,2) NOT NULL,
    new_price  DECIMAL(12,2) NOT NULL,
    changed_by INT DEFAULT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES staff(id) ON DELETE SET NULL,
    INDEX idx_price_history_product (product_id, changed_at DESC)
);

DELIMITER $$
CREATE TRIGGER trg_products_price_history
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.selling_price <> OLD.selling_price THEN
        INSERT INTO product_price_history (product_id, old_price, new_price, changed_by)
        VALUES (OLD.id, OLD.selling_price, NEW.selling_price, @current_staff_id);
    END IF;
END$$
DELIMITER ;
-- LƯU Ý CHO BACKEND: trước khi chạy UPDATE products SET selling_price = ...,
-- phải chạy "SET @current_staff_id = <id_nhan_vien>;" trong CÙNG session/
-- connection. Nếu quên, changed_by sẽ tự động là NULL (không lỗi, nhưng
-- mất thông tin ai đã đổi giá).

-- ------------------------------------------------------------
-- 7. BRANCH_INVENTORIES (Tồn kho THEO TỪNG CHI NHÁNH)
--    Đây là bảng trung tâm của yêu cầu "tách bạch catalog & tồn kho".
--    1 sản phẩm có N dòng tồn kho, mỗi dòng ứng với 1 chi nhánh.
-- ------------------------------------------------------------
CREATE TABLE branch_inventories (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    branch_id     INT NOT NULL,
    product_id    INT NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 5,   -- ngưỡng cảnh báo RIÊNG từng chi nhánh
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_branch_product (branch_id, product_id),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_branch_inv_product (product_id),
    -- Chặn tồn kho âm. Nhờ InnoDB khóa dòng khi UPDATE trong trigger
    -- upsert, CHECK này còn giải quyết luôn race condition: 2 giao dịch
    -- bán cùng lúc sản phẩm cuối cùng sẽ tuần tự hóa qua row-lock, giao
    -- dịch làm âm kho sẽ bị CHECK chặn và rollback toàn bộ transaction
    -- (bao gồm cả INSERT vào stock_movements) — không để lại dữ liệu mồ côi.
    CONSTRAINT chk_current_stock_non_negative CHECK (current_stock >= 0)
);

-- ------------------------------------------------------------
-- 8. STOCK_MOVEMENTS (Nhật ký kho — giờ có thêm branch_id bắt buộc,
--    vì biến động kho luôn xảy ra tại 1 chi nhánh cụ thể)
-- ------------------------------------------------------------
CREATE TABLE stock_movements (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    branch_id       INT NOT NULL,
    product_id      INT NOT NULL,
    movement_type   ENUM('purchase', 'sale', 'adjustment', 'return', 'transfer') NOT NULL,
    quantity_change INT NOT NULL,
    reference_type  VARCHAR(30),
    reference_id    INT,
    note            VARCHAR(255),
    created_by      INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,
    INDEX idx_stock_branch_product (branch_id, product_id),
    INDEX idx_stock_created_at (created_at)
);
-- Đã thêm 'transfer' vào movement_type để phục vụ chuyển hàng giữa
-- các chi nhánh sau này (1 dòng âm ở chi nhánh gửi, 1 dòng dương ở
-- chi nhánh nhận, cùng reference_id để đối soát) — chưa cần code
-- ngay, nhưng để sẵn enum tránh phải ALTER TABLE sau này.

-- ------------------------------------------------------------
-- TRIGGERS KHO: tự động cập nhật branch_inventories + append-only
--
-- CẢNH BÁO DEADLOCK CHO BACKEND: khi 1 đơn hàng có NHIỀU sản phẩm,
-- backend phải INSERT các dòng stock_movements theo thứ tự product_id
-- TĂNG DẦN (sort giỏ hàng trước khi loop insert). Nếu không, 2 đơn
-- hàng đồng thời chứa cùng 1 cặp sản phẩm nhưng insert theo thứ tự
-- ngược nhau sẽ xin khóa row chéo nhau -> InnoDB deadlock, 1 trong 2
-- giao dịch bị hủy giữa chừng. Sort theo cùng 1 chiều loại bỏ hoàn
-- toàn rủi ro này.
-- ------------------------------------------------------------
DELIMITER $$

-- UPSERT: nếu chi nhánh chưa từng có dòng tồn kho cho SP này thì tạo
-- mới, có rồi thì cộng dồn — không cần code backend tự tạo dòng khởi
-- tạo branch_inventories trước.
CREATE TRIGGER trg_stock_movements_after_insert
AFTER INSERT ON stock_movements
FOR EACH ROW
BEGIN
    INSERT INTO branch_inventories (branch_id, product_id, current_stock)
    VALUES (NEW.branch_id, NEW.product_id, NEW.quantity_change)
    ON DUPLICATE KEY UPDATE current_stock = current_stock + NEW.quantity_change;
END$$

CREATE TRIGGER trg_stock_movements_before_update
BEFORE UPDATE ON stock_movements
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'stock_movements la append-only: khong duoc UPDATE. Insert mot dong adjustment de bu tru.';
END$$

CREATE TRIGGER trg_stock_movements_before_delete
BEFORE DELETE ON stock_movements
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'stock_movements la append-only: khong duoc DELETE. Audit trail phai duoc giu nguyen.';
END$$

DELIMITER ;

-- ------------------------------------------------------------
-- 9. CASHIER_SHIFTS (Quản lý ca làm việc & két tiền)
--    open_marker + UNIQUE KEY là kỹ thuật giả lập "partial unique
--    index" trong MySQL (vốn không hỗ trợ trực tiếp): chỉ cho phép
--    1 dòng status='open' cho mỗi staff_id tại 1 thời điểm, vì UNIQUE
--    KEY cho phép nhiều NULL nhưng chỉ 1 giá trị non-NULL trùng nhau.
-- ------------------------------------------------------------
CREATE TABLE cashier_shifts (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    staff_id            INT NOT NULL,
    branch_id           INT NOT NULL,
    opened_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at           TIMESTAMP NULL DEFAULT NULL,
    opening_float_cash  DECIMAL(12,2) NOT NULL DEFAULT 0,
    expected_cash       DECIMAL(12,2) DEFAULT NULL,   -- tính khi đóng ca = float đầu + tổng bán tiền mặt
    actual_cash_counted DECIMAL(12,2) DEFAULT NULL,   -- đếm tay thực tế khi đóng ca
    cash_discrepancy    DECIMAL(12,2)
        GENERATED ALWAYS AS (actual_cash_counted - expected_cash) STORED,
    status              ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    notes               VARCHAR(255),
    open_marker         INT GENERATED ALWAYS AS (IF(status = 'open', staff_id, NULL)) VIRTUAL,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    UNIQUE KEY uq_one_open_shift_per_staff (open_marker),
    INDEX idx_shifts_branch_status (branch_id, status)
);

-- ------------------------------------------------------------
-- Bảo vệ dữ liệu đối soát: một khi ca đã 'closed' (đã đối soát tiền
-- mặt xong), KHÔNG được sửa lại — tránh trường hợp ai đó chỉnh
-- actual_cash_counted sau này để xóa dấu vết chênh lệch két. Vẫn cho
-- phép đúng 1 lần chuyển trạng thái open -> closed (lúc đó OLD.status
-- vẫn là 'open' nên không bị chặn).
-- ------------------------------------------------------------
DELIMITER $$
CREATE TRIGGER trg_cashier_shifts_lock_closed
BEFORE UPDATE ON cashier_shifts
FOR EACH ROW
BEGIN
    IF OLD.status = 'closed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ca lam viec da dong va doi soat: khong duoc sua lai du lieu.';
    END IF;
END$$
DELIMITER ;

-- ------------------------------------------------------------
-- 10. CUSTOMERS (Khách hàng — chung toàn chuỗi, không theo chi nhánh)
-- ------------------------------------------------------------
CREATE TABLE customers (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100),
    phone          VARCHAR(20) UNIQUE,
    email          VARCHAR(150),
    loyalty_points INT NOT NULL DEFAULT 0,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 11. ORDERS (Hóa đơn — thêm branch_id + shift_id)
--    branch_id lưu ĐỘC LẬP với staff.branch_id hiện tại: nếu nhân
--    viên sau này chuyển chi nhánh, đơn hàng cũ vẫn giữ đúng chi
--    nhánh lịch sử đã bán, không bị đổi theo.
--    shift_id bắt buộc với đơn 'pos' (ép bằng trigger bên dưới),
--    NULL với đơn 'facebook'/'instagram' (không có ca vật lý).
-- ------------------------------------------------------------
CREATE TABLE orders (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    branch_id         INT NOT NULL,
    customer_id       INT,
    staff_id          INT NOT NULL,
    shift_id          INT DEFAULT NULL,
    order_source      ENUM('pos', 'facebook', 'instagram', 'other') NOT NULL DEFAULT 'pos',
    status            ENUM('completed', 'refunded', 'cancelled') NOT NULL DEFAULT 'completed',
    payment_method    ENUM('cash', 'card', 'ewallet', 'other') NOT NULL DEFAULT 'cash',
    total_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
    external_order_id VARCHAR(100) DEFAULT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (shift_id) REFERENCES cashier_shifts(id),
    INDEX idx_orders_created_at (created_at),
    INDEX idx_customer_orders_speed (customer_id, created_at DESC),
    INDEX idx_orders_branch (branch_id, created_at DESC),
    UNIQUE KEY uq_orders_source_external (order_source, external_order_id)
);

DELIMITER $$

CREATE TRIGGER trg_orders_normalize_external_id
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.external_order_id = '' THEN
        SET NEW.external_order_id = NULL;
    END IF;
END$$

-- Thực thi đúng yêu cầu "Thu ngân không thể vào bán hàng khống":
-- đơn nguồn 'pos' bắt buộc gắn với 1 ca đang mở (status='open').
CREATE TRIGGER trg_orders_require_open_shift
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE v_shift_status VARCHAR(10);

    IF NEW.order_source = 'pos' THEN
        IF NEW.shift_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Don POS bat buoc phai gan voi mot ca lam viec (shift_id).';
        END IF;

        SELECT status INTO v_shift_status
        FROM cashier_shifts WHERE id = NEW.shift_id;

        IF v_shift_status IS NULL OR v_shift_status <> 'open' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Khong the tao don: ca lam viec khong ton tai hoac da dong.';
        END IF;
    END IF;
END$$

DELIMITER ;

-- ------------------------------------------------------------
-- 12. ORDER_ITEMS (Chi tiết hóa đơn — không đổi so với bản trước)
-- ------------------------------------------------------------
CREATE TABLE order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL,
    unit_price  DECIMAL(12,2) NOT NULL,
    cost_price  DECIMAL(12,2) NOT NULL,
    subtotal    DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    profit      DECIMAL(12,2) GENERATED ALWAYS AS (quantity * (unit_price - cost_price)) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
);

-- ------------------------------------------------------------
-- 13. PRODUCT_COOCCURRENCE (Ma trận mua kèm — TÍNH CHUNG TOÀN CHUỖI.
--     Giả định: hành vi mua kèm giống nhau giữa các chi nhánh. Nếu
--     sau này cần tách riêng theo chi nhánh, thêm branch_id vào PK.)
-- ------------------------------------------------------------
CREATE TABLE product_cooccurrence (
    product_id_a INT NOT NULL,
    product_id_b INT NOT NULL,
    co_count     INT NOT NULL DEFAULT 1,
    score        FLOAT NOT NULL DEFAULT 0,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id_a, product_id_b),
    FOREIGN KEY (product_id_a) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id_b) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_cooccurrence_order CHECK (product_id_a < product_id_b),
    INDEX idx_cooccur_a_score (product_id_a, score DESC),
    INDEX idx_cooccur_b_score (product_id_b, score DESC)
);

-- ------------------------------------------------------------
-- 14. ACTIVITY_LOGS (Audit trail tổng quát toàn hệ thống)
--     KHÔNG dùng trigger để ghi tự động cho mọi bảng (quá tay so với
--     quy mô đồ án) — bảng này do TẦNG BACKEND chủ động INSERT mỗi
--     khi có hành động đáng ghi nhận (đăng nhập, đổi quyền, huỷ đơn,
--     đóng ca lệch tiền...). metadata dùng JSON để linh hoạt theo
--     từng loại action mà không cần đổi schema.
-- ------------------------------------------------------------
CREATE TABLE activity_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id    INT DEFAULT NULL,
    branch_id   INT DEFAULT NULL,
    action      VARCHAR(50) NOT NULL,   -- vd: 'auth.login', 'shift.close', 'order.cancel'
    entity_type VARCHAR(50),            -- vd: 'order', 'shift', 'staff'
    entity_id   INT,
    metadata    JSON,                   -- vd: {"discrepancy": -15000}
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_activity_staff (staff_id),
    INDEX idx_activity_entity (entity_type, entity_id),
    INDEX idx_activity_created (created_at)
);

-- ------------------------------------------------------------
-- VIEW ĐỐI SOÁT (nay theo từng CHI NHÁNH, không còn toàn cục)
-- ------------------------------------------------------------
CREATE VIEW v_stock_reconciliation AS
SELECT
    bi.branch_id,
    bi.product_id,
    p.sku,
    p.name,
    bi.current_stock AS snapshot_stock,
    COALESCE(SUM(sm.quantity_change), 0) AS computed_stock,
    bi.current_stock - COALESCE(SUM(sm.quantity_change), 0) AS diff
FROM branch_inventories bi
JOIN products p ON p.id = bi.product_id
LEFT JOIN stock_movements sm
    ON sm.product_id = bi.product_id AND sm.branch_id = bi.branch_id
GROUP BY bi.branch_id, bi.product_id, p.sku, p.name, bi.current_stock
HAVING diff <> 0;
