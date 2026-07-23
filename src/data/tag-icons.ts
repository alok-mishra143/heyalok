import type { ToolIcon } from "./tools"

const iconMap: Record<string, ToolIcon> = {
  TypeScript: "/icon/tool/typescript.svg",
  JavaScript: "/icon/tool/javascript.svg",
  "Node.js": "/icon/tool/nodejs.svg",

  React: {
    light: "/icon/tool/react_light.svg",
    dark: "/icon/tool/react_dark.svg",
  },
  "Next.js": {
    light: "/icon/tool/nextjs_logo_light.svg",
    dark: "/icon/tool/nextjs_logo_dark.svg",
  },

  golang: {
    light: "/icon/tool/golang.svg",
    dark: "/icon/tool/golang_dark.svg",
  },
  "C++": "/icon/tool/c.svg",
  Docker: "/icon/tool/docker.svg",
  AWS: {
    light: "/icon/tool/aws_light.svg",
    dark: "/icon/tool/aws_dark.svg",
  },
  Bun: "/icon/tool/bun.svg",
  Turborepo: "/icon/tool/turborepo.svg",
  PostgreSQL: "/icon/tool/postgresql.svg",
  Redis: "/icon/tool/redis.svg",
  MongoDB: "/icon/tool/mongodb.svg",
  "Express.js": {
    light: "/icon/tool/expressjs.svg",
    dark: "/icon/tool/expressjs_dark.svg",
  },
  MCP: {
    light: "/icon/tool/modelcontextprotocol-000.svg",
    dark: "/icon/tool/modelcontextprotocol-fff.svg",
  },



}

const normalized = Object.entries(iconMap).reduce<Record<string, ToolIcon>>(
  (acc, [key, val]) => {
    acc[key.toLowerCase()] = val
    return acc
  },
  {},
)

export function getTagIcon(tag: string): ToolIcon | undefined {
  return iconMap[tag] ?? normalized[tag.toLowerCase()]
}
