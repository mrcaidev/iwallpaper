import { Separator } from "components/ui/separator";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import background from "./background.webp";
import { SignInForm } from "./form";
import { SignInWithGithubButton } from "./sign-in-with-github-button";

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
        <div className="w-[360px]">
          <div className="space-y-2 mb-4 text-center">
            <h1 className="font-bold text-3xl">Sign in</h1>
            <p className="text-muted-foreground text-balance">
              Sign in to enjoy all features of iWallpaper
            </p>
          </div>
          <SignInWithGithubButton />
          <div className="relative my-2">
            <Separator className="absolute left-0 top-1/2 -transform-y-1/2 w-[45%]" />
            <Separator className="absolute right-0 top-1/2 -transform-y-1/2 w-[45%]" />
            <p className="bg-background text-sm text-muted-foreground text-center">
              or
            </p>
          </div>
          <SignInForm />
          <div className="mt-6 text-sm text-center">
            Don&apos;t have an account?&nbsp;
            <Link href="/sign-up" className="underline">
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
