# Scripts

## Seed script (`seed.ts`)

Populates your Supabase database with sample data for development:

- **4 branches** – store locations (Downtown Main, Westside Mall, East End, North Plaza)
- **8 categories** – e.g. Dairy & Eggs, Produce, Bakery, Beverages, Snacks, Frozen, Pantry, Personal Care
- **60 products** – names and slugs, linked to categories
- **2 variants per product** (120 total) – “Standard” and “Large” with unique SKUs and prices
- **Random inventory** – quantity 0–100 per branch per variant
- **5 sample orders** – mixed statuses (pending, packed, dispatched, completed) with 1–3 line items each

### Prerequisites

1. **Supabase project** with the multi-branch schema applied (run migrations in `supabase/migrations/` if needed).
2. **Environment variables** (e.g. in `.env` in the project root):
   - `NEXT_PUBLIC_SUPABASE_URL` – your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` – service role key (bypasses RLS; keep secret)

   Copy from `.env.example` and fill in values from the Supabase dashboard (Settings → API).

### Run

```bash
npm install
npm run seed
```

The script loads `.env` via `dotenv` if available. You can also set the variables in the shell:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-key npm run seed
```

### Notes

- **Idempotency**: Running the script multiple times will insert duplicate branches, categories, products, etc. For a clean state, reset the DB (e.g. truncate tables or re-run migrations) before re-seeding.
- **Order numbers**: Sample orders use numbers like `ORD-SEED-0001`, `ORD-SEED-0002`, etc., so they are easy to spot in the admin.
- **RLS**: The script uses the service role key so it can insert into all tables (including orders) without an authenticated user.
