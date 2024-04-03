import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Inter as FontSans } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iwallpaper.mrcai.dev"),
  title: {
    template: "%s - iWallpaper",
    default: "iWallpaper",
  },
  description:
    "iWallpaper is a wallpaper exploring platform, featured with AI-powered recommendation, search engine and user interactions.",
  generator: "Next.js",
  applicationName: "iWallpaper",
  authors: [{ name: "Yuwang Cai", url: "https://mrcai.dev" }],
  creator: "Yuwang Cai",
  publisher: "Yuwang Cai",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
