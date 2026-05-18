import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { RichText } from "@payloadcms/richtext-lexical/react"
import LivePreviewClient from "@modules/blocks/LivePreviewClient"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import * as Icons from "lucide-react"

type Props = {
  params: Promise<{
    countryCode: string
    slug: string
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams
  const isPreview = searchParams.preview === "true"

  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: "static-pages",
      where: {
        slug: {
          equals: params.slug,
        },
      },
      draft: isPreview,
      limit: 1,
    })

    const page = res.docs[0]
    if (!page) return {}

    return {
      title: page.seo?.meta_title || page.title,
      description: page.seo?.meta_description || undefined,
    }
  } catch (error) {
    return {}
  }
}

export default async function StaticPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { slug } = params
  const isPreview = searchParams.preview === "true"

  let page: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: "static-pages",
      where: {
        slug: {
          equals: slug,
        },
      },
      draft: isPreview,
      limit: 1,
    })
    page = res.docs[0]
  } catch (error) {
    console.error("Error fetching static page:", error)
  }

  // 404 if page doesn't exist, or if it is not published and not in preview mode
  if (!page || (page.status !== "published" && !isPreview)) {
    return notFound()
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/30 pb-20">
      {isPreview && (
        <LivePreviewClient
          serverURL={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"}
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 py-16 md:py-24">
        {/* Subtle Decorative Background Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-neutral-100/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neutral-100/30 rounded-full filter blur-3xl" />

        <div className="content-container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb / Back link */}
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors duration-300 mb-6 group"
            >
              <Icons.ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Powrót do sklepu
            </LocalizedClientLink>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {page.title}
            </h1>

            {page.updatedAt && (
              <p className="text-xs text-gray-400 font-semibold mt-4 flex items-center gap-1.5">
                <Icons.Clock className="w-3.5 h-3.5" />
                Ostatnia aktualizacja:{" "}
                {new Date(page.updatedAt).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="content-container mx-auto px-4 mt-12 md:mt-16">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-12 shadow-sm">
          <article className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-black prose-a:underline hover:prose-a:text-neutral-700 transition-colors duration-300">
            <RichText data={page.content} />
          </article>
        </div>
      </div>
    </div>
  )
}
