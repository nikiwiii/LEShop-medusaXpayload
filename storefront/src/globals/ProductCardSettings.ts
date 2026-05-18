import { GlobalConfig } from "payload"

const fontSizeOptions = [
  { label: "10px", value: "10px" },
  { label: "11px", value: "11px" },
  { label: "12px", value: "12px" },
  { label: "13px", value: "13px" },
  { label: "14px", value: "14px" },
  { label: "15px", value: "15px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "22px", value: "22px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
]

const fontWeightOptions = [
  { label: "Cienki (300)", value: "300" },
  { label: "Normalny (400)", value: "400" },
  { label: "Średni (500)", value: "500" },
  { label: "Półgrubый (600)", value: "600" },
  { label: "Gruby (700)", value: "700" },
  { label: "Bardzo gruby (800)", value: "800" },
  { label: "Czarny (900)", value: "900" },
]

const textElementFields = (labelPrefix: string) => [
  {
    name: "show",
    type: "checkbox" as const,
    label: `Pokaż ${labelPrefix}`,
    defaultValue: true,
    admin: {
      description: `Czy ${labelPrefix} ma być wyświetlana na karcie produktu?`,
    },
  },
  {
    name: "fontSize",
    type: "select" as const,
    label: "Rozmiar czcionki",
    options: fontSizeOptions,
    defaultValue: "14px",
    admin: {
      description: `Rozmiar tekstu dla: ${labelPrefix}.`,
    },
  },
  {
    name: "fontWeight",
    type: "select" as const,
    label: "Grubość czcionki",
    options: fontWeightOptions,
    defaultValue: "400",
    admin: {
      description: `Grubość tekstu dla: ${labelPrefix}.`,
    },
  },
  {
    name: "color",
    type: "text" as const,
    label: "Kolor tekstu",
    defaultValue: "#111827",
    admin: {
      description: `Kolor tekstu w formacie HEX (np. #111827) lub CSS (np. rgba(0,0,0,0.8)). Dotyczy: ${labelPrefix}.`,
    },
  },
]

export const ProductCardSettings: GlobalConfig = {
  slug: "product-card-settings",
  label: "Ustawienia karty produktu (ProductCard)",
  admin: {
    description: "Dostosuj wygląd kart produktów wyświetlanych na karuzeli i w listingach.",
    group: "Wygląd",
  },
  fields: [
    // ── Image ────────────────────────────────────────────────────────────────
    {
      name: "image",
      type: "group",
      label: "Obrazek produktu",
      fields: [
        {
          name: "show",
          type: "checkbox",
          label: "Pokaż obrazek produktu",
          defaultValue: true,
        },
        {
          name: "aspectRatio",
          type: "select",
          label: "Proporcje obrazka",
          options: [
            { label: "Kwadrat (1:1)", value: "1/1" },
            { label: "Poziomy (4:3)", value: "4/3" },
            { label: "Pionowy (3:4)", value: "3/4" },
            { label: "Szerokoekranowy (16:9)", value: "16/9" },
            { label: "Pionowy (2:3)", value: "2/3" },
          ],
          defaultValue: "3/4",
          admin: {
            description: "Proporcje zdjęcia produktu na karcie.",
          },
        },
        {
          name: "borderRadius",
          type: "select",
          label: "Zaokrąglenie rogów obrazka",
          options: [
            { label: "Brak", value: "0px" },
            { label: "Małe (4px)", value: "4px" },
            { label: "Średnie (8px)", value: "8px" },
            { label: "Duże (12px)", value: "12px" },
            { label: "Bardzo duże (16px)", value: "16px" },
            { label: "Okrągłe", value: "9999px" },
          ],
          defaultValue: "8px",
        },
      ],
    },

    // ── Product Name ─────────────────────────────────────────────────────────
    {
      name: "productName",
      type: "group",
      label: "Nazwa produktu",
      fields: [
        ...textElementFields("nazwę produktu"),
        {
          name: "maxLines",
          type: "select",
          label: "Maksymalna liczba linii",
          options: [
            { label: "1 linia", value: "1" },
            { label: "2 linie", value: "2" },
            { label: "3 linie", value: "3" },
            { label: "Bez limitu", value: "none" },
          ],
          defaultValue: "2",
          admin: {
            description: "Po przekroczeniu limitu tekst zostanie przycięty wielokropkiem.",
          },
        },
      ],
      admin: {
        description: "Styl wyświetlania nazwy produktu.",
      },
    },

    // ── Category ─────────────────────────────────────────────────────────────
    {
      name: "category",
      type: "group",
      label: "Kategoria produktu",
      fields: textElementFields("kategorię produktu").map((f, i) =>
        i === 3 ? { ...f, defaultValue: "#6b7280" } : // szary kolor dla kategorii
        i === 1 ? { ...f, defaultValue: "12px" } :    // mniejszy font
        f
      ),
      admin: {
        description: "Styl wyświetlania etykiety kategorii produktu.",
      },
    },

    // ── Price ─────────────────────────────────────────────────────────────────
    {
      name: "price",
      type: "group",
      label: "Cena produktu",
      fields: [
        ...textElementFields("cenę produktu").map((f, i) =>
          i === 1 ? { ...f, defaultValue: "18px" } :    // większy font dla ceny
          i === 2 ? { ...f, defaultValue: "700" } :     // gruby font dla ceny
          i === 3 ? { ...f, defaultValue: "#111827" } : // ciemny kolor
          f
        ),
        {
          name: "showOriginalPrice",
          type: "checkbox",
          label: "Pokaż oryginalną cenę (przy obniżce)",
          defaultValue: true,
          admin: {
            description: "Wyświetla przekreśloną cenę oryginalną gdy produkt ma cenę promocyjną.",
          },
        },
        {
          name: "originalPriceColor",
          type: "text",
          label: "Kolor ceny oryginalnej",
          defaultValue: "#9ca3af",
          admin: {
            condition: (data, siblingData) => !!siblingData?.showOriginalPrice,
            description: "Kolor przekreślonej ceny oryginalnej (domyślnie szary).",
          },
        },
        {
          name: "salePriceColor",
          type: "text",
          label: "Kolor ceny promocyjnej",
          defaultValue: "#ef4444",
          admin: {
            description: "Kolor ceny gdy produkt jest w promocji (domyślnie czerwony).",
          },
        },
      ],
      admin: {
        description: "Styl wyświetlania ceny produktu.",
      },
    },

    // ── Cart Button ──────────────────────────────────────────────────────────
    {
      name: "cartButton",
      type: "group",
      label: "Przycisk koszyka",
      fields: [
        {
          name: "show",
          type: "checkbox",
          label: "Pokaż przycisk koszyka",
          defaultValue: true,
        },
        {
          name: "icon",
          type: "select",
          label: "Ikona przycisku (lucide-react)",
          options: [
            { label: "ShoppingCart", value: "ShoppingCart" },
            { label: "ShoppingBag", value: "ShoppingBag" },
            { label: "Plus", value: "Plus" },
            { label: "PlusCircle", value: "PlusCircle" },
            { label: "PackagePlus", value: "PackagePlus" },
          ],
          defaultValue: "ShoppingCart",
          admin: {
            description: "Ikona wyświetlana na przycisku dodawania do koszyka.",
          },
        },
        {
          name: "label",
          type: "text",
          label: "Tekst przycisku",
          defaultValue: "Dodaj do koszyka",
          admin: {
            description: "Tekst na przycisku koszyka. Zostaw puste aby pokazać tylko ikonę.",
          },
        },
        {
          name: "showLabelOnHover",
          type: "checkbox",
          label: "Pokaż tekst tylko po najechaniu",
          defaultValue: false,
          admin: {
            description: "Domyślnie pokazuje ikonę, tekst pojawia się po najechaniu myszą.",
          },
        },
        {
          name: "style",
          type: "select",
          label: "Styl przycisku",
          options: [
            { label: "Wypełniony (solid)", value: "solid" },
            { label: "Obrys (outline)", value: "outline" },
            { label: "Zaokrąglony", value: "rounded" },
            { label: "Subtelny (ghost)", value: "ghost" },
          ],
          defaultValue: "solid",
        },
        {
          name: "backgroundColor",
          type: "text",
          label: "Kolor tła przycisku",
          defaultValue: "#111827",
          admin: {
            description: "Kolor tła przycisku koszyka (format HEX lub CSS).",
          },
        },
        {
          name: "textColor",
          type: "text",
          label: "Kolor tekstu/ikony przycisku",
          defaultValue: "#ffffff",
        },
        {
          name: "hoverBackgroundColor",
          type: "text",
          label: "Kolor tła po najechaniu",
          defaultValue: "#374151",
        },
        {
          name: "fontSize",
          type: "select",
          label: "Rozmiar tekstu przycisku",
          options: fontSizeOptions,
          defaultValue: "14px",
        },
        {
          name: "fontWeight",
          type: "select",
          label: "Grubość tekstu przycisku",
          options: fontWeightOptions,
          defaultValue: "500",
        },
      ],
      admin: {
        description: "Wygląd i zawartość przycisku dodawania produktu do koszyka.",
      },
    },

    // ── Card Container ────────────────────────────────────────────────────────
    {
      name: "card",
      type: "group",
      label: "Kontener karty produktu",
      fields: [
        {
          name: "backgroundColor",
          type: "text",
          label: "Kolor tła karty",
          defaultValue: "#ffffff",
        },
        {
          name: "borderColor",
          type: "text",
          label: "Kolor obramowania",
          defaultValue: "#e5e7eb",
        },
        {
          name: "borderRadius",
          type: "select",
          label: "Zaokrąglenie rogów karty",
          options: [
            { label: "Brak", value: "0px" },
            { label: "Małe (4px)", value: "4px" },
            { label: "Średnie (8px)", value: "8px" },
            { label: "Duże (12px)", value: "12px" },
            { label: "Bardzo duże (16px)", value: "16px" },
          ],
          defaultValue: "12px",
        },
        {
          name: "shadow",
          type: "select",
          label: "Cień karty",
          options: [
            { label: "Brak", value: "none" },
            { label: "Mały", value: "sm" },
            { label: "Normalny", value: "md" },
            { label: "Duży", value: "lg" },
            { label: "Bardzo duży", value: "xl" },
          ],
          defaultValue: "sm",
        },
        {
          name: "hoverEffect",
          type: "select",
          label: "Efekt po najechaniu",
          options: [
            { label: "Brak", value: "none" },
            { label: "Unoszenie (lift)", value: "lift" },
            { label: "Powiększenie", value: "scale" },
            { label: "Cień", value: "shadow" },
            { label: "Obramowanie", value: "border" },
          ],
          defaultValue: "lift",
          admin: {
            description: "Animacja karty produktu przy najechaniu kursorem.",
          },
        },
      ],
      admin: {
        description: "Styl kontenera (ramki) karty produktu.",
      },
    },
  ],
}
