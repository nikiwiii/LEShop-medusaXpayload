import { GlobalConfig } from "payload"
import { ProductCarouselBlock } from "../blocks/ProductCarouselBlock.ts"
import { CategoryCarouselBlock } from "../blocks/CategoryCarouselBlock.ts"
import { LatestBlogsBlock } from "../blocks/LatestBlogsBlock.ts"

export const Pages: GlobalConfig = {
  slug: "pages",
  label: "Kreator stron",
  admin: {
    description: "Konstruuj strony sklepu za pomocą gotowych bloków (karuzele, blogi, kategorie).",
    group: "Kreator",
    livePreview: {
      url: ({ locale }) => {
        return `http://localhost:8000/dk?preview=true`
      },
    },
  },
  fields: [
    {
      name: "homePage",
      type: "group",
      label: "Strona główna",
      admin: {
        description: "Bloki wyświetlane na stronie głównej sklepu.",
      },
      fields: [
        {
          name: "blocks",
          type: "blocks",
          label: "Sekcje strony głównej",
          blocks: [
            ProductCarouselBlock,
            CategoryCarouselBlock,
            LatestBlogsBlock,
          ],
          admin: {
            description: "Dodaj i układaj sekcje strony głównej. Możesz dodawać karuzele produktów, karuzele kategorii oraz sekcję najnowszych wpisów blogowych.",
            initCollapsed: false,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        try {
          console.log("Pages global updated. Triggering revalidation...")
          const { revalidateTag } = await import("next/cache")
          revalidateTag("payload")
          console.log("Revalidation tag 'payload' triggered successfully!")
        } catch (e) {
          console.error("Failed to revalidate cache tag 'payload':", e)
        }
      },
    ],
  },
}
