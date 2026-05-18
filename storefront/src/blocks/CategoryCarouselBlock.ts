import type { Block } from "payload"

export const CategoryCarouselBlock: Block = {
  slug: "category-carousel",
  labels: {
    singular: "Karuzela kategorii",
    plural: "Karuzele kategorii",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Nagłówek sekcji",
      required: false,
      admin: {
        description: "Tytuł wyświetlany nad karuzelą kategorii.",
      },
    },
    {
      name: "icon",
      type: "select",
      label: "Ikona (lucide-react)",
      required: false,
      options: [
        { label: "Brak", value: "none" },
        { label: "Grid", value: "Grid" },
        { label: "LayoutGrid", value: "LayoutGrid" },
        { label: "List", value: "List" },
        { label: "Folders", value: "Folders" },
        { label: "Tag", value: "Tag" },
        { label: "Layers", value: "Layers" },
        { label: "Shapes", value: "Shapes" },
        { label: "Sparkles", value: "Sparkles" },
        { label: "Compass", value: "Compass" },
      ],
      defaultValue: "none",
      admin: {
        description: "Ikona z biblioteki lucide-react wyświetlana obok nagłówka.",
      },
    },
    {
      name: "sourceType",
      type: "select",
      label: "Źródło kategorii",
      required: true,
      defaultValue: "all",
      options: [
        { label: "Wszystkie kategorie", value: "all" },
        { label: "Ręczny wybór", value: "manual" },
      ],
      admin: {
        description: "Skąd pobierać kategorie do karuzeli.",
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      label: "Wybrane kategorie",
      required: false,
      hasMany: true,
      admin: {
        condition: (data, siblingData) => siblingData?.sourceType === "manual",
        description: "Ręcznie wybierz kategorie do wyświetlenia w karuzeli.",
      },
    },
    {
      name: "visibleCount",
      type: "number",
      label: "Liczba widocznych kategorii",
      defaultValue: 4,
      required: false,
      min: 1,
      max: 8,
      admin: {
        description: "Ile kategorii widać jednocześnie w karuzeli (domyślnie 4).",
      },
    },
    {
      name: "categoryUrlPrefix",
      type: "text",
      label: "Prefiks URL kategorii",
      required: false,
      defaultValue: "/categories",
      admin: {
        description: "Przedrostek URL dla linków do kategorii (np. /categories lub /store). Slug kategorii zostanie dołączony automatycznie.",
      },
    },
  ],
}
