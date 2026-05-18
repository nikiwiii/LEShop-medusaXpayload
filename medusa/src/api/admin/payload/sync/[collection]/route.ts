import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { createPayloadProductsWorkflow } from "../../../../../workflows/create-payload-products"
import { createPayloadCategoriesWorkflow } from "../../../../../workflows/create-payload-categories"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { collection } = req.params

  if (collection !== "products" && collection !== "categories") {
    return res.status(400).json({ message: "Unsupported collection" })
  }

  const productModuleService = req.scope.resolve("product")

  if (collection === "products") {
    const [products] = await productModuleService.listAndCountProducts({}, {
      relations: ["variants", "options", "variants.options"],
    })

    const { result } = await createPayloadProductsWorkflow(req.scope).run({
      input: {
        products,
      },
    })

    return res.json({
      message: `Sync started for ${products.length} products`,
      results: result,
    })
  } else {
    const [categories] = await productModuleService.listAndCountProductCategories({}, {
      select: ["id", "name", "handle", "description"],
    })

    const { result } = await createPayloadCategoriesWorkflow(req.scope).run({
      input: {
        categories,
      },
    })

    return res.json({
      message: `Sync started for ${categories.length} categories`,
      results: result,
    })
  }
}
