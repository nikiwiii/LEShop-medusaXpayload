#!/usr/bin/env bash
# ============================================================
# setup.sh – One-time project setup script
# Run this ONCE after cloning to scaffold all apps.
# ============================================================
set -e

PROJ_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJ_ROOT"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Medusa + Storefront + Payload CMS – Setup Script      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ─── Step 1: Create Medusa backend ────────────────────────────
if [ ! -f "$PROJ_ROOT/medusa/package.json" ]; then
  echo "► Installing Medusa backend in ./medusa ..."
  cd "$PROJ_ROOT/medusa"
  npx create-medusa-app@latest . --no-browser --skip-db
  cd "$PROJ_ROOT"
  echo "✔ Medusa installed"
else
  echo "► Medusa already installed, skipping."
fi

# ─── Step 2: Clone the Next.js Storefront ─────────────────────
if [ ! -f "$PROJ_ROOT/storefront/package.json" ]; then
  echo "► Cloning Medusa Next.js Starter Storefront ..."
  git clone --depth 1 https://github.com/medusajs/nextjs-starter-medusa.git "$PROJ_ROOT/storefront-tmp"
  cp -R "$PROJ_ROOT/storefront-tmp/"* "$PROJ_ROOT/storefront-tmp/".[!.]* "$PROJ_ROOT/storefront/" 2>/dev/null || true
  rm -rf "$PROJ_ROOT/storefront-tmp"
  echo "✔ Storefront cloned"
else
  echo "► Storefront already exists, skipping."
fi

# ─── Step 3: Install Payload deps in storefront ────────────────
echo "► Installing Payload CMS dependencies in ./storefront ..."
cd "$PROJ_ROOT/storefront"

npm install \
  payload \
  @payloadcms/next \
  @payloadcms/richtext-lexical \
  @payloadcms/db-postgres \
  sharp \
  qs

# Pin undici to avoid Payload CLI errors
npm pkg set resolutions.undici=5.20.0
npm pkg set overrides.undici=5.20.0
npm install

echo "✔ Payload dependencies installed"

# ─── Step 4: Copy our pre-written Payload files ────────────────
echo "► Copying Payload config, collections, and Payload route files ..."

# Collections are already in src/collections/ (created by this repo)
# payload.config.ts is already in src/

# Copy Payload app route files (needed by Next.js for /admin route)
# These come from the official medusajs/examples repo
mkdir -p "$PROJ_ROOT/storefront/src/app/(payload)"

cat > "$PROJ_ROOT/storefront/src/app/(payload)/layout.tsx" << 'EOF'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config"
import "@payloadcms/next/css"
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts"
import React from "react"
import { importMap } from "./admin/importMap.js"

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
EOF

mkdir -p "$PROJ_ROOT/storefront/src/app/(payload)/admin"
cat > "$PROJ_ROOT/storefront/src/app/(payload)/admin/[[...segments]]/page.tsx" << 'EOF'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { AdminViewServerProps } from "payload"
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
EOF

cat > "$PROJ_ROOT/storefront/src/app/(payload)/admin/[[...segments]]/not-found.tsx" << 'EOF'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views"

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: import("@payload-config"), params, searchParams })

export default NotFoundPage
EOF

cat > "$PROJ_ROOT/storefront/src/app/(payload)/admin/importMap.js" << 'EOF'
export const importMap = {}
EOF

# Create API route needed by Payload
mkdir -p "$PROJ_ROOT/storefront/src/app/(payload)/api"
cat > "$PROJ_ROOT/storefront/src/app/(payload)/api/[...slug]/route.ts" << 'EOF'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config"
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from "@payloadcms/next/routes"

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
EOF

echo "✔ Payload route files created"

# ─── Step 5: Move storefront app files ────────────────────────
# The official doc says to move src/app/* into src/app/(storefront)/
# We check if already done
if [ -d "$PROJ_ROOT/storefront/src/app/(storefront)" ]; then
  echo "► Storefront app directory already restructured, skipping."
else
  echo "► Restructuring src/app to support route groups ..."
  mkdir -p "$PROJ_ROOT/storefront/src/app/(storefront)"
  # Move everything except our (payload) dir
  for item in "$PROJ_ROOT/storefront/src/app"/*; do
    base=$(basename "$item")
    if [ "$base" != "(payload)" ] && [ "$base" != "(storefront)" ]; then
      mv "$item" "$PROJ_ROOT/storefront/src/app/(storefront)/"
    fi
  done
  echo "✔ Storefront app directory restructured"
fi

# ─── Step 6: Patch middleware.ts ───────────────────────────────
MIDDLEWARE="$PROJ_ROOT/storefront/src/middleware.ts"
if [ -f "$MIDDLEWARE" ] && ! grep -q "admin" "$MIDDLEWARE"; then
  echo "► Patching middleware.ts to exclude /admin routes ..."
  sed -i 's|"/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)"|\"/\((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp|admin).*)\"|g' "$MIDDLEWARE"
  echo "✔ middleware.ts patched"
fi

# ─── Step 7: Patch tsconfig.json ───────────────────────────────
TSCONFIG="$PROJ_ROOT/storefront/tsconfig.json"
if [ -f "$TSCONFIG" ] && ! grep -q "payload-config" "$TSCONFIG"; then
  echo "► Adding @payload-config path alias to tsconfig.json ..."
  # Use node to safely edit JSON
  node -e "
    const fs = require('fs');
    const tc = JSON.parse(fs.readFileSync('$TSCONFIG', 'utf8'));
    tc.compilerOptions = tc.compilerOptions || {};
    tc.compilerOptions.paths = tc.compilerOptions.paths || {};
    tc.compilerOptions.paths['@payload-config'] = ['./payload.config.ts'];
    fs.writeFileSync('$TSCONFIG', JSON.stringify(tc, null, 2));
  "
  echo "✔ tsconfig.json patched"
fi

# ─── Step 8: Patch next.config.js ──────────────────────────────
NEXTCONFIG="$PROJ_ROOT/storefront/next.config.js"
if [ -f "$NEXTCONFIG" ] && ! grep -q "withPayload" "$NEXTCONFIG"; then
  echo "► Patching next.config.js to wrap with withPayload ..."
  sed -i '1s|^|const { withPayload } = require("@payloadcms/next/withPayload")\n|' "$NEXTCONFIG"
  sed -i 's|module\.exports = \(.*\)|module.exports = withPayload(\1)|' "$NEXTCONFIG"
  echo "✔ next.config.js patched"
fi

# ─── Step 9: Copy medusa payload module into medusa/src ────────
echo "► Medusa Payload module files already at medusa/src/ ✔"

# ─── Step 10: Patch medusa-config.ts ───────────────────────────
MEDUSA_CONFIG="$PROJ_ROOT/medusa/medusa-config.ts"
if [ -f "$MEDUSA_CONFIG" ] && ! grep -q "payload" "$MEDUSA_CONFIG"; then
  echo "► Patching medusa-config.ts to include Payload module ..."
  # Insert modules array before the closing defineConfig })
  sed -i "s|})$|  modules: [\n    {\n      resolve: \"./src/modules/payload\",\n      options: {\n        serverUrl: process.env.PAYLOAD_SERVER_URL || \"http://localhost:8000\",\n        apiKey: process.env.PAYLOAD_API_KEY,\n        userCollection: process.env.PAYLOAD_USER_COLLECTION || \"users\",\n      },\n    },\n  ],\n})|" "$MEDUSA_CONFIG"
  echo "✔ medusa-config.ts patched"
fi

# ─── Step 11: Install qs in medusa ────────────────────────────
echo "► Installing qs in medusa backend ..."
cd "$PROJ_ROOT/medusa"
npm install qs @types/qs 2>/dev/null || true

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Setup complete!                                        ║"
echo "║   Now read README.md for next steps.                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
