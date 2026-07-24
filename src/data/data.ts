import type { ComponentType, SVGProps } from "react"
import {
  Instagram,
  Medium,
  Peerlist,
  LinkedIn,
  GitHub,
} from "@/components/asserts/Social"

export type SocialLinkGroup = "social" | "work" | "creator"

export type SocialLink = {
  index: number
  label: string
  href: string
  group: SocialLinkGroup
  disabled: boolean
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const socialLinks: SocialLink[] = [
  {
    index: 3,
    label: "Instagram",
    href: "https://instagram.com/alok_mishra143",
    group: "social",
    disabled: false,
    Icon: Instagram,
  },
  {
    index: 4,
    label: "Peerlist",
    href: "https://peerlist.io/zerion",
    group: "work",
    disabled: false,
    Icon: Peerlist,
  },
  {
    index: 5,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alok-mishra-367474406/",
    group: "work",
    disabled: false,
    Icon: LinkedIn,
  },
  {
    index: 6,
    label: "Github",
    href: "https://github.com/alok-mishra143",
    group: "work",
    disabled: false,
    Icon: GitHub,
  },
  {
    index: 7,
    label: "Medium",
    href: "https://medium.com/@zerion0",
    group: "creator",
    disabled: false,
    Icon: Medium,
  },
]

export type RouteGroup = "navigate" | "explore"

import {
  House,
  FileText,
  FileUser,
  BookOpen,
  Gamepad2,
  Wrench,
  FolderKanban,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type RouteItem = {
  label: string
  href: string
  icon: LucideIcon
  group: RouteGroup
  nav: boolean
  footer: boolean
  subTitle: string
  shortCutKey?: string
  target?: "_blank" | "_self"
}

export const navRoutes: RouteItem[] = [
  {
    label: "Home",
    href: "/",
    icon: House,
    group: "navigate",
    nav: true,
    footer: true,
    subTitle: "Go to Home",
    shortCutKey: "h",
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    icon: FileUser,
    group: "navigate",
    nav: false,
    footer: true,
    subTitle: "My Resume",
    shortCutKey: "r",
    target: "_blank",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: FileText,
    group: "navigate",
    nav: true,
    footer: true,
    subTitle: "Read my latest blog posts",
    shortCutKey: "b",
  },
  {
    label: "Books",
    href: "/books",
    icon: BookOpen,
    group: "explore",
    nav: false,
    footer: true,
    subTitle: "Explore my book collection",
    shortCutKey: "k",
  },
  {
    label: "Game",
    href: "/game",
    icon: Gamepad2,
    group: "explore",
    nav: false,
    footer: true,
    subTitle: "Wanna play a game?",
    shortCutKey: "g",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    group: "navigate",
    nav: true,
    footer: true,
    subTitle: "View my projects",
    shortCutKey: "p",
  },
  {
    label: "Tools",
    href: "/tools",
    icon: Wrench,
    group: "explore",
    nav: false,
    footer: true,
    subTitle: "See What Tools I Use",
    shortCutKey: "t",
  },
]

export type ShortcutAction = "toggleTheme" | "expandProfile"

export type ShortcutItem = {
  label: string
  subTitle: string
  shortcutKey: string
  icon: string
  action: ShortcutAction
}

export const shortcuts: ShortcutItem[] = [
  {
    label: "Toggle theme",
    subTitle: "Switch between dark and light mode",
    shortcutKey: "D",
    icon: "Sun",
    action: "toggleTheme",
  },
  {
    label: "Expand profile image",
    subTitle: "Open profile image in fullscreen",
    shortcutKey: "P",
    icon: "Expand",
    action: "expandProfile",
  },
]
