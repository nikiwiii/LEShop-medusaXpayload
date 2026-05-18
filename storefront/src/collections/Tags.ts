import { CollectionConfig } from "payload"

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "color", "updatedAt"],
    description: "Tagi przypisywane do wpisów blogowych",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nazwa tagu",
      required: true,
    },
    {
      name: "color",
      type: "text",
      label: "Kolor tagu",
      required: true,
      defaultValue: "#6366f1",
      admin: {
        description: "Kolor wyświetlany jako etykieta tagu (format HEX, np. #6366f1).",
        // Payload v3 supports custom components, here we use a plain text field
        // for maximum compatibility. You can replace with a color-picker component.
      },
      validate: (value: any) => {
        if (typeof value !== "string") return "Kolor musi być tekstem"
        if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
          return "Podaj poprawny kolor HEX (np. #ff0000 lub #f00)"
        }
        return true
      },
    },
  ],
}
