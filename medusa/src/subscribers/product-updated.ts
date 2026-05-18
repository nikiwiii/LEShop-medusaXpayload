import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createPayloadProductsWorkflow } from "../workflows/create-payload-products"

export default async function productUpdatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  // Using the core "product" service which is always registered and reliable
  const productModuleService = container.resolve("product")
  
  console.log(`Product updated event received for ID: ${data.id}. Syncing with Payload CMS...`)

  try {
    const product = await productModuleService.retrieveProduct(data.id, {
      relations: ["variants", "options", "variants.options"],
    })

    const { result } = await createPayloadProductsWorkflow(container).run({
      input: {
        products: [product],
      },
    })

    console.log(`Sync completed for updated product ${data.id}:`, result)
  } catch (error) {
    console.error(`Failed to sync updated product ${data.id} with Payload:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "product.updated",
}
