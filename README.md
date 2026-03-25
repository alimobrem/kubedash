# KubeDash

The ultimate Kubernetes platform dashboard — developer portal + operational console + platform management plane.

## Quick Start

```bash
pnpm install
pnpm dev          # Start dashboard + Storybook
```

Open [http://localhost:5173](http://localhost:5173) for the dashboard.

## Architecture

Turborepo monorepo with pnpm workspaces:

```
apps/
  dashboard/          React 19 + Vite 8 — main application
  storybook/          Component stories

packages/
  ui/                 21 UI primitives (shadcn/ui + Radix)
  design-tokens/      OKLCH color system, elevation, glow, density
  plugin-sdk/         Platform Object Model, DashboardConfig, ExtensionPoints
  k8s-client/         Kubernetes API client
  query-hooks/        TanStack Query hooks
```

## Tech Stack

- **Framework**: React 19.1, TanStack Router, TanStack Query v5, Zustand v5
- **Build**: Vite 8, Tailwind CSS 4.1, TypeScript 5.9
- **UI**: shadcn/ui + Radix UI, cmdk (command palette), Lucide React (icons)
- **Quality**: Biome 2.4 (lint/format), Vitest + Testing Library

## Key Features

### Persona-Based Views
Four personas filter the entire UI — sidebar, insights, suggested actions:
- **Developer**: My Services, Deploy, Logs, New Service
- **On-Call**: Triage (incident-first), Logs, Overview
- **Platform**: Nodes, Networking, Storage, Security, Topology
- **Leadership**: Cost, Reliability, Maturity

### Pulse AI Intelligence Layer
Native AI woven into the dashboard fabric, not a bolted-on chatbot:

| Tier | Name | How | Shortcut |
|------|------|-----|----------|
| 1 | Ambient | Proactive insight cards on every page | Always visible |
| 2 | Augmented | NL detection in command palette | Cmd+K |
| 3 | Dedicated | Slide-over conversation panel | Cmd+J |

- Purple accent color (OKLCH H=280) creates a distinct AI visual identity
- Context-aware suggested queries adapt per page
- Hero welcome card on landing page with inline ask input
- Custom AI-generated views saved to sidebar

### Design System
- Dark-first with OKLCH color space
- 6-level elevation system with glow effects
- Red H=25 / Amber H=70 safe for Night Shift
- Comfortable and compact density modes

## Scripts

```bash
pnpm dev            # Start dev server
pnpm build          # Production build
pnpm test           # Run tests
pnpm lint           # Biome check
pnpm lint:fix       # Auto-fix lint + format
pnpm storybook      # Component explorer
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+K | Command palette (search, actions, AI) |
| Cmd+J | Pulse AI panel |
| Esc | Close any panel/dialog |

## Project Status

- 114+ source files, 0 type errors, 7 tests passing
- 21 UI primitives, 13+ dashboard components
- 7 full pages + 9 placeholder routes
- 13 design token CSS files
- 3 schemas (Platform Object Model, DashboardConfig, ExtensionPoints)
- 8 Storybook stories
