import type { ToolCategory } from "../tools"

export const websites: ToolCategory = {
  name: "Websites",
  span: "half",
  items: [
    {
      name: "daily.dev",
      description: "Dev news feed, personalized",
      href: "https://daily.dev",
      icon: {
        light: "/icon/tool/daily-dev-ligth.svg",
        dark: "/icon/tool/daily-dev-dark.svg",
      },
    },
    {
      name: "GitHub Trending",
      description: "What the community is building",
      href: "https://github.com/trending",
      icon: {
        light: "/icon/tool/github_light.svg",
        dark: "/icon/tool/github_dark.svg",
      },
    },
  ],
}
