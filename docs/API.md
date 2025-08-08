# API Documentation

CodeCrafter Backend API provides endpoints for code generation and audio transcription.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://your-backend-url.com`

## Authentication

Currently, the API doesn't require authentication. In production, consider implementing:
- API keys
- JWT tokens
- OAuth 2.0

## Endpoints

### Health Check

#### GET /

Check if the API is running.

**Response:**
```json
{
  "message": "CodeCrafter API is running!"
}
```

### Generate Code

#### POST /generate-code

Generate code based on user idea and store it in the database.

**Request Body:**
```json
{
  "idea": "string (required) - Description of the app idea"
}
```

**Example Request:**
```json
{
  "idea": "Create a todo app with user authentication"
}
```

**Response:**
```json
{
  "id": "number - Database record ID",
  "idea": "string - The original idea",
  "code": "string - Generated code snippet",
  "generated_at": "string - ISO timestamp"
}
```

**Example Response:**
```json
{
  "id": 1,
  "idea": "Create a todo app with user authentication",
  "code": "// Todo App Component\nimport React, { useState } from 'react';\n\n...",
  "generated_at": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Missing or empty idea
  ```json
  {
    "error": "Idea is required"
  }
  ```

- `500 Internal Server Error`: Database or server error
  ```json
  {
    "error": "Failed to save to database"
  }
  ```

### Audio Transcription

#### POST /transcribe

Transcribe audio to text using AWS Transcribe (currently returns mock data).

**Request Body:**
```json
{
  "audio": "string (required) - Base64 encoded audio data"
}
```

**Example Request:**
```json
{
  "audio": "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
}
```

**Response:**
```json
{
  "transcription": "string - Transcribed text"
}
```

**Example Response:**
```json
{
  "transcription": "Create a todo application with user authentication"
}
```

**Error Responses:**

- `400 Bad Request`: Missing audio data
  ```json
  {
    "error": "Audio data is required"
  }
  ```

- `500 Internal Server Error`: Transcription service error
  ```json
  {
    "error": "Transcription failed"
  }
  ```

## Code Templates

The API includes several pre-built code templates that are selected based on keywords in the user's idea:

### Todo Template
**Triggered by:** "todo", "task"
**Generates:** React component with todo list functionality

### Weather Template
**Triggered by:** "weather"
**Generates:** React component with weather display

### Default Template
**Triggered by:** Any other input
**Generates:** Basic React counter component

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider:
- Request rate limits per IP
- User-based quotas
- API key-based limits

## CORS Configuration

The API is configured to accept requests from all origins during development. For production:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

HTTP status codes used:
- `200`: Success
- `400`: Bad Request (client error)
- `500`: Internal Server Error

## Database Schema

### generated_code Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key, auto-increment |
| idea | TEXT | User's app idea (required) |
| generated_at | TIMESTAMP | Creation timestamp with timezone |

**Indexes:**
- Primary key on `id`
- Index on `generated_at` for performance

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| SUPABASE_URL | Supabase project URL | https://abc123.supabase.co |
| SUPABASE_ANON_KEY | Supabase anonymous key | eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... |
| AWS_ACCESS_KEY_ID | AWS access key | AKIAIOSFODNN7EXAMPLE |
| AWS_SECRET_ACCESS_KEY | AWS secret key | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| AWS_REGION | AWS region | us-east-1 |
| PORT | Server port | 3001 |

## Testing

### Manual Testing

Use curl or Postman to test endpoints:

```bash
# Health check
curl http://localhost:3001/

# Generate code
curl -X POST http://localhost:3001/generate-code \
  -H "Content-Type: application/json" \
  -d '{"idea": "Create a todo app"}'

# Transcribe audio (mock)
curl -X POST http://localhost:3001/transcribe \
  -H "Content-Type: application/json" \
  -d '{"audio": "base64_audio_data"}'
```

### Automated Testing

Consider adding tests with Jest and Supertest:

```javascript
const request = require('supertest');
const app = require('./server');

describe('POST /generate-code', () => {
  it('should generate code for valid idea', async () => {
    const response = await request(app)
      .post('/generate-code')
      .send({ idea: 'Create a todo app' })
      .expect(200);
    
    expect(response.body).toHaveProperty('code');
    expect(response.body).toHaveProperty('id');
  });
});
```

## Future Enhancements

1. **Authentication**
   - User registration/login
   - JWT token validation
   - User-specific code history

2. **Advanced Code Generation**
   - AI-powered code generation
   - Multiple framework support
   - Custom templates

3. **Real Audio Transcription**
   - AWS Transcribe integration
   - Multiple language support
   - Real-time transcription

4. **Analytics**
   - Usage tracking
   - Popular ideas analysis
   - Performance metrics

5. **Caching**
   - Redis for frequently generated code
   - Template caching
   - Response caching