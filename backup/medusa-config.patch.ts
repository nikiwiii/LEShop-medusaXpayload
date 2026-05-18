/**
 * medusa-config.ts PATCH – Payload module additions
 *
 * After running `npx create-medusa-app@latest` in the /medusa directory,
 * add the following to your existing medusa-config.ts:
 *
 * 1. Add the `modules` array shown below to `defineConfig`.
 * 2. The DATABASE_URL and other env vars are already wired via Docker.
 */

// ─── PASTE THIS into your existing medusa-config.ts ───────────────────────────
//
// import { loadEnv, defineConfig } from "@medusajs/framework/utils"
//
// loadEnv(process.env.NODE_ENV || "development", process.cwd())
//
// module.exports = defineConfig({
//   projectConfig: {
//     databaseUrl: process.env.DATABASE_URL,
//     redisUrl: process.env.REDIS_URL,
//     http: {
//       storeCors: process.env.MEDUSA_STORE_CORS!,
//       adminCors: process.env.MEDUSA_ADMIN_CORS!,
//       authCors: process.env.MEDUSA_AUTH_CORS!,
//       jwtSecret: process.env.JWT_SECRET || "supersecret",
//       cookieSecret: process.env.COOKIE_SECRET || "supersecret",
//     },
//   },
//   // ─── ADD THIS BLOCK ────────────────────────────────────────────────
//   modules: [
//     {
//       resolve: "./src/modules/payload",
//       options: {
//         serverUrl: process.env.PAYLOAD_SERVER_URL || "http://localhost:8000",
//         apiKey: process.env.PAYLOAD_API_KEY,
//         userCollection: process.env.PAYLOAD_USER_COLLECTION || "users",
//       },
//     },
//   ],
//   // ───────────────────────────────────────────────────────────────────
// })
