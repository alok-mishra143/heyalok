import { NextResponse } from "next/server"

const GITHUB_GRAPHQL = "https://api.github.com/graphql"

const QUERY = `
  query GetPinnedRepos($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            homepageUrl
            openGraphImageUrl
          }
        }
      }
    }
  }
`

export type PinnedRepo = {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
  repositoryTopics: { nodes: { topic: { name: string } }[] }
  homepageUrl: string | null
  openGraphImageUrl: string
}

export const dynamic = "force-dynamic"

export async function GET() {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 },
    )
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username: "alok-mishra143" },
      }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("GitHub GraphQL error:", text)
      return NextResponse.json(
        { error: "Failed to fetch from GitHub" },
        { status: res.status },
      )
    }

    const json = await res.json()

    if (json.errors) {
      console.error("GitHub GraphQL errors:", json.errors)
      return NextResponse.json(
        { error: "GitHub API error", details: json.errors },
        { status: 500 },
      )
    }

    const repos: PinnedRepo[] =
      json.data?.user?.pinnedItems?.nodes ?? []

    return NextResponse.json(repos, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
      },
    })
  } catch (err) {
    console.error("GitHub pinned repos fetch error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
