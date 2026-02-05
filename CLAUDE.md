# Not Just Moosh - Project Guidelines

## Git Workflow

### Branch Naming
- **Features:** `feature/description` (e.g., `feature/voice-input`)
- **Bug fixes:** `fix/description` (e.g., `fix/calendar-scroll`)

### Process
1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit often
3. Test locally on mobile (see Local Development below)
4. Merge to main: `git checkout main && git merge feature/your-feature`
5. Push to origin: `git push`
6. Deploy with `npx vercel --prod`

## Local Development

### NPM Scripts
- `npm run dev` - Start local dev server with hot-reload (for development)
- `npm run build` - Build production files
- `npm run preview` - Preview production build locally

Note: `dev` is a script name (short for "development mode"), not a branch name.

### Ensuring Port 5173 is Available
Before starting the dev server, kill any processes using port 5173 to keep OAuth working:

```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace <pid> with actual number from above)
# In CMD:
taskkill /PID <pid> /F
# In Git Bash:
taskkill //PID <pid> //F
```

Then run `npm run dev` - it should start on port 5173.

### Testing on Mobile
To test features like swiping on your phone:

1. Start dev server exposed to your network:
   ```bash
   npm run dev -- --host
   ```

2. Open the Network URL on your phone (e.g., `http://192.168.1.xxx:5173`)
   - Must be on the same WiFi network

3. **One-time OAuth setup** (for login to work on mobile):
   - Google OAuth: Add `http://YOUR_LOCAL_IP:5173/auth/callback`
   - Supabase: Add `http://YOUR_LOCAL_IP:5173/**` to redirect URLs
   - Note: If your IP changes, update these URLs

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
