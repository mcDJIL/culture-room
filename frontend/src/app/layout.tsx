import React from "react"
import type { Metadata } from "next"
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google"
import "./styles.css"

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })

const title = "Ruang Budaya"
const description =
  "Jejaring profesional, marketplace jasa, dan ruang kolaborasi bagi pelaku budaya Nusantara."

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title,
  description,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title,
    description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${fraunces.variable} ${jakarta.variable} min-h-screen bg-[#eee9df] text-stone-900 antialiased`}>
        <div id="root" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  )
}
