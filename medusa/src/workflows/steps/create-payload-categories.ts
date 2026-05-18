import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PAYLOAD_MODULE } from "../../modules/payload"

export const createPayloadCategoriesStep = createStep(
  "create-payload-categories",
  async (input: { categories: any[] }, { container }) => {
    const payloadModuleService = container.resolve(PAYLOAD_MODULE)
    const results = []

    for (const category of input.categories) {
      const result = await payloadModuleService.syncCategory(category)
      results.push(result)
    }

    return new StepResponse(results)
  }
)
