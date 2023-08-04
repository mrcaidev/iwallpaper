import "@unocss/reset/tailwind.css";
import clsx from "clsx";
import { Rubik } from "next/font/google";
import { PropsWithChildren } from "react";
import "uno.css";

const font = Rubik({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: {
    template: "%s - iWallpaper",
    default: "iWallpaper",
  },
  description:
    "iWallpaper is a wallpaper exploring platform, featured with AI-powered recommendation, search engine, user subscription, and so much more!",
  authors: [{ name: "Yuwang Cai", url: "https://mrcai.dev" }],
  creator: "Yuwang Cai",
  publisher: "Yuwang Cai",
  applicationName: "iWallpaper",
  robots: "index,follow",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={clsx(font.className, font.variable)}>
      <body className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
        {children}
      </body>
    </html>
  );
}
