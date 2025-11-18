# API Reference

## Base URL

```
http://localhost:3000/api
```

## Response Format

All API endpoints return JSON responses in a standard format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {}  // Optional additional context
  }
}
```

## Authentication

Currently, the API does not require authentication. This will be added in a future version.

---

## Slide Plans

### Generate New Slide Plan

**POST** `/api/generate`

Generates a new slide plan using AI.

#### Request Body

```json
{
  "title": "string (required, 1-200 chars)",
  "audience": "string (required, 1-100 chars)",
  "durationMinutes": "number (required, 1-180)",
  "keywords": "string (optional, max 500 chars)",
  "templateId": "string (optional)",
  "userId": "string (optional)",
  "tags": ["string"] // optional
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "plan_1234567890_abc123",
      "title": "Introduction to Rust Programming",
      "audience": "Intermediate developers",
      "durationMinutes": 45,
      "keywords": "Rust, systems programming",
      "outlineMarkdown": "# Slide 1\n- Point 1\n...",
      "templateId": null,
      "userId": null,
      "tags": [],
      "metadata": {},
      "version": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Status Codes

- `201 Created`: Plan generated successfully
- `400 Bad Request`: Invalid input
- `500 Internal Server Error`: Generation failed

---

### List All Plans

**GET** `/api/plans`

Retrieve a paginated list of slide plans.

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number (1-indexed) | 1 |
| limit | number | Items per page | 10 |
| userId | string | Filter by user ID | - |
| tags | string | Comma-separated tags | - |
| search | string | Search in title/keywords | - |
| minDuration | number | Minimum duration in minutes | - |
| maxDuration | number | Maximum duration in minutes | - |
| sortBy | string | Field to sort by | createdAt |
| sortOrder | asc\|desc | Sort order | desc |

#### Example Request

```
GET /api/plans?page=1&limit=10&tags=rust,programming&sortBy=createdAt&sortOrder=desc
```

#### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "plan_123",
        "title": "...",
        // ... full plan object
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### Get Plan by ID

**GET** `/api/plans/[id]`

Retrieve a specific slide plan.

#### Parameters

- `id` (path): Plan ID

#### Response

```json
{
  "success": true,
  "data": {
    "plan": {
      // Full plan object
    }
  }
}
```

#### Status Codes

- `200 OK`: Plan found
- `404 Not Found`: Plan does not exist

---

### Update Plan

**PUT** `/api/plans/[id]`

Update an existing slide plan.

#### Request Body

All fields are optional. Only provided fields will be updated.

```json
{
  "title": "string",
  "audience": "string",
  "durationMinutes": "number",
  "keywords": "string",
  "tags": ["string"]
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "plan": {
      // Updated plan object
    }
  }
}
```

---

### Delete Plan

**DELETE** `/api/plans/[id]`

Delete a slide plan.

#### Response

```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

---

## Templates

### Create Template

**POST** `/api/templates`

Create a new slide template.

#### Request Body

```json
{
  "name": "string (required, 1-100 chars)",
  "description": "string (required, 1-500 chars)",
  "category": "technology|business|academic|training|sales|general",
  "structure": "string (required, markdown template)",
  "tags": ["string"], // optional
  "isPublic": "boolean", // optional, default false
  "userId": "string" // optional
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "template": {
      "id": "template_123",
      "name": "Technology Introduction Template",
      "description": "Perfect for introducing new technologies",
      "category": "technology",
      "structure": "# Introduction\n...",
      "tags": ["tech", "intro"],
      "isPublic": true,
      "userId": null,
      "usageCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### List Templates

**GET** `/api/templates`

Retrieve a paginated list of templates.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| category | string | Filter by category |
| isPublic | boolean | Filter public/private |
| tags | string | Comma-separated tags |
| search | string | Search in name/description |
| sortBy | string | Sort field |
| sortOrder | asc\|desc | Sort order |

---

### Get Template by ID

**GET** `/api/templates/[id]`

---

### Update Template

**PUT** `/api/templates/[id]`

---

### Delete Template

**DELETE** `/api/templates/[id]`

---

## Presentations

### Create Presentation

**POST** `/api/presentations`

Create a new presentation (scheduled or draft).

#### Request Body

```json
{
  "planId": "string (required)",
  "title": "string (required, 1-200 chars)",
  "venue": "string (optional, max 200 chars)",
  "scheduledAt": "string (optional, ISO 8601 datetime)",
  "userId": "string (optional)",
  "notes": "string (optional, max 2000 chars)"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "presentation": {
      "id": "presentation_123",
      "planId": "plan_456",
      "title": "My Presentation",
      "status": "draft",
      "venue": null,
      "scheduledAt": null,
      "deliveredAt": null,
      "audienceSize": null,
      "feedback": null,
      "notes": null,
      "userId": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### List Presentations

**GET** `/api/presentations`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| userId | string | Filter by user |
| status | draft\|upcoming\|delivered\|cancelled | Filter by status |
| dateFrom | string | ISO date (scheduled/delivered) |
| dateTo | string | ISO date (scheduled/delivered) |
| sortBy | string | Sort field |
| sortOrder | asc\|desc | Sort order |

---

### Get Presentation by ID

**GET** `/api/presentations/[id]`

---

### Update Presentation

**PUT** `/api/presentations/[id]`

Update presentation details.

#### Request Body

All fields optional:

```json
{
  "status": "draft|upcoming|delivered|cancelled",
  "deliveredAt": "string (ISO 8601)",
  "venue": "string",
  "audienceSize": "number",
  "feedback": "string",
  "notes": "string"
}
```

---

### Delete Presentation

**DELETE** `/api/presentations/[id]`

---

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| NOT_FOUND | Resource not found |
| PLAN_NOT_FOUND | Referenced plan not found |
| API_KEY_MISSING | AI provider API key not configured |
| PROVIDER_ERROR | AI provider request failed |
| STORAGE_ERROR | File storage operation failed |
| INTERNAL_ERROR | Unexpected server error |

---

## Rate Limiting

Currently no rate limiting is implemented. Future versions will include:

- Per-IP rate limiting
- Per-user rate limiting (when auth is added)
- Exponential backoff recommendations

---

## Pagination

All list endpoints support pagination with consistent parameters:

- `page`: 1-indexed page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

## Filtering & Search

### Search

The `search` parameter performs case-insensitive substring matching on:

- Plans: `title`, `keywords`, `audience`
- Templates: `name`, `description`
- Presentations: `title`, `venue`

### Tags

The `tags` parameter accepts comma-separated values (OR logic):

```
?tags=rust,programming  // Matches items with 'rust' OR 'programming'
```

### Date Ranges

For presentations, filter by date:

```
?dateFrom=2024-01-01&dateTo=2024-12-31
```

---

## Examples

### Complete Flow: Create Plan → Create Presentation → Mark as Delivered

```bash
# 1. Generate slide plan
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Rust",
    "audience": "Developers",
    "durationMinutes": 45,
    "keywords": "rust, programming"
  }'
# Returns: { "success": true, "data": { "plan": { "id": "plan_123", ... } } }

# 2. Create presentation
curl -X POST http://localhost:3000/api/presentations \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan_123",
    "title": "Introduction to Rust",
    "venue": "Tech Conference 2024",
    "scheduledAt": "2024-06-15T14:00:00Z"
  }'
# Returns: { "success": true, "data": { "presentation": { "id": "pres_456", ... } } }

# 3. Mark as delivered
curl -X PUT http://localhost:3000/api/presentations/pres_456 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered",
    "deliveredAt": "2024-06-15T14:45:00Z",
    "audienceSize": 85,
    "feedback": "Great session!"
  }'
```

---

## WebSocket API

Not currently implemented. Future versions may include real-time features:

- Live collaboration on slides
- Real-time generation progress
- Notifications

---

## Versioning

API version is currently `v1` (implicit). Future versions will use explicit versioning:

```
/api/v1/plans
/api/v2/plans  # Future
```

Breaking changes will increment the major version.
