-- Demo Data for Multi-Vendor E-Commerce Platform
-- This script populates the database with realistic sample data

-- Clear existing data (in correct order to avoid foreign key constraints)
TRUNCATE TABLE conversions CASCADE;
TRUNCATE TABLE user_sessions CASCADE;
TRUNCATE TABLE product_views CASCADE;
TRUNCATE TABLE payouts_ledger CASCADE;
TRUNCATE TABLE vendor_payouts CASCADE;
TRUNCATE TABLE exchanges CASCADE;
TRUNCATE TABLE returns CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE coupons CASCADE;
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE addresses CASCADE;
TRUNCATE TABLE wishlist CASCADE;
TRUNCATE TABLE carts CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE vendors CASCADE;
TRUNCATE TABLE product_categories CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE commissions CASCADE;

-- Insert Users (Admin, Vendors, Customers)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status, email_verified, phone_verified, created_at) VALUES
-- Admin Users
('550e8400-e29b-41d4-a716-446655440000', 'admin@ecommerce.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Super', 'Admin', '+91-9876543210', 'admin', 'active', true, true, NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440001', 'admin2@ecommerce.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'John', 'Admin', '+91-9876543211', 'admin', 'active', true, true, NOW() - INTERVAL '5 months'),

-- Vendor Users
('550e8400-e29b-41d4-a716-446655440010', 'vendor1@techmart.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Rajesh', 'Kumar', '+91-9876543220', 'vendor', 'active', true, true, NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440011', 'vendor2@fashionhub.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Priya', 'Sharma', '+91-9876543221', 'vendor', 'active', true, true, NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440012', 'vendor3@homeessentials.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Amit', 'Patel', '+91-9876543222', 'vendor', 'active', true, true, NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440013', 'vendor4@sportszone.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Sneha', 'Gupta', '+91-9876543223', 'vendor', 'active', true, true, NOW() - INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440014', 'vendor5@bookstore.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Vikram', 'Singh', '+91-9876543224', 'vendor', 'active', true, true, NOW() - INTERVAL '3 weeks'),
('550e8400-e29b-41d4-a716-446655440015', 'vendor6@beautycare.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Kavya', 'Reddy', '+91-9876543225', 'vendor', 'active', true, true, NOW() - INTERVAL '2 weeks'),

-- Customer Users
('550e8400-e29b-41d4-a716-446655440020', 'customer1@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Arjun', 'Mehta', '+91-9876543230', 'customer', 'active', true, true, NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440021', 'customer2@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Anita', 'Joshi', '+91-9876543231', 'customer', 'active', true, true, NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440022', 'customer3@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Rohit', 'Agarwal', '+91-9876543232', 'customer', 'active', true, true, NOW() - INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440023', 'customer4@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Deepika', 'Nair', '+91-9876543233', 'customer', 'active', true, true, NOW() - INTERVAL '3 weeks'),
('550e8400-e29b-41d4-a716-446655440024', 'customer5@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Karan', 'Malhotra', '+91-9876543234', 'customer', 'active', true, true, NOW() - INTERVAL '2 weeks'),
('550e8400-e29b-41d4-a716-446655440025', 'customer6@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Pooja', 'Verma', '+91-9876543235', 'customer', 'active', true, true, NOW() - INTERVAL '1 week'),
('550e8400-e29b-41d4-a716-446655440026', 'customer7@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Sanjay', 'Yadav', '+91-9876543236', 'customer', 'active', true, true, NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440027', 'customer8@gmail.com', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k', 'Meera', 'Iyer', '+91-9876543237', 'customer', 'active', true, true, NOW() - INTERVAL '1 day');

-- Insert Product Categories
INSERT INTO product_categories (id, name, slug, description, image_url, parent_id, is_active, created_at) VALUES
-- Main Categories
('650e8400-e29b-41d4-a716-446655440000', 'Electronics', 'electronics', 'Latest electronic gadgets and devices', '/images/categories/electronics.jpg', NULL, true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440001', 'Fashion', 'fashion', 'Trendy clothing and accessories', '/images/categories/fashion.jpg', NULL, true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440002', 'Home & Garden', 'home-garden', 'Home essentials and garden supplies', '/images/categories/home-garden.jpg', NULL, true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440003', 'Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', '/images/categories/sports.jpg', NULL, true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440004', 'Books & Media', 'books-media', 'Books, magazines, and digital media', '/images/categories/books.jpg', NULL, true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440005', 'Beauty & Personal Care', 'beauty-personal-care', 'Beauty products and personal care items', '/images/categories/beauty.jpg', NULL, true, NOW() - INTERVAL '6 months'),

-- Sub Categories for Electronics
('650e8400-e29b-41d4-a716-446655440010', 'Smartphones', 'smartphones', 'Latest smartphones and accessories', '/images/categories/smartphones.jpg', '650e8400-e29b-41d4-a716-446655440000', true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440011', 'Laptops', 'laptops', 'Laptops and computer accessories', '/images/categories/laptops.jpg', '650e8400-e29b-41d4-a716-446655440000', true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440012', 'Headphones', 'headphones', 'Audio devices and headphones', '/images/categories/headphones.jpg', '650e8400-e29b-41d4-a716-446655440000', true, NOW() - INTERVAL '6 months'),

-- Sub Categories for Fashion
('650e8400-e29b-41d4-a716-446655440020', 'Mens Clothing', 'mens-clothing', 'Mens fashion and apparel', '/images/categories/mens-clothing.jpg', '650e8400-e29b-41d4-a716-446655440001', true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440021', 'Womens Clothing', 'womens-clothing', 'Womens fashion and apparel', '/images/categories/womens-clothing.jpg', '650e8400-e29b-41d4-a716-446655440001', true, NOW() - INTERVAL '6 months'),
('650e8400-e29b-41d4-a716-446655440022', 'Accessories', 'accessories', 'Fashion accessories and jewelry', '/images/categories/accessories.jpg', '650e8400-e29b-41d4-a716-446655440001', true, NOW() - INTERVAL '6 months');

-- Insert Vendors
INSERT INTO vendors (id, user_id, store_name, store_description, gst_number, pan_number, logo_url, banner_url, address, city, state, pincode, country, commission_type, commission_value, is_verified, is_active, bank_account_number, bank_ifsc_code, bank_account_holder_name, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'TechMart Electronics', 'Your one-stop shop for latest electronics and gadgets', '29ABCDE1234F1Z5', 'ABCDE1234F', '/images/vendors/techmart-logo.jpg', '/images/vendors/techmart-banner.jpg', '123 Tech Street, Electronic City', 'Bangalore', 'Karnataka', '560100', 'India', 'percentage', 8.00, true, true, '1234567890123456', 'HDFC0001234', 'Rajesh Kumar', NOW() - INTERVAL '4 months'),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'Fashion Hub', 'Trendy fashion for modern lifestyle', '27FGHIJ5678K2L6', 'FGHIJ5678K', '/images/vendors/fashionhub-logo.jpg', '/images/vendors/fashionhub-banner.jpg', '456 Fashion Avenue, Commercial Street', 'Mumbai', 'Maharashtra', '400001', 'India', 'percentage', 12.00, true, true, '2345678901234567', 'ICICI0002345', 'Priya Sharma', NOW() - INTERVAL '3 months'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'Home Essentials', 'Quality home and garden products', '06KLMNO9012P3Q7', 'KLMNO9012P', '/images/vendors/homeessentials-logo.jpg', '/images/vendors/homeessentials-banner.jpg', '789 Home Street, Sector 18', 'Delhi', 'Delhi', '110001', 'India', 'percentage', 10.00, true, true, '3456789012345678', 'SBI0003456', 'Amit Patel', NOW() - INTERVAL '2 months'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', 'Sports Zone', 'Premium sports and fitness equipment', '33QRSTU3456V4W8', 'QRSTU3456V', '/images/vendors/sportszone-logo.jpg', '/images/vendors/sportszone-banner.jpg', '321 Sports Complex, Banjara Hills', 'Hyderabad', 'Telangana', '500034', 'India', 'percentage', 9.00, true, true, '4567890123456789', 'AXIS0004567', 'Sneha Gupta', NOW() - INTERVAL '1 month'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', 'Book Paradise', 'Wide collection of books and educational materials', '19WXYZ67890A5B9', 'WXYZ67890A', '/images/vendors/bookparadise-logo.jpg', '/images/vendors/bookparadise-banner.jpg', '654 Book Street, Park Street', 'Kolkata', 'West Bengal', '700016', 'India', 'percentage', 7.00, true, true, '5678901234567890', 'PNB0005678', 'Vikram Singh', NOW() - INTERVAL '3 weeks'),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440015', 'Beauty Care Plus', 'Premium beauty and personal care products', '36CDEFG1234H6I0', 'CDEFG1234H', '/images/vendors/beautycare-logo.jpg', '/images/vendors/beautycare-banner.jpg', '987 Beauty Lane, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'India', 'percentage', 15.00, true, true, '6789012345678901', 'KOTAK0006789', 'Kavya Reddy', NOW() - INTERVAL '2 weeks');

-- Insert Products
INSERT INTO products (id, vendor_id, category_id, name, slug, sku, description, short_description, images, price, compare_price, cost_price, discount_percentage, stock_quantity, min_stock_level, weight, rating, review_count, is_active, is_featured, tags, created_at) VALUES
-- TechMart Electronics Products
('850e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440010', 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'TECH-IP15PM-001', 'Latest iPhone 15 Pro Max with advanced camera system and A17 Pro chip', 'Premium smartphone with cutting-edge technology', '{"https://images.unsplash.com/photo-1592750475338-74b7b21085ab", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"}', 134900.00, 149900.00, 120000.00, 10.00, 25, 5, 0.240, 4.5, 128, true, true, '{"smartphone", "apple", "premium", "5g"}', NOW() - INTERVAL '2 months'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440011', 'MacBook Pro 16"', 'macbook-pro-16', 'TECH-MBP16-001', 'Powerful MacBook Pro with M3 Pro chip for professional workflows', 'High-performance laptop for professionals', '{"https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"}', 249900.00, 279900.00, 220000.00, 10.71, 15, 3, 2.100, 4.7, 89, true, true, '{"laptop", "apple", "professional", "m3"}', NOW() - INTERVAL '1 month'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440012', 'AirPods Pro 2nd Gen', 'airpods-pro-2nd-gen', 'TECH-APP2-001', 'Advanced noise cancellation and spatial audio experience', 'Premium wireless earbuds with ANC', '{"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1", "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb"}', 24900.00, 27900.00, 20000.00, 10.75, 50, 10, 0.056, 4.6, 234, true, true, '{"earbuds", "apple", "wireless", "anc"}', NOW() - INTERVAL '3 weeks'),

-- Fashion Hub Products
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440020', 'Premium Cotton Shirt', 'premium-cotton-shirt', 'FASH-PCS-001', 'High-quality cotton shirt perfect for formal and casual occasions', 'Comfortable and stylish cotton shirt', '{"https://images.unsplash.com/photo-1596755094514-f87e34085b2c", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"}', 2499.00, 3499.00, 1800.00, 28.58, 100, 20, 0.300, 4.3, 67, true, false, '{"shirt", "cotton", "formal", "casual"}', NOW() - INTERVAL '2 weeks'),
('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440021', 'Designer Kurti', 'designer-kurti', 'FASH-DK-001', 'Elegant designer kurti with intricate embroidery work', 'Beautiful ethnic wear for women', '{"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1", "https://images.unsplash.com/photo-1583391733956-6c78276477e2"}', 1899.00, 2799.00, 1200.00, 32.15, 75, 15, 0.250, 4.4, 45, true, true, '{"kurti", "ethnic", "designer", "embroidery"}', NOW() - INTERVAL '1 week'),

-- Home Essentials Products
('850e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'Smart LED Bulb Set', 'smart-led-bulb-set', 'HOME-SLB-001', 'WiFi enabled smart LED bulbs with color changing features', 'Energy-efficient smart lighting solution', '{"https://images.unsplash.com/photo-1558618666-fcd25c85cd64", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"}', 1299.00, 1799.00, 900.00, 27.79, 200, 50, 0.150, 4.2, 156, true, false, '{"led", "smart", "wifi", "energy-efficient"}', NOW() - INTERVAL '10 days'),

-- Sports Zone Products
('850e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'Professional Yoga Mat', 'professional-yoga-mat', 'SPORT-PYM-001', 'High-quality non-slip yoga mat for professional practice', 'Premium yoga mat with excellent grip', '{"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b", "https://images.unsplash.com/photo-1506629905607-c52b1b8b3b8b"}', 2999.00, 3999.00, 2000.00, 25.01, 80, 20, 1.200, 4.5, 92, true, true, '{"yoga", "mat", "fitness", "non-slip"}', NOW() - INTERVAL '5 days'),

-- Book Paradise Products
('850e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 'Complete Web Development Guide', 'complete-web-development-guide', 'BOOK-CWDG-001', 'Comprehensive guide to modern web development technologies', 'Learn full-stack web development', '{"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"}', 899.00, 1299.00, 600.00, 30.79, 150, 30, 0.500, 4.6, 78, true, false, '{"book", "programming", "web-development", "technology"}', NOW() - INTERVAL '3 days'),

-- Beauty Care Plus Products
('850e8400-e29b-41d4-a716-446655440050', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', 'Organic Face Serum', 'organic-face-serum', 'BEAUTY-OFS-001', 'Natural organic face serum with vitamin C and hyaluronic acid', 'Anti-aging serum for glowing skin', '{"https://images.unsplash.com/photo-1556228720-195a672e8a03", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"}', 1599.00, 2199.00, 1000.00, 27.28, 120, 25, 0.050, 4.4, 167, true, true, '{"serum", "organic", "vitamin-c", "anti-aging"}', NOW() - INTERVAL '1 day');

-- Insert Addresses
INSERT INTO addresses (id, user_id, name, phone, address_line_1, address_line_2, city, state, pincode, country, is_default, created_at) VALUES
('950e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440020', 'Arjun Mehta', '+91-9876543230', '123 Green Park', 'Near Metro Station', 'Delhi', 'Delhi', '110016', 'India', true, NOW() - INTERVAL '2 months'),
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'Anita Joshi', '+91-9876543231', '456 Bandra West', 'Linking Road', 'Mumbai', 'Maharashtra', '400050', 'India', true, NOW() - INTERVAL '1 month'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440022', 'Rohit Agarwal', '+91-9876543232', '789 Koramangala', '5th Block', 'Bangalore', 'Karnataka', '560095', 'India', true, NOW() - INTERVAL '3 weeks'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440023', 'Deepika Nair', '+91-9876543233', '321 Marine Drive', 'Queens Necklace', 'Mumbai', 'Maharashtra', '400002', 'India', true, NOW() - INTERVAL '2 weeks'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440024', 'Karan Malhotra', '+91-9876543234', '654 Sector 17', 'City Center', 'Chandigarh', 'Punjab', '160017', 'India', true, NOW() - INTERVAL '1 week');

-- Insert Orders
INSERT INTO orders (id, order_number, user_id, vendor_id, billing_address_id, shipping_address_id, status, payment_status, total_amount, shipping_amount, tax_amount, discount_amount, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440000', 'ORD001', '550e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', 'delivered', 'completed', 159799.00, 0.00, 14381.91, 0.00, NOW() - INTERVAL '1 month'),
('a50e8400-e29b-41d4-a716-446655440001', 'ORD002', '550e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'delivered', 'completed', 4398.00, 99.00, 395.82, 0.00, NOW() - INTERVAL '3 weeks'),
('a50e8400-e29b-41d4-a716-446655440002', 'ORD003', '550e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 'shipped', 'completed', 24900.00, 0.00, 2241.00, 0.00, NOW() - INTERVAL '2 weeks'),
('a50e8400-e29b-41d4-a716-446655440003', 'ORD004', '550e8400-e29b-41d4-a716-446655440023', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 'confirmed', 'completed', 1398.00, 99.00, 125.82, 0.00, NOW() - INTERVAL '1 week'),
('a50e8400-e29b-41d4-a716-446655440004', 'ORD005', '550e8400-e29b-41d4-a716-446655440024', '750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', 'placed', 'pending', 3098.00, 99.00, 278.82, 0.00, NOW() - INTERVAL '3 days'),
('a50e8400-e29b-41d4-a716-446655440005', 'ORD006', '550e8400-e29b-41d4-a716-446655440025', '750e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', 'placed', 'pending', 998.00, 99.00, 89.82, 0.00, NOW() - INTERVAL '1 day');

-- Insert Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, product_name, product_sku, created_at) VALUES
('b50e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440000', 1, 134900.00, 134900.00, 'iPhone 15 Pro Max', 'TECH-IP15PM-001', NOW() - INTERVAL '1 month'),
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440002', 1, 24900.00, 24900.00, 'AirPods Pro 2nd Gen', 'TECH-APP2-001', NOW() - INTERVAL '1 month'),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440010', 1, 2499.00, 2499.00, 'Premium Cotton Shirt', 'FASH-PCS-001', NOW() - INTERVAL '3 weeks'),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440011', 1, 1899.00, 1899.00, 'Designer Kurti', 'FASH-DK-001', NOW() - INTERVAL '3 weeks'),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 1, 24900.00, 24900.00, 'AirPods Pro 2nd Gen', 'TECH-APP2-001', NOW() - INTERVAL '2 weeks'),
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440020', 1, 1299.00, 1299.00, 'Smart LED Bulb Set', 'HOME-SLB-001', NOW() - INTERVAL '1 week'),
('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440030', 1, 2999.00, 2999.00, 'Professional Yoga Mat', 'SPORT-PYM-001', NOW() - INTERVAL '3 days'),
('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440040', 1, 899.00, 899.00, 'Complete Web Development Guide', 'BOOK-CWDG-001', NOW() - INTERVAL '1 day');

-- Insert Payments
INSERT INTO payments (id, order_id, payment_gateway, status, amount, currency, transaction_id, gateway_transaction_id, created_at) VALUES
('c50e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440000', 'razorpay', 'completed', 159799.00, 'INR', 'TXN001', 'pay_razorpay_001', NOW() - INTERVAL '1 month'),
('c50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'stripe', 'completed', 4398.00, 'INR', 'TXN002', 'pi_stripe_002', NOW() - INTERVAL '3 weeks'),
('c50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 'razorpay', 'completed', 24900.00, 'INR', 'TXN003', 'pay_razorpay_003', NOW() - INTERVAL '2 weeks'),
('c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', 'cashfree', 'completed', 1398.00, 'INR', 'TXN004', 'cf_004', NOW() - INTERVAL '1 week'),
('c50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440004', 'cod', 'pending', 3098.00, 'INR', 'TXN005', NULL, NOW() - INTERVAL '3 days'),
('c50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440005', 'razorpay', 'pending', 998.00, 'INR', 'TXN006', 'pay_razorpay_006', NOW() - INTERVAL '1 day');

-- Insert Reviews
INSERT INTO reviews (id, user_id, product_id, rating, title, comment, is_verified, is_approved, helpful_count, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440020', '850e8400-e29b-41d4-a716-446655440000', 5, 'Excellent Phone!', 'Amazing camera quality and performance. Highly recommended!', true, true, 15, NOW() - INTERVAL '3 weeks'),
('d50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '850e8400-e29b-41d4-a716-446655440010', 4, 'Good Quality Shirt', 'Nice fabric and comfortable fit. Good value for money.', true, true, 8, NOW() - INTERVAL '2 weeks'),
('d50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440022', '850e8400-e29b-41d4-a716-446655440002', 5, 'Best Earbuds Ever', 'Noise cancellation is incredible. Perfect for daily use.', true, true, 22, NOW() - INTERVAL '1 week'),
('d50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440023', '850e8400-e29b-41d4-a716-446655440020', 4, 'Smart and Efficient', 'Easy to setup and control via app. Good brightness levels.', true, true, 6, NOW() - INTERVAL '5 days'),
('d50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440024', '850e8400-e29b-41d4-a716-446655440030', 5, 'Perfect Yoga Mat', 'Excellent grip and cushioning. Very durable material.', true, true, 12, NOW() - INTERVAL '2 days');

-- Insert Returns
INSERT INTO returns (id, order_item_id, return_number, reason, status, refund_amount, created_at) VALUES
('e50e8400-e29b-41d4-a716-446655440000', 'b50e8400-e29b-41d4-a716-446655440003', 'RET001', 'Size issue - too small', 'approved', 1899.00, NOW() - INTERVAL '1 week'),
('e50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440005', 'RET002', 'Product not as described', 'pending', 1299.00, NOW() - INTERVAL '3 days');

-- Insert Exchanges
INSERT INTO exchanges (id, order_item_id, exchange_number, reason, status, price_difference, created_at) VALUES
('f50e8400-e29b-41d4-a716-446655440000', 'b50e8400-e29b-41d4-a716-446655440002', 'EXC001', 'Wrong size - need larger', 'completed', 0.00, NOW() - INTERVAL '2 weeks');

-- Insert Notifications
INSERT INTO notifications (id, user_id, type, title, body, read_at, sent_at, created_at) VALUES
('g50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440020', 'push', 'Order Delivered', 'Your order ORD001 has been delivered successfully!', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '3 weeks'),
('g50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'email', 'Return Approved', 'Your return request RET001 has been approved. Refund will be processed within 3-5 business days.', NULL, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('g50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440022', 'push', 'Order Shipped', 'Your order ORD003 is on its way! Track your package.', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
('g50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440023', 'push', 'New Offer Available', 'Get 20% off on your next purchase! Use code SAVE20', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

-- Insert Coupons
INSERT INTO coupons (id, code, name, description, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, usage_limit, used_count, start_date, expiry_date, is_active, created_at) VALUES
('h50e8400-e29b-41d4-a716-446655440000', 'WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 500.00, 1000.00, 1000, 156, NOW() - INTERVAL '6 months', NOW() + INTERVAL '6 months', true, NOW() - INTERVAL '6 months'),
('h50e8400-e29b-41d4-a716-446655440001', 'SAVE20', 'Save Big', 'Flat 20% off on orders above ₹2000', 'percentage', 20.00, 2000.00, 2000.00, 500, 89, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', true, NOW() - INTERVAL '1 month'),
('h50e8400-e29b-41d4-a716-446655440002', 'FLAT500', 'Flat Discount', 'Flat ₹500 off on orders above ₹3000', 'fixed', 500.00, 3000.00, 500.00, 200, 45, NOW() - INTERVAL '2 weeks', NOW() + INTERVAL '1 month', true, NOW() - INTERVAL '2 weeks');

-- Insert Commissions
INSERT INTO commissions (id, name, type, value, category_id, vendor_id, is_default, created_at) VALUES
('i50e8400-e29b-41d4-a716-446655440000', 'Electronics Commission', 'percentage', 8.00, '650e8400-e29b-41d4-a716-446655440000', NULL, true, NOW() - INTERVAL '6 months'),
('i50e8400-e29b-41d4-a716-446655440001', 'Fashion Commission', 'percentage', 12.00, '650e8400-e29b-41d4-a716-446655440001', NULL, true, NOW() - INTERVAL '6 months'),
('i50e8400-e29b-41d4-a716-446655440002', 'Home & Garden Commission', 'percentage', 10.00, '650e8400-e29b-41d4-a716-446655440002', NULL, true, NOW() - INTERVAL '6 months'),
('i50e8400-e29b-41d4-a716-446655440003', 'Sports Commission', 'percentage', 9.00, '650e8400-e29b-41d4-a716-446655440003', NULL, true, NOW() - INTERVAL '6 months'),
('i50e8400-e29b-41d4-a716-446655440004', 'Books Commission', 'percentage', 7.00, '650e8400-e29b-41d4-a716-446655440004', NULL, true, NOW() - INTERVAL '6 months'),
('i50e8400-e29b-41d4-a716-446655440005', 'Beauty Commission', 'percentage', 15.00, '650e8400-e29b-41d4-a716-446655440005', NULL, true, NOW() - INTERVAL '6 months');

-- Insert Vendor Payouts
INSERT INTO vendor_payouts (id, payout_number, amount, commission_deducted, net_amount, status, processed_at, created_at) VALUES
('j50e8400-e29b-41d4-a716-446655440000', 'PAY001', 147108.00, 12691.92, 134416.08, 'paid', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 month'),
('j50e8400-e29b-41d4-a716-446655440001', 'PAY002', 3870.24, 527.76, 3342.48, 'paid', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 weeks'),
('j50e8400-e29b-41d4-a716-446655440002', 'PAY003', 1169.10, 129.90, 1039.20, 'processing', NULL, NOW() - INTERVAL '3 days');

-- Insert Wishlist items
INSERT INTO wishlist (id, user_id, product_id, created_at) VALUES
('k50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440025', '850e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 week'),
('k50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440026', '850e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '3 days'),
('k50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440027', '850e8400-e29b-41d4-a716-446655440050', NOW() - INTERVAL '1 day');

-- Insert Cart items
INSERT INTO carts (id, user_id, product_id, quantity, created_at) VALUES
('l50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440026', '850e8400-e29b-41d4-a716-446655440020', 2, NOW() - INTERVAL '2 days'),
('l50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440027', '850e8400-e29b-41d4-a716-446655440040', 1, NOW() - INTERVAL '1 day'),
('l50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440027', '850e8400-e29b-41d4-a716-446655440050', 1, NOW() - INTERVAL '6 hours');

COMMIT;

-- Note: UUID fields don't use sequences, so no sequence updates needed

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_returns_created_at ON returns(created_at);
CREATE INDEX IF NOT EXISTS idx_exchanges_created_at ON exchanges(created_at);

-- Demo data inserted successfully!