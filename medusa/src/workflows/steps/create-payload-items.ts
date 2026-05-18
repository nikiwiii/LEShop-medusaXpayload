import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PAYLOAD_MODULE } from "../../modules/payload"

export const createPayloadItemsStep = createStep(
  "create-payload-items",
  async (input: { products: any[] }, { container }) => {
    const payloadModuleService = container.resolve(PAYLOAD_MODULE)
    const results = []

    for (const product of input.products) {
      const result = await payloadModuleService.syncProduct(product)
      results.push(result)
    }

    return new StepResponse(results)
  }
)
