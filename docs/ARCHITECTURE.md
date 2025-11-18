# Architecture Documentation

## Overview

The AI Seminar Slide Generator is a Next.js-based application that uses AI to generate presentation slide outlines. It follows a layered architecture with clear separation of concerns and extensibility points.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Next.js    │  │   API        │  │   CLI        │          │
│  │   Pages      │  │   Routes     │  │   Tool       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        Business Logic Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Domain     │  │   Services   │  │   Events     │          │
│  │   Models     │  │              │  │   System     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Storage    │  │   AI         │  │   Logging &  │          │
│  │   Layer      │  │   Providers  │  │   Metrics    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Domain Layer (`lib/types.ts`)

Defines the core business entities:

- **SlidePlan**: The main entity representing a slide presentation outline
- **SlideTemplate**: Reusable templates for different presentation types
- **Presentation**: Tracking of actual presentations delivered
- **User**: User accounts and preferences
- **GenerationHistory**: Audit log of AI generation requests

#### Key Design Decisions

- **Immutable IDs**: All entities use generated unique IDs
- **Timestamps**: All entities track `createdAt` and `updatedAt`
- **Versioning**: SlidePlan includes versioning for future edit history
- **Metadata**: Extensible metadata field for custom attributes

### 2. Storage Layer (`lib/storage/`)

File-based persistence using JSON files. Organized by entity type:

```
data/
├── plans/          # SlidePlan entities
├── templates/      # SlideTemplate entities
├── presentations/  # Presentation entities
└── users/          # User entities
```

#### Storage Architecture

- **Base Module** (`base.ts`): Common utilities for all storage
- **Entity Modules**: Specialized CRUD operations per entity
  - `templates.ts`
  - `presentations.ts`
  - `users.ts`
- **Legacy Support**: Backward compatibility for old data structure

#### Features

- **Pagination**: All list operations support pagination
- **Filtering**: Rich filtering capabilities (search, tags, dates)
- **Sorting**: Configurable sort order
- **Atomic Operations**: File writes are atomic

### 3. AI Provider System (`lib/providers/`)

Pluggable architecture for AI slide generation:

```
ISlideGeneratorProvider
├── AnthropicProvider (default)
├── OpenAIProvider
└── MockProvider (testing)
```

#### Provider Interface

```typescript
interface ISlideGeneratorProvider {
  readonly name: string;
  generateOutline(input: SlidePlanInput): Promise<SlideGenerationResult>;
  isConfigured(): boolean;
  getMetadata(): ProviderMetadata;
}
```

#### Configuration

Providers are selected via environment variable:

```bash
AI_PROVIDER=anthropic  # default
AI_PROVIDER=openai
AI_PROVIDER=mock
```

### 4. Event System (`lib/events/`)

Domain event architecture for extensibility:

```
EventBus
├── Domain Events (plan.created, template.used, etc.)
└── Adapters
    ├── LoggingAdapter
    ├── AnalyticsAdapter
    └── NotificationAdapter
```

#### Event Flow

```
1. Action occurs (e.g., plan created)
2. Event published to EventBus
3. All subscribers receive event
4. Adapters process event (log, track metrics, notify)
```

### 5. API Layer (`app/api/`)

REST API endpoints following Next.js App Router conventions:

- **POST /api/generate**: Generate new slide plan
- **GET /api/plans**: List all plans
- **GET /api/plans/[id]**: Get plan details
- **PUT /api/plans/[id]**: Update plan
- **DELETE /api/plans/[id]**: Delete plan
- **CRUD /api/templates**: Template management
- **CRUD /api/presentations**: Presentation management

#### API Response Format

All responses follow a standard format:

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### 6. Observability

#### Logging (`lib/logger.ts`)

- **Structured logging**: JSON-formatted logs
- **Log levels**: DEBUG, INFO, WARN, ERROR
- **Context**: Attach metadata to log entries
- **Child loggers**: Inherit context from parent

#### Metrics (`lib/metrics.ts`)

- **Counters**: Incrementing values (e.g., API requests)
- **Gauges**: Point-in-time values (e.g., active connections)
- **Histograms**: Distributions (e.g., response times)
- **Timing helpers**: Automatic duration tracking

#### Error Handling (`lib/errors.ts`)

Domain-specific error types:

- `ValidationError`: Input validation failures
- `NotFoundError`: Resource not found
- `ProviderError`: AI provider failures
- `StorageError`: Persistence failures
- `ConfigurationError`: Missing/invalid config

## Data Flow

### Slide Generation Flow

```
1. User submits form → POST /api/generate
2. Input validation (Zod schema)
3. Provider selection (factory pattern)
4. AI generation (provider.generateOutline)
5. Create SlidePlan entity
6. Save to storage
7. Publish plan.generated event
8. Return response
```

### Event Processing Flow

```
1. Domain action occurs
2. Create domain event
3. Publish to EventBus
4. EventBus notifies all subscribers
5. Adapters handle event:
   - LoggingAdapter → Write to log
   - AnalyticsAdapter → Track metric
   - NotificationAdapter → Send notification
```

## Extension Points

### Adding a New AI Provider

1. Implement `ISlideGeneratorProvider` interface
2. Register in `lib/providers/factory.ts`
3. Add to `ProviderType` enum
4. Update documentation

### Adding a New Entity

1. Define types in `lib/types.ts`
2. Create storage module in `lib/storage/`
3. Create API routes in `app/api/`
4. Add seed data in `scripts/seed-rich.ts`
5. Update documentation

### Adding Event Handlers

1. Define event type in `lib/events/types.ts`
2. Create adapter in `lib/events/adapters/`
3. Subscribe to events in adapter's `start()` method
4. Handle events asynchronously

## Testing Strategy

### Unit Tests

- Storage layer CRUD operations
- Domain logic and validation
- Provider implementations

### Integration Tests

- API endpoint testing
- End-to-end flows
- Database operations

### Test Utilities

- **Factories** (`lib/__tests__/factories.ts`): Generate test data
- **Fixtures**: Pre-defined test scenarios
- **Mocks**: MockProvider for AI generation

## Performance Considerations

### Current Optimizations

- **File-based storage**: Fast for small datasets
- **Pagination**: Prevents loading large datasets
- **Lazy loading**: Load data only when needed
- **Provider caching**: Reuse provider instances

### Future Optimizations

- **Database migration**: PostgreSQL for larger datasets
- **Caching layer**: Redis for frequently accessed data
- **Background jobs**: Queue for async processing
- **CDN**: Static assets and generated content

## Security Considerations

- **Input validation**: Zod schemas on all inputs
- **API key security**: Environment variables, never committed
- **File path validation**: Prevent directory traversal
- **Error messages**: Don't leak sensitive information

## Deployment Architecture

### Development

```bash
npm run dev  # Next.js dev server
```

### Production

```bash
npm run build  # Create production build
npm start      # Start production server
```

### Docker

```bash
docker compose up  # Run in container
```

## Monitoring and Observability

### Logs

- Application logs: Structured JSON format
- Access logs: Request/response tracking
- Error logs: Stack traces and context

### Metrics

- Request count by endpoint
- Response times (p50, p95, p99)
- Error rates
- AI generation metrics (tokens, duration)

### Health Checks

- `/api/health`: Application health status
- Provider connectivity checks
- Storage availability

## Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-...

# Optional
AI_PROVIDER=anthropic
LOG_LEVEL=info
NODE_ENV=production
PORT=3000
```

### Configuration Files

- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `vitest.config.ts`: Test configuration

## Future Roadmap

### Phase 4 (Potential)

- **Database**: Migrate to PostgreSQL
- **Authentication**: User accounts and sessions
- **Collaboration**: Real-time collaboration on slides
- **Export**: PDF/PPTX generation
- **Analytics**: Usage dashboards
- **API Keys**: Per-user API key management
