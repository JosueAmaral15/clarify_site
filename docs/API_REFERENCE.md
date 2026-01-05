# API Reference - Clarify Site

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

## Downloads

### Track Download
```http
POST /downloads/track
Content-Type: application/json

{
  "platform": "windows",
  "version": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "downloadId": "download_id_123"
}
```

**Platform Options:** `windows`, `macos`, `linux`

**Status Codes:**
- `200 OK` - Download tracked successfully
- `400 Bad Request` - Invalid platform
- `500 Internal Server Error` - Server error

---

### Get Download Statistics (Protected)
```http
GET /downloads/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total": 1250,
  "byPlatform": {
    "windows": 650,
    "macos": 400,
    "linux": 200
  },
  "byDate": [
    {
      "_id": "2026-01-01",
      "count": 45
    }
  ],
  "recent": [
    {
      "_id": "download_id",
      "platform": "windows",
      "version": "1.0.0",
      "timestamp": "2026-01-04T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Statistics retrieved
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

## Contacts

### Submit Contact Form
```http
POST /contacts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in Clarify software"
}
```

**Response:**
```json
{
  "success": true,
  "contactId": "contact_id_123"
}
```

**Validation:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `message`: Required, 10-1000 characters

**Status Codes:**
- `200 OK` - Contact submitted successfully
- `400 Bad Request` - Validation errors
- `500 Internal Server Error` - Server error

---

### Get All Contacts (Protected)
```http
GET /contacts
Authorization: Bearer <token>
```

**Response:**
```json
{
  "contacts": [
    {
      "_id": "contact_id",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "I'm interested in Clarify software",
      "status": "new",
      "createdAt": "2026-01-04T10:30:00Z"
    }
  ],
  "total": 45
}
```

**Status Codes:**
- `200 OK` - Contacts retrieved
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

### Update Contact Status (Protected)
```http
PUT /contacts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "contacted"
}
```

**Status Options:** `new`, `contacted`, `resolved`

**Response:**
```json
{
  "success": true,
  "contact": {
    "_id": "contact_id",
    "status": "contacted"
  }
}
```

**Status Codes:**
- `200 OK` - Status updated
- `400 Bad Request` - Invalid status
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Contact not found
- `500 Internal Server Error` - Server error

---

### Delete Contact (Protected)
```http
DELETE /contacts/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Contact deleted
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Contact not found
- `500 Internal Server Error` - Server error

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes
- `200 OK` - Request successful
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- Public endpoints: 100 requests per 15 minutes per IP
- Protected endpoints: 1000 requests per 15 minutes per token

---

## CORS

The API supports CORS for the following origins:
- Development: `http://localhost:5173`
- Production: Your configured domain

---

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (production only)

---

## Authentication Flow

1. User submits credentials to `/api/auth/login`
2. Server validates and returns JWT token
3. Client stores token (localStorage/sessionStorage)
4. Client includes token in Authorization header for protected routes
5. Token expires after 24 hours
6. User must login again after expiration

---

## Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

### Test Download Tracking
```bash
curl -X POST http://localhost:5000/api/downloads/track \
  -H "Content-Type: application/json" \
  -d '{"platform":"windows","version":"1.0.0"}'
```

### Test Contact Submission
```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/downloads/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
