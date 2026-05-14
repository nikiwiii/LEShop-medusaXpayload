# Medusa + Storefront + Payload CMS – Full Stack E-Commerce

A complete, Dockerized e-commerce stack:
- **Medusa v2** backend (API + Admin dashboard)
- **Next.js Starter Storefront** with **Payload CMS embedded** (product content management)
- **PostgreSQL** (two separate databases, one server)
- **Redis** (event bus for Medusa)
- All ports configurable via a single `.env` file

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Network                        │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │   Medusa     │────▶│  PostgreSQL  │◀────│  Storefront │ │
│  │  Backend     │     │  (2 DBs)     │     │  + Payload  │ │
│  │  :9000       │     │  :5432       │     │  :8000      │ │
│  └──────┬───────┘     └──────────────┘     └─────────────┘ │
│         │                                         ▲         │
│         │         ┌──────────────┐                │         │
│         └────────▶│    Redis     │                │         │
│                   │  :6379       │    HTTP sync   │         │
│                   └──────────────┘                │         │
│                                                   │         │
│  Medusa ──(product.created event)─────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

| Service       | Internal Port | External Port (default) | Config Key       |
|---------------|:-------------:|:-----------------------:|------------------|
| Medusa API    | 9000          | `MEDUSA_PORT=9000`      | `.env`           |
| Storefront    | 3000          | `STOREFRONT_PORT=8000`  | `.env`           |
| Payload Admin | (embedded)    | same as storefront `/admin` | -            |
| PostgreSQL    | 5432          | `POSTGRES_PORT=5432`    | `.env`           |
| Redis         | 6379          | `REDIS_PORT=6379`       | `.env`           |

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org) | v20+ |
| [Docker Desktop](https://docs.docker.com/get-docker/) | latest |
| [Git](https://git-scm.com) | any |

---

## Quick Start (Step-by-Step)

### Step 1 – Clone / navigate to the project

```bash
cd /path/to/proj
```

### Step 2 – Run the setup script (first time only)

> This scaffolds the Medusa backend and the Next.js storefront, installs all dependencies, and applies the necessary patches.

**On Linux / macOS / WSL:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows (PowerShell):**
```powershell
# Run the steps manually – see "Manual Setup" below
```

### Step 3 – Review and adjust `.env`

Open `.env` in the project root. Change any port that conflicts with your system:

```dotenv
MEDUSA_PORT=9000          # Medusa backend + Admin
STOREFRONT_PORT=8000      # Next.js storefront (Payload /admin is here too)
POSTGRES_PORT=5432
REDIS_PORT=6379
```

> All other services reference each other by Docker service name internally, so only the **host-side** ports need changing.

### Step 4 – Start everything with Docker Compose

```bash
docker compose up --build
```

On first run Docker will:
1. Start PostgreSQL and create both `medusa_db` and `payload_db`
2. Start Redis
3. Build and start the Medusa backend (runs DB migrations automatically)
4. Build and start the Storefront + Payload

### Step 5 – Create the Medusa Admin user

Open **http://localhost:9000/app** → you'll see a form to create your first admin user.

### Step 6 – Create the Payload Admin user

Open **http://localhost:8000/admin** → create your Payload admin user.

### Step 7 – Get the Payload API key

1. In the Payload admin, click **Users** in the sidebar
2. Click on your admin user
3. Check **Enable API key** → copy the key shown
4. Click **Save**
5. Paste the key into `.env`:

```dotenv
PAYLOAD_API_KEY=your_api_key_here
```

6. Restart the Medusa service:

```bash
docker compose restart medusa
```

### Step 8 – Sync products to Payload

1. Log into the Medusa admin at **http://localhost:9000/app**
2. Go to **Settings → Payload**
3. Click **Sync Products to Payload**

Your Medusa products will now appear in the Payload admin at **http://localhost:8000/admin/collections/products**.

---

## URL Reference

| URL | Description |
|-----|-------------|
| `http://localhost:9000/app` | Medusa Admin dashboard |
| `http://localhost:9000/store/*` | Medusa Store API |
| `http://localhost:9000/admin/*` | Medusa Admin API |
| `http://localhost:8000` | Next.js Storefront |
| `http://localhost:8000/admin` | Payload CMS Admin |

---

## Manual Windows Setup

If you're on Windows without WSL, run these commands manually in PowerShell:

```powershell
# 1. Create Medusa backend
cd .\medusa
npx create-medusa-app@latest . --no-browser --skip-db
cd ..

# 2. Clone storefront
git clone --depth 1 https://github.com/medusajs/nextjs-starter-medusa.git .\storefront-tmp
Copy-Item -Path .\storefront-tmp\* -Destination .\storefront\ -Recurse -Force
Copy-Item -Path .\storefront-tmp\.* -Destination .\storefront\ -Recurse -Force 2>$null
Remove-Item -Recurse -Force .\storefront-tmp

# 3. Install Payload deps in storefront
cd .\storefront
npm install payload @payloadcms/next @payloadcms/richtext-lexical @payloadcms/db-postgres sharp qs
# Pin undici
npm pkg set overrides.undici=5.20.0
npm install

# 4. Install qs in medusa
cd ..\medusa
npm install qs @types/qs

cd ..
```

Then manually apply the following patches (see sections below).

### Patch: `storefront/tsconfig.json`

Add to `compilerOptions.paths`:
```json
{
  "compilerOptions": {
    "paths": {
      "@payload-config": ["./payload.config.ts"]
    }
  }
}
```

### Patch: `storefront/next.config.js`

At the top, add:
```js
const { withPayload } = require("@payloadcms/next/withPayload")
```

At the bottom, change:
```js
// Before:
module.exports = nextConfig
// After:
module.exports = withPayload(nextConfig)
```

### Patch: `storefront/src/middleware.ts`

Change the matcher to exclude `/admin`:
```ts
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp|admin).*)",
  ],
}
```

### Patch: `medusa/medusa-config.ts`

Add the Payload module inside `defineConfig({...})`:
```ts
modules: [
  {
    resolve: "./src/modules/payload",
    options: {
      serverUrl: process.env.PAYLOAD_SERVER_URL || "http://localhost:8000",
      apiKey: process.env.PAYLOAD_API_KEY,
      userCollection: process.env.PAYLOAD_USER_COLLECTION || "users",
    },
  },
],
```

### Create Payload route files

Create `storefront/src/app/(payload)/layout.tsx`:
```tsx
import config from "@payload-config"
import "@payloadcms/next/css"
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts"
import React from "react"
import { importMap } from "./admin/importMap.js"

type Args = { children: React.ReactNode }

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>{children}</RootLayout>
)
export default Layout
```

Create `storefront/src/app/(payload)/api/[...slug]/route.ts`:
```ts
import config from "@payload-config"
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from "@payloadcms/next/routes"

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

Create `storefront/src/app/(payload)/admin/[[...segments]]/page.tsx`:
```tsx
import { RootPage, generatePageMetadata } from "@payloadcms/next/views"
import { importMap } from "../importMap.js"

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: import("@payload-config"), params, searchParams })

const Page = ({ params, searchParams }: Args) => (
  <RootPage config={import("@payload-config")} importMap={importMap} params={params} searchParams={searchParams} />
)
export default Page
```

Create `storefront/src/app/(payload)/admin/importMap.js`:
```js
export const importMap = {}
```

Move all existing `storefront/src/app/*` files into `storefront/src/app/(storefront)/`.

---

## Storefront Customizations

The following files show how to display Payload data in the storefront. Apply them **after** the app is installed:

### `storefront/src/lib/data/products.ts`

Find the `sdk.client.fetch` call in `listProducts` and update `fields`:
```ts
fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,*payload_product",
```

### `storefront/src/modules/products/templates/product-info/index.tsx`

Add imports:
```tsx
import { StoreProductWithPayload } from "../../../../types/global"
// @ts-ignore
import { RichText } from "@payloadcms/richtext-lexical/react"
```

Change `product` prop type to `StoreProductWithPayload` and use:
```tsx
{product?.payload_product?.title || product.title}
// and
{product?.payload_product?.description !== undefined &&
  <RichText data={product.payload_product.description} />
}
```

---

## Development (without Docker)

```bash
# Terminal 1 – PostgreSQL + Redis (still via Docker)
docker compose up postgres redis

# Terminal 2 – Medusa backend
cd medusa
DATABASE_URL=postgresql://medusa:medusa_secret_pw@localhost:5432/medusa_db \
REDIS_URL=redis://localhost:6379 \
PAYLOAD_SERVER_URL=http://localhost:8000 \
PAYLOAD_API_KEY=your_key \
npm run dev

# Terminal 3 – Storefront + Payload
cd storefront
PAYLOAD_DATABASE_URL=postgresql://medusa:medusa_secret_pw@localhost:5432/payload_db \
PAYLOAD_SECRET=supersecret \
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000 \
npm run dev
```

---

## Changing Ports

1. Edit `.env` in the project root
2. Run `docker compose up --build` (no other changes needed)

Internal service-to-service communication always uses Docker service names and fixed internal ports (9000, 3000, 5432, 6379), so only host-side bindings are driven by `.env`.

---

## Project Structure

```
proj/
├── .env                          # ← All ports & secrets live here
├── docker-compose.yml
├── docker/
│   └── init-db.sh                # Creates payload_db on first PG start
├── setup.sh                      # One-time setup script (Linux/macOS/WSL)
│
├── medusa/                       # Medusa v2 backend
│   ├── Dockerfile
│   ├── medusa-config.patch.ts    # Instructions for patching medusa-config.ts
│   └── src/
│       ├── modules/payload/      # Payload integration module
│       │   ├── index.ts
│       │   ├── service.ts
│       │   └── types.ts
│       ├── links/
│       │   └── product-payload.ts  # Virtual read-only link
│       ├── workflows/
│       │   ├── create-payload-products.ts
│       │   └── steps/create-payload-items.ts
│       ├── subscribers/
│       │   ├── product-created.ts      # Auto-sync on product create
│       │   └── products-sync-payload.ts # Bulk sync subscriber
│       ├── api/admin/payload/sync/[collection]/
│       │   └── route.ts          # POST /admin/payload/sync/:collection
│       └── admin/
│           ├── lib/sdk.ts
│           └── routes/settings/payload/page.tsx  # Admin settings UI
│
└── storefront/                   # Next.js Starter + Payload CMS
    ├── Dockerfile
    └── src/
        ├── payload.config.ts     # Payload configuration
        ├── collections/
        │   ├── Users.ts
        │   ├── Media.ts
        │   └── Products.ts
        ├── lib/util/
        │   └── payload-images.ts
        ├── types/
        │   └── payload.ts
        └── app/
            ├── (payload)/        # Payload CMS admin routes
            │   ├── layout.tsx
            │   ├── api/[...slug]/route.ts
            │   └── admin/
            │       ├── importMap.js
            │       └── [[...segments]]/page.tsx
            └── (storefront)/     # Original storefront pages
```

---

## Troubleshooting

**Medusa won't start – migration errors**
> Make sure PostgreSQL is healthy before Medusa starts. Docker Compose handles this via `depends_on` with `condition: service_healthy`.

**Payload admin shows "database connection failed"**
> Check that `payload_db` exists. The `docker/init-db.sh` script creates it automatically on first run. You can manually create it with:
> ```sql
> CREATE DATABASE payload_db;
> ```

**`PAYLOAD_API_KEY` is empty/wrong**
> Follow Step 7 above. The API key must be generated from the Payload Admin UI after creating a user.

**Port already in use**
> Edit `.env`, change the conflicting port variable, then run `docker compose up --build`.

**Products not syncing to Payload**
> 1. Ensure `PAYLOAD_API_KEY` is set correctly in `.env` and `medusa` container is restarted.
> 2. Check Medusa logs: `docker compose logs medusa`
> 3. Check that the Payload admin user has API key enabled.
