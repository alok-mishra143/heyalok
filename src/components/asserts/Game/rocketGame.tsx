"use client"

import { cn } from "@/lib/utils"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"

type RocketGameProps = {
  className?: string
}

type GameStatus = "ready" | "playing" | "paused" | "gameover"

type PressedKeys = {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  fire: boolean
}

type PointerState = {
  active: boolean
  x: number
  y: number
}

type Ship = {
  x: number
  y: number
  width: number
  height: number
}

type LaserBeam = {
  id: number
  x: number
  y: number
  length: number
  speed: number
}

type Rock = {
  id: number
  x: number
  y: number
  size: number
  radius: number
  speed: number
  rotation: number
  spin: number
  hp: number
}

type Star = {
  x: number
  y: number
  radius: number
  speed: number
  alpha: number
}

type Particle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  maxLife: number
  color: string
}

type GameState = {
  width: number
  height: number
  score: number
  highScore: number
  rocksDestroyed: number
  level: number
  elapsed: number
  nextRockIn: number
  lastShotAt: number
  nextId: number
  ship: Ship
  lasers: LaserBeam[]
  rocks: Rock[]
  stars: Star[]
  particles: Particle[]
}

type HudState = {
  score: number
  highScore: number
  rocksDestroyed: number
  level: number
}

type RenderQuality = "standard" | "low"

type RenderProfile = {
  quality: RenderQuality
  maxDpr: number
  frameIntervalMs: number
  idleFrameIntervalMs: number
  starArea: number
  minStars: number
  maxStars: number
  particleScale: number
  maxParticles: number
  maxRocks: number
  shadows: boolean
}

type CanvasSize = {
  width: number
  height: number
  dpr: number
}

type NavigatorPerformanceHints = Navigator & {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
  }
}

const HIGH_SCORE_KEY = "portfolio-rocket-game-high-score"
const DEFAULT_WIDTH = 640
const DEFAULT_HEIGHT = 520
const LASER_COOLDOWN_MS = 155
const MAX_FRAME_STEP = 0.035
const SHIP_VIEWBOX_WIDTH = 112
const SHIP_VIEWBOX_HEIGHT = 77
const ROCK_VIEWBOX_WIDTH = 99
const ROCK_VIEWBOX_HEIGHT = 92

const STANDARD_RENDER_PROFILE: RenderProfile = {
  quality: "standard",
  maxDpr: 2,
  frameIntervalMs: 0,
  idleFrameIntervalMs: 160,
  starArea: 5200,
  minStars: 70,
  maxStars: 180,
  particleScale: 1,
  maxParticles: 170,
  maxRocks: 14,
  shadows: true,
}

const LOW_RENDER_PROFILE: RenderProfile = {
  quality: "low",
  maxDpr: 1,
  frameIntervalMs: 32,
  idleFrameIntervalMs: 320,
  starArea: 9000,
  minStars: 34,
  maxStars: 90,
  particleScale: 0.45,
  maxParticles: 70,
  maxRocks: 8,
  shadows: false,
}

const defaultKeys = (): PressedKeys => ({
  left: false,
  right: false,
  up: false,
  down: false,
  fire: false,
})

const pathCache = new Map<string, Path2D>()

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const randomRange = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}

const getPath = (path: string) => {
  const cached = pathCache.get(path)

  if (cached) {
    return cached
  }

  const nextPath = new Path2D(path)
  pathCache.set(path, nextPath)
  return nextPath
}

const drawSvgPath = (
  context: CanvasRenderingContext2D,
  path: string,
  fill: string,
  stroke?: string,
  lineWidth = 1
) => {
  const shape = getPath(path)

  context.fillStyle = fill
  context.fill(shape)

  if (stroke) {
    context.strokeStyle = stroke
    context.lineWidth = lineWidth
    context.stroke(shape)
  }
}

const getShipSize = (width: number) => {
  const shipWidth = clamp(width * 0.14, 58, 84)

  return {
    width: shipWidth,
    height: shipWidth * (SHIP_VIEWBOX_HEIGHT / SHIP_VIEWBOX_WIDTH),
  }
}

const createStar = (
  width: number,
  height: number,
  y = Math.random() * height
) => {
  return {
    x: Math.random() * width,
    y,
    radius: randomRange(0.6, 1.9),
    speed: randomRange(18, 72),
    alpha: randomRange(0.35, 0.95),
  }
}

const getRenderProfile = () => {
  if (typeof window === "undefined") {
    return STANDARD_RENDER_PROFILE
  }

  const navigatorHints = window.navigator as NavigatorPerformanceHints
  const hasLowCpu =
    typeof navigatorHints.hardwareConcurrency === "number" &&
    navigatorHints.hardwareConcurrency <= 4
  const hasLowMemory =
    typeof navigatorHints.deviceMemory === "number" &&
    navigatorHints.deviceMemory <= 4
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const savesData = Boolean(navigatorHints.connection?.saveData)

  return hasLowCpu || hasLowMemory || prefersReducedMotion || savesData
    ? LOW_RENDER_PROFILE
    : STANDARD_RENDER_PROFILE
}

const getStarCount = (
  width: number,
  height: number,
  profile: RenderProfile
) => {
  return clamp(
    Math.round((width * height) / profile.starArea),
    profile.minStars,
    profile.maxStars
  )
}

const fitStars = (
  stars: Star[],
  width: number,
  height: number,
  profile: RenderProfile
) => {
  const targetCount = getStarCount(width, height, profile)
  const nextStars = stars.slice(0, targetCount)

  while (nextStars.length < targetCount) {
    nextStars.push(createStar(width, height))
  }

  return nextStars.map((star) => ({
    ...star,
    x: clamp(star.x, 0, width),
    y: clamp(star.y, 0, height),
  }))
}

const createGameState = (
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  highScore = 0,
  profile = STANDARD_RENDER_PROFILE
): GameState => {
  const shipSize = getShipSize(width)

  return {
    width,
    height,
    score: 0,
    highScore,
    rocksDestroyed: 0,
    level: 1,
    elapsed: 0,
    nextRockIn: 0.65,
    lastShotAt: -LASER_COOLDOWN_MS,
    nextId: 1,
    ship: {
      x: width / 2,
      y: height - shipSize.height * 1.15,
      width: shipSize.width,
      height: shipSize.height,
    },
    lasers: [],
    rocks: [],
    stars: fitStars([], width, height, profile),
    particles: [],
  }
}

const getHudSnapshot = (state: GameState): HudState => ({
  score: state.score,
  highScore: Math.max(state.highScore, state.score),
  rocksDestroyed: state.rocksDestroyed,
  level: state.level,
})

const sameHud = (left: HudState, right: HudState) => {
  return (
    left.score === right.score &&
    left.highScore === right.highScore &&
    left.rocksDestroyed === right.rocksDestroyed &&
    left.level === right.level
  )
}

const readStoredHighScore = async (): Promise<number> => {
  try {
    const parsed = Number.parseInt(
      window.localStorage.getItem(HIGH_SCORE_KEY) ?? "0",
      10
    )

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  } catch {
    // ignore
  }

  return 0
}

const writeStoredHighScore = async (score: number) => {
  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(score))
  } catch {
    // ignore
  }
}

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

const attemptFire = (state: GameState, now: number, force = false) => {
  if (!force && now - state.lastShotAt < LASER_COOLDOWN_MS) {
    return
  }

  state.lastShotAt = now
  state.lasers.push({
    id: state.nextId++,
    x: state.ship.x,
    y: state.ship.y - state.ship.height * 0.45,
    length: clamp(state.height * 0.13, 48, 82),
    speed: 760,
  })
}

const spawnRock = (state: GameState) => {
  const size = randomRange(44, 72)
  const radius = size * 0.38

  state.rocks.push({
    id: state.nextId++,
    x: randomRange(radius + 8, state.width - radius - 8),
    y: -size,
    size,
    radius,
    speed: randomRange(64, 102) + state.level * 13,
    rotation: randomRange(-Math.PI, Math.PI),
    spin: randomRange(-1.4, 1.4),
    hp: size > 62 ? 2 : 1,
  })
}

const spawnExplosion = (
  state: GameState,
  x: number,
  y: number,
  count: number,
  profile: RenderProfile
) => {
  const colors = ["#FDFF86", "#FF6AC7", "#FFA1E1", "#FFFFFF"]
  const targetCount = Math.max(1, Math.round(count * profile.particleScale))
  const particleCount = Math.min(
    targetCount,
    Math.max(profile.maxParticles - state.particles.length, 0)
  )
  const maxLife = profile.quality === "low" ? 0.42 : 0.56

  for (let index = 0; index < particleCount; index++) {
    const angle = randomRange(0, Math.PI * 2)
    const speed = randomRange(42, 145)

    state.particles.push({
      id: state.nextId++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: randomRange(1.4, 3.4),
      life: randomRange(0.2, maxLife),
      maxLife,
      color: colors[index % colors.length],
    })
  }
}

const distanceSquared = (
  leftX: number,
  leftY: number,
  rightX: number,
  rightY: number
) => {
  const dx = leftX - rightX
  const dy = leftY - rightY

  return dx * dx + dy * dy
}

const stepGame = (
  state: GameState,
  keys: PressedKeys,
  pointer: PointerState,
  profile: RenderProfile,
  now: number,
  deltaSeconds: number
) => {
  state.elapsed += deltaSeconds
  state.level = 1 + Math.floor(state.score / 120)

  const shipSpeed = clamp(280 + state.level * 18, 280, 520)
  const shipMarginX = state.ship.width * 0.55
  const shipMarginY = state.ship.height * 0.7

  if (pointer.active) {
    const followStrength = 1 - Math.pow(0.002, deltaSeconds)
    state.ship.x += (pointer.x - state.ship.x) * followStrength
    state.ship.y += (pointer.y - state.ship.y) * followStrength
    attemptFire(state, now)
  } else {
    const moveX = Number(keys.right) - Number(keys.left)
    const moveY = Number(keys.down) - Number(keys.up)
    const magnitude = Math.hypot(moveX, moveY) || 1

    state.ship.x += (moveX / magnitude) * shipSpeed * deltaSeconds
    state.ship.y += (moveY / magnitude) * shipSpeed * deltaSeconds

    if (keys.fire) {
      attemptFire(state, now)
    }
  }

  state.ship.x = clamp(state.ship.x, shipMarginX, state.width - shipMarginX)
  state.ship.y = clamp(
    state.ship.y,
    state.height * 0.24,
    state.height - shipMarginY
  )

  for (const star of state.stars) {
    star.y += (star.speed + state.level * 2) * deltaSeconds

    if (star.y > state.height + star.radius) {
      star.x = Math.random() * state.width
      star.y = -star.radius
      star.radius = randomRange(0.6, 1.9)
      star.speed = randomRange(18, 72)
      star.alpha = randomRange(0.35, 0.95)
    }
  }

  state.nextRockIn -= deltaSeconds

  const maxRocks = clamp(
    4 + state.level,
    profile.quality === "low" ? 4 : 5,
    profile.maxRocks
  )

  if (state.nextRockIn <= 0 && state.rocks.length < maxRocks) {
    const waveChance = clamp(
      state.level * (profile.quality === "low" ? 0.035 : 0.055),
      0.05,
      profile.quality === "low" ? 0.32 : 0.58
    )
    const waveCount =
      1 +
      Number(Math.random() < waveChance) +
      Number(
        profile.quality === "standard" &&
          state.level > 6 &&
          Math.random() < 0.18
      )

    for (let index = 0; index < waveCount; index++) {
      if (state.rocks.length < maxRocks) {
        spawnRock(state)
      }
    }

    state.nextRockIn = randomRange(
      clamp(0.36 - state.level * 0.012, 0.18, 0.36),
      clamp(1.04 - state.level * 0.04, 0.38, 1.04)
    )
  }

  for (const laser of state.lasers) {
    laser.y -= laser.speed * deltaSeconds
  }

  for (const rock of state.rocks) {
    rock.y += rock.speed * deltaSeconds
    rock.rotation += rock.spin * deltaSeconds
  }

  for (const particle of state.particles) {
    particle.x += particle.vx * deltaSeconds
    particle.y += particle.vy * deltaSeconds
    particle.vx *= 0.985
    particle.vy *= 0.985
    particle.life -= deltaSeconds
  }

  const spentLaserIds = new Set<number>()
  const destroyedRockIds = new Set<number>()

  for (const laser of state.lasers) {
    for (const rock of state.rocks) {
      if (destroyedRockIds.has(rock.id)) {
        continue
      }

      const laserTipY = laser.y - laser.length
      const closestY = clamp(rock.y, laserTipY, laser.y)
      const hitDistance = rock.radius + 4
      const hit =
        Math.abs(laser.x - rock.x) < hitDistance &&
        Math.abs(closestY - rock.y) < hitDistance

      if (!hit) {
        continue
      }

      spentLaserIds.add(laser.id)
      rock.hp -= 1
      spawnExplosion(state, laser.x, closestY, 5, profile)

      if (rock.hp <= 0) {
        destroyedRockIds.add(rock.id)
        state.rocksDestroyed += 1
        state.score += 10 + state.level * 2
        spawnExplosion(state, rock.x, rock.y, 13, profile)
      }

      break
    }
  }

  state.lasers = state.lasers.filter((laser) => {
    return !spentLaserIds.has(laser.id) && laser.y + laser.length > 0
  })
  state.rocks = state.rocks.filter((rock) => {
    return (
      !destroyedRockIds.has(rock.id) && rock.y - rock.radius < state.height + 80
    )
  })
  state.particles = state.particles.filter((particle) => particle.life > 0)

  const shipRadius = Math.min(state.ship.width, state.ship.height) * 0.42

  for (const rock of state.rocks) {
    const hitRadius = shipRadius + rock.radius * 0.72

    if (
      distanceSquared(state.ship.x, state.ship.y, rock.x, rock.y) <
      hitRadius * hitRadius
    ) {
      spawnExplosion(state, state.ship.x, state.ship.y, 22, profile)
      return true
    }
  }

  return false
}

const drawSpaceShip = (
  context: CanvasRenderingContext2D,
  ship: Ship,
  profile: RenderProfile
) => {
  context.save()
  context.translate(ship.x, ship.y)

  const scale = ship.width / SHIP_VIEWBOX_WIDTH
  context.scale(scale, scale)
  context.translate(-SHIP_VIEWBOX_WIDTH / 2, -SHIP_VIEWBOX_HEIGHT / 2)

  if (profile.shadows) {
    context.shadowColor = "rgba(245, 129, 255, 0.38)"
    context.shadowBlur = 14
  }

  drawSvgPath(
    context,
    "M67.1502 16.831L60.1719 1.66404C59.8455 0.954573 59.136 0.5 58.355 0.5H53.7145C52.8983 0.5 52.164 0.995953 51.8592 1.75309L45.8133 16.7706C45.6588 17.1546 45.3889 17.4811 45.0409 17.7052L39.9053 21.0125C39.8112 21.0731 39.7467 21.1704 39.7277 21.2807L39.353 23.4523C39.3022 23.747 39.1222 24.0034 38.8623 24.1514L25.697 31.6456L12.8507 38.9582C12.4288 39.1983 11.8954 39.1008 11.5858 38.7269L11.1619 38.2151C10.584 37.5172 9.60902 37.2951 8.7858 37.6738L2.14588 40.7281C1.02276 41.2447 0.632625 42.6464 1.32733 43.669L19.5612 70.5088C20.0413 71.2154 20.9171 71.5391 21.7413 71.3145L39.2727 66.538L44.6749 73.3621C45.2439 74.0808 46.1104 74.5 47.0271 74.5H67.4578C68.6052 74.5 69.6522 73.8455 70.1548 72.8139L73.2121 66.538L92.2588 70.0425C93.0557 70.1891 93.8624 69.8404 94.3015 69.1594L110.883 43.4465C111.495 42.4987 111.202 41.2333 110.236 40.6504L105.559 37.8267C104.783 37.358 103.788 37.4703 103.136 38.1004L102.344 38.865C102.031 39.1678 101.558 39.2327 101.174 39.0256L73.7368 24.2012C73.4136 24.0266 73.2121 23.6888 73.2121 23.3214V21.3258C73.2121 21.1898 73.143 21.0631 73.0287 20.9895L67.8842 17.6765C67.564 17.4703 67.3094 17.177 67.1502 16.831Z",
    "#3F132D",
    "#F581FF",
    1.4
  )
  context.shadowBlur = 0

  drawSvgPath(
    context,
    "M56.9745 19.2342H56.2915C55.3857 19.2342 54.5929 19.8429 54.3592 20.718L48.6721 42.0092C48.3329 43.2791 49.2899 44.5253 50.6043 44.5253H63.6956C65.0473 44.5253 66.0097 43.2122 65.6028 41.9232L58.8817 20.6321C58.619 19.8 57.8471 19.2342 56.9745 19.2342Z",
    "rgba(196, 196, 196, 0.5)"
  )
  drawSvgPath(
    context,
    "M8.87651 39.3278L3.43943 42.1289C2.90186 42.4058 2.7312 43.0928 3.07668 43.5892L20.9289 69.2355C21.1713 69.5836 21.6068 69.741 22.0157 69.6281L36.5191 65.6253C37.2855 65.4137 37.5105 64.4357 36.9135 63.9105L11.2625 41.3445C11.1889 41.2797 11.1253 41.2045 11.0735 41.1213L10.184 39.6891C9.90893 39.2463 9.33989 39.089 8.87651 39.3278Z",
    "#FFDF19",
    "#FDFF86",
    1.2
  )
  drawSvgPath(
    context,
    "M104.982 39.3599L108.704 41.6476C109.182 41.9416 109.325 42.5715 109.02 43.0428L92.9709 67.8475C92.7502 68.1885 92.3452 68.3622 91.9461 68.287L74.8813 65.0706C74.0389 64.9118 73.7737 63.836 74.4458 63.3039L102.221 41.3121C102.275 41.2687 102.325 41.2197 102.37 41.1659L103.688 39.574C104.006 39.1903 104.558 39.099 104.982 39.3599Z",
    "#FFDF19",
    "#FDFF86",
    1.2
  )

  if (profile.shadows) {
    context.shadowColor = "rgba(255, 175, 0, 0.42)"
    context.shadowBlur = 10
  }

  drawSvgPath(
    context,
    "M26.1028 46.4047L41.2492 29.1475C41.9727 28.3231 43.3039 29.0965 42.9461 30.1333L35.524 51.642C35.4405 51.8841 35.2673 52.0848 35.0402 52.203L30.0685 54.789C29.5446 55.0615 28.8999 54.8231 28.6794 54.2753L25.9267 47.4378C25.7858 47.0878 25.8539 46.6883 26.1028 46.4047Z",
    "#FFAF00",
    "#333333",
    1
  )
  drawSvgPath(
    context,
    "M86.8447 44.9964L70.9229 28.4035C70.1623 27.6109 68.8678 28.4403 69.2727 29.4608L77.6726 50.6312C77.7671 50.8694 77.9493 51.0626 78.1817 51.1709L83.2668 53.5418C83.8027 53.7917 84.4359 53.526 84.6311 52.9693L87.0679 46.0208C87.1927 45.6652 87.1064 45.269 86.8447 44.9964Z",
    "#FFAF00",
    "#333333",
    1
  )
  context.shadowBlur = 0

  drawSvgPath(
    context,
    "M37.8498 52.5495L53.5121 11.8161C54.4892 9.27504 58.0733 9.24446 59.0936 11.7685L75.5535 52.4878C75.9105 53.3711 75.8268 54.3714 75.3279 55.1831L67.7875 67.4507C67.2417 68.3387 66.2741 68.8798 65.2317 68.8798H47.7853C46.7175 68.8798 45.7301 68.3122 45.1928 67.3894L38.0574 55.1358C37.5997 54.3497 37.5233 53.3985 37.8498 52.5495Z",
    "#C4C4C4",
    "#BDBDBD",
    1.2
  )
  drawSvgPath(
    context,
    "M56.7273 38.9051L59.2466 43.1202H54.2079L56.7273 38.9051Z",
    "#3F132D"
  )

  context.restore()
}

const drawRock = (
  context: CanvasRenderingContext2D,
  rock: Rock,
  profile: RenderProfile
) => {
  context.save()
  context.translate(rock.x, rock.y)
  context.rotate(rock.rotation)

  const scale = rock.size / ROCK_VIEWBOX_WIDTH
  context.scale(scale, scale)
  context.translate(-ROCK_VIEWBOX_WIDTH / 2, -ROCK_VIEWBOX_HEIGHT / 2)

  if (profile.shadows) {
    context.shadowColor = "rgba(0, 0, 0, 0.35)"
    context.shadowBlur = 6
    context.shadowOffsetY = 3
  }

  drawSvgPath(
    context,
    "M77.4263 11.7492L38.7088 0.544189L4.51666 22.9541L6.52796 56.0597L20.6071 74.9044L70.3867 82.5442L93.5167 42.3082L77.4263 11.7492Z",
    "#636A97",
    "#322D38",
    1.4
  )
  context.shadowBlur = 0
  context.shadowOffsetY = 0
  drawSvgPath(
    context,
    "M41.7257 16.333L19.0986 29.0659L17.5901 50.4572L26.6409 59.6249L30.6635 58.097L33.1777 62.1715L41.7257 57.0784L54.7991 67.774L59.8274 65.7367L68.8782 50.4572L75.4149 42.8175L68.8782 21.4262L61.3358 19.8982L54.7991 25.5007L51.7822 16.333H41.7257Z",
    "#FFA1E1",
    "#FFA1E1",
    1
  )
  drawSvgPath(
    context,
    "M30.6636 47.4013H34.6862L39.2116 43.8361L33.6805 31.8269L29.1551 35.687L27.6466 40.2709L30.6636 47.4013Z",
    "#636A97",
    "#636A97",
    1
  )
  drawSvgPath(
    context,
    "M61.8387 45.8734L55.8048 34.1591L50.2737 33.1405L48.7652 43.8361L52.7878 50.4572L56.3076 55.5504L61.8387 45.8734Z",
    "#636A97",
    "#636A97",
    1
  )

  context.restore()
}

const drawLaser = (
  context: CanvasRenderingContext2D,
  laser: LaserBeam,
  profile: RenderProfile
) => {
  context.save()
  context.lineCap = "round"

  const gradient = context.createLinearGradient(
    laser.x,
    laser.y,
    laser.x,
    laser.y - laser.length
  )
  gradient.addColorStop(0, "rgba(253, 255, 134, 0)")
  gradient.addColorStop(0.34, "#FDFF86")
  gradient.addColorStop(1, "#FF6AC7")

  context.strokeStyle = gradient
  context.lineWidth = 8

  if (profile.shadows) {
    context.shadowColor = "rgba(255, 106, 199, 0.72)"
    context.shadowBlur = 12
  }

  context.beginPath()
  context.moveTo(laser.x, laser.y)
  context.lineTo(laser.x, laser.y - laser.length)
  context.stroke()

  context.strokeStyle = "rgba(255, 255, 255, 0.85)"
  context.lineWidth = 2
  context.shadowBlur = 0
  context.beginPath()
  context.moveTo(laser.x, laser.y - 4)
  context.lineTo(laser.x, laser.y - laser.length + 8)
  context.stroke()
  context.restore()
}

const drawParticles = (
  context: CanvasRenderingContext2D,
  particles: Particle[]
) => {
  context.save()

  for (const particle of particles) {
    const alpha = clamp(particle.life / particle.maxLife, 0, 1)

    context.globalAlpha = alpha
    context.fillStyle = particle.color
    context.beginPath()
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    context.fill()
  }

  context.restore()
}

const drawHud = (
  context: CanvasRenderingContext2D,
  state: GameState,
  status: GameStatus
) => {
  context.save()
  context.textAlign = "left"
  context.textBaseline = "top"
  context.font = '700 14px "Geist Mono", monospace'
  context.fillStyle = "rgba(0, 0, 0, 0.42)"
  context.fillRect(12, 12, 132, 88)

  const stats = [
    `Score ${String(state.score).padStart(4, "0")}`,
    `High ${String(Math.max(state.highScore, state.score)).padStart(4, "0")}`,
    `Rocks ${String(state.rocksDestroyed).padStart(3, "0")}`,
    `Level ${String(state.level).padStart(2, "0")}`,
  ]

  stats.forEach((stat, index) => {
    context.fillStyle = index === 0 ? "#FDFF86" : "rgba(255, 255, 255, 0.86)"
    context.fillText(stat, 22, 22 + index * 19)
  })

  if (status === "playing") {
    context.restore()
    return
  }

  context.fillStyle = "rgba(0, 0, 0, 0.56)"
  context.fillRect(0, 0, state.width, state.height)
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillStyle = "#FFFFFF"
  context.font = `800 ${clamp(state.width * 0.052, 24, 38)}px "Pixelify Sans", monospace`

  const title =
    status === "gameover"
      ? "GAME OVER"
      : status === "paused"
        ? "PAUSED"
        : "ROCKET GAME"

  context.fillText(title, state.width / 2, state.height / 2 - 20)
  context.font = '700 15px "Geist Mono", monospace'
  context.fillStyle = "#FDFF86"
  context.fillText(
    `Score ${state.score}  High ${Math.max(state.highScore, state.score)}`,
    state.width / 2,
    state.height / 2 + 24
  )
  context.restore()
}

const drawGame = (
  context: CanvasRenderingContext2D,
  state: GameState,
  status: GameStatus,
  profile: RenderProfile
) => {
  context.clearRect(0, 0, state.width, state.height)
  context.fillStyle = "#02030A"
  context.fillRect(0, 0, state.width, state.height)

  context.save()
  context.fillStyle = "#FFFFFF"

  for (const star of state.stars) {
    context.globalAlpha = star.alpha
    context.beginPath()
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    context.fill()
  }

  context.restore()

  for (const laser of state.lasers) {
    drawLaser(context, laser, profile)
  }

  for (const rock of state.rocks) {
    drawRock(context, rock, profile)
  }

  drawParticles(context, state.particles)
  drawSpaceShip(context, state.ship, profile)
  drawHud(context, state, status)
}

const RocketGame = ({ className }: RocketGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameStateRef = useRef<GameState>(createGameState())
  const statusRef = useRef<GameStatus>("ready")
  const keysRef = useRef<PressedKeys>(defaultKeys())
  const pointerRef = useRef<PointerState>({ active: false, x: 0, y: 0 })
  const renderProfileRef = useRef<RenderProfile>(STANDARD_RENDER_PROFILE)
  const canvasSizeRef = useRef<CanvasSize>({ width: 0, height: 0, dpr: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const lastFrameAtRef = useRef<number | null>(null)
  const lastDrawAtRef = useRef<number | null>(null)
  const lastHudAtRef = useRef(0)
  const highScoreRef = useRef(0)

  const [status, setStatus] = useState<GameStatus>("ready")
  const [hud, setHud] = useState<HudState>({
    score: 0,
    highScore: 0,
    rocksDestroyed: 0,
    level: 1,
  })

  const setGameStatus = useCallback((nextStatus: GameStatus) => {
    statusRef.current = nextStatus
    lastDrawAtRef.current = null
    setStatus(nextStatus)
  }, [])

  const publishHud = useCallback((force: boolean, now: number) => {
    if (!force && now - lastHudAtRef.current < 250) {
      return
    }

    lastHudAtRef.current = now
    const nextHud = getHudSnapshot(gameStateRef.current)
    setHud((currentHud) =>
      sameHud(currentHud, nextHud) ? currentHud : nextHud
    )
  }, [])

  const focusCanvas = useCallback(() => {
    window.requestAnimationFrame(() => {
      canvasRef.current?.focus({ preventScroll: true })
    })
  }, [])

  const startNewGame = useCallback(() => {
    const currentState = gameStateRef.current
    gameStateRef.current = createGameState(
      currentState.width,
      currentState.height,
      highScoreRef.current,
      renderProfileRef.current
    )
    keysRef.current = defaultKeys()
    setGameStatus("playing")
    publishHud(true, performance.now())
    focusCanvas()
  }, [focusCanvas, publishHud, setGameStatus])

  const finishGame = useCallback(() => {
    const state = gameStateRef.current

    if (state.score > highScoreRef.current) {
      highScoreRef.current = state.score
      state.highScore = state.score
      writeStoredHighScore(state.score)
    }

    setGameStatus("gameover")
    publishHud(true, performance.now())
  }, [publishHud, setGameStatus])

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") {
      setGameStatus("paused")
      publishHud(true, performance.now())
      return
    }

    if (statusRef.current === "paused") {
      setGameStatus("playing")
      focusCanvas()
    }
  }, [focusCanvas, publishHud, setGameStatus])

  const handlePrimaryAction = useCallback(() => {
    if (statusRef.current === "ready" || statusRef.current === "gameover") {
      startNewGame()
      return
    }

    togglePause()
  }, [startNewGame, togglePause])

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const width = Math.max(320, Math.round(rect.width))
    const height = Math.max(380, Math.round(rect.height))
    const renderProfile = renderProfileRef.current
    const dpr = Math.min(window.devicePixelRatio || 1, renderProfile.maxDpr)
    const currentSize = canvasSizeRef.current

    if (
      currentSize.width === width &&
      currentSize.height === height &&
      currentSize.dpr === dpr
    ) {
      return
    }

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvasSizeRef.current = { width, height, dpr }
    lastDrawAtRef.current = null

    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    const state = gameStateRef.current
    const scaleX = width / state.width
    const scaleY = height / state.height
    const shipSize = getShipSize(width)

    state.width = width
    state.height = height
    state.ship.width = shipSize.width
    state.ship.height = shipSize.height
    state.ship.x = clamp(
      state.ship.x * scaleX,
      shipSize.width * 0.55,
      width - shipSize.width * 0.55
    )
    state.ship.y = clamp(
      state.ship.y * scaleY,
      height * 0.24,
      height - shipSize.height * 0.7
    )
    state.rocks.forEach((rock) => {
      rock.x = clamp(rock.x * scaleX, rock.radius, width - rock.radius)
      rock.y *= scaleY
    })
    state.lasers.forEach((laser) => {
      laser.x *= scaleX
      laser.y *= scaleY
    })
    state.stars = fitStars(state.stars, width, height, renderProfile)
  }, [])

  const updatePointerPosition = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()

      pointerRef.current.x = event.clientX - rect.left
      pointerRef.current.y = event.clientY - rect.top
    },
    []
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      event.preventDefault()
      event.currentTarget.focus({ preventScroll: true })
      event.currentTarget.setPointerCapture(event.pointerId)

      if (statusRef.current === "ready" || statusRef.current === "gameover") {
        startNewGame()
      } else if (statusRef.current === "paused") {
        setGameStatus("playing")
      }

      updatePointerPosition(event)
      pointerRef.current.active = true
      attemptFire(gameStateRef.current, performance.now(), true)
    },
    [setGameStatus, startNewGame, updatePointerPosition]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!pointerRef.current.active) {
        return
      }

      event.preventDefault()
      updatePointerPosition(event)
    },
    [updatePointerPosition]
  )

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      pointerRef.current.active = false

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    []
  )

  useEffect(() => {
    const renderProfile = getRenderProfile()
    renderProfileRef.current = renderProfile

    const state = gameStateRef.current
    state.stars = fitStars(
      state.stars,
      state.width,
      state.height,
      renderProfile
    )
    canvasSizeRef.current = { width: 0, height: 0, dpr: 0 }
    lastDrawAtRef.current = null
  }, [])

  useEffect(() => {
    readStoredHighScore().then((savedHighScore) => {
      highScoreRef.current = savedHighScore
      gameStateRef.current.highScore = savedHighScore
      publishHud(true, performance.now())
    })
  }, [publishHud])

  useEffect(() => {
    syncCanvasSize()

    if ("ResizeObserver" in window && canvasRef.current) {
      const resizeObserver = new ResizeObserver(syncCanvasSize)
      resizeObserver.observe(canvasRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }

    window.addEventListener("resize", syncCanvasSize)

    return () => {
      window.removeEventListener("resize", syncCanvasSize)
    }
  }, [syncCanvasSize])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      let handled = true

      if (event.key === "ArrowLeft") {
        keysRef.current.left = true
      } else if (event.key === "ArrowRight") {
        keysRef.current.right = true
      } else if (event.key === "ArrowUp") {
        keysRef.current.up = true
      } else if (event.key === "ArrowDown") {
        keysRef.current.down = true
      } else if (event.code === "Space" || event.key === "Enter") {
        keysRef.current.fire = true

        if (statusRef.current === "ready" || statusRef.current === "gameover") {
          startNewGame()
        } else if (statusRef.current === "paused") {
          setGameStatus("playing")
        }

        attemptFire(gameStateRef.current, performance.now(), true)
      } else if (event.key.toLowerCase() === "p") {
        togglePause()
      } else if (event.key.toLowerCase() === "r") {
        startNewGame()
      } else {
        handled = false
      }

      if (handled) {
        event.preventDefault()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keysRef.current.left = false
      } else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
      ) {
        keysRef.current.right = false
      } else if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        keysRef.current.up = false
      } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        keysRef.current.down = false
      } else if (event.code === "Space" || event.key === "Enter") {
        keysRef.current.fire = false
      } else {
        return
      }

      event.preventDefault()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [setGameStatus, startNewGame, togglePause])

  useEffect(() => {
    const animate = (now: number) => {
      const canvas = canvasRef.current
      const context = canvas?.getContext("2d")

      if (!canvas || !context) {
        animationFrameRef.current = window.requestAnimationFrame(animate)
        return
      }

      const renderProfile = renderProfileRef.current
      const currentStatus = statusRef.current
      const frameIntervalMs =
        currentStatus === "playing"
          ? renderProfile.frameIntervalMs
          : renderProfile.idleFrameIntervalMs
      const lastDrawAt = lastDrawAtRef.current

      if (lastDrawAt !== null && now - lastDrawAt < frameIntervalMs) {
        animationFrameRef.current = window.requestAnimationFrame(animate)
        return
      }

      lastDrawAtRef.current = now

      const lastFrameAt = lastFrameAtRef.current ?? now
      const deltaSeconds = Math.min((now - lastFrameAt) / 1000, MAX_FRAME_STEP)
      lastFrameAtRef.current = now

      if (currentStatus === "playing") {
        const didCrash = stepGame(
          gameStateRef.current,
          keysRef.current,
          pointerRef.current,
          renderProfile,
          now,
          deltaSeconds
        )

        if (didCrash) {
          finishGame()
        }
      }

      drawGame(context, gameStateRef.current, statusRef.current, renderProfile)
      publishHud(false, now)
      animationFrameRef.current = window.requestAnimationFrame(animate)
    }

    animationFrameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [finishGame, publishHud])

  const primaryLabel =
    status === "playing" ? "Pause" : status === "paused" ? "Resume" : "Start"

  return (
    <section
      className={cn(
        "relative min-h-0 w-full overflow-hidden rounded-md border border-white/10 bg-black text-white",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label="Rocket game canvas. Arrow keys or WASD move the ship, Space shoots, and touch dragging moves and shoots on mobile."
        className="block h-[min(72svh,560px)] min-h-[420px] w-full touch-none bg-black outline-none focus-visible:ring-2 focus-visible:ring-[#FDFF86]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />

      <div className="pointer-events-none absolute top-3 right-3 flex gap-2">
        <button
          type="button"
          className="pointer-events-auto h-8 rounded-md border border-white/15 bg-black/65 px-3 font-pixel text-xs text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#FDFF86] focus-visible:outline-none"
          onClick={handlePrimaryAction}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          className="pointer-events-auto h-8 rounded-md border border-white/15 bg-black/65 px-3 font-pixel text-xs text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#FDFF86] focus-visible:outline-none"
          onClick={startNewGame}
        >
          Reset
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Status {status}. Score {hud.score}. High score {hud.highScore}. Rocks
        destroyed {hud.rocksDestroyed}. Level {hud.level}.
      </p>
    </section>
  )
}

export default RocketGame
