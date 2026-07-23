import type { ToolCategory } from "../tools"

export const languagesPlatforms: ToolCategory = {
  name: "Languages & Platforms",
  span: "full",
  items: [
    {
      name: "TypeScript",
      href: "https://typescriptlang.org",
      icon: "/icon/tool/typescript.svg",
    },
    {
      name: "JavaScript",
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      icon: "/icon/tool/javascript.svg",
    },
    {
      name: "Node.js",
      href: "https://nodejs.org",
      icon: "/icon/tool/nodejs.svg",
    },
    {
      name: "React",
      href: "https://react.dev",
      icon: {
        light: "/icon/tool/react_light.svg",
        dark: "/icon/tool/react_dark.svg",
      },
    },
    {
      name: "Next.js",
      href: "https://nextjs.org",
      icon: {
        light: "/icon/tool/nextjs_logo_light.svg",
        dark: "/icon/tool/nextjs_logo_dark.svg",
      },
    },
    {
      name: "Go",
      href: "https://go.dev",
      icon: {
        light: "/icon/tool/golang.svg",
        dark: "/icon/tool/golang_dark.svg",
      },
    },
    {
      name: "C++",
      href: "https://isocpp.org",
      icon: "/icon/tool/c.svg",
    },
    {
      name: "Docker",
      href: "https://docker.com",
      icon: "/icon/tool/docker.svg",
    },
    {
      name: "AWS",
      href: "https://aws.amazon.com",
      icon: {
        light: "/icon/tool/aws_light.svg",
        dark: "/icon/tool/aws_dark.svg",
      },
    },
    {
      name: "Bun",
      href: "https://bun.sh",
      icon: "/icon/tool/bun.svg",
    },
    {
      name: "Express.js",
      href: "https://expressjs.com",
      icon: {
        light: "/icon/tool/expressjs.svg",
        dark: "/icon/tool/expressjs_dark.svg",
      },
    },
    {
      name: "MCP",
      href: "https://modelcontextprotocol.io",
      icon: {
        light: "/icon/tool/modelcontextprotocol-000.svg",
        dark: "/icon/tool/modelcontextprotocol-fff.svg",
      },
    },
  ],
}
