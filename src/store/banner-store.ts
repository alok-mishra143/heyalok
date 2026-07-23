import { create } from "zustand"

interface BannerState {
  /** The signed banner video URL, or null if unavailable */
  bannerUrl: string | null
  /** Whether a fetch is currently in-flight */
  isLoading: boolean
  /** Error message if the last fetch failed */
  error: string | null
  /** Fetch (or refresh) the banner URL from the server */
  fetchBanner: () => Promise<void>
}

export const useBannerStore = create<BannerState>((set) => ({
  bannerUrl: null,
  isLoading: false,
  error: null,
  fetchBanner: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch("/api/banner")

      if (!res.ok) {
        throw new Error(`Failed to fetch banner (${res.status})`)
      }

      const data = (await res.json()) as { url: string | null }

      set({ bannerUrl: data.url, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      })
    }
  },
}))
