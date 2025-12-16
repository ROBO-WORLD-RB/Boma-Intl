-- BOMA 2025 Sample Data for Supabase
-- Copy and paste this into Supabase SQL Editor to seed 24 products

-- Create admin user
INSERT INTO "users" ("id", "email", "password_hash", "role") 
VALUES ('admin-user-1', 'admin@streetwear.com', '$2b$10$YourHashedPasswordHere', 'ADMIN')
ON CONFLICT ("email") DO NOTHING;

-- Create 24 sample products with variants
-- Product 1: Culture Tee
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-1', 'Culture Tee', 'culture-tee', 'Premium cotton tee celebrating African culture', 29.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-1-1', 'prod-1', 'M', 'Black', 50, 'CULTURE-TEE-M-BLK'),
  ('var-1-2', 'prod-1', 'L', 'White', 50, 'CULTURE-TEE-L-WHT');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-1', 'prod-1', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025.jpg', true, 'Culture Tee');

-- Product 2: Streets Hoodie
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-2', 'Streets Hoodie', 'streets-hoodie', 'Comfortable streetwear hoodie', 59.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-2-1', 'prod-2', 'M', 'Black', 40, 'STREETS-HOODIE-M-BLK'),
  ('var-2-2', 'prod-2', 'L', 'Gray', 40, 'STREETS-HOODIE-L-GRY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-2', 'prod-2', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_1.jpg', true, 'Streets Hoodie');

-- Product 3: Accra Jacket
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-3', 'Accra Jacket', 'accra-jacket', 'Stylish jacket inspired by Accra', 89.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-3-1', 'prod-3', 'M', 'Navy', 30, 'ACCRA-JACKET-M-NVY'),
  ('var-3-2', 'prod-3', 'L', 'Black', 30, 'ACCRA-JACKET-L-BLK');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-3', 'prod-3', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_10.jpg', true, 'Accra Jacket');

-- Product 4: Movement Pants
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-4', 'Movement Pants', 'movement-pants', 'Comfortable athletic pants', 49.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-4-1', 'prod-4', 'M', 'Black', 45, 'MOVEMENT-PANTS-M-BLK'),
  ('var-4-2', 'prod-4', 'L', 'Gray', 45, 'MOVEMENT-PANTS-L-GRY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-4', 'prod-4', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_11.jpg', true, 'Movement Pants');

-- Product 5: Heritage Cap
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-5', 'Heritage Cap', 'heritage-cap', 'Classic heritage-inspired cap', 24.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-5-1', 'prod-5', 'M', 'Black', 60, 'HERITAGE-CAP-M-BLK'),
  ('var-5-2', 'prod-5', 'M', 'Tan', 60, 'HERITAGE-CAP-M-TAN');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-5', 'prod-5', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_12.jpg', true, 'Heritage Cap');

-- Product 6: Unity Shorts
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-6', 'Unity Shorts', 'unity-shorts', 'Lightweight summer shorts', 34.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-6-1', 'prod-6', 'M', 'Black', 55, 'UNITY-SHORTS-M-BLK'),
  ('var-6-2', 'prod-6', 'L', 'Navy', 55, 'UNITY-SHORTS-L-NVY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-6', 'prod-6', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_13.jpg', true, 'Unity Shorts');

-- Product 7: Roots Sweater
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-7', 'Roots Sweater', 'roots-sweater', 'Cozy knit sweater', 64.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-7-1', 'prod-7', 'M', 'Cream', 35, 'ROOTS-SWEATER-M-CRM'),
  ('var-7-2', 'prod-7', 'L', 'Brown', 35, 'ROOTS-SWEATER-L-BRN');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-7', 'prod-7', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_14.jpg', true, 'Roots Sweater');

-- Product 8: Vision Tank
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-8', 'Vision Tank', 'vision-tank', 'Sleek tank top', 19.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-8-1', 'prod-8', 'M', 'Black', 70, 'VISION-TANK-M-BLK'),
  ('var-8-2', 'prod-8', 'L', 'White', 70, 'VISION-TANK-L-WHT');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-8', 'prod-8', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_15.jpg', true, 'Vision Tank');

-- Product 9: Legacy Joggers
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-9', 'Legacy Joggers', 'legacy-joggers', 'Premium joggers', 54.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-9-1', 'prod-9', 'M', 'Black', 42, 'LEGACY-JOGGERS-M-BLK'),
  ('var-9-2', 'prod-9', 'L', 'Gray', 42, 'LEGACY-JOGGERS-L-GRY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-9', 'prod-9', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_16.jpg', true, 'Legacy Joggers');

-- Product 10: Spirit Vest
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-10', 'Spirit Vest', 'spirit-vest', 'Layering vest', 44.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-10-1', 'prod-10', 'M', 'Black', 38, 'SPIRIT-VEST-M-BLK'),
  ('var-10-2', 'prod-10', 'L', 'Navy', 38, 'SPIRIT-VEST-L-NVY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-10', 'prod-10', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_17.jpg', true, 'Spirit Vest');

-- Product 11: Rhythm Shirt
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-11', 'Rhythm Shirt', 'rhythm-shirt', 'Casual button-up shirt', 39.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-11-1', 'prod-11', 'M', 'White', 48, 'RHYTHM-SHIRT-M-WHT'),
  ('var-11-2', 'prod-11', 'L', 'Blue', 48, 'RHYTHM-SHIRT-L-BLU');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-11', 'prod-11', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_18.jpg', true, 'Rhythm Shirt');

-- Product 12: Flow Cardigan
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-12', 'Flow Cardigan', 'flow-cardigan', 'Elegant cardigan', 69.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-12-1', 'prod-12', 'M', 'Cream', 32, 'FLOW-CARDIGAN-M-CRM'),
  ('var-12-2', 'prod-12', 'L', 'Black', 32, 'FLOW-CARDIGAN-L-BLK');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-12', 'prod-12', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_19.jpg', true, 'Flow Cardigan');

-- Products 13-24 (Duplicates with variant 2)
-- Product 13: Culture Tee 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-13', 'Culture Tee 2', 'culture-tee-2', 'Premium cotton tee celebrating African culture', 29.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-13-1', 'prod-13', 'S', 'Black', 50, 'CULTURE-TEE-2-S-BLK'),
  ('var-13-2', 'prod-13', 'XL', 'White', 50, 'CULTURE-TEE-2-XL-WHT');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-13', 'prod-13', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_2.jpg', true, 'Culture Tee 2');

-- Product 14: Streets Hoodie 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-14', 'Streets Hoodie 2', 'streets-hoodie-2', 'Comfortable streetwear hoodie', 59.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-14-1', 'prod-14', 'S', 'Black', 40, 'STREETS-HOODIE-2-S-BLK'),
  ('var-14-2', 'prod-14', 'XL', 'Gray', 40, 'STREETS-HOODIE-2-XL-GRY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-14', 'prod-14', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_20.jpg', true, 'Streets Hoodie 2');

-- Product 15: Accra Jacket 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-15', 'Accra Jacket 2', 'accra-jacket-2', 'Stylish jacket inspired by Accra', 89.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-15-1', 'prod-15', 'S', 'Navy', 30, 'ACCRA-JACKET-2-S-NVY'),
  ('var-15-2', 'prod-15', 'XL', 'Black', 30, 'ACCRA-JACKET-2-XL-BLK');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-15', 'prod-15', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_21.jpg', true, 'Accra Jacket 2');

-- Product 16: Movement Pants 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-16', 'Movement Pants 2', 'movement-pants-2', 'Comfortable athletic pants', 49.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-16-1', 'prod-16', 'S', 'Black', 45, 'MOVEMENT-PANTS-2-S-BLK'),
  ('var-16-2', 'prod-16', 'XL', 'Gray', 45, 'MOVEMENT-PANTS-2-XL-GRY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-16', 'prod-16', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_22.jpg', true, 'Movement Pants 2');

-- Product 17: Heritage Cap 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-17', 'Heritage Cap 2', 'heritage-cap-2', 'Classic heritage-inspired cap', 24.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-17-1', 'prod-17', 'S', 'Black', 60, 'HERITAGE-CAP-2-S-BLK'),
  ('var-17-2', 'prod-17', 'S', 'Tan', 60, 'HERITAGE-CAP-2-S-TAN');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-17', 'prod-17', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_23.jpg', true, 'Heritage Cap 2');

-- Product 18: Unity Shorts 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-18', 'Unity Shorts 2', 'unity-shorts-2', 'Lightweight summer shorts', 34.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-18-1', 'prod-18', 'S', 'Black', 55, 'UNITY-SHORTS-2-S-BLK'),
  ('var-18-2', 'prod-18', 'XL', 'Navy', 55, 'UNITY-SHORTS-2-XL-NVY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-18', 'prod-18', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_24.jpg', true, 'Unity Shorts 2');

-- Product 19: Roots Sweater 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-19', 'Roots Sweater 2', 'roots-sweater-2', 'Cozy knit sweater', 64.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-19-1', 'prod-19', 'S', 'Cream', 35, 'ROOTS-SWEATER-2-S-CRM'),
  ('var-19-2', 'prod-19', 'XL', 'Brown', 35, 'ROOTS-SWEATER-2-XL-BRN');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-19', 'prod-19', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_25.jpg', true, 'Roots Sweater 2');

-- Product 20: Vision Tank 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-20', 'Vision Tank 2', 'vision-tank-2', 'Sleek tank top', 19.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-20-1', 'prod-20', 'S', 'Black', 70, 'VISION-TANK-2-S-BLK'),
  ('var-20-2', 'prod-20', 'XL', 'White', 70, 'VISION-TANK-2-XL-WHT');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-20', 'prod-20', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_26.jpg', true, 'Vision Tank 2');

-- Product 21: Legacy Joggers 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-21', 'Legacy Joggers 2', 'legacy-joggers-2', 'Premium joggers', 54.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-21-1', 'prod-21', 'S', 'Black', 42, 'LEGACY-JOGGERS-2-S-BLK'),
  ('var-21-2', 'prod-21', 'XL', 'Gray', 42, 'LEGACY-JOGGERS-2-XL-GRY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-21', 'prod-21', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_27.jpg', true, 'Legacy Joggers 2');

-- Product 22: Spirit Vest 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-22', 'Spirit Vest 2', 'spirit-vest-2', 'Layering vest', 44.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-22-1', 'prod-22', 'S', 'Black', 38, 'SPIRIT-VEST-2-S-BLK'),
  ('var-22-2', 'prod-22', 'XL', 'Navy', 38, 'SPIRIT-VEST-2-XL-NVY');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-22', 'prod-22', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_28.jpg', true, 'Spirit Vest 2');

-- Product 23: Rhythm Shirt 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-23', 'Rhythm Shirt 2', 'rhythm-shirt-2', 'Casual button-up shirt', 39.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-23-1', 'prod-23', 'S', 'White', 48, 'RHYTHM-SHIRT-2-S-WHT'),
  ('var-23-2', 'prod-23', 'XL', 'Blue', 48, 'RHYTHM-SHIRT-2-XL-BLU');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-23', 'prod-23', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_29.jpg', true, 'Rhythm Shirt 2');

-- Product 24: Flow Cardigan 2
INSERT INTO "products" ("id", "title", "slug", "description", "base_price", "is_active") 
VALUES ('prod-24', 'Flow Cardigan 2', 'flow-cardigan-2', 'Elegant cardigan', 69.99, true)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "product_variants" ("id", "product_id", "size", "color", "stock_quantity", "sku") 
VALUES 
  ('var-24-1', 'prod-24', 'S', 'Cream', 32, 'FLOW-CARDIGAN-2-S-CRM'),
  ('var-24-2', 'prod-24', 'XL', 'Black', 32, 'FLOW-CARDIGAN-2-XL-BLK');

INSERT INTO "images" ("id", "product_id", "url", "is_main", "alt_text") 
VALUES ('img-24', 'prod-24', '/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_30.jpg', true, 'Flow Cardigan 2');

-- Verify data was inserted
SELECT COUNT(*) as total_products FROM "products";
SELECT COUNT(*) as total_variants FROM "product_variants";
SELECT COUNT(*) as total_images FROM "images";

