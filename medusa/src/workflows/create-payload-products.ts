import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createPayloadItemsStep } from "./steps/create-payload-items"

export const createPayloadProductsWorkflow = createWorkflow(
  "create-payload-products",
  (input: { products: any[] }) => {
    const results = createPayloadItemsStep(input)
    return new WorkflowResponse(results)
  }
)
