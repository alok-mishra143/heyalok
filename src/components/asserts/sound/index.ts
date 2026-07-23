import blob from "./blob"
import error from "./error"
import pop from "./pop"
import cutemeow from "./cuteMeow"
import clink from "./clink"
import windhit from "./windhit"

export const SOUND_NAMES = [
  "blob",
  "error",
  "pop",
  "cutemeow",
  "clink",
  "windhit"
] as const
export type SoundName = (typeof SOUND_NAMES)[number]

export const SOUND_URLS: Record<SoundName, string> = {
  blob,
  error,
  pop,
  cutemeow,
  clink,
  windhit,
}
