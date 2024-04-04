import { UserProvider } from "auth/context";
import { Header } from "components/header/header";
import { PcSidebar } from "components/sidebar";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "theme/context";
import { ThemeInitializer } from "theme/initializer";
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
      <head>
        <ThemeInitializer />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <UserProvider>
            <div className="hidden md:block fixed left-0 top-0 bottom-0 w-56 lg:w-72">
              <PcSidebar />
            </div>
            <div className="fixed left-0 md:left-56 lg:left-72 right-0 top-0">
              <Header />
            </div>
            <div className="grid min-h-screen pl-0 md:pl-56 lg:pl-72 pt-14 lg:pt-16">
              {children}
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
