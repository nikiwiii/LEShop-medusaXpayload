import { getPayload } from "payload"
import configPromise from "@payload-config"
import { DynamicIcon } from "./DynamicIcon"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import * as Icons from "lucide-react"

interface LatestBlogsProps {
  block: {
    heading?: string
    icon?: string
    postsCount?: number
    filterByCategory?: boolean
    category?: any
    showViewAllButton?: boolean
    viewAllLabel?: string
    viewAllUrl?: string
  }
}

export default async function LatestBlogs({ block }: LatestBlogsProps) {
  let posts: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })

    const where: any = {
      status: {
        equals: "published",
      },
    }

    if (block.filterByCategory && block.category) {
      const categoryId = typeof block.category === "object" ? block.category.id : block.category
      where.category = {
        equals: categoryId,
      }
    }

    const res = await payload.find({
      collection: "blog-posts",
      where,
      limit: block.postsCount || 3,
      sort: "-publishedAt",
    })
    posts = res.docs
  } catch (error) {
    console.error("Error fetching posts for LatestBlogs block:", error)
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className="w-full py-20 border-b border-gray-100 bg-gradient-to-b from-gray-50/30 to-white">
      <div className="content-container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
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
                Aktualności, trendy i porady ze świata mody i stylu
              </p>
            </div>
          </div>

          {block.showViewAllButton && block.viewAllUrl && (
            <LocalizedClientLink
              href={block.viewAllUrl}
              className="group flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span>{block.viewAllLabel || "Przejdź do bloga"}</span>
              <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LocalizedClientLink>
          )}
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const coverUrl = typeof post.coverImage === "object" ? post.coverImage?.url : undefined
            const formattedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : null

            return (
              <LocalizedClientLink
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                {/* Image Wrapper */}
                <div className="relative h-60 w-full overflow-hidden bg-neutral-100">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-100 to-neutral-200">
                      <Icons.FileText className="w-12 h-12 text-neutral-400" />
                    </div>
                  )}

                  {/* Category Tag */}
                  {post.category && (
                    <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-bold rounded-full border border-white/20 shadow-sm">
                      {typeof post.category === "object" ? post.category.name : "Kategoria"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  {formattedDate && (
                    <span className="text-xs text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                      <Icons.Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed font-medium mb-5">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read More Link */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-1.5 text-sm font-bold text-gray-900 group-hover:text-neutral-700 transition-colors duration-300">
                    <span>Czytaj wpis</span>
                    <Icons.ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
