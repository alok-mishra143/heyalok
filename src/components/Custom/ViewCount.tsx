"use client"

import { useState, useEffect } from "react"
import { Eye } from "lucide-react"
import NumberFlow from "../Custom/NumberFlow"
import { getCache, setCache } from "@/lib/idb-cache"

const CACHE_KEY = "view-count"
const ONE_HOUR_MS = 60 * 60 * 1000

const ViewCount = () => {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    let ignore = false

    async function syncViewCount() {
      const cached = await getCache<{ count: number }>(CACHE_KEY)

      if (cached && typeof cached.count === "number") {
        if (!ignore) setCount(cached.count)
        return
      }

      try {
        const res = await fetch("/api/view", { method: "POST" })
        if (!res.ok) throw new Error("Failed to fetch view count")

        const data = (await res.json()) as { count: number }
        await setCache(CACHE_KEY, { count: data.count }, ONE_HOUR_MS)

        if (!ignore) setCount(data.count)
      } catch {}
    }

    void syncViewCount()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="flex items-center gap-1 text-xs  p-1">
      <NumberFlow
        value={count}
        continuous
        isolate
        willChange
        className="leading-none tabular-nums"
      />
      <Eye size={13} />
    </div>
  )
}

export default ViewCount
