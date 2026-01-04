# Clarify Site - API Documentation

**Version**: 1.0.0  
**Base URL**: `https://api.clarify.example.com` (production) | `http://localhost:5000` (development)  
**Authentication**: JWT Bearer Token  
**Last Updated**: January 04, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Downloads](#downloads)
4. [Contact](#contact)
5. [Newsletter](#newsletter)
6. [Admin](#admin)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## Authentication

### Register

**POST** `/api/auth/register`

Create a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!@#"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-04T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules**:
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain uppercase, lowercase, number, special character

---

### Login

**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!@#"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `401 Unauthorized`: Invalid credentials
- `404 Not Found`: User not found

---

### Logout

**POST** `/api/auth/logout`

Invalidate the current JWT token.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

### Forgot Password

**POST** `/api/auth/forgot-password`

Request a password reset email.

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset email sent"
}
```

**Notes**:
- Reset token expires in 1 hour
- Email contains link: `/reset-password/{token}`

---

### Reset Password

**POST** `/api/auth/reset-password/:token`

Reset password using token from email.

**Request Body**:
```json
{
  "password": "NewSecurePass123!@#"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset successfully"
}
```

**Errors**:
- `400 Bad Request`: Invalid or expired token
- `400 Bad Request`: Weak password

---

## Users

### Get Current User

**GET** `/api/users/me`

Get authenticated user's profile.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2026-01-04T12:00:00.000Z"
}
```

---

### Update Profile

**PUT** `/api/users/me`

Update user profile (name, avatar).

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "email": "john@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

---

### Change Password

**PUT** `/api/users/me/password`

Change user password.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "currentPassword": "OldPass123!@#",
  "newPassword": "NewPass123!@#"
}
```

**Response** (200 OK):
```json
{
  "message": "Password changed successfully"
}
```

**Errors**:
- `401 Unauthorized`: Current password incorrect
- `400 Bad Request`: Weak new password

---

### Delete Account

**DELETE** `/api/users/me`

Soft delete user account.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "message": "Account deleted successfully"
}
```

**Notes**:
- Account is soft-deleted (isDeleted=true)
- Can be restored within 30 days by admins

---

## Downloads

### Track Download

**POST** `/api/downloads`

Track a software download.

**Request Body**:
```json
{
  "version": "2.9.111",
  "os": "Windows",
  "email": "user@example.com"
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "version": "2.9.111",
  "os": "Windows",
  "email": "user@example.com",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2026-01-04T12:00:00.000Z"
}
```

**Validation**:
- `version`: Required
- `os`: Required, one of: "Windows", "macOS", "Linux"
- `email`: Optional, valid email format

---

### Get Download Statistics

**GET** `/api/downloads/stats`

Get download statistics (public).

**Response** (200 OK):
```json
{
  "total": 50421,
  "today": 142,
  "thisWeek": 1247,
  "thisMonth": 5891,
  "byPlatform": {
    "Windows": 30254,
    "macOS": 12087,
    "Linux": 8080
  },
  "byVersion": {
    "2.9.111": 15234,
    "2.9.110": 12456,
    "2.9.109": 8932
  }
}
```

---

### Get All Downloads (Admin)

**GET** `/api/downloads`

Get all download records (admin only).

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `os`: Filter by OS
- `version`: Filter by version

**Response** (200 OK):
```json
{
  "downloads": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "version": "2.9.111",
      "os": "Windows",
      "email": "user@example.com",
      "ipAddress": "192.168.1.1",
      "createdAt": "2026-01-04T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50421,
    "page": 1,
    "pages": 1009,
    "limit": 50
  }
}
```

---

## Contact

### Submit Contact Form

**POST** `/api/contact`

Submit a contact message.

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company": "Acme Corp",
  "message": "I'm interested in Clarify for my team..."
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company": "Acme Corp",
  "message": "I'm interested in Clarify...",
  "status": "pending",
  "createdAt": "2026-01-04T12:00:00.000Z"
}
```

**Validation**:
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `company`: Optional, max 100 characters
- `message`: Required, 10-5000 characters

**Rate Limit**: 5 requests per hour per IP

---

### Get All Contacts (Admin)

**GET** `/api/contacts`

Get all contact messages (admin only).

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `status`: Filter by status (pending/contacted/resolved)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response** (200 OK):
```json
{
  "contacts": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "company": "Acme Corp",
      "message": "I'm interested in Clarify...",
      "status": "pending",
      "createdAt": "2026-01-04T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 234,
    "page": 1,
    "pages": 5,
    "limit": 50
  }
}
```

---

### Update Contact Status (Admin)

**PATCH** `/api/contacts/:id`

Update contact message status.

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request Body**:
```json
{
  "status": "contacted"
}
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "contacted",
  "updatedAt": "2026-01-04T12:30:00.000Z"
}
```

**Valid Status Values**: `pending`, `contacted`, `resolved`

---

### Delete Contact (Admin)

**DELETE** `/api/contacts/:id`

Delete a contact message.

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200 OK):
```json
{
  "message": "Contact deleted successfully"
}
```

---

## Newsletter

### Subscribe

**POST** `/api/newsletter/subscribe`

Subscribe to newsletter for release notifications.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "email": "user@example.com",
  "active": true,
  "createdAt": "2026-01-04T12:00:00.000Z"
}
```

**Rate Limit**: 3 subscriptions per hour per IP

---

### Unsubscribe

**POST** `/api/newsletter/unsubscribe`

Unsubscribe from newsletter.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "Unsubscribed successfully"
}
```

---

## Admin

### Get All Users (Admin)

**GET** `/api/admin/users`

Get all users (admin only).

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `search`: Search by name or email
- `role`: Filter by role (user/admin)

**Response** (200 OK):
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-01-04T12:00:00.000Z",
      "isBanned": false
    }
  ],
  "pagination": {
    "total": 1234,
    "page": 1,
    "pages": 25,
    "limit": 50
  }
}
```

---

### Ban User (Admin)

**PUT** `/api/admin/users/:id/ban`

Ban a user account.

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200 OK):
```json
{
  "message": "User banned successfully"
}
```

---

### Unban User (Admin)

**PUT** `/api/admin/users/:id/unban`

Unban a user account.

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200 OK):
```json
{
  "message": "User unbanned successfully"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or invalid input
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Global | 100 requests / 15 minutes per IP |
| `/api/auth/*` | 5 requests / 15 minutes per IP |
| `/api/contact` | 5 requests / 1 hour per IP |
| `/api/newsletter/subscribe` | 3 requests / 1 hour per IP |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

**Rate Limit Response** (429):
```json
{
  "message": "Too many requests, please try again later"
}
```

---

## Security

### Authentication

- JWT tokens with 7-day expiration
- Secure HTTP-only cookies for token storage
- Refresh tokens with 30-day expiration

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Security Headers

- Helmet.js for security headers
- CORS with whitelist
- HSTS enabled
- CSP (Content Security Policy)
- XSS Protection

### Input Sanitization

- MongoDB injection prevention
- XSS prevention on all inputs
- Request payload size limits (10MB)

---

## Testing

Test the API with curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test123!@#"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# Get profile (with token)
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Track download
curl -X POST http://localhost:5000/api/downloads \
  -H "Content-Type: application/json" \
  -d '{"version":"2.9.111","os":"Windows","email":"user@test.com"}'

# Get download stats
curl -X GET http://localhost:5000/api/downloads/stats

# Submit contact
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello World!"}'
```

---

**Last Updated**: January 04, 2026  
**Maintained by**: Clarify Development Team
