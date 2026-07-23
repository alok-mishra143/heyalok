"use client"

import "@/css/blogcontent.css"
import React, { useCallback, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Check, Copy } from "lucide-react"
import Image from "next/image"
import type { Components } from "react-markdown"


function isYouTubeUrl(href: string) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(
    href
  )
}

function getYouTubeEmbedUrl(href: string) {
  const match = href.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md p-0 text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}

function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const text =
    React.Children.toArray(children).reduce<string>((acc, child) => {
      if (typeof child === "string") return acc + child
      if (React.isValidElement(child)) {
        const el = child as React.ReactElement<{ children?: React.ReactNode }>
        return acc + extractText(el.props.children)
      }
      return acc
    }, "") || ""

  return (
    <pre {...props}>
      <CopyButton text={text} />
      {children}
    </pre>
  )
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: React.ReactNode }).children)
  }
  return ""
}

function MarkdownImage({ src, alt, node: _node, ..._rest }: React.ImgHTMLAttributes<HTMLImageElement> & { node?: unknown }) {
  const [loaded, setLoaded] = useState(false)
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null)

  const srcStr = typeof src === "string" ? src : undefined
  if (!srcStr) return null

  const aspectRatio = naturalRatio ?? 16 / 9

  return (
    <span
      className="relative mx-auto my-6 flex overflow-hidden rounded-xl border border-border/30 bg-muted/20 shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.18)]"
      style={{ aspectRatio: String(aspectRatio) }}
    >
      {!loaded && (
        <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-muted/30 to-transparent" />
      )}
      <Image
        src={srcStr}
        alt={alt || ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 720px"
        style={{ objectFit: "contain" }}
        onLoad={(e) => {
          const img = e.currentTarget
          const w = img.naturalWidth
          const h = img.naturalHeight
          if (w > 0 && h > 0) {
            setNaturalRatio(w / h)
          }
          setLoaded(true)
        }}
      />
    </span>
  )
}

const components: Components = {
  pre: PreBlock,
  img: MarkdownImage,
  a: ({ children, href, node: _node, ...props }) => {
    if (!href || typeof href !== "string") return <>{children}</>

    if (isYouTubeUrl(href)) {
      const embedUrl = getYouTubeEmbedUrl(href)
      if (embedUrl) {
        return (
          <span className="my-3 flex aspect-video overflow-hidden rounded-sm border border-border/30">
            <iframe
              src={embedUrl}
              className="size-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </span>
        )
      }
    }

    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  },
}

type Props = {
  children: string
}

function CustomMarkdownComponent({ children }: Props) {
  return (
    <div className="medium-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

const CustomMarkdown = React.memo(CustomMarkdownComponent)
CustomMarkdown.displayName = "CustomMarkdown"

export { CustomMarkdown }
