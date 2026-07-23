interface CacheEntry<T> {
  data: T
  expiresAt: number
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${encodeURIComponent(name)}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAgeSeconds?: number): void {
  const parts: string[] = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    "path=/",
    "SameSite=Lax",
  ]
  if (maxAgeSeconds !== undefined) {
    parts.push(`max-age=${maxAgeSeconds}`)
  }
  document.cookie = parts.join("; ")
}

function removeCookie(name: string): void {
  setCookie(name, "", 0)
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const raw = getCookie(`cache:${key}`)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() >= entry.expiresAt) {
      removeCookie(`cache:${key}`)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlMs: number
): Promise<void> {
  try {
    const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs }
    setCookie(`cache:${key}`, JSON.stringify(entry), Math.ceil(ttlMs / 1000))
  } catch {
    // silently fail
  }
}

export async function getPersist<T>(key: string): Promise<T | null> {
  try {
    const raw = getCookie(`persist:${key}`)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function setPersist<T>(key: string, value: T): Promise<void> {
  try {
    setCookie(`persist:${key}`, JSON.stringify(value))
  } catch {
    // silently fail
  }
}

export async function removePersist(key: string): Promise<void> {
  try {
    removeCookie(`persist:${key}`)
  } catch {
    // silently fail
  }
}
