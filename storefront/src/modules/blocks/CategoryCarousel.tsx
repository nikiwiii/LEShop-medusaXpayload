import { getPayload } from "payload"
import configPromise from "@payload-config"
import { DynamicIcon } from "./DynamicIcon"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import * as Icons from "lucide-react"

interface CategoryCarouselProps {
  block: {
    heading?: string
    icon?: string
    sourceType: "all" | "manual"
    categories?: any[]
    visibleCount?: number
    categoryUrlPrefix?: string
  }
}

export default async function CategoryCarousel({ block }: CategoryCarouselProps) {
  let categories: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })

    if (block.sourceType === "all") {
      const res = await payload.find({
        collection: "categories",
        limit: block.visibleCount || 6,
      })
      categories = res.docs
    } else if (block.sourceType === "manual" && block.categories?.length) {
      categories = block.categories
    }
  } catch (error) {
    console.error("Error fetching categories for CategoryCarousel block:", error)
  }

  if (categories.length === 0) {
    return null
  }

  const prefix = block.categoryUrlPrefix || "/categories"

  return (
    <div className="w-full py-16 border-b border-gray-100 bg-white">
      <div className="content-container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          {block.icon && block.icon !== "none" && (
            <div className="p-3.5 bg-neutral-100 text-neutral-800 rounded-2xl border border-neutral-200 shadow-sm">
              <DynamicIcon name={block.icon} className="w-6 h-6 text-black" />
            </div>
          )}
          <div>
            {block.heading && (
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                {block.heading}
              </h2>
            )}
            <p className="text-sm text-gray-500 mt-1.5 font-medium">
              Przeglądaj według kategorii produktowych
            </p>
          </div>
        </div>

        {/* Carousel / Slider */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4 scroll-smooth">
            {categories.map((category) => {
              const imageUrl = typeof category.image === "object" ? category.image?.url : undefined
              const hasImage = !!imageUrl

              return (
                <LocalizedClientLink
                  key={category.id}
                  href={`${prefix}/${category.slug}`}
                  className="w-[200px] shrink-0 snap-start group relative flex flex-col justify-end h-56 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 transition-all duration-500 hover:scale-[1.03] shadow-lg"
                >
                  {/* Background Image / Gradient */}
                  {hasImage ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800" />
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col items-center text-center">
                    <div className="mb-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Icons.ChevronRight className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-wide">
                      {category.name}
                    </span>
                    {category.description && (
                      <span className="text-xs text-gray-300 font-medium mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {category.description}
                      </span>
                    )}
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
