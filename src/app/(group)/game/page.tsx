import type { Metadata } from "next"
import dynamic from "next/dynamic"
import CurvArrow1 from "@/components/asserts/arrows/CurvArrow1"

const RocketGame = dynamic(() => import("@/components/asserts/Game/rocketGame"))

export const metadata: Metadata = {
  title: "Game",
  description: "A small interactive rocket game by Alok Mishra.",
  alternates: {
    canonical: "/game",
  },
  openGraph: {
    images: [{ url: "/og/game.png", width: 1200, height: 630, alt: "Rocket Game by Alok Mishra" }],
  },
  twitter: {
    images: ["/og/game.png"],
  },
}

const GamePage = () => {
  return (
    <div className="relative mt-10 flex w-full flex-col">
      <RocketGame />

      <div className="pointer-events-none fixed top-96 left-80 hidden h-full w-full lg:block">
        <CurvArrow1
          ClassName=" absolute h-auto w-28 -rotate-190  text-primary/40"
          strokeWidth={2.5}
        />
        <span className="absolute flex w-full -translate-x-45 translate-y-5 text-xs leading-tight text-primary/70">
          I didn`&lsquo;`t added Sound duhh....
        </span>
      </div>
    </div>
  )
}

export default GamePage
