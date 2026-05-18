import { GlobalConfig } from "payload"

const colorField = (name: string, label: string, defaultValue: string) => ({
  name,
  type: "text" as const,
  label,
  defaultValue,
  admin: {
    description: `Kolor w formacie HEX (np. ${defaultValue}) lub CSS (np. rgba(0,0,0,0.5)).`,
  },
})

const fontFamilyOptions = [
  { label: "Inter (domyślnie)", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Outfit", value: "Outfit, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Nunito", value: "Nunito, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Playfair Display (serif)", value: "Playfair Display, serif" },
  { label: "Merriweather (serif)", value: "Merriweather, serif" },
  { label: "DM Sans", value: "DM Sans, sans-serif" },
  { label: "Raleway", value: "Raleway, sans-serif" },
]

const fontWeightOptions = [
  { label: "Cienki (300)", value: "300" },
  { label: "Normalny (400)", value: "400" },
  { label: "Średni (500)", value: "500" },
  { label: "Półgruby (600)", value: "600" },
  { label: "Gruby (700)", value: "700" },
  { label: "Bardzo gruby (800)", value: "800" },
  { label: "Czarny (900)", value: "900" },
]

const headingStyleFields = (tag: string, defaultSize: string, defaultWeight = "700") => [
  {
    name: "fontSize",
    type: "select" as const,
    label: "Rozmiar czcionki",
    options: [
      { label: "14px", value: "14px" },
      { label: "16px", value: "16px" },
      { label: "18px", value: "18px" },
      { label: "20px", value: "20px" },
      { label: "22px", value: "22px" },
      { label: "24px", value: "24px" },
      { label: "28px", value: "28px" },
      { label: "32px", value: "32px" },
      { label: "36px", value: "36px" },
      { label: "40px", value: "40px" },
      { label: "48px", value: "48px" },
      { label: "56px", value: "56px" },
      { label: "64px", value: "64px" },
      { label: "72px", value: "72px" },
    ],
    defaultValue: defaultSize,
    admin: { description: `Rozmiar czcionki dla elementów ${tag}.` },
  },
  {
    name: "fontWeight",
    type: "select" as const,
    label: "Grubość czcionki",
    options: fontWeightOptions,
    defaultValue: defaultWeight,
  },
  colorField("color", "Kolor tekstu", "#111827"),
  {
    name: "lineHeight",
    type: "select" as const,
    label: "Wysokość linii",
    options: [
      { label: "1.0 (ścisły)", value: "1.0" },
      { label: "1.1", value: "1.1" },
      { label: "1.2", value: "1.2" },
      { label: "1.25", value: "1.25" },
      { label: "1.3", value: "1.3" },
      { label: "1.4", value: "1.4" },
      { label: "1.5 (normalny)", value: "1.5" },
      { label: "1.6", value: "1.6" },
      { label: "1.75 (luźny)", value: "1.75" },
    ],
    defaultValue: "1.25",
  },
  {
    name: "letterSpacing",
    type: "select" as const,
    label: "Odstęp między literami",
    options: [
      { label: "Ujemny (-0.05em)", value: "-0.05em" },
      { label: "Normalny (0)", value: "0" },
      { label: "Mały (0.025em)", value: "0.025em" },
      { label: "Normalny (0.05em)", value: "0.05em" },
      { label: "Duży (0.1em)", value: "0.1em" },
      { label: "Bardzo duży (0.15em)", value: "0.15em" },
    ],
    defaultValue: "-0.05em",
  },
  {
    name: "textTransform",
    type: "select" as const,
    label: "Transformacja tekstu",
    options: [
      { label: "Brak", value: "none" },
      { label: "Wielkie litery (uppercase)", value: "uppercase" },
      { label: "Małe litery (lowercase)", value: "lowercase" },
      { label: "Pierwsza wielka (capitalize)", value: "capitalize" },
    ],
    defaultValue: "none",
  },
]

export const ThemeSettings: GlobalConfig = {
  slug: "theme-settings",
  label: "Ustawienia motywu",
  admin: {
    description: "Globalne ustawienia kolorów, typografii i stylu sklepu. Zmiany wpływają na cały wygląd sklepu.",
    group: "Wygląd",
  },
  fields: [
    // ── COLORS ───────────────────────────────────────────────────────────────
    {
      name: "colors",
      type: "group",
      label: "🎨 Kolory",
      admin: {
        description: "Główna paleta kolorów sklepu. Używana w przyciskach, linkach, tłach i akcentach.",
      },
      fields: [
        {
          name: "primary",
          type: "group",
          label: "Kolor główny (Primary)",
          fields: [
            colorField("base", "Kolor główny", "#111827"),
            colorField("hover", "Kolor po najechaniu", "#374151"),
            colorField("light", "Jasna wersja", "#f3f4f6"),
            colorField("foreground", "Kolor tekstu na tle głównym", "#ffffff"),
          ],
        },
        {
          name: "secondary",
          type: "group",
          label: "Kolor dodatkowy (Secondary)",
          fields: [
            colorField("base", "Kolor dodatkowy", "#6b7280"),
            colorField("hover", "Kolor po najechaniu", "#4b5563"),
            colorField("light", "Jasna wersja", "#f9fafb"),
            colorField("foreground", "Kolor tekstu na tle dodatkowym", "#ffffff"),
          ],
        },
        {
          name: "accent",
          type: "group",
          label: "Kolor akcentu (Accent)",
          fields: [
            colorField("base", "Kolor akcentu", "#f59e0b"),
            colorField("hover", "Kolor po najechaniu", "#d97706"),
            colorField("foreground", "Kolor tekstu na tle akcentu", "#ffffff"),
          ],
        },
        {
          name: "success",
          type: "group",
          label: "Sukces / Potwierdzenie",
          fields: [
            colorField("base", "Kolor sukcesu", "#10b981"),
            colorField("foreground", "Kolor tekstu", "#ffffff"),
          ],
        },
        {
          name: "danger",
          type: "group",
          label: "Błąd / Niebezpieczeństwo",
          fields: [
            colorField("base", "Kolor błędu", "#ef4444"),
            colorField("foreground", "Kolor tekstu", "#ffffff"),
          ],
        },
        {
          name: "warning",
          type: "group",
          label: "Ostrzeżenie",
          fields: [
            colorField("base", "Kolor ostrzeżenia", "#f97316"),
            colorField("foreground", "Kolor tekstu", "#ffffff"),
          ],
        },
        {
          name: "background",
          type: "group",
          label: "Tła strony",
          fields: [
            colorField("page", "Tło strony", "#ffffff"),
            colorField("section", "Tło sekcji (alternatywne)", "#f9fafb"),
            colorField("card", "Tło karty/panelu", "#ffffff"),
            colorField("overlay", "Kolor nakładki (overlay)", "rgba(0,0,0,0.5)"),
          ],
        },
        {
          name: "text",
          type: "group",
          label: "Kolory tekstu",
          fields: [
            colorField("primary", "Tekst główny", "#111827"),
            colorField("secondary", "Tekst drugorzędny", "#6b7280"),
            colorField("muted", "Tekst wyciszony", "#9ca3af"),
            colorField("link", "Kolor linków", "#111827"),
            colorField("linkHover", "Kolor linków po najechaniu", "#374151"),
          ],
        },
        {
          name: "border",
          type: "group",
          label: "Obramowania",
          fields: [
            colorField("default", "Kolor obramowania", "#e5e7eb"),
            colorField("focus", "Kolor fokusa (focus)", "#111827"),
            colorField("divider", "Kolor separatora", "#f3f4f6"),
          ],
        },
        {
          name: "nav",
          type: "group",
          label: "Nawigacja",
          fields: [
            colorField("background", "Tło nawigacji", "#ffffff"),
            colorField("text", "Kolor tekstu nawigacji", "#111827"),
            colorField("activeText", "Kolor aktywnego linku", "#111827"),
            colorField("border", "Kolor obramowania nawigacji", "#e5e7eb"),
          ],
        },
        {
          name: "footer",
          type: "group",
          label: "Stopka",
          fields: [
            colorField("background", "Tło stopki", "#111827"),
            colorField("text", "Kolor tekstu stopki", "#d1d5db"),
            colorField("linkHover", "Kolor linków stopki po najechaniu", "#ffffff"),
            colorField("border", "Kolor separatora stopki", "#374151"),
          ],
        },
      ],
    },

    // ── TYPOGRAPHY ────────────────────────────────────────────────────────────
    {
      name: "typography",
      type: "group",
      label: "🔤 Typografia",
      admin: {
        description: "Ustawienia czcionek i stylów tekstu. Pamiętaj, że czcionki Google Fonts muszą być załadowane w kodzie strony.",
      },
      fields: [
        {
          name: "headingFont",
          type: "select",
          label: "Czcionka nagłówków",
          options: fontFamilyOptions,
          defaultValue: "Inter, sans-serif",
          admin: {
            description: "Czcionka używana dla nagłówków H1-H6.",
          },
        },
        {
          name: "bodyFont",
          type: "select",
          label: "Czcionka treści",
          options: fontFamilyOptions,
          defaultValue: "Inter, sans-serif",
          admin: {
            description: "Czcionka używana dla paragrafów i ogólnego tekstu.",
          },
        },
        {
          name: "baseSize",
          type: "select",
          label: "Bazowy rozmiar czcionki",
          options: [
            { label: "14px", value: "14px" },
            { label: "15px", value: "15px" },
            { label: "16px (standard)", value: "16px" },
            { label: "17px", value: "17px" },
            { label: "18px", value: "18px" },
          ],
          defaultValue: "16px",
          admin: {
            description: "Bazowy rozmiar tekstu (rem base). Wszystkie inne rozmiary są względem tej wartości.",
          },
        },

        // H1
        {
          name: "h1",
          type: "group",
          label: "Nagłówek H1",
          fields: headingStyleFields("H1", "48px", "800"),
        },
        // H2
        {
          name: "h2",
          type: "group",
          label: "Nagłówek H2",
          fields: headingStyleFields("H2", "36px", "700"),
        },
        // H3
        {
          name: "h3",
          type: "group",
          label: "Nagłówek H3",
          fields: headingStyleFields("H3", "28px", "700"),
        },
        // H4
        {
          name: "h4",
          type: "group",
          label: "Nagłówek H4",
          fields: headingStyleFields("H4", "22px", "600"),
        },
        // H5
        {
          name: "h5",
          type: "group",
          label: "Nagłówek H5",
          fields: headingStyleFields("H5", "20px", "600"),
        },
        // H6
        {
          name: "h6",
          type: "group",
          label: "Nagłówek H6",
          fields: headingStyleFields("H6", "16px", "600"),
        },

        // Body text
        {
          name: "body",
          type: "group",
          label: "Tekst treści (body)",
          fields: [
            {
              name: "fontSize",
              type: "select",
              label: "Rozmiar czcionki",
              options: [
                { label: "13px", value: "13px" },
                { label: "14px", value: "14px" },
                { label: "15px", value: "15px" },
                { label: "16px", value: "16px" },
                { label: "17px", value: "17px" },
                { label: "18px", value: "18px" },
              ],
              defaultValue: "16px",
            },
            {
              name: "fontWeight",
              type: "select",
              label: "Grubość czcionki",
              options: fontWeightOptions,
              defaultValue: "400",
            },
            colorField("color", "Kolor tekstu", "#374151"),
            {
              name: "lineHeight",
              type: "select",
              label: "Wysokość linii",
              options: [
                { label: "1.4", value: "1.4" },
                { label: "1.5 (normalny)", value: "1.5" },
                { label: "1.6", value: "1.6" },
                { label: "1.7", value: "1.7" },
                { label: "1.75", value: "1.75" },
                { label: "1.8", value: "1.8" },
                { label: "2.0 (luźny)", value: "2.0" },
              ],
              defaultValue: "1.6",
            },
          ],
          admin: {
            description: "Styl domyślnego tekstu paragrafów.",
          },
        },

        // Small text
        {
          name: "small",
          type: "group",
          label: "Mały tekst (small / caption)",
          fields: [
            {
              name: "fontSize",
              type: "select",
              label: "Rozmiar czcionki",
              options: [
                { label: "10px", value: "10px" },
                { label: "11px", value: "11px" },
                { label: "12px", value: "12px" },
                { label: "13px", value: "13px" },
              ],
              defaultValue: "12px",
            },
            {
              name: "fontWeight",
              type: "select",
              label: "Grubość czcionki",
              options: fontWeightOptions,
              defaultValue: "400",
            },
            colorField("color", "Kolor tekstu", "#6b7280"),
          ],
          admin: {
            description: "Styl małego tekstu pomocniczego (etykiety, podpisy).",
          },
        },
      ],
    },

    // ── GLOBAL STYLES ─────────────────────────────────────────────────────────
    {
      name: "globalStyles",
      type: "group",
      label: "⚙️ Globalne style",
      admin: {
        description: "Ogólne ustawienia stylu dotyczące całej strony.",
      },
      fields: [
        {
          name: "borderRadius",
          type: "select",
          label: "Globalny styl zaokrąglenia rogów",
          options: [
            { label: "Brak (kanciaste)", value: "0px" },
            { label: "Małe (4px)", value: "4px" },
            { label: "Średnie (8px) – domyślnie", value: "8px" },
            { label: "Duże (12px)", value: "12px" },
            { label: "Bardzo duże (16px)", value: "16px" },
            { label: "Pełne zaokrąglenie", value: "9999px" },
          ],
          defaultValue: "8px",
          admin: {
            description: "Bazowy promień zaokrąglenia rogów przycisków, kart, pól itp.",
          },
        },
        {
          name: "buttonStyle",
          type: "select",
          label: "Domyślny styl przycisków",
          options: [
            { label: "Wypełniony (solid)", value: "solid" },
            { label: "Obrys (outline)", value: "outline" },
            { label: "Subtelny (ghost)", value: "ghost" },
            { label: "Miękki (soft)", value: "soft" },
          ],
          defaultValue: "solid",
        },
        {
          name: "transitionSpeed",
          type: "select",
          label: "Szybkość animacji/przejść",
          options: [
            { label: "Brak animacji", value: "0ms" },
            { label: "Szybka (100ms)", value: "100ms" },
            { label: "Normalna (200ms)", value: "200ms" },
            { label: "Płynna (300ms) – domyślnie", value: "300ms" },
            { label: "Wolna (500ms)", value: "500ms" },
          ],
          defaultValue: "300ms",
          admin: {
            description: "Globalny czas trwania animacji CSS (hover, fokus, itp.).",
          },
        },
        {
          name: "containerMaxWidth",
          type: "select",
          label: "Maksymalna szerokość kontenera",
          options: [
            { label: "1024px", value: "1024px" },
            { label: "1200px", value: "1200px" },
            { label: "1280px (domyślnie)", value: "1280px" },
            { label: "1400px", value: "1400px" },
            { label: "1536px", value: "1536px" },
            { label: "Pełna szerokość", value: "100%" },
          ],
          defaultValue: "1280px",
          admin: {
            description: "Maksymalna szerokość głównego kontenera treści.",
          },
        },
        {
          name: "sectionSpacing",
          type: "select",
          label: "Odstęp między sekcjami",
          options: [
            { label: "Mały (32px)", value: "32px" },
            { label: "Normalny (48px)", value: "48px" },
            { label: "Duży (64px) – domyślnie", value: "64px" },
            { label: "Bardzo duży (80px)", value: "80px" },
            { label: "Ogromny (96px)", value: "96px" },
          ],
          defaultValue: "64px",
          admin: {
            description: "Pionowy odstęp między sekcjami na stronach.",
          },
        },
      ],
    },

    // ── DARK MODE ─────────────────────────────────────────────────────────────
    {
      name: "darkMode",
      type: "group",
      label: "🌙 Tryb ciemny (Dark Mode)",
      admin: {
        description: "Ustawienia kolorów dla trybu ciemnego (jeśli sklep obsługuje dark mode).",
      },
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Włącz obsługę trybu ciemnego",
          defaultValue: false,
          admin: {
            description: "Aktywuj ciemny motyw po wykryciu preferencji systemowych użytkownika.",
          },
        },
        colorField("background", "Tło strony (dark)", "#0f172a"),
        colorField("cardBackground", "Tło karty (dark)", "#1e293b"),
        colorField("textPrimary", "Tekst główny (dark)", "#f1f5f9"),
        colorField("textSecondary", "Tekst drugorzędny (dark)", "#94a3b8"),
        colorField("border", "Kolor obramowania (dark)", "#334155"),
        colorField("primary", "Kolor główny (dark)", "#6366f1"),
        colorField("primaryHover", "Kolor główny po najechaniu (dark)", "#4f46e5"),
      ],
    },
  ],
}
