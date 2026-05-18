import sharp from "sharp"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { buildConfig } from "payload"
import { Users } from "./collections/Users.ts"
import { Products } from "./collections/Products.ts"
import { Media } from "./collections/Media.ts"
import { Categories } from "./collections/Categories.ts"
import { Tags } from "./collections/Tags.ts"
import { BlogPosts } from "./collections/BlogPosts.ts"
import { Slides } from "./collections/Slides.ts"
import { StaticPages } from "./collections/StaticPages.ts"
import { StoreInfo } from "./globals/StoreInfo.ts"
import { Pages } from "./globals/Pages.ts"
import { ProductCardSettings } from "./globals/ProductCardSettings.ts"
import { ThemeSettings } from "./globals/ThemeSettings.ts"

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    Users,
    Products,
    Media,
    Categories,
    Tags,
    BlogPosts,
    Slides,
    StaticPages,
  ],
  globals: [
    StoreInfo,
    Pages,
    ProductCardSettings,
    ThemeSettings,
  ],

  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URL || "",
    },
  }),
  sharp,
})
