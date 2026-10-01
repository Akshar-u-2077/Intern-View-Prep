# Planly InternView Prep Tracker

A production-ready interview preparation tracker built for the Planly internship curriculum. It turns a structured 8-sprint prep plan into a focused, daily study workflow with progress tracking, revision planning, analytics, and interview simulation.

## Highlights

- 8-sprint curriculum plan with topic tracking
- Daily study workflow and progress updates
- Subject-based organization and filtering
- Revision queue and review scheduling
- Interview mode for timed practice
- Offline persistence with IndexedDB + local state
- Supabase-ready data layer for cloud sync
- Terminal-inspired UI for a focused, productivity-first experience

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- IndexedDB for local persistence
- Supabase client integration

## Project Structure

- `src/` – app logic, UI components, state, and curriculum data
- `scripts/` – curriculum parsing and generation utilities
- `supabase/` – database schema and RLS migration files
- `public/` – static assets
- `Planly-InternView Prep Structure.txt` – source curriculum text

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

3. Fill in your Supabase settings in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – type-check and bundle the app
- `npm run preview` – preview the production build locally
- `npm run parse-curriculum` – inspect and classify the raw curriculum
- `npm run generate-curriculum` – regenerate the structured JSON dataset

## Data Generation

The curriculum is parsed from the raw text file and transformed into a structured dataset used by the UI. If the source curriculum changes, regenerate the app data with:

```bash
npm run generate-curriculum
```

## Notes

- The app is already wired for local persistence and can be connected to a live Supabase project by supplying valid environment variables.
- The production build currently succeeds; Vite emits a chunk-size warning because the app is feature-dense, but it is not a build failure.
