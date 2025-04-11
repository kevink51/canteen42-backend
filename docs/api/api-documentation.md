# API Documentation

This document provides detailed information about the CANTEEN42 API endpoints, request/response formats, and authentication requirements.

## Authentication

### Register a new user

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "token": "firebase-jwt-token"
}
```

### Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer firebase-jwt-token
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "customer",
    "phone": "123-456-7890",
    "addresses": [
      {
        "name": "Home",
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "USA",
        "phone": "123-456-7890"
      }
    ]
  }
}
```

## Products

### Get All Products

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (default: "createdAt")
- `order`: Sort order ("asc" or "desc", default: "desc")
- `category`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search term

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "product123",
      "name": "Camping Tent",
      "description": "4-person camping tent",
      "price": 129.99,
      "category": "Tents",
      "images": ["https://example.com/tent.jpg"],
      "inventory": 25
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "product123",
    "name": "Camping Tent",
    "description": "4-person camping tent",
    "price": 129.99,
    "salePrice": 99.99,
    "category": "Tents",
    "subcategory": "Family Tents",
    "images": ["https://example.com/tent.jpg"],
    "inventory": 25,
    "sku": "TENT-001",
    "weight": 5.2,
    "dimensions": {
      "length": 24,
      "width": 18,
      "height": 8
    },
    "features": [
      "Waterproof",
      "Easy setup",
      "Includes rainfly"
    ],
    "specifications": {
      "material": "Polyester",
      "poles": "Aluminum",
      "capacity": 4
    },
    "variants": [
      {
        "color": "Blue",
        "sku": "TENT-001-BLU",
        "inventory": 15
      },
      {
        "color": "Green",
        "sku": "TENT-001-GRN",
        "inventory": 10
      }
    ],
    "tags": ["camping", "outdoor", "tent"],
    "brand": "OutdoorPro",
    "isActive": true,
    "isFeatured": true,
    "ratings": {
      "average": 4.5,
      "count": 28
    }
  }
}
```

## Orders

### Create New Order

**Endpoint:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer firebase-jwt-token
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product123",
      "quantity": 1,
      "price": 129.99
    }
  ],
  "subtotal": 129.99,
  "tax": 10.40,
  "shipping": 5.99,
  "discount": 0,
  "total": 146.38,
  "paymentMethod": "stripe",
  "paymentId": "pi_123456",
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA",
    "phone": "123-456-7890"
  },
  "billingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA",
    "phone": "123-456-7890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order123",
    "userId": "user123",
    "items": [
      {
        "productId": "product123",
        "name": "Camping Tent",
        "quantity": 1,
        "price": 129.99
      }
    ],
    "subtotal": 129.99,
    "tax": 10.40,
    "shipping": 5.99,
    "discount": 0,
    "total": 146.38,
    "paymentMethod": "stripe",
    "paymentId": "pi_123456",
    "status": "processing",
    "shippingAddress": {
      "name": "John Doe",
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA",
      "phone": "123-456-7890"
    },
    "createdAt": "2025-04-09T05:07:12.000Z"
  }
}
```

## Admin Endpoints

### Admin Login Verification

**Endpoint:** `POST /api/admin/login/verify`

**Request Body:**
```json
{
  "idToken": "firebase-jwt-token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "admin123",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Get Dashboard Overview

**Endpoint:** `GET /api/admin/dashboard/overview`

**Headers:**
```
Authorization: Bearer firebase-jwt-token
```

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "counts": {
      "products": 150,
      "orders": 75,
      "users": 250,
      "categories": 12
    },
    "revenue": {
      "total": 12500.75,
      "monthly": 2750.50
    },
    "recentOrders": [
      {
        "id": "order123",
        "shippingAddress": {
          "name": "John Doe"
        },
        "createdAt": "2025-04-09T05:07:12.000Z",
        "status": "processing",
        "total": 146.38
      }
    ],
    "topProducts": [
      {
        "id": "product123",
        "name": "Camping Tent",
        "price": 129.99,
        "sales": 25,
        "inventory": 15
      }
    ]
  }
}
```

## Payment Processing

### Process Stripe Payment

**Endpoint:** `POST /api/payments/stripe`

**Headers:**
```
Authorization: Bearer firebase-jwt-token
```

**Request Body:**
```json
{
  "amount": 146.38,
  "currency": "usd",
  "paymentMethodId": "pm_123456",
  "description": "Order #123",
  "metadata": {
    "orderId": "order123"
  },
  "orderData": {
    "items": [
      {
        "productId": "product123",
        "quantity": 1,
        "price": 129.99
      }
    ],
    "subtotal": 129.99,
    "tax": 10.40,
    "shipping": 5.99,
    "discount": 0,
    "total": 146.38,
    "shippingAddress": {
      "name": "John Doe",
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA",
      "phone": "123-456-7890"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "paymentId": "pi_123456",
    "status": "succeeded"
  },
  "order": {
    "id": "order123",
    "status": "processing",
    "paymentId": "pi_123456",
    "paymentStatus": "succeeded"
  }
}
```

## Dropshipping

### Get Products from Supplier

**Endpoint:** `GET /api/dropshipping/:supplierId/products`

**Headers:**
```
Authorization: Bearer firebase-jwt-token
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "SUP-001",
      "name": "Camping Tent",
      "description": "Waterproof 4-person camping tent",
      "price": 89.99,
      "inventory": 45,
      "category": "Tents",
      "images": ["https://example.com/tent1.jpg"]
    }
  ],
  "supplier": {
    "id": "supplier123",
    "name": "OutdoorWholesale"
  }
}
```

### Import Product from Supplier

**Endpoint:** `POST /api/dropshipping/:supplierId/import/:productId`

**Headers:**
```
Authorization: Bearer firebase-jwt-token
```

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "product456",
    "name": "Imported Product",
    "description": "This is an imported product from the supplier",
    "price": 29.99,
    "inventory": 15,
    "category": "Outdoor Gear",
    "images": ["https://example.com/product.jpg"],
    "supplierId": "supplier123",
    "supplierProductId": "SUP-001"
  },
  "supplier": {
    "id": "supplier123",
    "name": "OutdoorWholesale"
  }
}
```
