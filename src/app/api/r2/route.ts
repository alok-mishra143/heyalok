// src/app/api/r2/route.ts
import { NextRequest, NextResponse } from "next/server"
import { GetFromS3, listR2Objects } from "@/lib/r2"

const cacheHeader = (seconds: number) => ({
  "Cache-Control": `public, max-age=${seconds}, stale-while-revalidate=86400`,
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")
  const prefix = searchParams.get("prefix")

  if (key) {
    const expiresIn = searchParams.get("expiresIn")
      ? Number(searchParams.get("expiresIn"))
      : undefined

    const result = await GetFromS3(key, expiresIn)
    const cacheSeconds = Math.min(expiresIn ?? 60 * 60, 60 * 60 * 24)

    return NextResponse.json(result, {
      headers: cacheHeader(cacheSeconds),
    })
  }

  if (prefix) {
    const objects = await listR2Objects(prefix)

    return NextResponse.json(objects, {
      headers: cacheHeader(5 * 60 * 60),
    })
  }

  return NextResponse.json(
    { error: "Provide a 'key' or 'prefix' query parameter" },
    { status: 400 }
  )
}
