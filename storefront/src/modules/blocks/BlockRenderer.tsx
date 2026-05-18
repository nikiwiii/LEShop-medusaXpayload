import React from "react"
import { HttpTypes } from "@medusajs/types"
import ProductCarousel from "./ProductCarousel"
import CategoryCarousel from "./CategoryCarousel"
import LatestBlogs from "./LatestBlogs"

interface BlockRendererProps {
  blocks: any[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function BlockRenderer({ blocks, region, countryCode }: BlockRendererProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <div className="w-full flex flex-col">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case "product-carousel":
            return (
              <ProductCarousel
                key={`${block.blockType}-${index}`}
                block={block}
                region={region}
                countryCode={countryCode}
              />
            )
          case "category-carousel":
            return (
              <CategoryCarousel
                key={`${block.blockType}-${index}`}
                block={block}
              />
            )
          case "latest-blogs":
            return (
              <LatestBlogs
                key={`${block.blockType}-${index}`}
                block={block}
              />
            )
          default:
            console.warn(`Unrecognized block type: ${block.blockType}`)
            return null
        }
      })}
    </div>
  )
}
