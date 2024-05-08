import { BanIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  searchParams: {
    message?: string;
  };
};

export default function AuthErrorPage({
  searchParams: { message = "Unknown error" },
}: Props) {
  return (
    <div className="grid place-content-center place-items-center gap-3 p-12 h-full text-center text-balance">
      <BanIcon size={64} />
      <h1 className="font-bold text-3xl">Authorization Error</h1>
      <p className="text-muted-foreground">{message}</p>
      <Link href="/" className="underline">
        Go back to homepage
      </Link>
    </div>
  );
}
