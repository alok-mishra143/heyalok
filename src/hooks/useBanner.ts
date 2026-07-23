"use client"
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useMemo,
} from "react"
import { useSearchParams } from "next/navigation"
import { getCookie, readCache, setCookie, writeCache } from "@/lib/cookie-cache"

const COOKIE_NAME = "banner_cache"
const DEBUG_BANNER_PARAM = "debugbanner"

type BannerResponse = {
  url: string | null
  expiresAt?: number
}

const subscribe = () => () => {}

const getCachedBannerUrl = (debugBanner: boolean) => {
  if (debugBanner) return null

  const cached = readCache<{ url: string; expiresAt: number }>(
    getCookie(COOKIE_NAME)
  )
  return typeof cached?.url === "string" ? cached.url : null
}

export const useBanner = () => {
  const searchParams = useSearchParams()
  const debugBanner = searchParams.get(DEBUG_BANNER_PARAM) === "true"
  const getBannerSnapshot = useCallback(
    () => getCachedBannerUrl(debugBanner),
    [debugBanner]
  )
  const cachedUrl = useSyncExternalStore(
    subscribe,
    getBannerSnapshot,
    () => null
  )
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (debugBanner) {
      setCookie(COOKIE_NAME, "", 0)
    }

    if (!debugBanner && cachedUrl) {
      return
    }

    const bannerEndpoint = debugBanner
      ? `/api/banner?${DEBUG_BANNER_PARAM}=true`
      : "/api/banner"

    fetch(bannerEndpoint, debugBanner ? { cache: "no-store" } : undefined)
      .then(async (res) => {
        if (!res.ok) {
          console.warn("useBanner: API returned", res.status)
          return null
        }
        return res.json() as Promise<BannerResponse>
      })
      .then((data) => {
        if (!data) {
          setRemoteUrl(null)
          return
        }

        const bannerUrl = typeof data.url === "string" ? data.url : null
        if (!debugBanner && bannerUrl && typeof data.expiresAt === "number") {
          writeCache(COOKIE_NAME, { url: bannerUrl }, data.expiresAt)
        }
        setRemoteUrl(bannerUrl)
      })
      .catch((err) => {
        console.warn("useBanner: fetch failed", err)
        setRemoteUrl(null)
      })
  }, [cachedUrl, debugBanner])

  return useMemo(
    () => ({ bannerUrl: cachedUrl ?? remoteUrl, muted, setMuted }),
    [cachedUrl, remoteUrl, muted, setMuted]
  )
}
