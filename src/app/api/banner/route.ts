import { type NextRequest, NextResponse } from "next/server";
import { GetFromS3, listR2Objects } from "@/lib/r2";

const BANNER_PREFIX = "banner/";
const DEBUG_BANNER_PARAM = "debugbanner";

const ONE_HOUR_IN_SECONDS = 60 * 60;
const ONE_HOUR_IN_MS = ONE_HOUR_IN_SECONDS * 1000;

const sortBannerKeys = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
}).compare;

const isMp4Object = (key: string) => key.toLowerCase().endsWith(".mp4");

const isDebugBannerRequest = (request: NextRequest) =>
  request.nextUrl.searchParams.get(DEBUG_BANNER_PARAM) === "true";

type BannerCache = {
  url: string;
  expiresAt: number;
};

const shownBannerKeys = new Set<string>();

function pickBannerKey(keys: string[], now: number): string {
  const available = keys.filter((k) => !shownBannerKeys.has(k));
  if (available.length === 0) {
    shownBannerKeys.clear();
  }
  const pool = available.length > 0 ? available : keys;
  const slot = Math.floor(now / ONE_HOUR_IN_MS);
  const key = pool[slot % pool.length];
  shownBannerKeys.add(key);
  return key;
}

let cache: BannerCache | null = null;
let loadingPromise: Promise<BannerCache> | null = null;

export const dynamic = "force-dynamic";

async function loadBanner(now: number): Promise<BannerCache> {
  const keys = (await listR2Objects(BANNER_PREFIX))
    .filter(isMp4Object)
    .sort(sortBannerKeys);

  if (keys.length === 0) {
    return {
      url: "",
      expiresAt: now + ONE_HOUR_IN_MS,
    };
  }

  const currentHourSlot = Math.floor(now / ONE_HOUR_IN_MS);
  const expiresAt = (currentHourSlot + 1) * ONE_HOUR_IN_MS;
  const ttlSeconds = Math.max(
    1,
    Math.ceil((expiresAt - now) / 1000)
  );

  const bannerKey = pickBannerKey(keys, now);

  const presignedTtl = Math.max(ttlSeconds, 7 * 24 * 60 * 60);
  const { url } = await GetFromS3(bannerKey, presignedTtl);

  return {
    url,
    expiresAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    if (isDebugBannerRequest(request)) {
      const keys = (await listR2Objects(BANNER_PREFIX))
        .filter(isMp4Object)
        .sort(sortBannerKeys);

      if (!keys.length) {
        return NextResponse.json({ url: null });
      }

      const banner = pickBannerKey(keys, now);

      const { url } = await GetFromS3(
        banner,
        ONE_HOUR_IN_SECONDS
      );

      return NextResponse.json(
        {
          url,
          expiresAt: now + ONE_HOUR_IN_MS,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    if (cache && cache.expiresAt > now) {
      const ttl = Math.max(1, Math.ceil((cache.expiresAt - now) / 1000));
      return NextResponse.json(cache, {
        headers: {
          "Cache-Control": `public, max-age=${ttl}, stale-while-revalidate=86400`,
        },
      });
    }

    if (!loadingPromise) {
      loadingPromise = loadBanner(now).finally(() => {
        loadingPromise = null;
      });
    }

    cache = await loadingPromise;

    const ttl = Math.max(1, Math.ceil((cache.expiresAt - Date.now()) / 1000));
    return NextResponse.json(cache, {
      headers: {
        "Cache-Control": `public, max-age=${ttl}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch banner:", error);

    return NextResponse.json(
      { url: null },
      { status: 500 }
    );
  }
}
