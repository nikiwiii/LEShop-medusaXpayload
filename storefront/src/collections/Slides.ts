import { CollectionConfig } from "payload"

export const Slides: CollectionConfig = {
  slug: "slides",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "isActive", "updatedAt"],
    description: "Slajdy wyświetlane na karuzeli/sliderze strony głównej",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Tytuł slajdu",
      required: true,
    },
    {
      name: "subtitle",
      type: "textarea",
      label: "Podtytuł / tekst pomocniczy",
      required: false,
      admin: {
        description: "Krótki tekst wyświetlany pod tytułem na slajdzie.",
      },
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media" as any,
      label: "Obrazek tła slajdu",
      required: true,
      admin: {
        description: "Obraz wyświetlany jako pełnoekranowe tło slajdu.",
      },
    },
    {
      name: "ctaLabel",
      type: "text",
      label: "Tekst przycisku CTA",
      required: false,
      admin: {
        description: "Tekst na przycisku Call-to-Action (np. 'Sprawdź ofertę').",
      },
    },
    {
      name: "ctaUrl",
      type: "text",
      label: "Link przycisku CTA",
      required: false,
      admin: {
        description: "URL do którego prowadzi przycisk CTA (np. /kategoria/elektronika).",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Kolejność wyświetlania",
      required: false,
      defaultValue: 0,
      admin: {
        description: "Niższa liczba = wyświetlany wcześniej. Domyślnie 0.",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Aktywny",
      defaultValue: true,
      admin: {
        description: "Odznacz aby ukryć slajd bez jego usuwania.",
      },
    },
  ],
}
