import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "O'SMS - Professional SMS Platform",
  description:
    "Enterprise-grade SMS communication platform with global reach, advanced security, and cryptocurrency payments.",
  keywords: ["SMS", "messaging", "business", "enterprise", "communication", "global"],
  authors: [{ name: "O'SMS Team" }],
  creator: "O'SMS",
  publisher: "O'SMS",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://osms.com",
    title: "O'SMS - Professional SMS Platform",
    description: "Enterprise-grade SMS communication platform with global reach",
    siteName: "O'SMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "O'SMS - Professional SMS Platform",
    description: "Enterprise-grade SMS communication platform with global reach",
    creator: "@osms",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  )
}
