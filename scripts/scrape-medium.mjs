#!/usr/bin/env node

import { XMLParser } from "fast-xml-parser"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { createInterface } from "readline"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")

function readStdin() {
  return new Promise((resolve) => {
    let data = ""
    process.stdin.setEncoding("utf-8")
    process.stdin.on("data", (chunk) => (data += chunk))
    process.stdin.on("end", () => resolve(data.trim()))
  })
}

const RSS_URL = "https://medium.com/feed/@zerion0"

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
})

const rl = createInterface({ input: process.stdin, output: process.stdout })
const question = (q) => new Promise((r) => rl.question(q, r))

function slugify(link) {
  try {
    const path = new URL(link).pathname
    const last = path.split("/").filter(Boolean).pop() || ""
    return last.replace(/-[a-z0-9]{12}$/, "")
  } catch {
    return ""
  }
}

function extractSubtitle(content) {
  const stripped = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
  if (stripped.length <= 100) return stripped
  return stripped.slice(0, 100) + "..."
}

function formatDate(pubDate) {
  const d = new Date(pubDate)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

function mergeAdjacentPre(html) {
  let result = ""
  let lastIndex = 0
  const preBlocks = []
  const preRegex = /<pre>([\s\S]*?)<\/pre>/g
  let m

  while ((m = preRegex.exec(html)) !== null) {
    preBlocks.push({
      start: m.index,
      end: m.index + m[0].length,
      content: m[1].replace(/<br\s*\/?>/gi, "\n"),
    })
  }

  let i = 0
  while (i < preBlocks.length) {
    const group = [preBlocks[i].content]
    const groupStart = preBlocks[i].start
    let groupEnd = preBlocks[i].end

    let j = i + 1
    while (j < preBlocks.length) {
      const gap = html.slice(groupEnd, preBlocks[j].start)
      if (/^\s*$/.test(gap)) {
        group.push(preBlocks[j].content)
        groupEnd = preBlocks[j].end
        j++
      } else break
    }

    result += html.slice(lastIndex, groupStart)
    result += `<pre>${group.join("\n")}</pre>`
    lastIndex = groupEnd
    i = j
  }

  result += html.slice(lastIndex)
  return result
}

function addElementIds(html) {
  let headingIdx = 0
  let elIdx = 0

  const blockRe = /<(p|h[1-6]|ul|ol|li|blockquote|pre|figure|hr|img|table)([^>]*?)>/gi
  const tokens = []
  let m

  while ((m = blockRe.exec(html)) !== null) {
    tokens.push({
      start: m.index,
      end: m.index + m[0].length,
      raw: m[0],
      tag: m[1].toLowerCase(),
      isHeading: /^h[1-6]$/.test(m[1]),
    })
  }

  let result = ""
  let lastEnd = 0

  for (const tok of tokens) {
    result += html.slice(lastEnd, tok.start)

    if (tok.isHeading) {
      const cleaned = tok.raw.replace(/\s+id\s*=\s*"[^"]*"/gi, "")
      result += cleaned.replace(/>$/, ` id="blog-heading-${headingIdx++}">`)
      elIdx = 0
    } else {
      const hasId = /\sid\s*=\s*"[^"]*"/i.test(tok.raw)
      const idVal = `blog-heading-${headingIdx}-el-${elIdx++}`
      if (hasId) {
        result += tok.raw.replace(/\sid\s*=\s*"([^"]*)"/i, ` id="${idVal}"`)
      } else {
        result += tok.raw.replace(/>$/, ` id="${idVal}">`)
      }
    }

    lastEnd = tok.end
  }

  result += html.slice(lastEnd)
  return result
}

function cleanHtml(html) {
  let cleaned = mergeAdjacentPre(html)
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "")
  cleaned = cleaned.replace(
    /<img\s+[^>]*src=["']https?:\/\/medium\.com\/_[^"']*["'][^>]*>/gi,
    ""
  )
  cleaned = addElementIds(cleaned)
  cleaned = cleaned.replace(
    /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi,
    '<img src="$1" loading="lazy" />'
  )
  return cleaned
}

async function main() {
  console.log("Fetching Medium RSS feed...\n")

  const response = await fetch(RSS_URL, {
    headers: { Accept: "application/rss+xml" },
  })

  if (!response.ok) {
    console.error(`Failed to fetch RSS: ${response.status}`)
    process.exit(1)
  }

  const xml = await response.text()
  const feed = parser.parse(xml)

  const rawItems = feed.rss.channel.item
  const items = Array.isArray(rawItems) ? rawItems : [rawItems]

  console.log(`Found ${items.length} posts.\n`)

  for (let i = 0; i < items.length; i++) {
    console.log(`  ${i + 1}. ${items[i].title}`)
  }

  console.log()

  let count = items.length

  if (process.argv[2]) {
    count = Math.min(parseInt(process.argv[2], 10) || items.length, items.length)
    console.log(`Scraping ${count} posts.`)
  } else if (process.stdin.isTTY) {
    const answer = await question(
      `How many latest posts to scrape? (1-${items.length}, press Enter for all): `
    )
    if (answer.trim() !== "") {
      count = Math.min(parseInt(answer, 10) || items.length, items.length)
    }
  } else {
    const input = await readStdin()
    if (input.trim() !== "") {
      count = Math.min(parseInt(input, 10) || items.length, items.length)
    }
    console.log(`Scraping ${count} posts.`)
  }

  const selected = items.slice(0, count)

  const blogDir = resolve(ROOT, "src", "blog")
  if (!existsSync(blogDir)) {
    mkdirSync(blogDir, { recursive: true })
  }

  const posts = []
  let scraped = 0

  for (const item of selected) {
    const slug = slugify(item.link)
    if (!slug) {
      console.warn(`  ⚠ Skipping: could not slugify "${item.title}"`)
      continue
    }

    const raw = item["content:encoded"] || item.description || ""
    const html = cleanHtml(raw)
    const subtitle = extractSubtitle(raw)
    const date = formatDate(item.pubDate)
    const categories = !item.category
      ? []
      : Array.isArray(item.category)
        ? item.category
        : [item.category]

    const mdx = `---
title: ${JSON.stringify(item.title)}
subtitle: ${JSON.stringify(subtitle)}
date: "${date}"
slug: "${slug}"
keywords: ${JSON.stringify(categories)}
link: "${item.link}"
---

${html}
`

    writeFileSync(resolve(blogDir, `${slug}.mdx`), mdx, "utf-8")
    console.log(`  ✓ ${slug}.mdx`)

    posts.push({
      title: item.title,
      subtitle,
      date,
      isoDate: item.pubDate,
      slug,
      keywords: categories,
      link: item.link,
      content: html,
    })
    scraped++
  }

  const index = posts.map(({ content: _content, ...rest }) => rest)

  const contentMap = {}
  for (const post of posts) {
    contentMap[post.slug] = post.content
  }

  const indexFile = {
    posts: index,
    content: contentMap,
  }

  const indexPath = resolve(ROOT, "src", "data", "blog-index.json")
  writeFileSync(indexPath, JSON.stringify(indexFile, null, 2) + "\n", "utf-8")
  console.log(`  ✓ Updated src/data/blog-index.json`)

  console.log(`\nDone. ${scraped} posts saved to src/blog/`)
  rl.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
