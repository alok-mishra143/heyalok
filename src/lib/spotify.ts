import { unstable_cache } from "next/cache"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing"
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpotifyData =
  | {
      isPlaying: boolean
      title: string
      artist: string
      albumArt: string | null
      songUrl: string | null
      lastPlayedAt?: string | null
    }
  | { isConfigured: false; error: string }
  | { error: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN ?? "",
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Token refresh failed: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  if (!data.access_token) {
    throw new Error("No access_token in token response.")
  }

  return data.access_token as string
}

async function fetchNowPlaying(accessToken: string) {
  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  if (res.status !== 200) return null

  const data = await res.json()
  return data ?? null
}

async function fetchRecentlyPlayed(accessToken: string) {
  const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  if (res.status !== 200) return null

  const data = await res.json()
  return data ?? null
}

function parseNowPlaying(
  song: Record<string, unknown> | null
): SpotifyData | null {
  if (!song) return null

  const item = song.item as Record<string, unknown> | undefined
  if (!item) return null
  const artists = (item.artists as Array<{ name: string }> | undefined) ?? []

  return {
    isPlaying: (song.is_playing as boolean) ?? false,
    title: (item.name as string) ?? "Unknown Track",
    artist: artists.map((a) => a.name).join(", ") || "Unknown Artist",
    albumArt:
      (
        (item.album as Record<string, unknown>)?.images as Array<{
          url: string
        }>
      )?.[1]?.url ?? null,
    songUrl:
      ((item.external_urls as Record<string, unknown>)?.spotify as string) ??
      null,
  }
}

function parseRecentlyPlayed(
  recent: Record<string, unknown> | null
): SpotifyData | null {
  if (!recent) return null

  type RecentItem = { track: Record<string, unknown>; played_at: string }
  const items = (recent.items as RecentItem[] | undefined) ?? []
  const track = items[0]?.track
  if (!track) return null
  const artists = (track.artists as Array<{ name: string }> | undefined) ?? []

  return {
    isPlaying: false,
    title: (track.name as string) ?? "Unknown Track",
    artist: artists.map((a) => a.name).join(", ") || "Unknown Artist",
    albumArt:
      (
        (track.album as Record<string, unknown>)?.images as Array<{
          url: string
        }>
      )?.[1]?.url ?? null,
    songUrl:
      ((track.external_urls as Record<string, unknown>)?.spotify as string) ??
      null,
    lastPlayedAt: items[0].played_at ?? null,
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

async function fetchSpotifyData(): Promise<SpotifyData> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return {
      isConfigured: false,
      error: "Spotify env vars are not configured.",
    }
  }

  const accessToken = await getAccessToken()

  const nowPlaying = await fetchNowPlaying(accessToken)
  const parsed = parseNowPlaying(nowPlaying)
  if (parsed) return parsed

  const recentlyPlayed = await fetchRecentlyPlayed(accessToken)
  const parsedRecent = parseRecentlyPlayed(recentlyPlayed)
  if (parsedRecent) return parsedRecent

  return {
    isPlaying: false,
    title: "Offline",
    artist: "Not listening right now",
    albumArt: null,
    songUrl: "https://open.spotify.com",
  }
}

export const getSpotifyData = unstable_cache(
  fetchSpotifyData,
  ["spotify-data"],
  {
    revalidate: 60,
    tags: ["spotify-data"],
  }
)
