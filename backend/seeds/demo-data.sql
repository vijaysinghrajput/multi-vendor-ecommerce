-- Multi-Vendor E-Commerce Demo Data Seeds
-- This script populates the database with realistic demo data

-- Insert Categories
INSERT INTO product_categories (id, name, slug, description, image_url, parent_id, sort_order, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Electronic gadgets and devices', 'https://example.com/images/electronics.jpg', NULL, 1, true),
('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion', 'Clothing and fashion accessories', 'https://example.com/images/fashion.jpg', NULL, 2, true),
('33333333-3333-3333-3333-333333333333', 'Home & Kitchen', 'home-kitchen', 'Home appliances and kitchen items', 'https://example.com/images/home-kitchen.jpg', NULL, 3, true),
('44444444-4444-4444-4444-444444444444', 'Books', 'books', 'Books and educational materials', 'https://example.com/images/books.jpg', NULL, 4, true),
('55555555-5555-5555-5555-555555555555', 'Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', 'https://example.com/images/sports.jpg', NULL, 5, true);

-- Insert Subcategories
INSERT INTO product_categories (id, name, slug, description, image_url, parent_id, sort_order, is_active) VALUES
-- Electronics subcategories
('11111111-1111-1111-1111-111111111112', 'Mobile Phones', 'mobile-phones', 'Smartphones and accessories', 'https://example.com/images/mobile.jpg', '11111111-1111-1111-1111-111111111111', 1, true),
('11111111-1111-1111-1111-111111111113', 'Laptops', 'laptops', 'Laptops and notebooks', 'https://example.com/images/laptops.jpg', '11111111-1111-1111-1111-111111111111', 2, true),
('11111111-1111-1111-1111-111111111114', 'Cameras', 'cameras', 'Digital cameras and accessories', 'https://example.com/images/cameras.jpg', '11111111-1111-1111-1111-111111111111', 3, true),
-- Fashion subcategories
('22222222-2222-2222-2222-222222222223', 'Men''s Clothing', 'mens-clothing', 'Clothing for men', 'https://example.com/images/mens-clothing.jpg', '22222222-2222-2222-2222-222222222222', 1, true),
('22222222-2222-2222-2222-222222222224', 'Women''s Clothing', 'womens-clothing', 'Clothing for women', 'https://example.com/images/womens-clothing.jpg', '22222222-2222-2222-2222-222222222222', 2, true),
('22222222-2222-2222-2222-222222222225', 'Footwear', 'footwear', 'Shoes and sandals', 'https://example.com/images/footwear.jpg', '22222222-2222-2222-2222-222222222222', 3, true),
-- Home & Kitchen subcategories
('33333333-3333-3333-3333-333333333334', 'Furniture', 'furniture', 'Home furniture', 'https://example.com/images/furniture.jpg', '33333333-3333-3333-3333-333333333333', 1, true),
('33333333-3333-3333-3333-333333333335', 'Kitchen Appliances', 'kitchen-appliances', 'Kitchen and cooking appliances', 'https://example.com/images/kitchen.jpg', '33333333-3333-3333-3333-333333333333', 2, true);

-- Insert Users (Admin, Vendors, Customers)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status, email_verified, phone_verified, avatar_url, gender, created_at) VALUES
-- Admin user
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'John', 'Admin', '+1234567890', 'admin', 'active', true, true, 'https://example.com/avatars/admin.jpg', 'male', '2024-01-01 10:00:00'),
-- Vendor users
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'vendor1@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Sarah', 'Electronics', '+1234567891', 'vendor', 'active', true, true, 'https://example.com/avatars/vendor1.jpg', 'female', '2024-01-02 10:00:00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'vendor2@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Mike', 'Fashion', '+1234567892', 'vendor', 'active', true, true, 'https://example.com/avatars/vendor2.jpg', 'male', '2024-01-03 10:00:00'),
-- Customer users
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'customer1@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Emily', 'Johnson', '+1234567893', 'customer', 'active', true, true, 'https://example.com/avatars/customer1.jpg', 'female', '2024-01-04 10:00:00'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'customer2@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'David', 'Smith', '+1234567894', 'customer', 'active', true, false, 'https://example.com/avatars/customer2.jpg', 'male', '2024-01-05 10:00:00'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'customer3@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Lisa', 'Brown', '+1234567895', 'customer', 'active', false, true, NULL, 'female', '2024-01-06 10:00:00');

-- Insert Vendors
INSERT INTO vendors (id, user_id, store_name, store_description, gst_number, pan_number, logo_url, banner_url, address, city, state, pincode, country, commission_type, commission_value, is_verified, is_active, bank_account_number, bank_ifsc_code, bank_account_holder_name, created_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TechWorld Electronics', 'Your one-stop shop for all electronic gadgets and devices', '29GGGGG1314R9Z6', 'ABCDE1234F', 'https://example.com/logos/techworld.jpg', 'https://example.com/banners/techworld.jpg', '123 Tech Street, Electronic City', 'Bangalore', 'Karnataka', '560100', 'India', 'percentage', 8.00, true, true, '1234567890123456', 'HDFC0001234', 'Sarah Electronics', '2024-01-02 10:00:00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'StyleHub Fashion', 'Trendy fashion and clothing for everyone', '27AAAAA0000A1Z5', 'FGHIJ5678K', 'https://example.com/logos/stylehub.jpg', 'https://example.com/banners/stylehub.jpg', '456 Fashion Plaza, Commercial Street', 'Mumbai', 'Maharashtra', '400001', 'India', 'percentage', 12.00, true, true, '9876543210987654', 'ICICI0005678', 'Mike Fashion', '2024-01-03 10:00:00');

-- Insert Customer Addresses
INSERT INTO addresses (id, user_id, name, phone, address_line_1, address_line_2, landmark, city, state, pincode, country, is_default, address_type, created_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Emily Johnson', '+1234567893', '789 Residential Area', 'Apartment 12B', 'Near City Mall', 'Delhi', 'Delhi', '110001', 'India', true, 'home', '2024-01-04 11:00:00'),
('dddddddd-dddd-dddd-dddd-dddddddddd02', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Emily Johnson', '+1234567893', '321 Office Complex', 'Floor 5', 'Business District', 'Delhi', 'Delhi', '110048', 'India', false, 'office', '2024-01-04 11:30:00'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'David Smith', '+1234567894', '654 Garden Street', 'House No. 25', 'Opposite Park', 'Chennai', 'Tamil Nadu', '600001', 'India', true, 'home', '2024-01-05 11:00:00'),
('ffffffff-ffff-ffff-ffff-ffffffffff01', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Lisa Brown', '+1234567895', '987 Lake View', 'Villa 8', 'Lake Side', 'Pune', 'Maharashtra', '411001', 'India', true, 'home', '2024-01-06 11:00:00');

-- Insert Products
INSERT INTO products (id, vendor_id, category_id, name, slug, sku, description, short_description, images, price, compare_price, cost_price, discount_percentage, stock_quantity, min_stock_level, weight, dimensions, rating, review_count, is_active, is_featured, tags, created_at) VALUES
-- TechWorld Electronics Products
('11111111-1111-1111-1111-111111111121', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111112', 'iPhone 15 Pro', 'iphone-15-pro', 'SKU-IPHONE15PRO', 'Latest iPhone 15 Pro with advanced camera system and A17 Pro chip', 'Latest iPhone with pro features', '{"https://example.com/products/iphone15pro-1.jpg","https://example.com/products/iphone15pro-2.jpg","https://example.com/products/iphone15pro-3.jpg"}', 99999.00, 119999.00, 85000.00, 16.67, 50, 5, 0.187, '{"length": 14.67, "width": 7.09, "height": 0.81}', 4.5, 23, true, true, '{"smartphone","apple","iphone","premium"}', '2024-01-07 10:00:00'),
('22222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111113', 'MacBook Pro 14"', 'macbook-pro-14', 'SKU-MACBOOKPRO14', 'MacBook Pro 14-inch with M3 Pro chip for professionals', 'Professional laptop with M3 Pro chip', '{"https://example.com/products/macbook14-1.jpg","https://example.com/products/macbook14-2.jpg"}', 199999.00, 249999.00, 170000.00, 20.00, 25, 3, 1.55, '{"length": 31.26, "width": 22.12, "height": 1.55}', 4.8, 45, true, true, '{"laptop","apple","macbook","professional"}', '2024-01-07 11:00:00'),
('33333333-3333-3333-3333-333333333331', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111114', 'Canon EOS R5', 'canon-eos-r5', 'SKU-CANONEOSR5', 'Professional mirrorless camera with 45MP full-frame sensor', 'Professional mirrorless camera', '{"https://example.com/products/canonr5-1.jpg","https://example.com/products/canonr5-2.jpg"}', 299999.00, 349999.00, 250000.00, 14.29, 15, 2, 0.738, '{"length": 13.8, "width": 9.77, "height": 8.84}', 4.7, 32, true, false, '{"camera","canon","professional","photography"}', '2024-01-07 12:00:00'),
-- StyleHub Fashion Products
('44444444-4444-4444-4444-444444444441', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222223', 'Men''s Cotton Shirt', 'mens-cotton-shirt-blue', 'SKU-MENSHIRT001', 'Premium cotton shirt for formal and casual wear', 'Premium cotton shirt', '{"https://example.com/products/shirt-blue-1.jpg","https://example.com/products/shirt-blue-2.jpg"}', 1999.00, 2999.00, 1200.00, 33.33, 100, 10, 0.3, '{"length": 70, "width": 50, "height": 2}', 4.2, 18, true, false, '{"shirt","cotton","mens","formal"}', '2024-01-08 10:00:00'),
('55555555-5555-5555-5555-555555555551', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222224', 'Women''s Summer Dress', 'womens-summer-dress-floral', 'SKU-WOMENDRESS001', 'Beautiful floral summer dress perfect for any occasion', 'Beautiful floral summer dress', '{"https://example.com/products/dress-floral-1.jpg","https://example.com/products/dress-floral-2.jpg"}', 2499.00, 3499.00, 1500.00, 28.58, 75, 8, 0.4, '{"length": 110, "width": 40, "height": 3}', 4.6, 27, true, true, '{"dress","summer","floral","women"}', '2024-01-08 11:00:00'),
('66666666-6666-6666-6666-666666666661', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222225', 'Sports Sneakers', 'sports-sneakers-white', 'SKU-SNEAKERS001', 'Comfortable sports sneakers for running and casual wear', 'Comfortable sports sneakers', '{"https://example.com/products/sneakers-white-1.jpg","https://example.com/products/sneakers-white-2.jpg"}', 4999.00, 6999.00, 3000.00, 28.58, 60, 6, 0.8, '{"length": 30, "width": 12, "height": 10}', 4.4, 35, true, false, '{"sneakers","sports","running","comfortable"}', '2024-01-08 12:00:00');

-- Insert Product Variants
INSERT INTO product_variants (id, product_id, sku, color, size, material, price, compare_price, stock_quantity, image_url, weight, is_active, created_at) VALUES
-- iPhone 15 Pro variants
('variant1-1111-1111-1111-111111111111', 'product1-1111-1111-1111-111111111111', 'SKU-IPHONE15PRO-BLUE-128', 'Blue Titanium', '128GB', 'Titanium', 99999.00, 119999.00, 20, 'https://example.com/products/iphone15pro-blue.jpg', 0.187, true, '2024-01-07 10:30:00'),
('variant1-1111-1111-1111-111111111112', 'product1-1111-1111-1111-111111111111', 'SKU-IPHONE15PRO-BLACK-128', 'Black Titanium', '128GB', 'Titanium', 99999.00, 119999.00, 15, 'https://example.com/products/iphone15pro-black.jpg', 0.187, true, '2024-01-07 10:30:00'),
('variant1-1111-1111-1111-111111111113', 'product1-1111-1111-1111-111111111111', 'SKU-IPHONE15PRO-BLUE-256', 'Blue Titanium', '256GB', 'Titanium', 119999.00, 139999.00, 15, 'https://example.com/products/iphone15pro-blue.jpg', 0.187, true, '2024-01-07 10:30:00'),
-- Men's Shirt variants
('variant4-4444-4444-4444-444444444444', 'product4-4444-4444-4444-444444444444', 'SKU-MENSHIRT001-BLUE-M', 'Blue', 'M', 'Cotton', 1999.00, 2999.00, 25, 'https://example.com/products/shirt-blue-m.jpg', 0.3, true, '2024-01-08 10:30:00'),
('variant4-4444-4444-4444-444444444445', 'product4-4444-4444-4444-444444444444', 'SKU-MENSHIRT001-BLUE-L', 'Blue', 'L', 'Cotton', 1999.00, 2999.00, 25, 'https://example.com/products/shirt-blue-l.jpg', 0.3, true, '2024-01-08 10:30:00'),
('variant4-4444-4444-4444-444444444446', 'product4-4444-4444-4444-444444444444', 'SKU-MENSHIRT001-WHITE-M', 'White', 'M', 'Cotton', 1999.00, 2999.00, 25, 'https://example.com/products/shirt-white-m.jpg', 0.3, true, '2024-01-08 10:30:00'),
-- Sneakers variants
('variant6-6666-6666-6666-666666666666', 'product6-6666-6666-6666-666666666666', 'SKU-SNEAKERS001-WHITE-9', 'White', '9', 'Synthetic', 4999.00, 6999.00, 20, 'https://example.com/products/sneakers-white-9.jpg', 0.8, true, '2024-01-08 12:30:00'),
('variant6-6666-6666-6666-666666666667', 'product6-6666-6666-6666-666666666666', 'SKU-SNEAKERS001-BLACK-9', 'Black', '9', 'Synthetic', 4999.00, 6999.00, 20, 'https://example.com/products/sneakers-black-9.jpg', 0.8, true, '2024-01-08 12:30:00'),
('variant6-6666-6666-6666-666666666668', 'product6-6666-6666-6666-666666666666', 'SKU-SNEAKERS001-WHITE-10', 'White', '10', 'Synthetic', 4999.00, 6999.00, 20, 'https://example.com/products/sneakers-white-10.jpg', 0.8, true, '2024-01-08 12:30:00');

-- Insert Wishlist items
INSERT INTO wishlist (id, user_id, product_id, created_at) VALUES
('wishlist1-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'product1-1111-1111-1111-111111111111', '2024-01-10 10:00:00'),
('wishlist1-1111-1111-1111-111111111112', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'product5-5555-5555-5555-555555555555', '2024-01-10 11:00:00'),
('wishlist2-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'product2-2222-2222-2222-222222222222', '2024-01-11 10:00:00');

-- Insert Cart items
INSERT INTO carts (id, user_id, product_id, variant_id, quantity, created_at) VALUES
('cart1-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'product4-4444-4444-4444-444444444444', 'variant4-4444-4444-4444-444444444444', 2, '2024-01-12 10:00:00'),
('cart1-1111-1111-1111-111111111112', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'product6-6666-6666-6666-666666666666', 'variant6-6666-6666-6666-666666666666', 1, '2024-01-12 11:00:00'),
('cart2-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'product1-1111-1111-1111-111111111111', 'variant1-1111-1111-1111-111111111111', 1, '2024-01-13 10:00:00');

-- Insert Orders
INSERT INTO orders (id, order_number, user_id, vendor_id, status, payment_status, total_amount, subtotal, tax_amount, shipping_amount, discount_amount, shipping_address_id, billing_address_id, notes, shipped_at, delivered_at, tracking_number, estimated_delivery_date, created_at) VALUES
('order1-1111-1111-1111-111111111111', 'ORD-2024-000001', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'delivered', 'completed', 106998.00, 99999.00, 5999.40, 1999.60, 1000.00, 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'Please handle with care', '2024-01-15 10:00:00', '2024-01-18 14:30:00', 'TRK-2024-001', '2024-01-18', '2024-01-14 10:00:00'),
('order2-2222-2222-2222-222222222222', 'ORD-2024-000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'shipped', 'completed', 7497.00, 6999.00, 349.95, 149.05, 0.00, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', NULL, '2024-01-16 09:00:00', NULL, 'TRK-2024-002', '2024-01-19', '2024-01-15 11:00:00'),
('order3-3333-3333-3333-333333333333', 'ORD-2024-000003', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'confirmed', 'completed', 2648.00, 2499.00, 124.95, 24.05, 0.00, 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Gift wrapping requested', NULL, NULL, NULL, '2024-01-20', '2024-01-16 14:00:00');

-- Insert Order Items
INSERT INTO order_items (id, order_id, product_id, variant_id, quantity, unit_price, total_price, product_name, product_sku, variant_details, created_at) VALUES
('orderitem1-1111-1111-1111-111111111111', 'order1-1111-1111-1111-111111111111', 'product1-1111-1111-1111-111111111111', 'variant1-1111-1111-1111-111111111111', 1, 99999.00, 99999.00, 'iPhone 15 Pro', 'SKU-IPHONE15PRO', '{"color": "Blue Titanium", "size": "128GB", "material": "Titanium"}', '2024-01-14 10:00:00'),
('orderitem2-2222-2222-2222-222222222222', 'order2-2222-2222-2222-222222222222', 'product6-6666-6666-6666-666666666666', 'variant6-6666-6666-6666-666666666666', 1, 4999.00, 4999.00, 'Sports Sneakers', 'SKU-SNEAKERS001', '{"color": "White", "size": "9", "material": "Synthetic"}', '2024-01-15 11:00:00'),
('orderitem2-2222-2222-2222-222222222223', 'order2-2222-2222-2222-222222222222', 'product4-4444-4444-4444-444444444444', 'variant4-4444-4444-4444-444444444444', 1, 1999.00, 1999.00, 'Men''s Cotton Shirt', 'SKU-MENSHIRT001', '{"color": "Blue", "size": "M", "material": "Cotton"}', '2024-01-15 11:00:00'),
('orderitem3-3333-3333-3333-333333333333', 'order3-3333-3333-3333-333333333333', 'product5-5555-5555-5555-555555555555', NULL, 1, 2499.00, 2499.00, 'Women''s Summer Dress', 'SKU-WOMENDRESS001', '{"color": "Floral", "size": "M"}', '2024-01-16 14:00:00');

-- Insert Payments
INSERT INTO payments (id, order_id, payment_gateway, status, amount, currency, transaction_id, gateway_transaction_id, payment_method, created_at) VALUES
('payment1-1111-1111-1111-111111111111', 'order1-1111-1111-1111-111111111111', 'razorpay', 'completed', 106998.00, 'INR', 'TXN-2024-001', 'rzp_live_1234567890', 'card', '2024-01-14 10:05:00'),
('payment2-2222-2222-2222-222222222222', 'order2-2222-2222-2222-222222222222', 'stripe', 'completed', 7497.00, 'INR', 'TXN-2024-002', 'pi_3K1234567890abcdef', 'card', '2024-01-15 11:05:00'),
('payment3-3333-3333-3333-333333333333', 'order3-3333-3333-3333-333333333333', 'cod', 'pending', 2648.00, 'INR', 'TXN-2024-003', NULL, 'cash_on_delivery', '2024-01-16 14:05:00');

-- Insert Reviews
INSERT INTO reviews (id, user_id, product_id, order_item_id, rating, title, comment, images, is_verified, is_approved, helpful_count, created_at) VALUES
('review1-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'product1-1111-1111-1111-111111111111', 'orderitem1-1111-1111-1111-111111111111', 5, 'Excellent phone!', 'Amazing camera quality and performance. The titanium build feels premium and the battery life is impressive. Highly recommended!', '{"https://example.com/reviews/review1-img1.jpg","https://example.com/reviews/review1-img2.jpg"}', true, true, 12, '2024-01-20 10:00:00'),
('review2-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'product6-6666-6666-6666-666666666666', 'orderitem2-2222-2222-2222-222222222222', 4, 'Comfortable sneakers', 'Very comfortable for daily wear and running. Good value for money. The white color looks great but gets dirty easily.', '{"https://example.com/reviews/review2-img1.jpg"}', true, true, 8, '2024-01-17 15:00:00'),
('review2-2222-2222-2222-222222222223', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'product4-4444-4444-4444-444444444444', 'orderitem2-2222-2222-2222-222222222223', 4, 'Good quality shirt', 'Nice cotton material and good fit. The color is exactly as shown in pictures. Will order more colors.', NULL, true, true, 5, '2024-01-17 16:00:00');

-- Insert Coupons
INSERT INTO coupons (id, code, name, description, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, usage_limit, used_count, user_usage_limit, start_date, expiry_date, is_active, created_at) VALUES
('coupon1-1111-1111-1111-111111111111', 'WELCOME10', 'Welcome Discount', '10% off on first order', 'percentage', 10.00, 1000.00, 2000.00, 1000, 23, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true, '2024-01-01 00:00:00'),
('coupon2-2222-2222-2222-222222222222', 'SAVE500', 'Flat 500 Off', 'Flat ₹500 off on orders above ₹5000', 'fixed', 500.00, 5000.00, 500.00, 500, 45, 2, '2024-01-01 00:00:00', '2024-06-30 23:59:59', true, '2024-01-01 00:00:00'),
('coupon3-3333-3333-3333-333333333333', 'FASHION20', 'Fashion Sale', '20% off on fashion items', 'percentage', 20.00, 2000.00, 1000.00, 200, 67, 1, '2024-01-15 00:00:00', '2024-02-15 23:59:59', true, '2024-01-15 00:00:00');

-- Insert Returns
INSERT INTO returns (id, order_item_id, return_number, reason, status, refund_amount, admin_notes, images, approved_at, refunded_at, created_at) VALUES
('return1-1111-1111-1111-111111111111', 'orderitem1-1111-1111-1111-111111111111', 'RET-2024-000001', 'Product has manufacturing defect in the camera module', 'approved', 99999.00, 'Valid return request. Manufacturing defect confirmed.', '{"https://example.com/returns/return1-img1.jpg","https://example.com/returns/return1-img2.jpg"}', '2024-01-22 10:00:00', '2024-01-25 14:00:00', '2024-01-21 09:00:00');

-- Insert Exchanges  
INSERT INTO exchanges (id, order_item_id, exchange_number, reason, status, new_variant_id, price_difference, admin_notes, images, approved_at, completed_at, created_at) VALUES
('exchange1-1111-1111-1111-111111111111', 'orderitem2-2222-2222-2222-222222222222', 'EXC-2024-000001', 'Wrong size delivered, need size 10 instead of 9', 'completed', 'variant6-6666-6666-6666-666666666668', 0.00, 'Size exchange approved. Same price variant.', '{"https://example.com/exchanges/exchange1-img1.jpg"}', '2024-01-18 10:00:00', '2024-01-21 15:00:00', '2024-01-17 18:00:00');

-- Insert Vendor Payouts
INSERT INTO vendor_payouts (id, vendor_id, payout_number, amount, commission_deducted, net_amount, status, reference_note, transaction_id, processed_at, created_at) VALUES
('payout1-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'PAY-2024-000001', 99999.00, 7999.92, 91999.08, 'paid', 'Monthly payout for January 2024', 'NEFT-2024-001', '2024-02-01 10:00:00', '2024-02-01 09:00:00'),
('payout2-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'PAY-2024-000002', 9497.00, 1139.64, 8357.36, 'processing', 'Monthly payout for January 2024', NULL, NULL, '2024-02-01 09:30:00');

-- Insert Payout Ledger entries
INSERT INTO payouts_ledger (id, vendor_id, order_id, payout_id, transaction_type, amount, commission_rate, commission_amount, description, balance_after, created_at) VALUES
('ledger1-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'order1-1111-1111-1111-111111111111', NULL, 'earning', 99999.00, 8.00, 7999.92, 'Order payment received', 99999.00, '2024-01-14 10:05:00'),
('ledger1-1111-1111-1111-111111111112', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'order1-1111-1111-1111-111111111111', NULL, 'commission', -7999.92, 8.00, 7999.92, 'Platform commission deducted', 91999.08, '2024-01-14 10:05:00'),
('ledger1-1111-1111-1111-111111111113', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'payout1-1111-1111-1111-111111111111', 'payout', -91999.08, NULL, NULL, 'Payout processed', 0.00, '2024-02-01 10:00:00'),
('ledger2-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'order2-2222-2222-2222-222222222222', NULL, 'earning', 6998.00, 12.00, 839.76, 'Order payment received', 6998.00, '2024-01-15 11:05:00'),
('ledger2-2222-2222-2222-222222222223', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'order2-2222-2222-2222-222222222222', NULL, 'commission', -839.76, 12.00, 839.76, 'Platform commission deducted', 6158.24, '2024-01-15 11:05:00'),
('ledger2-2222-2222-2222-222222222224', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'order3-3333-3333-3333-333333333333', NULL, 'earning', 2499.00, 12.00, 299.88, 'Order payment received', 8657.24, '2024-01-16 14:05:00'),
('ledger2-2222-2222-2222-222222222225', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'order3-3333-3333-3333-333333333333', NULL, 'commission', -299.88, 12.00, 299.88, 'Platform commission deducted', 8357.36, '2024-01-16 14:05:00');

-- Insert Commission rules
INSERT INTO commissions (id, name, type, value, category_id, vendor_id, is_default, is_active, created_at) VALUES
('commission1-1111-1111-1111-111111111111', 'Electronics Default', 'percentage', 8.00, '11111111-1111-1111-1111-111111111111', NULL, true, true, '2024-01-01 00:00:00'),
('commission2-2222-2222-2222-222222222222', 'Fashion Default', 'percentage', 12.00, '22222222-2222-2222-2222-222222222222', NULL, true, true, '2024-01-01 00:00:00'),
('commission3-3333-3333-3333-333333333333', 'Premium Vendor Rate', 'percentage', 6.00, NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', false, true, '2024-01-02 00:00:00');

-- Insert Product Views Analytics
INSERT INTO product_views (id, product_id, user_id, session_id, ip_address, user_agent, referrer, viewed_at) VALUES
('view1-1111-1111-1111-111111111111', 'product1-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'sess_2024_001', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://google.com', '2024-01-10 09:00:00'),
('view1-1111-1111-1111-111111111112', 'product1-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'sess_2024_002', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', 'https://facebook.com', '2024-01-11 14:30:00'),
('view2-2222-2222-2222-222222222222', 'product2-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'sess_2024_003', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://multivendor.com', '2024-01-12 10:15:00'),
('view3-3333-3333-3333-333333333333', 'product5-5555-5555-5555-555555555555', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'sess_2024_004', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'https://instagram.com', '2024-01-13 16:45:00');

-- Insert Order Stats Analytics
INSERT INTO order_stats (id, date, vendor_id, total_orders, total_revenue, total_commission, avg_order_value, created_at) VALUES
('stats1-1111-1111-1111-111111111111', '2024-01-14', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 99999.00, 7999.92, 99999.00, '2024-01-15 00:00:00'),
('stats2-2222-2222-2222-222222222222', '2024-01-15', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 6998.00, 839.76, 6998.00, '2024-01-16 00:00:00'),
('stats2-2222-2222-2222-222222222223', '2024-01-16', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 2499.00, 299.88, 2499.00, '2024-01-17 00:00:00');

-- Insert Notifications
INSERT INTO notifications (id, user_id, type, title, body, data, is_read, sent_at, created_at) VALUES
('notif1-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'push', 'Order Delivered!', 'Your order ORD-2024-000001 has been delivered successfully.', '{"order_id": "order1-1111-1111-1111-111111111111", "order_number": "ORD-2024-000001"}', true, '2024-01-18 14:30:00', '2024-01-18 14:30:00'),
('notif2-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'push', 'Order Shipped!', 'Your order ORD-2024-000002 has been shipped and is on the way.', '{"order_id": "order2-2222-2222-2222-222222222222", "order_number": "ORD-2024-000002"}', false, '2024-01-16 09:00:00', '2024-01-16 09:00:00'),
('notif3-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'email', 'New Order Received', 'You have received a new order ORD-2024-000001 worth ₹99,999.', '{"order_id": "order1-1111-1111-1111-111111111111", "amount": 99999.00}', true, '2024-01-14 10:00:00', '2024-01-14 10:00:00'),
('notif4-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'email', 'Payout Processing', 'Your payout PAY-2024-000002 for ₹8,357.36 is being processed.', '{"payout_id": "payout2-2222-2222-2222-222222222222", "amount": 8357.36}', false, '2024-02-01 09:30:00', '2024-02-01 09:30:00');

-- Update product ratings based on reviews
UPDATE products SET 
    rating = (
        SELECT ROUND(AVG(rating)::numeric, 1) 
        FROM reviews 
        WHERE reviews.product_id = products.id 
        AND reviews.is_approved = true
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE reviews.product_id = products.id 
        AND reviews.is_approved = true
    )
WHERE id IN (
    SELECT DISTINCT product_id 
    FROM reviews 
    WHERE is_approved = true
);

-- Create admin user entry for password: 'password' (hashed with bcrypt)
UPDATE users SET password_hash = '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG' WHERE role = 'admin';
UPDATE users SET password_hash = '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG' WHERE role = 'vendor';
UPDATE users SET password_hash = '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG' WHERE role = 'customer';

COMMIT;