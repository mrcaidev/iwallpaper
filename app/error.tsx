"use client";

import { BanIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
};

export default function ErrorBoundary({ error }: Props) {
  useEffect(() => console.error(error), [error]);

  return (
    <main className="grid place-content-center place-items-center gap-3 p-12 h-screen text-center text-balance">
      <BanIcon size={64} />
      <h1 className="font-bold text-3xl">Error</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <p className="text-muted-foreground">
        {error.digest && `Digest: ${error.digest}`}
      </p>
      <Link href="/" className="underline">
        Go back to homepage
      </Link>
    </main>
  );
}
