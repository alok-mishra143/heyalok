"use client"

import Image from "next/image"
import Link from "next/link"

import type { SpotifyData } from "@/lib/spotify"
import CurvArrow1 from "../asserts/arrows/CurvArrow1"
import ManSettingLaptop from "../asserts/ManSettingLaptop"

const overlayBars = [18, 28, 14, 24]

function formatLastPlayed(dateStr: string): string {
  const diffMins = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 60_000
  )
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const h = Math.floor(diffMins / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

type Props = { data: SpotifyData }

const SpotifyPlayer = ({ data }: Props) => {
  const isTrack = "title" in data
  const isPlaying = isTrack && data.isPlaying
  const title = isTrack ? data.title : "Unavailable"
  const artist = isTrack ? data.artist : "–"
  const albumArt = isTrack ? data.albumArt : null
  const songUrl = isTrack
    ? (data.songUrl ?? "https://open.spotify.com")
    : "https://open.spotify.com"
  const lastPlayedAt = isTrack ? (data.lastPlayedAt ?? null) : null

  return (
    <div className="relative flex max-w-sm flex-col">
      <Link
        href={songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-100/5 p-4 text-primary shadow-xl shadow-black/20 backdrop-blur transition-colors hover:border-white/20 dark:bg-zinc-950/80 dark:shadow-black/40">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--primary),0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(var(--secondary),0.08),transparent_35%)]"
          />

          {/* Album art */}
          <div className="relative z-10 size-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_24px_rgba(var(--primary),0.12)]">
            {albumArt ? (
              <>
                <Image
                  src={albumArt}
                  alt={title}
                  fill
                  sizes="64px"
                  className="object-cover"
                  quality={30}
                />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-end justify-center gap-0.75 bg-black/50 px-2.5 pb-2">
                    {overlayBars.map((height, i) => (
                      <span
                        key={i}
                        style={{ height: Math.max(5, height * 0.7) }}
                        className="w-full rounded-full bg-white/90"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col justify-end gap-1.5 bg-white/5 px-3 py-3">
                {overlayBars.map((height, i) => (
                  <span
                    key={i}
                    style={{ height }}
                    className="w-full rounded-full bg-linear-to-r from-primary via-primary/80 to-secondary"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="relative z-10 min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-1.5">
              {isPlaying ? (
                <span className="flex items-center gap-1 text-[9px] font-semibold tracking-widest text-green-700 uppercase dark:text-green-300">
                  <span>●</span>
                  Now Playing
                </span>
              ) : lastPlayedAt ? (
                <span className="text-[9px] font-medium tracking-widest text-zinc-700 uppercase dark:text-zinc-300">
                  {formatLastPlayed(lastPlayedAt)}
                </span>
              ) : (
                <span className="text-[9px] font-medium tracking-widest text-zinc-700 uppercase dark:text-zinc-300">
                  Offline
                </span>
              )}
            </div>

            <p className="truncate text-sm leading-snug font-semibold">
              {title}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {artist}
            </p>
          </div>

          {/* Spotify label */}
          <p className="relative z-10 text-[10px] font-medium tracking-[0.28em] text-zinc-700 uppercase dark:text-zinc-300">
            Spotify
          </p>
        </div>
      </Link>

      <div className="h-px w-full bg-linear-to-r from-transparent via-primary to-transparent" />

      {/* Side decoration */}
      <div className="pointer-events-none absolute -left-25 z-40 hidden w-full text-primary/40 lg:block">
        <CurvArrow1
          ClassName="h-20 w-20 rotate-180 text-primary/40"
          strokeWidth={2.5}
        />
        <span className="flex items-center justify-center">
          <p className="absolute top-0 -left-25 text-xs leading-tight text-primary/70">
            LockIn Mode
          </p>
          <ManSettingLaptop className="text-primary/70m absolute top-0 -left-33 h-7 w-7 text-xs leading-tight" />
        </span>
      </div>
    </div>
  )
}

export default SpotifyPlayer
