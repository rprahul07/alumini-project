# Alumni Management System API Documentation

## Base URL
```
http://localhost:5001
```

## Authentication Endpoints

### Register/Signup
```http
POST /api/auth/register
POST /api/auth/signup
```

Both endpoints perform the same registration function.

#### Request Body
```json
{
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "role": "student | alumni | faculty",
  // Role-specific fields
  // For Student:
  "department": "string",
  "currentSemester": "string",
  "rollNumber": "string",
  // For Alumni:
  "department": "string",
  "graduationYear": "number",
  "currentJobTitle": "string",
  "companyName": "string",
  // For Faculty:
  "department": "string",
  "designation": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "number",
    "fullName": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Login
```http
POST /api/auth/login
```

Rate-limited endpoint for user authentication.

#### Request Body
```json
{
  "email": "string",
  "password": "string",
  "role": "student | alumni | faculty"
}
```

#### Response
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "_id": "number",
    "fullName": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

Protected endpoint requiring authentication.

#### Response
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Check Authentication
```http
GET /api/auth/check
```

Protected endpoint to verify authentication status.

#### Response
```json
{
  "success": true,
  "message": "User authenticated",
  "data": {
    "_id": "number",
    "fullName": "string",
    "email": "string",
    "role": "string"
  }
}
```

## Security Endpoints

### CSRF Token
```http
GET /api/csrf-token
```

Endpoint to obtain CSRF token for form submissions.

#### Response
```json
{
  "csrfToken": "string"
}
```

### Health Check
```http
GET /
```

Simple endpoint to verify server status.

#### Response
```json
{
  "message": "Server is running"
}
```

## Security Features

### Rate Limiting
- Login endpoint is rate-limited to prevent brute force attacks
- Configurable time window and maximum attempts

### JWT Authentication
- Protected routes require valid JWT token
- Token delivered via HTTP-only cookie
- Automatic token verification and role checking

### CORS Configuration
- Origin: http://localhost:3000
- Credentials: true
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers:
  - Content-Type
  - Authorization
  - X-CSRF-Token
  - X-Requested-With
  - Accept
  - Origin

### Error Handling
- Database errors (Prisma)
- Validation errors
- Authentication errors
- General server errors

## Usage Examples

### Registration Example
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "StrongPass123!",
  "confirmPassword": "StrongPass123!",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "role": "student",
  "department": "Computer Science",
  "currentSemester": "5",
  "rollNumber": "CS123"
}
```

### Login Example
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "StrongPass123!",
  "role": "student"
}
```

### Protected Route Example
```http
GET /api/auth/check
Cookie: jwt=<token>
X-CSRF-Token: <csrf_token>
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### Database Error
```json
{
  "success": false,
  "message": "Database operation failed"
}
``` 