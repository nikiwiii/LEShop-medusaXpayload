import { CollectionConfig } from "payload"

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt", "updatedAt"],
    description: "Wpisy blogowe przypisywane do kategorii i oznaczane tagami",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Tytuł wpisu",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        description: "Przyjazny URL wpisu (generowany automatycznie z tytułu).",
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
      name: "excerpt",
      type: "textarea",
      label: "Krótki opis (zajawka)",
      required: false,
      admin: {
        description: "Wyświetlany na listingu bloga jako krótki opis wpisu.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media" as any,
      label: "Zdjęcie wyróżniające",
      required: false,
    },
    {
      name: "content",
      type: "richText",
      label: "Treść wpisu",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Kategoria",
      required: false,
      hasMany: false,
      admin: {
        description: "Kategoria z której pochodzi wpis (ta sama co kategorie produktów).",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      label: "Tagi",
      required: false,
      hasMany: true,
      admin: {
        description: "Wybierz tagi z listy. Tagi tworzone są w sekcji Tagi panelu.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Data publikacji",
      required: false,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "Data i godzina publikacji wpisu.",
      },
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
        { label: "Zarchiwizowany", value: "archived" },
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
