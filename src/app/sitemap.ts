import type { MetadataRoute } from "next"

export const dynamic = "force-dynamic"
import { navRoutes } from "@/data/data"
import { siteConfig } from "@/lib/site"

const routePriority = new Map([
  ["/", 1],
  ["/blog", 0.8],
  ["/books", 0.7],
  ["/game", 0.4],
])

async function fetchBlogSlugs(): Promise<{ slug: string; date: string }[]> {
  const { listR2Objects, getObjectContent } = await import("@/lib/r2")
  const keys = await listR2Objects("blogs/")
  const slugs: { slug: string; date: string }[] = []

  for (const key of keys) {
    if (!key.endsWith(".mdx")) continue
    const raw = await getObjectContent(key)
    const slugMatch = raw.match(/^slug:\s*"([^"]+)"$/m)
    const dateMatch = raw.match(/^date:\s*"([^"]+)"$/m)
    if (slugMatch) {
      slugs.push({ slug: slugMatch[1], date: dateMatch?.[1] ?? "" })
    }
  }

  return slugs
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const nav: MetadataRoute.Sitemap = navRoutes
    .filter((route) => route.footer || route.nav)
    .map((route) => ({
      url: new URL(route.href, siteConfig.url).toString(),
      lastModified,
      changeFrequency: route.href === "/" ? "monthly" : "weekly",
      priority: routePriority.get(route.href) ?? 0.5,
    }))

  const posts = await fetchBlogSlugs()
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => {
    const [day, month, year] = post.date.split(".")
    return {
      url: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
      lastModified: new Date(`${year}-${month}-${day}`),
      changeFrequency: "monthly",
      priority: 0.6,
    }
  })

  return [...nav, ...blogPosts]
}
