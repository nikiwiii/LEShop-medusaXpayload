import type { Block } from "payload"

export const LatestBlogsBlock: Block = {
  slug: "latest-blogs",
  labels: {
    singular: "Najnowsze wpisy blogowe",
    plural: "Sekcje najnowszych wpisów blogowych",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Nagłówek sekcji",
      required: false,
      defaultValue: "Najnowsze wpisy",
      admin: {
        description: "Tytuł wyświetlany nad sekcją bloga.",
      },
    },
    {
      name: "icon",
      type: "select",
      label: "Ikona (lucide-react)",
      required: false,
      options: [
        { label: "Brak", value: "none" },
        { label: "BookOpen", value: "BookOpen" },
        { label: "FileText", value: "FileText" },
        { label: "Newspaper", value: "Newspaper" },
        { label: "PenLine", value: "PenLine" },
        { label: "Rss", value: "Rss" },
        { label: "MessageSquare", value: "MessageSquare" },
        { label: "Library", value: "Library" },
      ],
      defaultValue: "BookOpen",
      admin: {
        description: "Ikona z biblioteki lucide-react wyświetlana obok nagłówka.",
      },
    },
    {
      name: "postsCount",
      type: "number",
      label: "Liczba wyświetlanych wpisów",
      defaultValue: 3,
      required: false,
      min: 1,
      max: 9,
      admin: {
        description: "Ile najnowszych wpisów blogowych wyświetlić (domyślnie 3).",
      },
    },
    {
      name: "filterByCategory",
      type: "checkbox",
      label: "Filtruj według kategorii",
      defaultValue: false,
      admin: {
        description: "Jeśli zaznaczone, wpisy będą filtrowane do wybranej kategorii.",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Kategoria bloga",
      required: false,
      hasMany: false,
      admin: {
        condition: (data, siblingData) => !!siblingData?.filterByCategory,
        description: "Pokazuj wpisy tylko z tej kategorii.",
      },
    },
    {
      name: "showViewAllButton",
      type: "checkbox",
      label: "Pokaż przycisk 'Czytaj więcej'",
      defaultValue: true,
      admin: {
        description: "Wyświetla przycisk prowadzący do strony ze wszystkimi wpisami blogu.",
      },
    },
    {
      name: "viewAllLabel",
      type: "text",
      label: "Tekst przycisku",
      required: false,
      defaultValue: "Przejdź do bloga",
      admin: {
        condition: (data, siblingData) => !!siblingData?.showViewAllButton,
        description: "Tekst na przycisku prowadzącym do bloga.",
      },
    },
    {
      name: "viewAllUrl",
      type: "text",
      label: "Link przycisku",
      required: false,
      defaultValue: "/blog",
      admin: {
        condition: (data, siblingData) => !!siblingData?.showViewAllButton,
        description: "URL przycisku (np. /blog).",
      },
    },
  ],
}
