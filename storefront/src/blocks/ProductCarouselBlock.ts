import type { Block } from "payload"

export const ProductCarouselBlock: Block = {
  slug: "product-carousel",
  labels: {
    singular: "Karuzela produktów",
    plural: "Karuzele produktów",
  },
  imageURL: undefined,
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Nagłówek sekcji",
      required: false,
      admin: {
        description: "Tytuł wyświetlany nad karuzelą produktów.",
      },
    },
    {
      name: "icon",
      type: "select",
      label: "Ikona (lucide-react)",
      required: false,
      options: [
        { label: "Brak", value: "none" },
        { label: "ShoppingBag", value: "ShoppingBag" },
        { label: "Star", value: "Star" },
        { label: "Flame", value: "Flame" },
        { label: "Tag", value: "Tag" },
        { label: "Gift", value: "Gift" },
        { label: "Zap", value: "Zap" },
        { label: "Heart", value: "Heart" },
        { label: "Award", value: "Award" },
        { label: "TrendingUp", value: "TrendingUp" },
        { label: "Sparkles", value: "Sparkles" },
        { label: "Box", value: "Box" },
        { label: "Package", value: "Package" },
        { label: "ShoppingCart", value: "ShoppingCart" },
        { label: "Percent", value: "Percent" },
        { label: "Layers", value: "Layers" },
      ],
      defaultValue: "none",
      admin: {
        description: "Ikona z biblioteki lucide-react wyświetlana obok nagłówka.",
      },
    },
    {
      name: "sourceType",
      type: "select",
      label: "Źródło produktów",
      required: true,
      defaultValue: "category",
      options: [
        { label: "Kategoria", value: "category" },
        { label: "Kolekcja", value: "collection" },
        { label: "Ręczny wybór", value: "manual" },
      ],
      admin: {
        description: "Skąd pobierać produkty do karuzeli.",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Kategoria produktów",
      required: false,
      hasMany: false,
      admin: {
        condition: (data, siblingData) => siblingData?.sourceType === "category",
        description: "Wybierz kategorię z której pobierane będą produkty.",
      },
    },
    {
      name: "collectionHandle",
      type: "text",
      label: "Handle kolekcji (Medusa)",
      required: false,
      admin: {
        condition: (data, siblingData) => siblingData?.sourceType === "collection",
        description: "Wpisz handle kolekcji z Medusa (np. 'new-arrivals').",
      },
    },
    {
      name: "manualProducts",
      type: "relationship",
      relationTo: "products",
      label: "Wybrane produkty",
      required: false,
      hasMany: true,
      admin: {
        condition: (data, siblingData) => siblingData?.sourceType === "manual",
        description: "Ręcznie wybierz produkty do wyświetlenia w karuzeli.",
      },
    },
    {
      name: "visibleCount",
      type: "number",
      label: "Liczba widocznych produktów",
      defaultValue: 6,
      required: false,
      min: 1,
      max: 12,
      admin: {
        description: "Ile produktów widać jednocześnie w karuzeli (domyślnie 6).",
      },
    },
    {
      name: "showViewAllButton",
      type: "checkbox",
      label: "Pokaż przycisk 'Zobacz wszystkie'",
      defaultValue: true,
      admin: {
        description: "Wyświetla przycisk prowadzący do strony ze wszystkimi produktami danej kategorii/kolekcji.",
      },
    },
    {
      name: "viewAllLabel",
      type: "text",
      label: "Tekst przycisku 'Zobacz wszystkie'",
      required: false,
      defaultValue: "Zobacz wszystkie produkty",
      admin: {
        condition: (data, siblingData) => !!siblingData?.showViewAllButton,
        description: "Tekst na przycisku prowadzącym do pełnej listy produktów.",
      },
    },
    {
      name: "viewAllUrl",
      type: "text",
      label: "Link przycisku 'Zobacz wszystkie'",
      required: false,
      defaultValue: "/store",
      admin: {
        condition: (data, siblingData) => !!siblingData?.showViewAllButton,
        description: "URL przycisku (np. /store lub /categories/elektronika).",
      },
    },
  ],
}
