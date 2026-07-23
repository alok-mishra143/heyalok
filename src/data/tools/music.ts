import type { ToolCategory } from "../tools"

export const music: ToolCategory = {
  name: "Music",
  span: "half",
  items: [
    {
      name: "Spotify",
      description: "Focus playlists, lofi, ambient",
      href: "https://open.spotify.com",
      icon: "/icon/tool/spotify.svg",
    },
    {
      name: "YouTube Music",
      description: "Deep cuts and algorithmic mixes",
      href: "https://music.youtube.com",
      icon: "/icon/tool/youtube_music.svg",
    },
  ],
}
