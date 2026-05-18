import { MedusaService } from "@medusajs/framework/utils"
import { PayloadModuleOptions, SyncResult } from "./types"
import qs from "qs"

class PayloadModuleService extends MedusaService({}) {
  protected options_: PayloadModuleOptions

  constructor({}, options: PayloadModuleOptions) {
    super(...arguments)
    this.options_ = options
  }

  async syncProduct(product: any): Promise<SyncResult> {
    try {
      const { serverUrl, apiKey } = this.options_

      // 1. Check if product exists in Payload
      const query = qs.stringify({
        where: {
          medusa_id: {
            equals: product.id,
          },
        },
      })

      const searchResponse = await fetch(`${serverUrl}/api/products?${query}`, {
        headers: {
          Authorization: `users API-Key ${apiKey}`,
        },
      })

      const searchData: any = await searchResponse.json()
      const existingProduct = searchData.docs?.[0]

      const payloadData = {
        medusa_id: product.id,
        title: product.title,
        handle: product.handle,
        subtitle: product.subtitle,
        description: product.description,
        // Add more fields as needed
        options: product.options?.map((o: any) => ({
          title: o.title,
          medusa_id: o.id,
        })),
        variants: product.variants?.map((v: any) => ({
          title: v.title,
          medusa_id: v.id,
          option_values: v.options?.map((ov: any) => ({
            medusa_id: ov.id,
            medusa_option_id: ov.option_id,
            value: ov.value,
          })),
        })),
      }

      let response
      if (existingProduct) {
        // Update
        response = await fetch(`${serverUrl}/api/products/${existingProduct.id}?is_from_medusa=true`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `users API-Key ${apiKey}`,
          },
          body: JSON.stringify(payloadData),
        })
      } else {
        // Create
        response = await fetch(`${serverUrl}/api/products?is_from_medusa=true`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `users API-Key ${apiKey}`,
          },
          body: JSON.stringify(payloadData),
        })
      }

      const resultData: any = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: resultData.errors?.[0]?.message || "Failed to sync to Payload",
        }
      }

      return {
        success: true,
        payloadId: resultData.doc?.id || resultData.id,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async syncCategory(category: any): Promise<SyncResult> {
    try {
      const { serverUrl, apiKey } = this.options_

      console.log(`Syncing category with payload: ${JSON.stringify({ id: category?.id, name: category?.name, handle: category?.handle, keys: Object.keys(category || {}) })}`)

      // 1. Check if category exists in Payload
      const query = qs.stringify({
        where: {
          or: [
            {
              medusa_id: {
                equals: category.id,
              },
            },
            {
              slug: {
                equals: category.handle,
              },
            },
          ],
        },
      })

      const searchResponse = await fetch(`${serverUrl}/api/categories?${query}&is_from_medusa=true`, {
        headers: {
          Authorization: `users API-Key ${apiKey}`,
        },
      })

      const searchData: any = await searchResponse.json()
      const existingCategory = searchData.docs?.[0]

      const payloadData = {
        medusa_id: category.id,
        name: category.name,
        slug: category.handle,
        description: category.description || "",
      }

      let response
      if (existingCategory) {
        // Update
        response = await fetch(`${serverUrl}/api/categories/${existingCategory.id}?is_from_medusa=true`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `users API-Key ${apiKey}`,
          },
          body: JSON.stringify(payloadData),
        })
      } else {
        // Create
        response = await fetch(`${serverUrl}/api/categories?is_from_medusa=true`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `users API-Key ${apiKey}`,
          },
          body: JSON.stringify(payloadData),
        })
      }

      const resultData: any = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: resultData.errors?.[0]?.message || "Failed to sync to Payload",
        }
      }

      return {
        success: true,
        payloadId: resultData.doc?.id || resultData.id,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

export default PayloadModuleService
