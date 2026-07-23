"use client"

import { useQuery, keepPreviousData } from "@tanstack/react-query"
import SpotifyPlayer from "../ui/SpotifyPlayer"
import SpotifyPlayerSkeleton from "../ui/SpotifyPlayerSkeleton"

const Spotify = () => {
  const { data } = useQuery({
    queryKey: ["spotify"],
    queryFn: () =>
      fetch("/api/spotify").then((res) => (res.ok ? res.json() : null)),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })

  if (!data) return <SpotifyPlayerSkeleton />

  return <SpotifyPlayer data={data} />
}

export default Spotify
