import "server-only";
import { listR2Objects, getObjectContent } from "@/lib/r2";
import type { BlogPost } from "@/data/blog";

type BlogData = (BlogPost & { content: string })[];

const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

let cache: BlogData | null = null;
let cacheTime = 0;
let loadingPromise: Promise<BlogData> | null = null;

function parseBlog(raw: string): (BlogPost & { content: string }) | null {
  if (!raw.startsWith("---")) return null;

  const lines = raw.split("\n");

  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }

  if (end === -1) return null;

  const fm: Record<string, unknown> = {};

  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        fm[key] = JSON.parse(value);
      } catch {
        fm[key] = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^"|"$/g, ""));
      }
    } else if (value.startsWith('"') && value.endsWith('"')) {
      fm[key] = value.slice(1, -1);
    } else {
      fm[key] = value;
    }
  }

  if (typeof fm.title !== "string" || typeof fm.slug !== "string") {
    return null;
  }

  return {
    title: fm.title,
    subtitle: typeof fm.subtitle === "string" ? fm.subtitle : "",
    date: typeof fm.date === "string" ? fm.date : "",
    slug: fm.slug,
    keywords: Array.isArray(fm.keywords)
      ? fm.keywords.map((k) => ({ label: String(k) }))
      : [],
    link: typeof fm.link === "string" ? fm.link : "",
    content: lines.slice(end + 1).join("\n").trim(),
  };
}

async function loadBlogs(): Promise<BlogData> {
  const keys = await listR2Objects("blogs/");

  const posts = (
    await Promise.all(
      keys
        .filter((key) => key.endsWith(".mdx"))
        .map(async (key) => {
          try {
            const raw = await getObjectContent(key);
            return parseBlog(raw);
          } catch {
            return null;
          }
        })
    )
  ).filter((p): p is BlogPost & { content: string } => p !== null);

  posts.sort((a, b) => {
    const [da, ma, ya] = a.date.split(".").map(Number);
    const [db, mb, yb] = b.date.split(".").map(Number);

    return (
      new Date(yb, mb - 1, db).getTime() -
      new Date(ya, ma - 1, da).getTime()
    );
  });

  return posts;
}

export async function fetchAllBlogData(): Promise<BlogData> {
  const now = Date.now();

  if (cache && now - cacheTime < CACHE_TTL) {
    return cache;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = loadBlogs()
    .then((data) => {
      cache = data;
      cacheTime = Date.now();
      return data;
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}
