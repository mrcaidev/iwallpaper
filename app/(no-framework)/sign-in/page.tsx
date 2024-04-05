import Image from "next/image";
import Link from "next/link";
import background from "./background.webp";
import { SignInForm } from "./form";

export default function SignInPage() {
  return (
    <div className="grid lg:grid-cols-2 h-full">
      <div className="place-self-center space-y-6 w-[360px] py-12">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">Sign in</h1>
          <p className="text-muted-foreground text-balance">
            Sign in to enjoy all features of iWallpaper
          </p>
        </div>
        <SignInForm />
        <div className="text-sm text-center">
          Don&apos;t have an account?&nbsp;
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </div>
      <div className="hidden lg:block relative bg-muted">
        <Image
          src={background}
          alt="Beach and ocean during daytime"
          fill
          sizes="(max-width: 1024px) 0, 50vw"
          priority
          placeholder="blur"
          className="object-cover"
        />
      </div>
    </div>
  );
}
