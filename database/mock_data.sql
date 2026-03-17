-- 1. Thêm Người dùng mẫu (Mật khẩu đang để tạm là '123456', Backend sẽ mã hóa sau)
INSERT INTO users (username, password_hash, email, role) VALUES
('admin_hai', '123456', 'admin@vgastore.com', 'ADMIN'),
('khachhang_01', '123456', 'khach1@gmail.com', 'CUSTOMER'),
('khachhang_02', '123456', 'khach2@gmail.com', 'CUSTOMER');

-- 2. Thêm Thương hiệu
INSERT INTO brands (name, logo_url) VALUES
('ASUS', 'logo_asus.png'),
('GIGABYTE', 'logo_giga.png'),
('MSI', 'logo_msi.png');

-- 3. Thêm Sản phẩm VGA
INSERT INTO products (brand_id, name, vram, price, stock, description, img_url) VALUES
(1, 'ASUS ROG Strix GeForce RTX 4090 OC', '24GB GDDR6X', 55000000, 5, 'Card đồ họa đỉnh cao cho 4K Gaming.', 'rtx4090_asus.jpg'),
(2, 'GIGABYTE AORUS GeForce RTX 4080 SUPER', '16GB GDDR6X', 32000000, 10, 'Hiệu năng mạnh mẽ, tản nhiệt cực mát.', 'rtx4080_giga.jpg'),
(3, 'MSI GeForce RTX 4060 Ti Gaming X', '8GB GDDR6', 12500000, 30, 'Lựa chọn quốc dân cho độ phân giải Full HD.', 'rtx4060ti_msi.jpg'),
(1, 'ASUS Dual Radeon RX 7600', '8GB GDDR6', 7500000, 20, 'Card đội đỏ P/P ngon nhất phân khúc.', 'rx7600_asus.jpg');

-- 4. Tạo Giỏ hàng cho Khách hàng 1 (user_id = 2)
INSERT INTO carts (user_id) VALUES (2);

-- 5. Thêm sản phẩm vào Giỏ hàng của Khách hàng 1 (Mua 2 con RTX 4060 Ti)
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (1, 3, 2);

-- 6. Khách hàng 2 (user_id = 3) đã Đặt hàng thành công
INSERT INTO orders (user_id, total_price, status) VALUES (3, 32000000, 'PROCESSING');

-- 7. Chi tiết Đơn hàng của Khách hàng 2 (Mua 1 con RTX 4080 SUPER)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (1, 2, 1, 32000000);