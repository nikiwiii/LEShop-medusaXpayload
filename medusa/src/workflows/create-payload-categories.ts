import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createPayloadCategoriesStep } from "./steps/create-payload-categories"

export const createPayloadCategoriesWorkflow = createWorkflow(
  "create-payload-categories",
  (input: { categories: any[] }) => {
    const results = createPayloadCategoriesStep(input)
    return new WorkflowResponse(results)
  }
)
