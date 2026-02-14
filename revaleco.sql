-- Create database
CREATE DATABASE IF NOT EXISTS revaleco;
USE revaleco;

-- Buyers table
CREATE TABLE IF NOT EXISTS buyers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  eco_score INT DEFAULT 0,
  favorite_ids JSON DEFAULT ('[]'),
  avatar VARCHAR(500),
  location VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  eco_score INT DEFAULT 0,
  business_name VARCHAR(100),
  business_type VARCHAR(50),
  license_number VARCHAR(50),
  avatar VARCHAR(500),
  location VARCHAR(100),
  phone VARCHAR(20),
  rating DECIMAL(3,1) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category ENUM('Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-Waste') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  seller_id VARCHAR(50),
  location VARCHAR(100),
  distance DECIMAL(5,2),
  rating DECIMAL(3,1) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_seller (seller_id)
);

-- Insert sample data (passwords are hashed with bcrypt, salt rounds 10)
-- Password for both is 'password123'
INSERT INTO buyers (id, name, email, password, eco_score, favorite_ids, avatar, location) VALUES
('buyer-1', 'Eco Enthusiast', 'buyer@revaleco.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 850, '[]', 'C:\Users\User\OneDrive\Desktop\SEPRO\RevalEco\LastOne\revaleco\Image\avatar.avif', 'Colombo, SL');

INSERT INTO sellers (id, name, email, password, eco_score, business_name, business_type, avatar, location, rating) VALUES
('seller-1', 'Green Waste Co', 'seller@revaleco.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 920, 'Green Waste Solutions', 'Recycling Center', 'https://picsum.photos/seed/seller/200/200', 'Colombo Hub', 4.8);

INSERT INTO products (title, category, price, quantity, unit, description, image, seller_id, location, distance, rating) VALUES
('Pressed Plastic Bales', 'Plastic', 15450.00, 10, 'Bales', 'High-quality HDPE plastic bales, sorted and cleaned.', 'https://www.makabale.com/media/159/IMG_3258-1.jpg', 's1', 'Downtown Hub', 2.4, 4.8),
('Assorted Glass Bottles', 'Glass', 3250.50, 50, 'kg', 'Clear and brown glass bottles ready for crushing.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzzZXXkgX4LnJJkheDVgH0mlKxClcnEeRrrQ&s', 's2', 'East Industrial', 8.1, 4.5),
('Cardboard Sheets', 'Paper', 1800.00, 100, 'Sheets', 'Corrugated cardboard, 100% recyclable material.', 'https://www.qualpack.net/wp-content/uploads/2016/05/corrugated-sheets-cardboard.jpg', 's1', 'North Depot', 12.5, 4.2),
('Aluminum Scrap', 'Metal', 26500.00, 20, 'kg', 'Mixed aluminum scrap from household electronics.', 'https://www.globalscraps.com/upload/category/1628492232Aluminum-scrap.jpg', 's3', 'South Yard', 4.7, 4.9),
('Old Circuit Boards', 'E-Waste', 42000.00, 5, 'kg', 'Recoverable electronic components for gold/copper extraction.', 'https://i.sstatic.net/sIri0.jpg', 's4', 'West Processing', 18.2, 4.7),
('Organic Compost Mix', 'Organic', 450.00, 500, 'kg', 'Premium organic waste prepared for high-yield composting.', 'https://www.promixgardening.com/sites/promix/files/promix-premium-organic-garden-mix-03.png', 's5', 'Rural Node A', 35.0, 4.6);