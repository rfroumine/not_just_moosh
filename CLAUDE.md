# Not Just Moosh - Project Guidelines

## Git Workflow

### Branch Naming
- **Features:** `feature/description` (e.g., `feature/voice-input`)
- **Bug fixes:** `fix/description` (e.g., `fix/calendar-scroll`)

### Process
1. Create a branch before starting work: `git checkout -b feature/your-feature-name`
2. Make changes and commit often
3. Merge to main when complete
4. Push to origin
5. Deploy with `npx vercel --prod`

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Google OAuth)
- TanStack Query (server state)
- Zustand (UI state)
- React Router v6
- react-swipeable (gestures)
- vite-plugin-pwa

## Key Files
- `src/lib/supabase.ts` - Supabase client
- `src/lib/types.ts` - TypeScript interfaces
- `src/lib/constants.ts` - Default foods, categories, colors
- `src/hooks/useAuth.ts` - Authentication hook
- `src/utils/deriveChecklist.ts` - Core checklist logic
- `src/stores/uiStore.ts` - UI state (Zustand)
- `src/queries/` - TanStack Query hooks

## Database
- Supabase project: `kjhqufxlxyzbcgcithrg`
- Do NOT use triggers on `auth.users` - create profiles from app code instead
- Schema is in `supabase/schema.sql`

## Deployment
- Hosted on Vercel
- Run `npx vercel --prod` to deploy
- Environment variables set in Vercel dashboard
