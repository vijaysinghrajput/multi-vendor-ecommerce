-- Simple seed data for testing the multi-vendor e-commerce system

BEGIN;

-- Insert Categories
INSERT INTO product_categories (id, name, slug, description, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Electronic devices', true),
('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion', 'Clothing and fashion', true);

-- Insert Users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status, email_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Admin', 'User', '+1234567890', 'admin', 'active', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'vendor1@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Vendor', 'One', '+1234567891', 'vendor', 'active', true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'customer1@example.com', '$2b$10$rZNQPkUMqKnRm6/aJ7p7uOJVAj9bQqRJd3xNbV.V8VpjYWzJpC0VG', 'Customer', 'One', '+1234567893', 'customer', 'active', true);

-- Insert Vendors with shorter GST numbers
INSERT INTO vendors (id, user_id, store_name, store_description, pan_number, address, city, state, pincode, country, commission_type, commission_value, is_verified, is_active) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tech Store', 'Electronics store', 'ABCDE1234F', '123 Tech Street', 'Bangalore', 'Karnataka', '560100', 'India', 'percentage', 10.00, true, true);

-- Insert Customer Address
INSERT INTO addresses (id, user_id, name, phone, address_line_1, city, state, pincode, country, is_default, address_type) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Customer One', '+1234567893', '789 Customer Street', 'Delhi', 'Delhi', '110001', 'India', true, 'home');

-- Insert Products
INSERT INTO products (id, vendor_id, category_id, name, slug, sku, description, price, stock_quantity, is_active) VALUES
('11111111-1111-1111-1111-111111111121', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Smartphone', 'smartphone', 'SKU-PHONE001', 'A great smartphone', 25000.00, 50, true),
('22222222-2222-2222-2222-222222222221', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'T-Shirt', 't-shirt', 'SKU-SHIRT001', 'Cotton t-shirt', 999.00, 100, true);

COMMIT;

-- Demo login credentials:
-- Admin: admin@example.com / password
-- Vendor: vendor1@example.com / password
-- Customer: customer1@example.com / password