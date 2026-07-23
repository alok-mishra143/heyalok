import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPostClient } from "@/components/Blog/BlogPostClient"
import { siteConfig } from "@/lib/site"
import { fetchAllBlogData } from "@/lib/fetch-blog-data"

interface PageProps {
  params: Promise<{ blogtitle: string }>
}

function toIsoDate(dateStr: string): string {
  const [day, month, year] = dateStr.split(".")
  return `${year}-${month}-${day}`
}

export async function generateStaticParams() {
  try {
    const posts = await fetchAllBlogData()
    return posts.map((post) => ({ blogtitle: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { blogtitle } = await params
    const posts = await fetchAllBlogData()
    const post = posts.find((p) => p.slug === blogtitle)

    if (!post) return {}

    return {
      title: post.title,
      description: post.subtitle,
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.subtitle,
        url: `/blog/${post.slug}`,
        images: [{ url: "/og/blog.png", width: 1200, height: 630, alt: post.title }],
        type: "article",
        publishedTime: toIsoDate(post.date),
        tags: post.keywords.map((k) => k.label),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.subtitle,
        images: ["/og/blog.png"],
      },
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { blogtitle } = await params

  const posts = await fetchAllBlogData()
  const post = posts.find((p) => p.slug === blogtitle)

  if (!post) notFound()

  const relatedPosts = posts
    .filter((p) => p.slug !== blogtitle)
    .filter((p) => p.keywords.some((k) => post.keywords.some((pk) => pk.label === k.label)))
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
              { "@type": "ListItem", position: 3, name: post.title },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.subtitle,
            url: `${siteConfig.url}/blog/${post.slug}`,
            datePublished: toIsoDate(post.date),
            author: {
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          }),
        }}
      />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  )
}
