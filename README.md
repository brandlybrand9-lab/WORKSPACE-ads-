# Marketing Agency CRM

A production-ready internal workspace and CRM for marketing agencies.

## Tech Stack
- React 19 (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Zustand (State Management)
- i18next (RTL Arabic & French support)
- Supabase (Auth & Database)
- Lucide React (Icons)

## Features
- **Dashboard**: Overview of revenue, leads, tasks, and pipeline.
- **Task Management**: Kanban and table views, priorities, statuses, assignments.
- **CRM**: Leads tracking, pipeline summary, stages.
- **Clients**: Client profiles, projects, and status.
- **Internationalization**: Full support for English, French, and Arabic (with RTL layout).
- **Theming**: Dark and light mode support.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the contents of `schema.sql` to create the tables, RLS policies, and triggers.
3. Go to Project Settings -> API and copy your `Project URL` and `anon public` key.

### 2. Environment Variables
1. Rename `.env.example` to `.env`.
2. Update the Supabase variables with your keys:
   ```env
   VITE_SUPABASE_URL="your-project-url"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

### 3. Running Locally
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

### 4. Deployment (Vercel)
This project is ready to be deployed on Vercel.
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Ensure the Framework Preset is set to `Vite`.
4. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the Vercel dashboard.
5. Deploy!

## Folder Structure
- `/src/components`: Reusable UI components and layout wrappers.
- `/src/pages`: Main application views (Dashboard, CRM, Tasks, etc.).
- `/src/lib`: Utility functions and Supabase client configuration.
- `/src/store`: Zustand global state management.
- `/src/i18n`: Translation configurations and dictionaries.
- `/schema.sql`: Database schema for Supabase.
