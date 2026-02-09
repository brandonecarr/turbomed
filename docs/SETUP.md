# TurboMed Distributors - Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier works)
- A Mapbox account (free tier available)

## Environment Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API
3. Copy the **Project URL** and **anon (public)** key
4. Copy the **service_role** key (keep this secret!)

### 2. Run Database Migration

1. Go to your Supabase dashboard > SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL to create all tables, indexes, and RLS policies

### 3. Get Mapbox Token

1. Go to [mapbox.com](https://www.mapbox.com/) and create an account
2. Go to Account > Access Tokens
3. Copy your default public token (or create a new one)

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token
```

Generate NEXTAUTH_SECRET with:
```bash
openssl rand -base64 32
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Seed the Database

```bash
# Seed all countries (195+ entries)
npm run seed:countries

# Create initial admin user
npm run seed:admin
```

Default admin credentials (change immediately!):
- Email: `admin@turbomedusa.com`
- Password: `TurboMed2024!`

### 7. Start Development Server

```bash
npm run dev
```

Visit:
- Public page: http://localhost:3000/find-a-distributor
- Admin panel: http://localhost:3000/admin

---

## Admin Guide

### Adding a Distributor

1. Go to **Admin > Distributors**
2. Click **Add Distributor**
3. Fill in the required fields:
   - **Name**: Company name
   - **Location**: Click on the map or search for an address
4. Optional fields:
   - Contact info (email, phone, website)
   - Address details
   - Countries serviced (multi-select)
   - Products supported
   - Service types
   - Languages
5. Toggle **Published** when ready to show publicly
6. Click **Save**

### Assigning Countries to a Distributor

1. Edit the distributor
2. Go to the **Coverage** tab
3. Use the multi-select to add countries
4. Save changes

Countries appear in search results based on this assignment.

### Publishing/Unpublishing

- **Published**: Distributor visible on public page and map
- **Unpublished**: Hidden from public, still editable in admin

Toggle via the eye icon on the distributor list or the button in the edit form.

### Bulk Import

1. Go to **Admin > Import/Export**
2. Download the CSV template
3. Fill in your data
4. Upload and preview
5. Review validation results
6. Click **Import** to add records

CSV columns:
- `name` (required)
- `status` (published/unpublished)
- `location_lat`, `location_lng` (required)
- `countries` (comma-separated ISO codes: US,CA,MX)
- Plus all other fields...

### Managing Countries

1. Go to **Admin > Countries**
2. All ISO countries are pre-seeded
3. Add **synonyms** for better search (e.g., "USA, U.S., America")
4. View coverage status

---

## Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

For the initial deployment:
1. Run migrations on Supabase (if not done)
2. Set production NEXTAUTH_URL to your domain
3. Run seed scripts with production env vars

---

## File Structure

```
/src
├── app/
│   ├── find-a-distributor/     # Public page
│   ├── admin/                   # Admin panel
│   │   ├── distributors/        # CRUD pages
│   │   ├── countries/           # Country management
│   │   ├── import/              # CSV import/export
│   │   ├── audit-log/           # Activity history
│   │   └── settings/            # User settings
│   └── api/                     # API routes
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── map/                     # Map components
│   ├── distributor/             # Distributor list/card
│   ├── admin/                   # Admin-specific
│   └── layout/                  # Header/footer
├── lib/                         # Utilities
├── hooks/                       # React Query hooks
└── types/                       # TypeScript types

/supabase
└── migrations/                  # SQL migration files

/scripts
├── seed-countries.ts            # Country seeder
└── seed-admin.ts                # Admin user seeder
```

---

## Troubleshooting

### "Invalid email or password" on login
- Check Supabase service role key is correct
- Ensure admin user was seeded (`npm run seed:admin`)

### Map not loading
- Verify NEXT_PUBLIC_MAPBOX_TOKEN is set
- Check browser console for Mapbox errors

### Countries not showing
- Run `npm run seed:countries`
- Check Supabase RLS policies allow read access

### API returns 401
- Ensure NEXTAUTH_SECRET is set
- Clear cookies and login again
