"use client"

import { useRef, useCallback } from "react"

type SoundName = "blob" | "error" | "pop" | "cutemeow" | "clink" | "windhit"

const SOUND_LOADERS: Record<SoundName, () => Promise<string>> = {
  blob: () => import("@/components/asserts/sound/blob").then((m) => m.default),
  error: () => import("@/components/asserts/sound/error").then((m) => m.default),
  pop: () => import("@/components/asserts/sound/pop").then((m) => m.default),
  cutemeow: () => import("@/components/asserts/sound/cuteMeow").then((m) => m.default),
  clink: () => import("@/components/asserts/sound/clink").then((m) => m.default),
  windhit: () => import("@/components/asserts/sound/windhit").then((m) => m.default),
}

export function useSoundEffect(soundName: SoundName) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadedRef = useRef(false)

  const getAudio = useCallback(async (): Promise<HTMLAudioElement | null> => {
    if (audioRef.current) return audioRef.current
    if (loadedRef.current) return null
    loadedRef.current = true
    const url = await SOUND_LOADERS[soundName]()
    const audio = new Audio(url)
    audioRef.current = audio
    return audio
  }, [soundName])

  const play = useCallback(
    async ({ vol = 0.3 }: { vol?: number } = {}) => {
      try {
        const audio = await getAudio()
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
        audio.volume = Math.max(0, Math.min(1, vol))
        audio.play().catch((err) => console.warn("Sound play failed:", err))
      } catch {
        // Sound loading failed silently
      }
    },
    [getAudio]
  )

  return { play }
}
