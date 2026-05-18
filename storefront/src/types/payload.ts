import { StoreProduct } from "@medusajs/types"
// @ts-ignore
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical"

export type StoreProductWithPayload = StoreProduct & {
  payload_product?: {
    medusa_id: string
    title: string
    handle: string
    subtitle?: string
    description?: SerializedEditorState
    thumbnail?: {
      id: string
      url: string
    }
    images: {
      id: string
      image: {
        id: string
        url: string
      }
    }[]
    options: {
      medusa_id: string
      title: string
    }[]
    variants: {
      medusa_id: string
      title: string
      option_values: {
        medusa_option_id: string
        value: string
      }[]
    }[]
  }
}
