# AI Seminar Slide Generator

AI-powered presentation slide outline generator using Claude API. Input your presentation theme, target audience, and duration to automatically generate a well-structured slide outline with key talking points.

## Overview

This tool leverages Anthropic's Claude AI to generate comprehensive slide outlines for presentations. It helps speakers and content creators quickly scaffold their presentation structure, saving time on initial planning and ensuring comprehensive coverage of topics.

**Key Features:**
- 🤖 AI-powered slide generation using Claude 3.5 Sonnet
- 📝 Markdown-based output for easy integration with presentation tools
- 💾 File-based storage for slide plans
- 🎯 Customizable by audience, duration, and keywords
- ✅ Full TypeScript type safety with Zod validation
- 🧪 Comprehensive test coverage with Vitest
- 🐳 Docker-ready for easy deployment

## Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### AI & Validation
- **Anthropic Claude API** - AI slide generation (claude-3.5-sonnet-20241022)
- **Zod** - Runtime type validation

### Testing & Quality
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Domain Model

### Core Entities

#### SlidePlan
The primary entity representing a generated slide outline.

```typescript
interface SlidePlan {
  id: string;                  // Unique identifier (plan_timestamp_random)
  title: string;               // Presentation title
  audience: string;            // Target audience description
  durationMinutes: number;     // Presentation duration (1-180)
  keywords?: string;           // Optional keywords for focus
  outlineMarkdown: string;     // Generated markdown outline
  createdAt: Date;             // Creation timestamp
}
```

### Data Flow

```
User Input (Form)
  → Validation (Zod)
  → AI Generation (Claude API)
  → Storage (File System)
  → Display (React UI)
```

## Getting Started

### Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Anthropic API Key**: Get one at [console.anthropic.com](https://console.anthropic.com)

### Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-seminar-slide-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Seed demo data** (optional)
   ```bash
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start (Docker)

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

2. **Build and start with Docker Compose**
   ```bash
   docker compose up -d
   ```

3. **View logs** (optional)
   ```bash
   npm run docker:logs
   ```

4. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Stop the application**
   ```bash
   npm run docker:down
   ```

## Example Flow (Vertical Slice)

This project implements a complete end-to-end flow for slide generation:

### 1. Create a Slide Plan

**Via UI:**
1. Navigate to http://localhost:3000
2. Fill in the form:
   - **Title**: "機械学習入門 - 実践から学ぶAI開発"
   - **Audience**: "エンジニア初級〜中級"
   - **Duration**: 45 minutes
   - **Keywords**: "Python, TensorFlow, 機械学習" (optional)
3. Click "スライド構成案を生成"
4. AI generates a comprehensive outline with ~10 slides
5. View, copy, or download the generated outline

**Via API:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "TypeScript実践テクニック",
    "audience": "フロントエンド開発者",
    "durationMinutes": 30,
    "keywords": "TypeScript, 型安全性"
  }'
```

### 2. Retrieve a Slide Plan

**Via UI:**
- Access `/plans/{id}` from the generation success page
- View the generated outline
- Copy to clipboard or download as Markdown

**Via API:**
```bash
curl http://localhost:3000/api/plans/{plan_id}
```

### 3. Demo Data

After running `npm run db:seed`, you can explore three pre-generated slide plans:
- Machine Learning fundamentals (45 min)
- TypeScript best practices (30 min)
- Agile development introduction (60 min)

Check the `data/` directory for the generated JSON files.

## Project Structure

```
ai-seminar-slide-generator/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── generate/         # POST /api/generate - Create slide plan
│   │   └── plans/[id]/       # GET /api/plans/:id - Retrieve plan
│   ├── plans/[id]/           # Slide plan detail page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page with input form
│   └── globals.css           # Global styles
├── lib/                      # Core business logic
│   ├── types.ts              # Type definitions & Zod schemas
│   ├── storage.ts            # File-based storage layer
│   ├── ai.ts                 # Claude API integration
│   ├── api-utils.ts          # API response helpers
│   └── __tests__/            # Unit tests
├── scripts/
│   └── seed.ts               # Database seeding script
├── test/
│   └── setup.ts              # Vitest setup
├── data/                     # Generated slide plans (gitignored)
├── public/                   # Static assets
├── Dockerfile                # Docker image definition
├── docker-compose.yml        # Docker orchestration
└── vitest.config.ts          # Test configuration
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server on :3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm test             # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open Vitest UI
```

### Data Management
```bash
npm run db:seed      # Seed demo slide plans
```

### Docker
```bash
npm run docker:build # Build Docker image
npm run docker:up    # Start containers in background
npm run docker:down  # Stop and remove containers
npm run docker:logs  # View container logs
```

## API Reference

### POST /api/generate

Generate a new slide plan.

**Request Body:**
```typescript
{
  title: string;              // Required, 1-200 chars
  audience: string;           // Required, 1-100 chars
  durationMinutes: number;    // Required, 1-180 (integer)
  keywords?: string;          // Optional, max 500 chars
}
```

**Success Response (201):**
```typescript
{
  success: true,
  data: {
    plan: SlidePlan
  }
}
```

**Error Response (400/500):**
```typescript
{
  success: false,
  error: {
    message: string,
    code?: string,
    details?: unknown
  }
}
```

### GET /api/plans/:id

Retrieve a slide plan by ID.

**Success Response (200):**
```typescript
{
  success: true,
  data: {
    plan: SlidePlan
  }
}
```

**Error Response (404/500):**
```typescript
{
  success: false,
  error: {
    message: string,
    code?: string
  }
}
```

## Using Generated Markdown

The generated Markdown outline can be used with various presentation tools:

### Keynote / PowerPoint / Google Slides
1. Copy the generated Markdown
2. Use each `# Slide N: Title` as a slide heading
3. Use bullet points as slide content
4. Add visuals, charts, and design elements

### Markdown Presentation Tools
- **Marp**: VS Code extension for Markdown presentations
- **reveal.js**: Web-based presentation framework
- **Slidev**: Developer-focused presentation tool

The generated format is:
```markdown
# Slide 1: Introduction
- First key point
- Second key point
- Third key point

# Slide 2: Main Topic
- Detail 1
- Detail 2
- Detail 3
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (useful during development)
npm run test:watch

# Open Vitest UI
npm run test:ui
```

### Test Coverage

- **Validation**: Zod schema validation (lib/__tests__/types.test.ts)
- **Storage**: File operations and data persistence (lib/__tests__/storage.test.ts)
- **API Utils**: Response formatting and error handling (lib/__tests__/api-utils.test.ts)

## Deployment

### Environment Variables

Required:
- `ANTHROPIC_API_KEY`: Your Anthropic API key

Optional:
- `NODE_ENV`: Set to `production` for production builds
- `PORT`: Server port (default: 3000)

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up -d

# Or build and run manually
docker build -t ai-seminar-slide-generator .
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_key \
  -v $(pwd)/data:/app/data \
  ai-seminar-slide-generator
```

### Production Considerations

- **Data Persistence**: Currently uses file-based storage in `data/`. For production, consider migrating to PostgreSQL, MongoDB, or another database.
- **API Rate Limiting**: Implement rate limiting to prevent abuse
- **Caching**: Consider caching responses for similar requests
- **Monitoring**: Add application monitoring and error tracking
- **Scaling**: Use a database instead of file storage for horizontal scaling

## Future Extensions

### Planned Features
- [ ] **Database Integration**: PostgreSQL with Prisma ORM
- [ ] **User Authentication**: NextAuth.js integration
- [ ] **Template System**: Customizable prompt templates
- [ ] **Export Formats**: Direct export to PPTX, PDF
- [ ] **Collaboration**: Share and collaborate on slide outlines
- [ ] **Version History**: Track and compare outline versions
- [ ] **Multi-language**: Support for multiple presentation languages
- [ ] **Advanced AI Controls**: Temperature, tone, and style customization
- [ ] **Slide Library**: Reusable slide components and templates

### Integration Opportunities
- **Presentation Tools**: Direct integration with Google Slides, PowerPoint
- **Content Management**: Import from notion, Confluence, etc.
- **Analytics**: Track which outlines perform best
- **Team Features**: Organization accounts, shared templates

## Troubleshooting

### Common Issues

**API Key Error**
- Ensure `ANTHROPIC_API_KEY` is set in `.env`
- Verify the key is valid at [console.anthropic.com](https://console.anthropic.com)
- Restart the development server after changing `.env`

**Slow Generation**
- Claude API typically takes 5-15 seconds
- Check your network connection
- Verify API rate limits haven't been exceeded

**Tests Failing**
```bash
# Clear test cache and rerun
rm -rf node_modules/.vitest
npm test
```

**Docker Issues**
```bash
# Rebuild without cache
docker compose build --no-cache

# Check logs
docker compose logs -f
```

## Contributing

This project follows conventional commit messages and uses TypeScript strict mode. When contributing:

1. Run `npm test` before committing
2. Ensure `npm run type-check` passes
3. Follow the existing code style
4. Add tests for new features

## License

MIT

## Acknowledgments

- Powered by [Anthropic Claude](https://www.anthropic.com)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
