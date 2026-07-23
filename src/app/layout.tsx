import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist_Mono, Inter, Pixelify_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { GeistPixelSquare } from "geist/font/pixel"
import Providers from "@/components/provider/TansStackProvider"
import { BlogDataLoader } from "@/components/Blog/BlogDataLoader"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig, siteUrl } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const pixelify_sans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: "/alokm.png",
        width: 500,
        height: 500,
        alt: `${siteConfig.name} profile photo`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.handle,
    images: ["/alokm.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased",
        fontMono.variable,
        inter.variable,
        pixelify_sans.variable,
        GeistPixelSquare.className
      )}
    >
      <body suppressHydrationWarning className="">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Alok Mishra",
              alternateName: ["zerion0", "zerion", "zeera", "zera", "alokm"],
              url: siteConfig.url,
              image: `${siteConfig.url}/alokm.png`,
              description: siteConfig.descriptionLong,
              jobTitle: "Full-Stack Developer",
              location: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Surat",
                  addressRegion: "Gujarat",
                  addressCountry: "IN",
                },
              },
              sameAs: [
                "https://x.com/zerion0",
                "https://github.com/zerion0",
                "https://medium.com/@zerion0",
                "https://instagram.com/itszerion",
                "https://t.me/heyzerion",
                "https://peerlist.io/zerion",
              ],
              knowsAbout: [
                "Backend Architecture",
                "System Design",
                "Scalable Applications",
                "API Design",
                "Web Development",
                "AI Workflows",
                "Automation",
                "Software Engineering",
                "Competitive Programming",
                "Data Structures and Algorithms",
              ],
              knowsLanguage: ["English", "Hindi"],
              award: "2nd Place — Internal Company Hackathon",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": siteConfig.url,
              },
            }),
          }}
        />
        <link
          rel="prefetch"
          as="fetch"
          href="/api/banner"
          crossOrigin="anonymous"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Suspense fallback={null}>
              <BlogDataLoader />
            </Suspense>
            {children}
          </Providers>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
