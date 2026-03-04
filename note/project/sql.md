/*
=====================================================================
PROJECT NAME: CIVILAI PHONE SHOP POS SYSTEM
VERSION: 3.0 (Hierarchical Categories & Laravel Sync)
=====================================================================
*/

CREATE DATABASE IF NOT EXISTS civilai_pos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE civilai_pos_db;

-- ==========================================================
-- 1. ACCESS CONTROL (Roles & Users)
-- ==========================================================

CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL,
    permissions JSON NULL 
) ENGINE=InnoDB;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    image VARCHAR(255) DEFAULT 'default_user.png',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==========================================================
-- 2. INVENTORY (Hierarchical Categories & Products)
-- ==========================================================

-- Synced with your Laravel Model (supports Parent/Child relationship)
CREATE TABLE categories (
    cat_id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT DEFAULT NULL, -- Self-reference for sub-categories
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    image VARCHAR(255) DEFAULT 'default_cat.png',
    description TEXT,
    status TINYINT DEFAULT 1, -- 1 = Active, 0 = Inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(cat_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE products (
    pro_id INT PRIMARY KEY AUTO_INCREMENT,
    cat_id INT, -- Links to the specific category/sub-category
    pro_name VARCHAR(255) NOT NULL,
    model_number VARCHAR(100),
    pro_image VARCHAR(255) DEFAULT 'default_pro.png',
    buy_price DECIMAL(12, 2) DEFAULT 0.00,
    sell_price DECIMAL(12, 2) DEFAULT 0.00,
    qty_in_stock INT DEFAULT 0,
    is_imei_tracking BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES categories(cat_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE imei_tracking (
    imei_id INT PRIMARY KEY AUTO_INCREMENT,
    pro_id INT,
    imei_code VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('available', 'sold', 'repairing', 'returned') DEFAULT 'available',
    purchase_date DATE,
    FOREIGN KEY (pro_id) REFERENCES products(pro_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 3. CRM (Suppliers & Customers)
-- ==========================================================

CREATE TABLE suppliers (
    sup_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    image VARCHAR(255) DEFAULT 'default_supplier.png',
    address TEXT
) ENGINE=InnoDB;

CREATE TABLE customers (
    cus_id INT PRIMARY KEY AUTO_INCREMENT,
    cus_name VARCHAR(100) NOT NULL DEFAULT 'អតិថិជនទូទៅ',
    phone VARCHAR(20),
    address TEXT,
    points INT DEFAULT 0
) ENGINE=InnoDB;

-- ==========================================================
-- 4. SALES SYSTEM (POS & Trade-in)
-- ==========================================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    user_id INT, 
    cus_id INT, 
    total_amount DECIMAL(12, 2),
    discount DECIMAL(12, 2) DEFAULT 0.00,
    grand_total DECIMAL(12, 2),
    paid_amount DECIMAL(12, 2),
    due_amount DECIMAL(12, 2),
    payment_method VARCHAR(50), 
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (cus_id) REFERENCES customers(cus_id)
) ENGINE=InnoDB;

CREATE TABLE order_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    pro_id INT,
    imei_code VARCHAR(50) NULL,
    qty INT DEFAULT 1,
    unit_price DECIMAL(12, 2),
    sub_total DECIMAL(12, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (pro_id) REFERENCES products(pro_id)
) ENGINE=InnoDB;

CREATE TABLE exchanges (
    exchange_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT, 
    old_device_name VARCHAR(255),
    old_device_imei VARCHAR(50),
    trade_in_value DECIMAL(12, 2), 
    description TEXT,
    old_device_image VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 5. SERVICES & FINANCE (Repairs & Expenses)
-- ==========================================================

CREATE TABLE repair_services (
    repair_id INT PRIMARY KEY AUTO_INCREMENT,
    cus_id INT,
    user_id INT, 
    device_model VARCHAR(255) NOT NULL,
    imei_sn VARCHAR(50),
    device_image VARCHAR(255),
    problem_description TEXT,
    estimated_cost DECIMAL(12, 2),
    deposit DECIMAL(12, 2) DEFAULT 0.00,
    status ENUM('pending', 'fixing', 'completed', 'delivered', 'cancelled') DEFAULT 'pending',
    pickup_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cus_id) REFERENCES customers(cus_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE expenses (
    exp_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    amount DECIMAL(12, 2),
    exp_date DATE,
    receipt_image VARCHAR(255),
    note TEXT,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- ==========================================================
-- 6. SEED DATA (Sample Data)
-- ==========================================================

INSERT INTO roles (role_name) VALUES ('Admin'), ('Cashier'), ('Technician');

INSERT INTO users (role_id, full_name, email, username, password) 
VALUES (1, 'Admin CivilAI', 'admin@civilai.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password

-- Main Categories (parent_id is NULL)
INSERT INTO categories (name, slug, parent_id) VALUES 
('Smartphones', 'smartphones', NULL),
('Accessories', 'accessories', NULL),
('Services', 'services', NULL);

-- Sub-Categories (parent_id links to Smartphones/Accessories)
INSERT INTO categories (name, slug, parent_id) VALUES 
('iPhone', 'iphone', 1),
('Samsung', 'samsung', 1),
('Chargers', 'chargers', 2);

-- Products linked to Sub-Category (iPhone)
INSERT INTO products (cat_id, pro_name, sell_price, qty_in_stock)
VALUES (4, 'iPhone 15 Pro Max', 1200.00, 5),
       (5, 'Samsung S24 Ultra', 1150.00, 3);