import CurvArrow1 from "../asserts/arrows/CurvArrow1"
import ManSettingLaptop from "../asserts/ManSettingLaptop"

const SpotifyPlayerSkeleton = () => {
  return (
    <div
      className="relative flex max-w-sm flex-col"
      aria-busy="true"
      aria-label="Loading Spotify player"
    >
      <div className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-100/5 p-4 shadow-xl shadow-black/20 backdrop-blur dark:bg-zinc-950/80 dark:shadow-black/40">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--primary),0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(var(--secondary),0.08),transparent_35%)]"
        />

        {/* Album art placeholder */}
        <div className="relative z-10 size-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_24px_rgba(var(--primary),0.12)]">
          <div className="h-full w-full animate-pulse bg-white/10" />
        </div>

        {/* Track info placeholders */}
        <div className="relative z-10 min-w-0 flex-1">
          <div className="mb-1.5 h-2 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="h-3.5 w-full max-w-40 animate-pulse rounded-full bg-white/15" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-white/10" />
        </div>

        {/* Spotify label placeholder */}
        <div className="relative z-10 h-2.5 w-14 shrink-0 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-primary to-transparent" />

      {/* Side decoration */}
      <div className="pointer-events-none absolute -left-25 z-40 hidden w-full text-primary/40 lg:block">
        <CurvArrow1
          ClassName="h-20 w-20 rotate-180 text-primary/40"
          strokeWidth={2.5}
        />
        <span className="flex items-center justify-center">
          <p className="absolute top-0 -left-25 text-xs leading-tight text-primary/70">LockIn Mode</p>
          <ManSettingLaptop className="absolute top-0 -left-33 h-7 w-7" />
        </span>
      </div>
    </div>
  )
}

export default SpotifyPlayerSkeleton
