import { CompassIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist.",
};

export default function NotFoundPage() {
  return (
    <main className="grid place-content-center place-items-center gap-3 h-screen p-12 text-center text-balance">
      <CompassIcon size={64} />
      <h1 className="font-bold text-3xl">Page not found</h1>
      <p className="text-muted-foreground">This page does not exist.</p>
      <Link href="/" className="underline">
        Go back to homepage
      </Link>
    </main>
  );
}
