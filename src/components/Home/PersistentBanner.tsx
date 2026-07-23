"use client"

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  Suspense,
  type ReactNode,
} from "react"
import { VolumeX, Volume2 } from "lucide-react"
import { useBanner } from "@/hooks/useBanner"
import { usePathname } from "next/navigation"
import CurvArrow1 from "../asserts/arrows/CurvArrow1"

type BannerContextValue = {
  muted: boolean
  setMuted: React.Dispatch<React.SetStateAction<boolean>>
  bannerUrl: string | null
}

const BannerContext = createContext<BannerContextValue | null>(null)

export function useBannerContext(): BannerContextValue {
  const ctx = useContext(BannerContext)
  return ctx ?? { muted: true, setMuted: () => {}, bannerUrl: null }
}

function BannerInner({ children }: { children: ReactNode }) {
  const { bannerUrl, muted, setMuted } = useBanner()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [shouldLoad, setShouldLoad] = useState(isHome)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !bannerUrl || isHome) return

    setShouldLoad(false)
    loadedRef.current = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [bannerUrl, isHome])


  useEffect(() => {
    if (!isHome || !bannerUrl) return
    const videoLink = document.createElement("link")
    videoLink.rel = "preload"
    videoLink.as = "video"
    videoLink.href = bannerUrl
    videoLink.fetchPriority = "high"
    document.head.appendChild(videoLink)

    const posterLink = document.createElement("link")
    posterLink.rel = "preload"
    posterLink.as = "image"
    posterLink.href = "/banner-poster.svg"
    posterLink.fetchPriority = "high"
    document.head.appendChild(posterLink)

    return () => {
      videoLink.remove()
      posterLink.remove()
    }
  }, [bannerUrl, isHome])

  return (
    <BannerContext.Provider value={{ bannerUrl, muted, setMuted }}>
      {bannerUrl && (
        <div
          ref={containerRef}
          className={`absolute top-0 left-0 z-0 w-full ${
            isHome ? "" : "pointer-events-none opacity-0"
          }`}
        >
          <video
            ref={videoRef}
            poster={isHome ? "/banner-poster.svg" : undefined}
            autoPlay={isHome}
            muted={muted}
            loop
            playsInline
            preload={isHome ? "auto" : "none"}
            aria-hidden="true"
            className="h-40 w-full rounded-b-md object-cover bg-muted"
          >
            {isHome && <source src={bannerUrl} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
          {shouldLoad && (
            <>
              <button
                type="button"
                onClick={() => setMuted((prev) => !prev)}
                className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-md bg-black/50 text-white transition-colors hover:bg-black/70"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <div className="pointer-events-none absolute top-10 -left-30 z-50 hidden lg:block">
                <CurvArrow1
                  ClassName="h-auto w-28 -rotate-180 -scale-y-100 text-primary/40"
                  strokeWidth={2.5}
                />
                <span className="flex -translate-x-60 -translate-y-10 text-xs leading-tight text-primary/70">
                  This Banner will change in every hour :)
                </span>
              </div>
            </>
          )}
        </div>
      )}
      {children}
    </BannerContext.Provider>
  )
}

export function PersistentBanner({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <BannerInner>{children}</BannerInner>
    </Suspense>
  )
}
