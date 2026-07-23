"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

type UseImageOptions = {
  enabled?: boolean
}

export function useImage(
  key: string,
  folder = "asserts",
  options: UseImageOptions = {}
) {
  const fullKey = `${folder}/${key}`

  const { data, isLoading, error } = useQuery<{ url: string }>({
    queryKey: ["r2-image", folder, key],
    queryFn: async () => {
      const res = await fetch(`/api/r2?key=${encodeURIComponent(fullKey)}`)

      if (!res.ok) {
        throw new Error("Failed to fetch image")
      }

      return res.json()
    },
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  })

  return {
    url: data?.url ?? null,
    isLoading,
    error,
  }
}
