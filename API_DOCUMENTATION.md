# Streetwear E-Commerce API Documentation

## Overview
Production-ready REST API for a streetwear clothing brand e-commerce store built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "cmirjnev2000aswlk3izq4uj4",
      "email": "user@example.com",
      "role": "CUSTOMER",
      "createdAt": "2025-12-04T14:41:23.966Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```
POST /auth/login
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cmirjnev2000aswlk3izq4uj4",
      "email": "user@example.com",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "cmirjnev2000aswlk3izq4uj4",
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```

---

### Products

#### List Products
```
GET /products?page=1&limit=12&search=hoodie&minPrice=50&maxPrice=150
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `search` (optional): Search by title or description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "cmirjneta0001swlko15z50gr",
        "title": "Classic Oversized Hoodie",
        "slug": "classic-oversized-hoodie",
        "description": "Premium heavyweight cotton hoodie...",
        "basePrice": "89.99",
        "isActive": true,
        "createdAt": "2025-12-04T14:41:23.902Z",
        "updatedAt": "2025-12-04T14:41:23.902Z",
        "images": [
          {
            "id": "cmirjneta0008swlkyh19l6ee",
            "url": "https://example.com/hoodie-black-front.jpg",
            "isMain": true,
            "altText": "Black hoodie front view"
          }
        ],
        "variants": [
          {
            "id": "cmirjneta0002swlk2ady2jap",
            "size": "S",
            "color": "Black",
            "stockQuantity": 50
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

#### Get Product by Slug
```
GET /products/classic-oversized-hoodie
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cmirjneta0001swlko15z50gr",
    "title": "Classic Oversized Hoodie",
    "slug": "classic-oversized-hoodie",
    "description": "Premium heavyweight cotton hoodie...",
    "basePrice": "89.99",
    "isActive": true,
    "images": [
      {
        "id": "cmirjneta0008swlkyh19l6ee",
        "url": "https://example.com/hoodie-black-front.jpg",
        "isMain": true,
        "altText": "Black hoodie front view"
      }
    ],
    "variants": [
      {
        "id": "cmirjneta0002swlk2ady2jap",
        "size": "S",
        "color": "Black",
        "stockQuantity": 50,
        "priceOverride": null,
        "sku": "HOD-BLK-S"
      }
    ]
  }
}
```

---

### Admin - Products

#### Create Product
```
POST /admin/products
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "title": "Limited Edition Jacket",
  "slug": "limited-edition-jacket",
  "description": "Exclusive limited edition jacket",
  "basePrice": 199.99,
  "isActive": true,
  "variants": [
    {
      "size": "M",
      "color": "Black",
      "stockQuantity": 50,
      "sku": "JAC-BLK-M",
      "priceOverride": 189.99
    }
  ],
  "images": [
    {
      "url": "https://example.com/jacket.jpg",
      "isMain": true,
      "altText": "Black jacket front view"
    }
  ]
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "cmirjnev2000aswlk3izq4uj4",
    "title": "Limited Edition Jacket",
    "slug": "limited-edition-jacket",
    "basePrice": "199.99",
    "variants": [...],
    "images": [...]
  }
}
```

#### Update Product
```
PATCH /admin/products/:id
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "title": "Updated Jacket Name",
  "basePrice": 179.99,
  "isActive": true
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "cmirjnev2000aswlk3izq4uj4",
    "title": "Updated Jacket Name",
    "basePrice": "179.99",
    "variants": [...],
    "images": [...]
  }
}
```

#### Delete Product
```
DELETE /admin/products/:id
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```
Note: Products with existing orders are soft-deleted (deactivated) instead of permanently deleted.

#### Update Variant Stock
```
PATCH /admin/variants/:variantId/stock
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "stockQuantity": 100
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": {
    "id": "cmirjneta0002swlk2ady2jap",
    "stockQuantity": 100,
    "product": {
      "title": "Classic Oversized Hoodie",
      "slug": "classic-oversized-hoodie"
    }
  }
}
```

#### Update Low Stock Threshold
```
PATCH /admin/products/:id/threshold
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "threshold": 10
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Low stock threshold updated successfully",
  "data": {
    "id": "cmirjneta0001swlko15z50gr",
    "title": "Classic Oversized Hoodie",
    "lowStockThreshold": 10
  }
}
```

---

### Admin - Orders

#### Get All Orders
```
GET /admin/orders?page=1&limit=20&status=PENDING
Authorization: Bearer <admin_token>
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### Get Order by ID (Admin)
```
GET /admin/orders/:id
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cmirke1dl0007swls5mmtiujm",
    "status": "PENDING",
    "totalAmount": "179.98",
    "user": { "id": "...", "email": "..." },
    "items": [...]
  }
}
```

#### Update Order Status
```
PATCH /admin/orders/:id/status
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "GH123456789",
  "trackingUrl": "https://tracking.example.com/GH123456789"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated to SHIPPED",
  "data": {
    "id": "cmirke1dl0007swls5mmtiujm",
    "status": "SHIPPED",
    "items": [...]
  }
}
```
Note: When status is updated to SHIPPED, a shipping notification email is sent to the customer.

---

### Admin - Reviews

#### Get All Reviews
```
GET /admin/reviews?page=1&limit=20&flagged=true
Authorization: Bearer <admin_token>
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `flagged` (optional): Filter flagged reviews only (true/false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "...",
        "rating": 5,
        "comment": "Great product!",
        "flagged": false,
        "user": { "id": "...", "email": "..." },
        "product": { "id": "...", "title": "...", "slug": "..." }
      }
    ],
    "pagination": { ... }
  }
}
```

#### Flag Review
```
PATCH /admin/reviews/:reviewId/flag
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "flagged": true,
  "flagReason": "Inappropriate content"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Review flagged successfully",
  "data": { ... }
}
```

#### Delete Review (Admin)
```
DELETE /admin/reviews/:reviewId
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

### Admin - Analytics

#### Get Sales Analytics
```
GET /admin/analytics?days=30
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000.00,
    "orderCount": 50,
    "averageOrderValue": 300.00,
    "salesOverTime": [...],
    "topProducts": [...],
    "ordersByStatus": [...]
  }
}
```

#### Get Quick Metrics
```
GET /admin/analytics/quick
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "thisMonthRevenue": 5000.00,
    "lastMonthRevenue": 4500.00,
    "revenueGrowth": 11.1,
    "thisMonthOrders": 20,
    "lastMonthOrders": 18,
    "todayOrders": 3,
    "pendingOrders": 5,
    "totalCustomers": 100
  }
}
```

---

### Admin - Inventory

#### Get Low Stock Alerts
```
GET /admin/inventory/alerts?threshold=5
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "lowStockItems": [...],
    "outOfStockCount": 2,
    "lowStockCount": 5,
    "criticalCount": 3
  }
}
```

#### Get Inventory Summary
```
GET /admin/inventory/summary
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "productId": "...",
      "title": "Classic Oversized Hoodie",
      "slug": "classic-oversized-hoodie",
      "totalStock": 150,
      "variantCount": 6,
      "outOfStockVariants": 0,
      "lowStockThreshold": 5
    }
  ]
}
```

---

### Orders

#### Create Order
```
POST /orders
Authorization: Bearer <token>
```
**Request:**
```json
{
  "items": [
    {
      "variantId": "cmirjneta0002swlk2ady2jap",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001",
    "country": "Nigeria",
    "phone": "+2348012345678"
  }
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "cmirke1dl0007swls5mmtiujm",
      "userId": "cmirjnev2000aswlk3izq4uj4",
      "status": "PENDING",
      "totalAmount": "179.98",
      "paymentRef": "ORD-1733318400000-ABC123XYZ",
      "shippingAddress": {...},
      "createdAt": "2025-12-04T14:41:23.966Z",
      "items": [
        {
          "id": "cmirke1dl0008swls5mmtiujm",
          "quantity": 2,
          "priceAtPurchase": "89.99",
          "variant": {
            "id": "cmirjneta0002swlk2ady2jap",
            "size": "S",
            "color": "Black",
            "product": {
              "title": "Classic Oversized Hoodie",
              "slug": "classic-oversized-hoodie"
            }
          }
        }
      ]
    },
    "payment": {
      "authorizationUrl": "https://checkout.paystack.com/...",
      "reference": "ORD-1733318400000-ABC123XYZ"
    }
  }
}
```

#### Get My Orders
```
GET /orders
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmirke1dl0007swls5mmtiujm",
      "userId": "cmirjnev2000aswlk3izq4uj4",
      "status": "PENDING",
      "totalAmount": "179.98",
      "paymentRef": "ORD-1733318400000-ABC123XYZ",
      "createdAt": "2025-12-04T14:41:23.966Z",
      "items": [...]
    }
  ]
}
```

#### Get Order by ID
```
GET /orders/:id
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cmirke1dl0007swls5mmtiujm",
    "userId": "cmirjnev2000aswlk3izq4uj4",
    "status": "PENDING",
    "totalAmount": "179.98",
    "items": [...]
  }
}
```

#### Verify Payment (Webhook)
```
POST /orders/verify
X-Paystack-Signature: <signature>
```
**Request Body (from Paystack):**
```json
{
  "data": {
    "reference": "ORD-1733318400000-ABC123XYZ",
    "status": "success",
    "amount": 17998,
    "paid_at": "2025-12-04T14:41:23.966Z"
  }
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "order": {
      "id": "cmirke1dl0007swls5mmtiujm",
      "status": "PAID"
    }
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Key Features

### Atomic Transactions
Orders use Prisma transactions to ensure:
- Stock availability is verified
- Stock is deducted atomically
- Order and items are created together
- No overselling possible even under concurrent requests

### Security
- Passwords hashed with bcrypt (12 rounds)
- JWT authentication with configurable expiry
- Admin role-based access control
- Input validation with Zod
- Helmet security headers
- CORS protection

### Inventory Management
- Real-time stock tracking
- Variant-level stock control (size/color combinations)
- Automatic stock deduction on order creation
- Stock restoration on payment failure

### Payment Integration
- Paystack API integration ready
- Webhook signature verification
- Payment status tracking
- Order status updates on payment confirmation

---

## Sample Credentials

**Admin Account:**
- Email: `admin@streetwear.com`
- Password: `admin123`

**Sample Products:**
1. Classic Oversized Hoodie - ₦89.99
2. Graphic Tee - Free The Youth - ₦45.00

---

## Development

### Start Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Database Commands
```bash
npm run db:push      # Sync schema with database
npm run db:migrate   # Create migration
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

### Type Checking
```bash
npm run typecheck
```
