# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Type-check and build for production (runs `tsc -b && vite build`)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript todo application built with Vite, using Supabase as the backend.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS with class-based dark mode
- **State Management**: Zustand (no traditional React Context for app state)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router v7
- **Internationalization**: Custom i18n system (zh-CN and en-US)

### Directory Structure
```
src/
├── components/        # React components
│   ├── auth/         # Authentication components (LoginForm, ProtectedRoute)
│   ├── categories/   # Category management components
│   ├── layout/       # Layout components (Sidebar, Layout, ThemeToggle)
│   ├── todos/        # Todo-related components (TodoForm, TodoItem, TodoList, etc.)
│   └── ui/           # Reusable UI primitives (Button, Input, Modal, Badge, Spinner)
├── contexts/         # React contexts (only AuthContext)
├── hooks/            # Zustand stores (useTodos, useCategories, useProfile) and custom hooks
├── lib/              # Utilities (supabase client, utils, i18n)
├── pages/            # Route pages (DashboardPage, TodayPage, UpcomingPage, etc.)
└── types/            # TypeScript type definitions
```

### State Management Pattern

The app uses Zustand for state management. Each major data domain has its own store:
- `useAuth` (AuthContext.tsx) - Authentication state
- `useTodos` - Todo CRUD operations + recurring task logic
- `useCategories` - Category management
- `useProfile` - User profile and preferences

**Important**: Unlike typical Zustand usage, `useAuth` is exported from `contexts/AuthContext.tsx` as a Zustand store, not a React Context.

### Recurring Tasks System

The application supports two recurring task modes:
1. **Scheduled**: Tasks appear on a fixed schedule (e.g., every Monday)
2. **After Completion**: Next task appears only after the previous one is completed

Recurring task generation happens client-side in `useTodos.ts` via the `generateScheduledTasks()` function, which runs on `fetchTodos()`. The `toggleComplete()` function handles "after completion" mode recurrence via `handleAfterCompletion()`.

### Realtime Sync

The app uses Supabase Realtime for multi-tab/device synchronization. The `useRealtime()` hook subscribes to changes on `todos` and `categories` tables filtered by `user_id`. Currently, changes trigger a refetch rather than optimistic updates.

### Authentication Flow

- Unauthenticated users are redirected to `/login`
- Protected routes use the `<ProtectedRoute>` component
- Auth state is managed via Supabase auth and persisted in Zustand

### Internationalization

The app supports Chinese (zh-CN) and English (en-US). The `t()` function in `lib/i18n.ts` is used for translations. Language preference is stored in the user's profile.

### Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema Types

All database types are defined in `src/types/index.ts` with proper TypeScript types for:
- `Profile` - User profiles with theme and language preferences
- `Category` - User-defined categories with colors
- `Todo` - Tasks with status, priority, due dates, reminders, tags
- `RecurringTask` - Recurring task configurations

### Component Patterns

- UI components use `class-variance-authority` (cva) for variant-based styling
- The `cn()` utility from `lib/utils.ts` combines `clsx` and `tailwind-merge`
- Components use lucide-react for icons
- Toast notifications use `react-hot-toast`
