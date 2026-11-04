# Littlepreneurs — Season 02 · Christmas Special

Website, registration and door check-in for **Littlepreneurs Season 02** (20 December, 12–5 PM, T-Works, Hyderabad). Built with Next.js 16 (App Router) and Supabase, deployed on Vercel.

## Pages

| Route | Who | What |
| --- | --- | --- |
| `/` | Public | The Season 02 website (story, gallery, programme, videos, booking) |
| `/register` | Public | Two registrations — **Visitor** (name, email, phone) and **Stall / brand** (stall name, category, 1 or 2 children, parent details). Each one returns a QR pass to save or print. `?type=stall` / `?type=guest` preselects the tab |
| `/login` | Staff | Shared passcode (`ADMIN_SECRET`) |
| `/verify` | Staff | Camera scanner. A scan checks the pass in once; later scans show **Already scanned** with the first-scan time |
| `/onboard` | Staff | Register a walk-in, or bulk-import visitors / stalls from `.xlsx` / `.csv` (samples in `public/sample_*.csv`) |
| `/admin` | Staff | Search by name, stall, child, email or phone; edit, reprint or delete |
| `/guests` | Staff | Paginated list with Visitors / Stalls filters and **Download CSV** |

Everything except `/`, `/register` and `/login` requires the staff passcode (enforced in `proxy.ts`).

## Setup

1. **Supabase** — open the SQL editor of your Supabase project and run `supabase/setup.sql` (same as `supabase/migrations/20261104120000_create_entries.sql`). It creates `public.entries` with RLS on and no policies, so the public key can't read or write it; all access goes through the server.
2. **Environment variables** (Vercel → Settings → Environment Variables, and `.env.local` for local dev — see `.env.example`):

   | Variable | Notes |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL. `SUPABASE_URL` also works (the Vercel↔Supabase integration sets it) |
   | `SUPABASE_SECRET_KEY` | Service-role / secret key. `SUPABASE_SERVICE_ROLE_KEY` also works. Server-only |
   | `ADMIN_SECRET` | Staff passcode — choose a strong one |

3. Redeploy on Vercel after adding the variables.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Data model

One table, `entries`, with `kind = 'guest' | 'stall'`.

- **Visitor**: `name`, `email`, `number`. One pass per phone number (unique for visitors).
- **Stall**: `name` (parent / guardian), `email`, `number`, `stall_name`, `category`, `table_type` (`single` / `shared`), `child_name`, `child_age`, and for shared tables `child2_name`, `child2_age`. A parent can register several stalls with the same phone.
- Check-in: `checkedin`, `checked_in_at`. The scan only flips `checkedin` from `false` to `true`, so two devices scanning the same pass can't both succeed.

Phone numbers are stored in E.164 (`+919876543210`); numbers without a country code are treated as +91.

## Customising

- Event name, date, venue, categories, ages, prices and open/closed switch: `utils/event.ts` (set `registrationOpen: false` to close public sign-ups; staff can still register from `/onboard`).
- Marketing page: `app/page.tsx` (markup) and `app/globals.css` (styles); behaviour in `components/SiteEffects.tsx`.
- Video embeds: the `data-embed` URLs in the Watch section of `app/page.tsx`.

## Structure

```
app/
  page.tsx                 # marketing site
  register/page.tsx        # public registration
  login/page.tsx           # staff passcode
  (staff)/                 # verify, onboard, admin, guests (shared staff header)
  api/auth, api/entries    # login/logout, create/search, [id] scan/edit/delete, export CSV
components/                # EntryForm, EventPass, QRScanner, AdminSearch, ExcelUpload, ...
utils/                     # event config, entry validation, Supabase server client
proxy.ts                   # staff gate
supabase/                  # SQL migration + setup script
```
