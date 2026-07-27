-- ============================================================
-- ANALYTICS SUMMARY LAYER (mini OLAP) — BẢN CẬP NHẬT MULTI-BRANCH
-- Thêm branch_id vào 2 bảng summary để Dashboard so sánh hiệu suất
-- giữa các chi nhánh (Phase 4). Trước đây 2 bảng này gom chung toàn
-- hệ thống thành 1 dòng/ngày — không tách được theo chi nhánh.
-- ============================================================
USE retail_pos;

-- ------------------------------------------------------------
-- Doanh thu/lợi nhuận theo NGÀY + CHI NHÁNH
-- ------------------------------------------------------------
CREATE TABLE daily_sales_summary (
    summary_date     DATE NOT NULL,
    branch_id        INT NOT NULL,
    order_count      INT NOT NULL DEFAULT 0,
    total_revenue    DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_profit     DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_items_sold INT NOT NULL DEFAULT 0,
    PRIMARY KEY (summary_date, branch_id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- ------------------------------------------------------------
-- Doanh số theo NGÀY + CHI NHÁNH + SẢN PHẨM
-- ------------------------------------------------------------
CREATE TABLE product_sales_summary (
    summary_date  DATE NOT NULL,
    branch_id     INT NOT NULL,
    product_id    INT NOT NULL,
    quantity_sold INT NOT NULL DEFAULT 0,
    revenue       DECIMAL(14,2) NOT NULL DEFAULT 0,
    profit        DECIMAL(14,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (summary_date, branch_id, product_id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ------------------------------------------------------------
-- ETL: chạy 1 lần/ngày, gom dữ liệu hôm qua từ orders/order_items
-- (OLTP) sang 2 bảng summary (OLAP), TÁCH RIÊNG theo branch_id.
-- ------------------------------------------------------------
-- SET PERSIST (không phải SET GLOBAL): giữ cấu hình qua các lần MySQL
-- restart. Với SET GLOBAL, sau khi restart server, event_scheduler tự
-- tắt và ev_daily_sales_etl ngừng chạy MÀ KHÔNG BÁO LỖI GÌ — rất khó
-- phát hiện nếu không để ý.
SET PERSIST event_scheduler = ON;

DELIMITER $$
CREATE EVENT ev_daily_sales_etl
ON SCHEDULE EVERY 1 DAY STARTS (CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 2 HOUR)
DO
BEGIN
    DECLARE target_date DATE DEFAULT CURRENT_DATE - INTERVAL 1 DAY;

    REPLACE INTO daily_sales_summary
    SELECT
        target_date,
        o.branch_id,
        COUNT(DISTINCT o.id),
        COALESCE(SUM(oi.subtotal), 0),
        COALESCE(SUM(oi.profit), 0),
        COALESCE(SUM(oi.quantity), 0)
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= target_date
      AND o.created_at < target_date + INTERVAL 1 DAY
      AND o.status = 'completed'
    GROUP BY o.branch_id;

    REPLACE INTO product_sales_summary
    SELECT
        target_date,
        o.branch_id,
        oi.product_id,
        SUM(oi.quantity),
        SUM(oi.subtotal),
        SUM(oi.profit)
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= target_date
      AND o.created_at < target_date + INTERVAL 1 DAY
      AND o.status = 'completed'
    GROUP BY o.branch_id, oi.product_id;
END$$
DELIMITER ;

-- ------------------------------------------------------------
-- Ghi chú: khi thêm chi nhánh mới, KHÔNG cần sửa gì ở đây — event
-- tự GROUP BY theo branch_id thực tế có trong orders ngày hôm đó,
-- chi nhánh mới sẽ tự động xuất hiện thêm dòng trong summary từ
-- ngày đầu tiên có giao dịch, không cần khởi tạo thủ công.
-- ------------------------------------------------------------
