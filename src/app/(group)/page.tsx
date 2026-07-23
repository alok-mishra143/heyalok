import type { Metadata } from "next"
import { Suspense } from "react"
import AlokGithub from "@/components/Home/AlokGithub"
import Profile from "@/components/Home/Profile"
import RecentBlogs from "@/components/Home/RecentBlogs"
import RecentProjects from "@/components/Home/RecentProjects"
import Experience from "@/components/Home/Experience"
import SpotifyPlayer from "@/components/Home/Spotify"
import WhoAmI from "@/components/Home/WhoAmI"
import { experiences } from "@/data/experiences"

export const metadata: Metadata = {
  openGraph: {
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Alok Mishra" },
    ],
  },
  twitter: {
    images: ["/og/home.png"],
  },
}

const ProfileFallback = () => (
  <div className="h-52 w-full rounded-b-md bg-muted" />
)

const page = () => {
  return (
    <div className="flex min-h-lvh w-full flex-col gap-2">
      <Suspense fallback={<ProfileFallback />}>
        <Profile />
      </Suspense>
      <WhoAmI />
      <SpotifyPlayer />
      <AlokGithub />
      <Experience experiences={experiences} />
      <RecentProjects />
      <RecentBlogs />
    </div>
  )
}

export default page
