import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createPayloadCategoriesWorkflow } from "../workflows/create-payload-categories"

export default async function categoryCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const productModuleService = container.resolve("product")

  console.log(`Product category created event received for ID: ${data.id}. Syncing with Payload CMS...`)

  try {
    const category = await productModuleService.retrieveProductCategory(data.id, {
      select: ["id", "name", "handle", "description"],
    })

    const { result } = await createPayloadCategoriesWorkflow(container).run({
      input: {
        categories: [category],
      },
    })

    console.log(`Sync completed for created product category ${data.id}:`, result)
  } catch (error) {
    console.error(`Failed to sync created product category ${data.id} with Payload:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "product-category.created",
}
