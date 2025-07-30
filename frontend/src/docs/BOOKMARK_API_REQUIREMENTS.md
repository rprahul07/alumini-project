# Bookmark API Implementation Guide

## Required Backend API Endpoints

The frontend bookmark functionality expects the following API endpoints to be implemented:

### 1. Get User's Bookmarks
```
GET /api/bookmarks
```
**Description**: Retrieve all bookmarked alumni for the current authenticated user.

**Response Format**:
```json
{
  "success": true,
  "message": "Bookmarks retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 123,
      "alumniId": 456,
      "createdAt": "2025-07-28T12:00:00Z"
    }
  ]
}
```

### 2. Add Bookmark
```
POST /api/bookmarks
```
**Request Body**:
```json
{
  "alumniId": 456
}
```

**Response Format**:
```json
{
  "success": true,
  "message": "Alumni bookmarked successfully",
  "data": {
    "id": 1,
    "userId": 123,
    "alumniId": 456,
    "createdAt": "2025-07-28T12:00:00Z"
  }
}
```

### 3. Remove Bookmark
```
DELETE /api/bookmarks/:alumniId
```
**Description**: Remove the bookmark for the specified alumni ID.

**Response Format**:
```json
{
  "success": true,
  "message": "Alumni removed from bookmarks",
  "data": null
}
```



## Error Handling
The frontend handles the following error scenarios:
- Network errors (connection issues)
- 401 Unauthorized (invalid/expired token)
- 404 Not Found (alumni doesn't exist)
- 409 Conflict (trying to bookmark already bookmarked alumni)
- 500 Server Error (database issues)

## Implementation Notes
1. Add bookmark routes to the appropriate user routes file (student_routes.js, alumni_routes.js, etc.)
2. Create a bookmark controller with the three main functions
3. Ensure proper error handling and response formatting
4. Add database indexes on user_id and alumni_id for performance
5. Consider rate limiting to prevent spam bookmarking
