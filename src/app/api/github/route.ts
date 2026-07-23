import { NextResponse } from "next/server";

const WAKATIME_SUMMARIES_URL =
  "https://wakatime.com/api/v1/users/current/summaries";

export const dynamic = "force-dynamic";

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

type GithubData = {
  total: Record<string, number>;
  contributions: Array<{
    date: string;
    count: number;
    level: number;
  }>;
};

type WakaTimeSummaryResponse = {
  data?: Array<{
    grand_total?: {
      total_seconds?: number;
    };
  }>;
};

type ResponseData = {
  github?: GithubData;
  wakatime?: number;
};

let cache: ResponseData | null = null;
let cacheTime = 0;
let loadingPromise: Promise<ResponseData> | null = null;

async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<T | undefined> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) return undefined;
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

async function loadData(): Promise<ResponseData> {
  const WAKA_ENV = process.env.WAKA_ENV;
  const today = new Date().toISOString().slice(0, 10);
  const year = new Date().getFullYear();
  const githubUrl = `https://github-contributions-api.jogruber.de/v4/alok-mishra143?y=${year}`;

  const [github, wakatime] = await Promise.all([
    fetchJson<GithubData>(githubUrl),
    WAKA_ENV
      ? fetchJson<WakaTimeSummaryResponse>(
          `${WAKATIME_SUMMARIES_URL}?start=${today}&end=${today}`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(WAKA_ENV).toString(
                "base64"
              )}`,
            },
          }
        ).then((json) => json?.data?.[0]?.grand_total?.total_seconds)
      : Promise.resolve(undefined),
  ]);

  return {
    github,
    wakatime,
  };
}

export async function GET() {
  const now = Date.now();

  if (cache && now - cacheTime < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  if (!loadingPromise) {
    loadingPromise = loadData()
      .then((data) => {
        cache = data;
        cacheTime = Date.now();
        return data;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  const data = await loadingPromise;

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=60",
    },
  });
}
