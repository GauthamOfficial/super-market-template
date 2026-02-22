# Deployment checklist: Vercel + Supabase

Step-by-step guide to deploy the Super Market app to **Vercel** with **Supabase** as the backend. Written to be clear and practical from anywhere (including Sri Lanka): minimal jargon, all values you need are listed, and you can do it in order.

---

## Before you start

- A **Supabase** account ([supabase.com](https://supabase.com)) — free tier is enough to begin.
- A **Vercel** account ([vercel.com](https://vercel.com)) — free tier is enough.
- Your app code in a **Git** repo (GitHub, GitLab, or Bitbucket) so Vercel can connect to it.
- **Database**: run all migrations in `supabase/migrations/` on your Supabase project (via Dashboard SQL Editor or `supabase db push` if using Supabase CLI).

---

## 1. Environment variables

### 1.1 Get values from Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Settings** (gear icon) → **API**.
3. Copy and keep these somewhere safe:
   - **Project URL** → you will use this as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this **secret**; only for server/scripts)

### 1.2 Add variables in Vercel

1. In [Vercel Dashboard](https://vercel.com/dashboard), open your project (or create one and import your repo).
2. Go to **Settings** → **Environment Variables**.
3. Add each variable below. Choose **Production** (and optionally Preview) for each.

| Name | Value | Required | Notes |
|------|--------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase **Project URL** | Yes | e.g. `https://xxxxxxxxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon public** key | Yes | Safe to expose in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service_role** key | Yes* | Secret; used for admin/seed. Never expose in client. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (e.g. `94771234567`) | No | For “Contact on WhatsApp” on order success; no `+` |

\* Required if you run the seed script or use server-side admin features that bypass RLS.

4. Save. **Redeploy** the project so the new env vars are applied (Deployments → … on latest → Redeploy).

---

## 2. Supabase redirect URLs (Auth)

Supabase Auth uses these for email links (e.g. confirm email, reset password) and for any OAuth redirects you add later. If they are wrong, users may see “redirect URL not allowed” or links that don’t open your app.

1. In Supabase Dashboard go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your main app URL:
   - Production: `https://your-domain.com` (replace with your real domain or Vercel URL).
   - If you don’t have a custom domain yet, use your Vercel URL, e.g. `https://your-project.vercel.app`.
3. Under **Redirect URLs**, add one URL per line. Include:
   - Production: `https://your-domain.com/**`
   - Vercel default: `https://your-project.vercel.app/**`
   - Preview deployments (optional but useful): `https://*.vercel.app/**`
   - Local (optional): `http://localhost:3000/**`

Example (replace with your real domains):

```text
https://your-domain.com/**
https://your-project.vercel.app/**
https://*.vercel.app/**
http://localhost:3000/**
```

4. Save. No need to restart anything; changes apply immediately.

---

## 3. Storage bucket policies (product images)

The app uploads product images to a Supabase Storage bucket named **product-images**.

### 3.1 Create the bucket (if not already created)

1. In Supabase Dashboard go to **Storage**.
2. Click **New bucket**.
3. Name: `product-images`.
4. **Public bucket**: turn **ON** so product images can be loaded on the storefront without auth.
5. Create the bucket.

### 3.2 Set bucket policies

1. Open the **product-images** bucket.
2. Go to **Policies** (or use **Storage** → **Policies**).
3. Add policies so that:
   - **Anyone** can read (public storefront).
   - **Authenticated users** (admins) can upload/update/delete.

**Policy 1 – Public read**

- **Policy name**: e.g. `Public read for product images`
- **Allowed operation**: `SELECT` (read)
- **Target roles**: `public` (or equivalent “all”)
- **Policy definition**: `true` (no extra condition), or use “For full customization” and expression `true`.

**Policy 2 – Authenticated upload/update/delete**

- **Policy name**: e.g. `Authenticated users can upload and manage`
- **Allowed operations**: `INSERT`, `UPDATE`, `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: e.g. `true` so any logged-in user can upload (your app already restricts admin to `/admin` and `admin_users`).

If your UI uses “Policy definition” in SQL form, examples:

- Read (public):  
  `true`
- Insert (authenticated):  
  `(bucket_id = 'product-images') AND (auth.role() = 'authenticated')`
- Update/Delete (authenticated):  
  same as above.

Adjust to your exact Supabase policy UI (they sometimes group INSERT/UPDATE/DELETE under one policy).

---

## 4. Admin auth setup

Admins sign in with **email + password** via Supabase Auth. The app then checks the **admin_users** table to see if that user is an admin (and for which branch).

### 4.1 Enable Email auth in Supabase

1. In Supabase go to **Authentication** → **Providers**.
2. Ensure **Email** is enabled.
3. (Optional) Under **Email**, turn **OFF** “Confirm email” for the first deployment so you can log in without checking email. You can turn it back on later and use the redirect URLs from step 2.

### 4.2 Create the first admin user

**Option A – Supabase Dashboard**

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter email and password. Create the user.
3. Copy the new user’s **UUID** (e.g. from the user row or user detail).

**Option B – Sign up from your app**

1. Temporarily add a sign-up form or use Supabase Dashboard → **Authentication** → **Users** → **Add user** to create a user with the email/password you want for admin.
2. Copy that user’s **UUID** from **Authentication** → **Users**.

**Then link the user to admin_users**

1. In Supabase go to **SQL Editor**.
2. Run (replace `USER_UUID_HERE` with the real UUID, and optionally set `branch_id` to one branch UUID or leave `NULL` for “super admin” for all branches):

```sql
INSERT INTO public.admin_users (user_id, branch_id, role)
VALUES ('USER_UUID_HERE', NULL, 'admin')
ON CONFLICT (user_id, branch_id) DO NOTHING;
```

3. Sign in at `https://your-domain.com/admin/login` (or your Vercel URL) with that email and password. You should land on the admin area.

**Branch-scoped admin (optional)**  
To limit an admin to one branch, set `branch_id` to that branch’s UUID instead of `NULL`. Get branch IDs from **Table Editor** → **branches**.

---

## 5. Domain configuration (placeholders)

Use these as a checklist when you add a custom domain. Replace placeholders with your real values.

### 5.1 Vercel

- [ ] **Domains**: In project **Settings** → **Domains**, add your domain (e.g. `your-domain.com` or `www.your-domain.com`).
- [ ] **Redirect**: If you use both `www` and non-`www`, choose one as primary and set the other to redirect (Vercel suggests this in the Domains UI).
- [ ] **SSL**: Vercel provisions SSL automatically; wait until it shows “Valid” for the domain.

### 5.2 Supabase (Auth URLs)

After your domain is live:

- [ ] **Site URL**: Set to `https://YOUR_DOMAIN` (e.g. `https://your-domain.com`).
- [ ] **Redirect URLs**: Add `https://YOUR_DOMAIN/**` (and keep Vercel preview URLs if you use them).

### 5.3 App env (optional)

If you ever need the app to know its own URL (e.g. for emails or sharing):

- [ ] Add `NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN` in Vercel **Environment Variables** (and use it in code where needed). This is **optional** for the current app; only add if you introduce features that need it.

### 5.4 Placeholder summary

| Placeholder | Replace with |
|-------------|--------------|
| `your-domain.com` | Your actual domain (e.g. `supermarket.lk`) |
| `your-project.vercel.app` | Your Vercel project URL (e.g. `super-market-xyz.vercel.app`) |
| `USER_UUID_HERE` | The Supabase Auth user UUID of your first admin |
| `xxxxxxxxxxxx.supabase.co` | Your Supabase project reference from the Project URL |

---

## Quick reference – order of steps

1. Run Supabase migrations.
2. Create Supabase project (if new) and get API keys.
3. In Vercel: add env vars, connect repo, deploy.
4. In Supabase: set Auth **Site URL** and **Redirect URLs**.
5. In Supabase: create **product-images** bucket and storage policies.
6. In Supabase: create first admin user and insert row into **admin_users**.
7. (When ready) Add custom domain in Vercel and update Supabase Auth URLs.

After each change to env vars or Supabase Auth/Storage, trigger a new deploy or refresh the page to verify.
