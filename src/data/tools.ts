export type ToolIcon = string | { light: string; dark: string }

export type ToolItem = {
  name: string
  description?: string
  href?: string
  icon?: ToolIcon
  showIcon?: boolean
}

export type ToolCategory = {
  name: string
  items: ToolItem[]
  span: "full" | "half"
  showIcon?: boolean
}

import { appsIde } from "./tools/apps-ide"
import { llm } from "./tools/llm"
import { websites } from "./tools/websites"
import { skills } from "./tools/skills"
import { languagesPlatforms } from "./tools/languages-platforms"
import { terminal } from "./tools/terminal"
import { design } from "./tools/design"
import { browser } from "./tools/browser"
import { music } from "./tools/music"
import { twitter } from "./tools/twitter"

export const toolCategories: ToolCategory[] = [
  appsIde,
  llm,
  websites,
  skills,
  terminal,
  design,
  browser,
  music,
  twitter,
  languagesPlatforms,
]
