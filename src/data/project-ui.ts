const hoverColors = [
  "hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/10 dark:hover:bg-sky-400/10",
  "hover:text-violet-500 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-400/10",
  "hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-400/10",
  "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10",
  "hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-400/10",
  "hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10",
  "hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-500/10 dark:hover:bg-teal-400/10",
  "hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-500/10 dark:hover:bg-lime-400/10",
  "hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:bg-fuchsia-500/10 dark:hover:bg-fuchsia-400/10",
  "hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10",
]

const tagBgColors = [
  "bg-sky-500/10 dark:bg-sky-400/10",
  "bg-violet-500/10 dark:bg-violet-400/10",
  "bg-amber-500/10 dark:bg-amber-400/10",
  "bg-emerald-500/10 dark:bg-emerald-400/10",
  "bg-rose-500/10 dark:bg-rose-400/10",
  "bg-indigo-500/10 dark:bg-indigo-400/10",
  "bg-teal-500/10 dark:bg-teal-400/10",
  "bg-lime-500/10 dark:bg-lime-400/10",
  "bg-fuchsia-500/10 dark:bg-fuchsia-400/10",
  "bg-cyan-500/10 dark:bg-cyan-400/10",
]

function tagIndex(tag: string): number {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % hoverColors.length
}

export function getTagBg(tag: string): string {
  return tagBgColors[tagIndex(tag)]
}

export function getTagHover(tag: string): string {
  return hoverColors[tagIndex(tag)]
}

export const statusConfig: Record<string, { label: string; badge: string }> = {
  active: {
    label: "Active",
    badge:
      "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-400/10",
  },
  wip: {
    label: "WIP",
    badge:
      "text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10",
  },
  archived: {
    label: "Archived",
    badge:
      "text-sky-700 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-400/10",
  },
}