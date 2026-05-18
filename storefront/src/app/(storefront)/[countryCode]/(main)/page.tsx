import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import BlockRenderer from "@modules/blocks/BlockRenderer"
import LivePreviewClient from "@modules/blocks/LivePreviewClient"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { countryCode } = params
  const isPreview = searchParams.preview === "true"

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  let blocks: any[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.findGlobal({
      slug: "pages",
      draft: isPreview,
    })
    blocks = pages.homePage?.blocks || []
  } catch (error) {
    console.error("Error loading Payload pages global:", error)
  }

  return (
    <>
      <Hero />
      {isPreview && (
        <LivePreviewClient
          serverURL={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"}
        />
      )}
      {blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} region={region} countryCode={countryCode} />
      ) : (
        <div className="py-12">
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )}
    </>
  )
}
