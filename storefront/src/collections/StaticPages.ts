import { CollectionConfig } from "payload"

export const StaticPages: CollectionConfig = {
  slug: "static-pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "updatedAt"],
    description: "Kreator stron statycznych (np. O nas, Regulamin, Polityka prywatności)",
    livePreview: {
      url: ({ data }) => {
        return `http://localhost:8000/dk/p/${data.slug}?preview=true`
      },
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          console.log("Static page updated. Triggering revalidation...")
          const { revalidateTag } = await import("next/cache")
          revalidateTag("payload")
          console.log("Revalidation tag 'payload' triggered successfully!")
        } catch (e) {
          console.error("Failed to revalidate cache tag 'payload':", e)
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Tytuł strony",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        description: "Przyjazny URL strony (np. o-nas, regulamin). Generowany automatycznie z tytułu.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return (data.title as string)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "")
            }
            return value
          },
        ],
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Treść strony",
      required: true,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Szkic", value: "draft" },
        { label: "Opublikowany", value: "published" },
      ],
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "meta_title",
          type: "text",
          label: "Meta Title",
          required: false,
        },
        {
          name: "meta_description",
          type: "textarea",
          label: "Meta Description",
          required: false,
        },
      ],
    },
  ],
}
