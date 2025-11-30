# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Devisio is a Next.js 16 application using the App Router architecture with TypeScript, React 19, and Tailwind CSS v4.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production application
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 16.0.4 with App Router
- **React**: v19.2.0
- **TypeScript**: v5 with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`

## Architecture

### App Structure

The application follows Next.js App Router conventions:

- `app/` - Contains all routes and layouts
  - `layout.tsx` - Root layout with font configuration and metadata
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles with Tailwind import and CSS custom properties
- `public/` - Static assets (SVG icons and images)

### Path Aliases

The project uses `@/*` as an alias for the root directory (configured in tsconfig.json).

### Styling System

Uses Tailwind CSS v4 with the new `@theme inline` directive in globals.css for custom design tokens. The theme includes:
- CSS custom properties for `--background` and `--foreground` colors
- Dark mode support via `prefers-color-scheme`
- Custom font tokens mapped to Geist fonts

### TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX set to `react-jsx` (using React 19's automatic JSX runtime)
- Incremental compilation enabled

### ESLint Configuration

Uses Next.js ESLint presets:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Build artifacts (`.next/`, `out/`, `build/`) are ignored.

## Workflow

### Branch Naming Conventions

Use the following prefixes for branch names:
- `feature/*` - New features or enhancements
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation branches

### Deployment Process

- **Platform**: Vercel
- **Production**: `main` branch auto-deploys to production
- **Process**: Push to `main` triggers automatic deployment
- Changes are immediately visible on the live website after successful deployment

### Development Workflow

1. Create a feature/fix branch from `main`
2. Make changes and test locally with `npm run dev`
3. Run `npm run lint` to check for linting issues
4. Push branch and create pull request to `main`
5. Once merged, changes auto-deploy to production via Vercel
