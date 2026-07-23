"use client"

import GitHubActivity, { type GithubData } from "../Custom/GitHubActivity"
import { Zed } from "../asserts/Icon/zed"
import NumberFlow from "../Custom/NumberFlow"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getCache, setCache } from "@/lib/idb-cache"

const CACHE_KEY = "github-activity"
const TTL = 24 * 60 * 60 * 1000

function useDurationValue(totalSeconds?: number | null) {
  if (!Number.isFinite(totalSeconds) || !totalSeconds || totalSeconds <= 0) {
    return { value: 0, suffix: "min" }
  }

  const seconds = Math.floor(totalSeconds)

  if (seconds >= 3600) {
    const hours = seconds / 3600
    return { value: Math.round(hours * 10) / 10, suffix: "hrs" }
  }

  const minutes = Math.floor(seconds / 60)
  return { value: minutes, suffix: "min" }
}

const AlokGithub = () => {
  const { data } = useQuery({
    queryKey: ["github"],
    queryFn: async () => {
      const cached = await getCache(CACHE_KEY)
      if (cached) return cached
      const res = await fetch("/api/github")
      if (!res.ok) return null
      const data = await res.json()
      await setCache(CACHE_KEY, data, TTL)
      return data
    },
    placeholderData: keepPreviousData,
    staleTime: TTL,
  })

  const { value, suffix } = useDurationValue(data?.wakatime)

  return (
    <section className="w-full shrink-0 overflow-hidden font-pixel">
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <h1 className="text-2xl leading-none">Github</h1>

        <div className="flex items-center gap-3 rounded-full border bg-background/60 px-3 py-1.5 text-muted-foreground shadow-sm backdrop-blur">
          <span className="inline-flex items-baseline gap-0.5 text-xs font-medium">
            <NumberFlow
              value={value}
              continuous
              isolate
              willChange
              format={
                value % 1 === 0
                  ? undefined
                  : { minimumFractionDigits: 1, maximumFractionDigits: 1 }
              }
              className="tabular-nums"
            />
            {suffix}
          </span>

          <span className="h-4 w-px bg-border" />

          <div className="flex items-center gap-1.5">
            <Zed className="size-4 text-foreground" />
            <span className="text-xs font-medium text-foreground">Zed</span>
          </div>
        </div>
      </div>

      <div className="relative scrollbar-thin [scrollbar-color:hsl(var(--muted-foreground))_transparent] overflow-x-auto overscroll-x-contain">
        <GitHubActivity data={data?.github} />
      </div>
    </section>
  )
}

export default AlokGithub
