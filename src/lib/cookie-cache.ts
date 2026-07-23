export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : undefined
}

export function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
}

export function readCache<T extends { expiresAt: number }>(raw: string | undefined): T | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as T
    if (Date.now() < parsed.expiresAt) return parsed
  } catch {
    /* corrupted cookie, ignore */
  }
  return null
}

export function writeCache<T extends object>(name: string, data: T, expiresAt: number) {
  const maxAge = Math.ceil((expiresAt - Date.now()) / 1000)
  if (maxAge <= 0) return
  setCookie(name, JSON.stringify({ ...data, expiresAt }), maxAge)
}
