# Todo App with Supabase

A modern, full-featured Todo List application built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Authentication**: Secure email/password login via Supabase Auth.
- **Real-time Sync**: Tasks sync across devices instantly.
- **Task Management**: Create, read, update, and delete tasks.
- **Organization**: Categorize tasks, set priorities, and due dates.
- **Smart Views**: Filter by Today, Upcoming, and Important tasks.
- **Dark Mode**: Built-in dark mode support.
- **Responsive**: Works great on mobile and desktop.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: Zustand
- **Date Handling**: date-fns

## 🏁 Getting Started

### 1. Prerequisites

- Node.js (v18 or higher)
- A Supabase account

### 2. Installation

1. Clone the repository (if applicable) or navigate to the project directory:
   ```bash
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Open `.env` file.
   - Fill in your Supabase URL and Anon Key.
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Database Setup

1. Go to your Supabase Dashboard -> SQL Editor.
2. Copy the content of `supabase_schema.sql` from this project.
3. Paste it into the SQL Editor and run it.

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:5173 to see your app!

## 📁 Project Structure

```
src/
├── components/     # React components
│   ├── auth/       # Authentication components
│   ├── layout/     # Layout components (Sidebar, etc.)
│   ├── todos/      # Todo related components
│   └── ui/         # Reusable UI components
├── contexts/       # React Contexts
├── hooks/          # Custom Hooks (useTodos, useAuth)
├── lib/            # Utilities and Supabase client
├── pages/          # Page components
└── types/          # TypeScript definitions
```

## 📄 License

MIT
