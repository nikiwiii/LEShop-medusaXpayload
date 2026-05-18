import { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "image", "updatedAt"],
    description: "Kategorie produktów i wpisów blogowych",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.query.is_from_medusa,
    update: ({ req }) => !!req.query.is_from_medusa,
    delete: ({ req }) => !!req.query.is_from_medusa,
  },
  fields: [
    {
      name: "medusa_id",
      type: "text",
      label: "Medusa Category ID",
      required: false,
      unique: true,
      admin: {
        description: "The unique identifier from Medusa",
      },
    },
    {
      name: "name",
      type: "text",
      label: "Nazwa kategorii",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        description: "Przyjazny URL (np. elektronika, odziez). Generowany automatycznie z nazwy.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return (data.name as string)
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
      name: "description",
      type: "textarea",
      label: "Opis kategorii",
      required: false,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media" as any,
      label: "Obrazek tła przycisku kategorii",
      required: false,
      admin: {
        description: "Obraz wyświetlany jako tło przycisku prowadzącego do produktów z tej kategorii.",
      },
    },
  ],
}
