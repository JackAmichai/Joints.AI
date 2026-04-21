# Joints.AI

Personalized physiotherapy exercise programs powered by AI, reviewed by clinicians.

## Overview

Joints.AI helps users get customized exercise programs based on their injuries or pain areas. The platform uses AI to generate personalized rehabilitation plans which are then reviewed by clinical professionals.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Backend API**: Python/FastAPI (separate repository)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for authentication)
- Backend API running (see backend repository)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── assess/            # Assessment flow
│   ├── results/           # Plan results view
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/            # Layout components (header, sidebar)
│   └── ui/               # UI components
├── lib/                   # Utility libraries
├── store/                 # Zustand stores
└── supabase/             # Supabase configuration
```

## Features

- User authentication (login/signup)
- Assessment flow for reporting pain/injuries
- AI-generated personalized exercise programs
- Clinical review workflow
- Progress tracking
- History of plans
- Export user data

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL |
| `OPENAI_API_KEY` | OpenAI API key for AI features |

## License

Private - All rights reserved
