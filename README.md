# Super Market

Next.js 14+ App Router supermarket e-commerce template with TypeScript, TailwindCSS, shadcn/ui, and Supabase.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL from Supabase dashboard
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon/public key from Supabase dashboard

3. **Supabase schema (optional)**

   Create tables in Supabase to match `types/database.ts`:

   - `categories`: id (uuid), name, slug, created_at
   - `products`: id (uuid), name, slug, description, price, image_url, category_id, created_at, updated_at

   The app works with empty tables (safe fallbacks return empty arrays / null).

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
/app                 # App Router routes
/components          # Shared UI (layout, ui)
/features            # Feature modules (products, cart) + server actions
/lib                 # Utils, Supabase client/server
/types               # Database & app types
```

## Scripts

- `npm run dev` – development
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – ESLint
