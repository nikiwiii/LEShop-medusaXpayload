import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createPayloadProductsWorkflow } from "../workflows/create-payload-products"

export default async function productCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const productModuleService = container.resolve("product")
  
  console.log(`Product created event received for ID: ${data.id}. Syncing with Payload CMS...`)

  try {
    const product = await productModuleService.retrieveProduct(data.id, {
      relations: ["variants", "options", "variants.options"],
    })

    const { result } = await createPayloadProductsWorkflow(container).run({
      input: {
        products: [product],
      },
    })

    console.log(`Sync completed for created product ${data.id}:`, result)
  } catch (error) {
    console.error(`Failed to sync created product ${data.id} with Payload:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "product.created",
}
