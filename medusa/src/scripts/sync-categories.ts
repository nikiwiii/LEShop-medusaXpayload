import { MedusaContainer } from "@medusajs/framework/types"
import { createPayloadCategoriesWorkflow } from "../workflows/create-payload-categories"

export default async function syncCategoriesScript({
  container,
}: {
  container: MedusaContainer
}) {
  const productModuleService = container.resolve("product")

  console.log("Fetching product categories from Medusa...")
  const [categories, count] = await productModuleService.listAndCountProductCategories({}, {
    select: ["id", "name", "handle", "description"],
  })

  console.log(`Found ${count} categories. Starting sync to Payload CMS...`)

  const { result } = await createPayloadCategoriesWorkflow(container).run({
    input: {
      categories,
    },
  })

  console.log("Sync completed successfully!")
  console.log(result)
}
