import { listProducts } from "@lib/data/products"
import { getCategoryByHandle } from "@lib/data/categories"
import { getCollectionByHandle } from "@lib/data/collections"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"
import { DynamicIcon } from "./DynamicIcon"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import * as Icons from "lucide-react"

interface ProductCarouselProps {
  block: {
    heading?: string
    icon?: string
    sourceType: "category" | "collection" | "manual"
    category?: {
      slug: string
      name: string
    }
    collectionHandle?: string
    manualProducts?: {
      medusa_id: string
    }[]
    visibleCount?: number
    showViewAllButton?: boolean
    viewAllLabel?: string
    viewAllUrl?: string
  }
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function ProductCarousel({ block, region, countryCode }: ProductCarouselProps) {
  const limit = block.visibleCount || 6
  let products: HttpTypes.StoreProduct[] = []

  try {
    if (block.sourceType === "category" && block.category?.slug) {
      const medusaCategory = await getCategoryByHandle([block.category.slug])
      if (medusaCategory) {
        const { response } = await listProducts({
          queryParams: {
            category_id: [medusaCategory.id],
            limit,
          },
          countryCode,
        })
        products = response.products
      }
    } else if (block.sourceType === "collection" && block.collectionHandle) {
      const medusaCollection = await getCollectionByHandle(block.collectionHandle)
      if (medusaCollection) {
        const { response } = await listProducts({
          queryParams: {
            collection_id: [medusaCollection.id],
            limit,
          },
          countryCode,
        })
        products = response.products
      }
    } else if (block.sourceType === "manual" && block.manualProducts?.length) {
      const productIds = block.manualProducts
        .map((p) => p.medusa_id)
        .filter(Boolean)

      if (productIds.length > 0) {
        const { response } = await listProducts({
          queryParams: {
            id: productIds,
            limit,
          },
          countryCode,
        })
        products = response.products
      }
    }

    // Enrich Medusa products with Payload CMS description/details
    if (products.length > 0) {
      const { enrichProductsWithPayload } = await import("@lib/util/enrich-products")
      products = await enrichProductsWithPayload(products)
    }
  } catch (error) {
    console.error("Error fetching products for ProductCarousel block:", error)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="w-full py-16 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
      <div className="content-container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            {block.icon && block.icon !== "none" && (
              <div className="p-3.5 bg-primary-100/10 text-primary-600 rounded-2xl border border-primary-100/20 backdrop-blur-md shadow-sm">
                <DynamicIcon name={block.icon} className="w-6 h-6 text-black" />
              </div>
            )}
            <div>
              {block.heading && (
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                  {block.heading}
                </h2>
              )}
            </div>
          </div>

          {block.showViewAllButton && block.viewAllUrl && (
            <LocalizedClientLink
              href={block.viewAllUrl}
              className="group flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span>{block.viewAllLabel || "Zobacz wszystkie"}</span>
              <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LocalizedClientLink>
          )}
        </div>

        {/* Carousel / Slider */}
        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <ProductPreview product={product} region={region} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
