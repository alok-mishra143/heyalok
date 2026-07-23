export function formatDurationFromSeconds(totalSeconds?: number | null) {
  if (!Number.isFinite(totalSeconds) || !totalSeconds || totalSeconds <= 0) {
    return "0min"
  }

  const seconds = Math.floor(totalSeconds)
  const days = Math.floor(seconds / 86_400)
  const hours = Math.floor((seconds % 86_400) / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)

  const parts: string[] = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}hr`)
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}min`)

  return parts.join(" ")
}
