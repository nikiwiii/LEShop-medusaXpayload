import { GlobalConfig } from "payload"

export const StoreInfo: GlobalConfig = {
  slug: "store-info",
  label: "Informacje o sklepie",
  admin: {
    description: "Globalne informacje o sklepie widoczne w stopce, meta tagach i na stronie kontaktowej.",
  },
  fields: [
    {
      name: "storeName",
      type: "text",
      label: "Nazwa sklepu",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media" as any,
      label: "Logo sklepu",
      required: false,
    },
    {
      name: "tagline",
      type: "text",
      label: "Slogan / hasło reklamowe",
      required: false,
    },
    {
      name: "contact",
      type: "group",
      label: "Dane kontaktowe",
      fields: [
        {
          name: "email",
          type: "email",
          label: "Adres e-mail",
          required: false,
        },
        {
          name: "phone",
          type: "text",
          label: "Numer telefonu",
          required: false,
        },
        {
          name: "address",
          type: "textarea",
          label: "Adres",
          required: false,
          admin: {
            description: "Pełny adres siedziby firmy.",
          },
        },
      ],
    },
    {
      name: "socialMedia",
      type: "group",
      label: "Media społecznościowe",
      fields: [
        {
          name: "facebook",
          type: "text",
          label: "Facebook URL",
          required: false,
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram URL",
          required: false,
        },
        {
          name: "tiktok",
          type: "text",
          label: "TikTok URL",
          required: false,
        },
        {
          name: "youtube",
          type: "text",
          label: "YouTube URL",
          required: false,
        },
        {
          name: "x",
          type: "text",
          label: "X (Twitter) URL",
          required: false,
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      label: "Globalne SEO",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Domyślny Meta Title",
          required: false,
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Domyślny Meta Description",
          required: false,
        },
        {
          name: "favicon",
          type: "upload",
          relationTo: "media" as any,
          label: "Favicon",
          required: false,
        },
      ],
    },
    {
      name: "businessInfo",
      type: "group",
      label: "Dane firmy (faktura / regulamin)",
      fields: [
        {
          name: "companyName",
          type: "text",
          label: "Nazwa firmy",
          required: false,
        },
        {
          name: "nip",
          type: "text",
          label: "NIP",
          required: false,
        },
        {
          name: "regon",
          type: "text",
          label: "REGON",
          required: false,
        },
        {
          name: "bankAccount",
          type: "text",
          label: "Numer konta bankowego",
          required: false,
        },
      ],
    },
  ],
}
