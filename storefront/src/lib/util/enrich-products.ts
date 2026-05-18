import { getPayload } from "payload"
import configPromise from "@payload-config"

export async function enrichProductWithPayload(product: any) {
  if (!product) return product

  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: "products",
      where: {
        medusa_id: {
          equals: product.id,
        },
      },
    })

    const payloadProduct = res.docs?.[0]
    if (payloadProduct) {
      product.payload_product = payloadProduct
    }
  } catch (error) {
    console.error(`Error enriching product ${product.id} with Payload:`, error)
  }

  return product
}

export async function enrichProductsWithPayload(products: any[]) {
  if (!products || products.length === 0) return products

  try {
    const payload = await getPayload({ config: configPromise })
    const ids = products.map((p) => p.id)

    const res = await payload.find({
      collection: "products",
      where: {
        medusa_id: {
          in: ids,
        },
      },
      limit: 100,
    })

    const payloadProducts = res.docs
    const map = new Map(payloadProducts.map((p: any) => [p.medusa_id, p]))

    for (const product of products) {
      const payloadProduct = map.get(product.id)
      if (payloadProduct) {
        product.payload_product = payloadProduct
      }
    }
  } catch (error) {
    console.error("Error enriching products list with Payload:", error)
  }

  return products
}
