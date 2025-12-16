-- BOMA 2025 Database Schema for Supabase
-- Copy and paste this entire script into Supabase SQL Editor

-- Create ENUM types
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "Size" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- Create users table
CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE "products" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "base_price" DECIMAL(10,2) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create product_variants table
CREATE TABLE "product_variants" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "product_id" TEXT NOT NULL,
  "size" "Size" NOT NULL,
  "color" TEXT NOT NULL,
  "stock_quantity" INTEGER NOT NULL DEFAULT 0,
  "price_override" DECIMAL(10,2),
  "sku" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE,
  UNIQUE("product_id", "size", "color")
);

-- Create images table
CREATE TABLE "images" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "product_id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "is_main" BOOLEAN NOT NULL DEFAULT false,
  "alt_text" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE "orders" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "total_amount" DECIMAL(10,2) NOT NULL,
  "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "payment_ref" TEXT UNIQUE,
  "payment_method" TEXT NOT NULL DEFAULT 'cod',
  "shipping_address" JSONB NOT NULL,
  "scheduled_date" TIMESTAMP(3),
  "time_window" TEXT,
  "customer_name" TEXT,
  "customer_phone" TEXT,
  "customer_email" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL
);

-- Create order_items table
CREATE TABLE "order_items" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "order_id" TEXT NOT NULL,
  "variant_id" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price_at_purchase" DECIMAL(10,2) NOT NULL,
  CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE,
  CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants" ("id")
);

-- Create reviews table
CREATE TABLE "reviews" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "product_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "flagged" BOOLEAN NOT NULL DEFAULT false,
  "flag_reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE,
  CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  UNIQUE("product_id", "user_id")
);

-- Create wishlist_items table
CREATE TABLE "wishlist_items" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "wishlist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE,
  UNIQUE("user_id", "product_id")
);

-- Create newsletter_subscriptions table
CREATE TABLE "newsletter_subscriptions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribed_at" TIMESTAMP(3)
);

-- Create indexes for better performance
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "products_slug_idx" ON "products"("slug");
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");
CREATE INDEX "product_variants_sku_idx" ON "product_variants"("sku");
CREATE INDEX "images_product_id_idx" ON "images"("product_id");
CREATE INDEX "orders_user_id_idx" ON "orders"("user_id");
CREATE INDEX "orders_status_idx" ON "orders"("status");
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX "order_items_variant_id_idx" ON "order_items"("variant_id");
CREATE INDEX "reviews_product_id_idx" ON "reviews"("product_id");
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");
CREATE INDEX "wishlist_items_user_id_idx" ON "wishlist_items"("user_id");
CREATE INDEX "wishlist_items_product_id_idx" ON "wishlist_items"("product_id");
CREATE INDEX "newsletter_subscriptions_email_idx" ON "newsletter_subscriptions"("email");

-- Create admin user
INSERT INTO "users" ("id", "email", "password_hash", "role") 
VALUES ('admin-user-1', 'admin@streetwear.com', '$2b$10$YourHashedPasswordHere', 'ADMIN')
ON CONFLICT DO NOTHING;

