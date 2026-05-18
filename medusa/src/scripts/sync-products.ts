import { MedusaContainer } from "@medusajs/framework/types"
import { createPayloadProductsWorkflow } from "../workflows/create-payload-products"

export default async function syncProductsScript({
  container,
}: {
  container: MedusaContainer
}) {
  const productModuleService = container.resolve("product")

  console.log("Fetching products from Medusa...")
  const [products, count] = await productModuleService.listAndCountProducts({}, {
    relations: ["variants", "options", "variants.options"],
  })

  console.log(`Found ${count} products. Starting sync to Payload CMS...`)

  const { result } = await createPayloadProductsWorkflow(container).run({
    input: {
      products,
    },
  })

  console.log("Sync completed successfully!")
  console.log(result)
}
