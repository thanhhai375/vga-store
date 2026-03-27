-- Tạo Database
CREATE DATABASE IF NOT EXISTS vga_store_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vga_store_db;

-- 1. Bảng Users (Người dùng)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Brands (Thương hiệu)
CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Bảng Categories (Danh mục dòng VGA)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- 4. Bảng Products (Sản phẩm)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    old_price DECIMAL(15, 2),
    stock INT DEFAULT 0,
    thumbnail VARCHAR(255),
    images JSON,
    vram VARCHAR(20),      -- Ví dụ: 24GB, 16GB
    gpu_model VARCHAR(50), -- Ví dụ: RTX 4090, RX 7900 XTX
    description TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. Bảng Coupons (Mã giảm giá)
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    valid_until DATETIME
);

-- 6. Bảng Orders (Đơn hàng)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Bảng Order Items (Chi tiết đơn hàng)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL, -- Giá lúc mua
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- 8. Bảng Warranties (Bảo hành - Phục vụ trang Tra cứu bảo hành)
CREATE TABLE warranties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'REPAIRING') DEFAULT 'ACTIVE',
    end_date DATETIME NOT NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);

-- 9. Bảng Reviews (Đánh giá)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);