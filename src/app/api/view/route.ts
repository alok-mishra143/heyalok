import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export const dynamic = "force-dynamic"

const VIEWS_KEY = "portfolio:views"
const COOKIE_NAME = "vid"
const WINDOW_SECONDS = 5 * 60 * 60 // 5 hours

function makeId(): string {
  // crypto.randomUUID is available in modern Node.js / Edge runtimes
  return crypto.randomUUID()
}

/**
 * GET /api/view — returns current count without registering a new view.
 */
export async function GET() {
  try {
    const count = (await redis.get<number>(VIEWS_KEY)) ?? 0
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Failed to fetch view count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

/**
 * POST /api/view — register a view if this visitor hasn't been seen in the
 * last 5 hours.
 *
 * Strategy:
 *  - An httpOnly cookie (`vid`) identifies the browser across visits.
 *  - On the server we do `SET portfolio:v:{vid} 1 NX EX 18000`.
 *  - If the key was *newly* set, this is a fresh 5-hour window → increment.
 *  - If it already existed, the visitor was already counted recently → no-op.
 *  - The cookie itself lives for 1 year so the same UUID persists.
 */
export async function POST(request: NextRequest) {
  try {
    let visitorId = request.cookies.get(COOKIE_NAME)?.value
    const isNewCookie = !visitorId

    if (!visitorId) {
      visitorId = makeId()
    }

    // Try to claim a 5-hour window for this visitor.
    // Returns "OK" if the key was set (first time in this window),
    // or null if it already exists (already counted recently).
    const result = await redis.set(`portfolio:v:${visitorId}`, "1", {
      nx: true,
      ex: WINDOW_SECONDS,
    })
    const isNewWindow = result === "OK"

    if (isNewWindow) {
      await redis.incr(VIEWS_KEY)
    }

    const count = (await redis.get<number>(VIEWS_KEY)) ?? 0
    const response = NextResponse.json({ count })
    const ONE_YEAR = 60 * 60 * 24 * 365

    // If this is a brand-new visitor, give them a long-lived cookie.
    // (If they already had one the cookie is already in place, no need to
    //  re-set it on every request.)
    if (isNewCookie) {
      response.cookies.set(COOKIE_NAME, visitorId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: ONE_YEAR,
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Failed to register view:", error)
    const count = (await redis.get<number>(VIEWS_KEY)) ?? 0
    return NextResponse.json({ count })
  }
}
