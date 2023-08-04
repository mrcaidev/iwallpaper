import "@unocss/reset/tailwind.css";
import { UserProvider } from "auth/context";
import clsx from "clsx";
import { Mulish as Font } from "next/font/google";
import { PropsWithChildren } from "react";
import { Sidebar } from "sidebar";
import "uno.css";

const font = Font({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: {
    template: "%s - iWallpaper",
    default: "iWallpaper",
  },
  description:
    "iWallpaper is a wallpaper exploring platform, featured with AI-powered recommendation, search engine, user subscription, and so much more!",
  applicationName: "iWallpaper",
  authors: [{ name: "Yuwang Cai", url: "https://mrcai.dev" }],
  creator: "Yuwang Cai",
  publisher: "Yuwang Cai",
  robots: "index,follow",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={clsx(font.className, font.variable, "dark")}>
      <body className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
        <UserProvider>
          <Sidebar />
          <main className="min-h-screen ml-17 lg:ml-80">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
