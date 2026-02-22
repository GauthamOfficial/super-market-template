# Site config (white-labeling)

All customer-facing branding is driven by **`site.ts`**.

Edit `site.ts` to rebrand for another supermarket — no code changes elsewhere. Typical edits:

| Field | Example | Where it appears |
|-------|---------|-------------------|
| `name` | `"Fresh Mart"` | Header, footer, every page title |
| `tagline` | `"Local groceries, delivered"` | Meta description, footer |
| `logoUrl` | `"/logo.svg"` or Supabase URL | Header (replaces text name) |
| `faviconUrl` | `"/favicon.ico"` | Browser tab |
| `contact` | `{ email, phone, address }` | Footer |
| `currency` | `"EUR"` | All prices |
| `branchesMode` | `"single"` or `"multi"` | Single branch = no branch picker |
| `colors.primary` | `"262 83% 58%"` (HSL) | Buttons, links, theme |

**External images:** If `logoUrl` or `faviconUrl` points to a domain not already in `next.config.js` → `images.remotePatterns`, add that domain so Next.js can optimize the image.
