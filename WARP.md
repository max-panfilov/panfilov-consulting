# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Payload CMS 3.x website template built with Next.js 15 (App Router), React 19, and PostgreSQL. It provides an enterprise-grade headless CMS with a fully integrated frontend for websites, blogs, and portfolios.

## Common Commands

### Development
```bash
pnpm dev                    # Start dev server on http://localhost:3000
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm dev:prod               # Clean build and start production mode
```

### Code Quality
```bash
pnpm lint                   # Run ESLint
pnpm lint:fix               # Auto-fix ESLint issues
tsc --noEmit                # Type check without emitting files
```

### Testing
```bash
pnpm test                   # Run all tests (integration + e2e)
pnpm test:int               # Run integration tests with Vitest
pnpm test:e2e               # Run E2E tests with Playwright
```

### Payload CMS
```bash
pnpm payload generate:types     # Generate TypeScript types from Payload config
pnpm payload generate:importmap # Generate import map for admin UI
pnpm payload migrate:create     # Create database migration (Postgres)
pnpm payload migrate            # Run pending migrations (Postgres)
```

### Package Management
```bash
pnpm ii                     # Install dependencies (ignore workspace)
pnpm reinstall              # Clean reinstall (removes node_modules and lock file)
```

## Architecture

### Tech Stack
- **CMS**: Payload CMS 3.x with Lexical rich text editor
- **Frontend**: Next.js 15 App Router, React 19, TypeScript
- **Database**: PostgreSQL (configured via `@payloadcms/db-postgres`)
- **Styling**: TailwindCSS + shadcn/ui components
- **Forms**: React Hook Form
- **Testing**: Vitest (integration), Playwright (E2E)

### Project Structure

```
src/
├── app/
│   ├── (frontend)/         # Next.js frontend routes
│   └── (payload)/          # Payload admin panel routes
├── collections/            # Payload collections (Pages, Posts, Media, Categories, Users)
├── blocks/                 # Layout builder blocks (Hero, Content, Media, CTA, etc.)
├── components/             # Reusable React components
├── fields/                 # Custom Payload field configurations
├── access/                 # Payload access control functions
├── hooks/                  # Payload hooks (afterChange, beforeChange, etc.)
├── plugins/                # Payload plugin configurations
├── utilities/              # Shared utility functions
├── Header/                 # Global header configuration and components
├── Footer/                 # Global footer configuration and components
├── heros/                  # Hero block variants
├── search/                 # Search plugin customization
└── payload.config.ts       # Main Payload configuration
```

### Core Collections
- **Pages**: Draft-enabled pages with layout builder
- **Posts**: Blog posts with categories and layout builder
- **Media**: Upload management with image transformations
- **Categories**: Nested taxonomy for organizing posts
- **Users**: Authentication-enabled admin users

### Globals
- **Header**: Navigation links and header data
- **Footer**: Footer content and links

### Key Features
- **Layout Builder**: Compose pages using reusable blocks (ArchiveBlock, Banner, CallToAction, Code, Content, Form, MediaBlock, RelatedPosts)
- **Draft Preview**: Preview unpublished content before publishing
- **Live Preview**: Real-time preview while editing in admin panel
- **SEO Plugin**: Built-in SEO management with `@payloadcms/plugin-seo`
- **Search Plugin**: SSR search functionality with `@payloadcms/plugin-search`
- **Form Builder**: Dynamic forms with `@payloadcms/plugin-form-builder`
- **Redirects**: URL redirect management with `@payloadcms/plugin-redirects`
- **Nested Docs**: Hierarchical categories with `@payloadcms/plugin-nested-docs`
- **Scheduled Publishing**: Jobs queue for timed publish/unpublish

### Path Aliases
```typescript
@/*              -> ./src/*
@payload-config  -> ./src/payload.config.ts
```

## Database

This project uses PostgreSQL with migrations support. When making schema changes:

1. Update collection/field definitions in `src/collections/` or `src/payload.config.ts`
2. Run `pnpm payload generate:types` to update TypeScript types
3. Create migration: `pnpm payload migrate:create`
4. Apply migration: `pnpm payload migrate` (production) or use `push: true` (development)

**Important**: Never modify database schema directly without user approval (see project rules).

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URI`: PostgreSQL connection string
- `PAYLOAD_SECRET`: JWT encryption secret
- `NEXT_PUBLIC_SERVER_URL`: Base URL for the site (no trailing slash)
- `CRON_SECRET`: Authentication for scheduled jobs
- `PREVIEW_SECRET`: Draft preview validation token

**Never modify or delete `.env` file directly.**

## Development Workflow

### Adding New Collections
1. Create collection config in `src/collections/`
2. Register in `src/payload.config.ts` collections array
3. Run `pnpm payload generate:types`
4. Create migration if using Postgres

### Adding Layout Blocks
1. Create block directory in `src/blocks/`
2. Define block config (exported as `Block`)
3. Create React component for rendering
4. Add to `RenderBlocks.tsx` switch statement

### Revalidation
The template uses on-demand revalidation via `afterChange` hooks. When published content changes, affected pages automatically revalidate in Next.js.

## Code Standards

- Follow SOLID principles and clean architecture patterns
- Add inline comments explaining code functionality
- Run type checking with `tsc` before committing TypeScript changes
- Use existing code patterns and idioms found in the codebase
- Documentation should be written in Russian (except README.md and this file)
- Store project documentation in `docs/` folder

## Seeding Data

From the admin panel, use the "seed database" link to populate sample data. This is destructive and will reset the database.

Demo user after seeding:
- Email: demo-author@payloadcms.com
- Password: password

## Notes

- Next.js caching is disabled by default (optimized for Payload Cloud with Cloudflare)
- Admin panel available at `/admin`
- TypeScript strict mode is enabled
- Uses pnpm for package management (required)
- Node.js 18.20.2+ or 20.9.0+ required
