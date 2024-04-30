import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import background from "./background.webp";
import { SignInForm } from "./form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to enjoy all features of iWallpaper",
};

export default async function SignInPage() {
  return (
    <div className="grid lg:grid-cols-2 h-full">
      <div className="grid place-items-center relative">
        <div className="absolute top-12 left-12">
          <Link href="/" className="group flex items-center">
            <ChevronLeftIcon
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Home
          </Link>
        </div>
        <div className="space-y-6 w-[360px]">
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl">Sign in</h1>
            <p className="text-muted-foreground text-balance">
              Sign in to enjoy all features of iWallpaper
            </p>
          </div>
          <SignInForm />
          <div className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?&nbsp;
            <Link href="/sign-up" className="hover:text-foreground underline">
              Sign up
            </Link>
          </div>
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
