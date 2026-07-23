import Footer from "@/components/Footer/Footer"
import GlobalWrapper from "@/components/global/GlobalWrapper"
import Navbar from "@/components/global/Navbar"
import { PersistentBanner } from "@/components/Home/PersistentBanner"
import React from "react"
type LayoutProps = {
  children: React.ReactNode
}
const layout = ({ children }: LayoutProps) => {
  return (
    <GlobalWrapper>
      <div className="relative flex flex-1 flex-col">
        <Navbar />
        <main className="relative mt-10 flex min-h-0 flex-1 flex-col">
          {/*{children}*/}
          <PersistentBanner>{children}</PersistentBanner>
        </main>
        <Footer />
      </div>
    </GlobalWrapper>
  )
}

export default layout
