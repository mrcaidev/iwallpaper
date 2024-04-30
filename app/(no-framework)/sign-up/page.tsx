import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import background from "./background.webp";
import { SignUpForm } from "./form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Enter your information to create an account",
};

export default async function SignUpPage() {
  return (
    <div className="grid lg:grid-cols-2 h-full">
      <div className="hidden lg:block relative bg-muted">
        <Image
          src={background}
          alt="Aerial photography of gray and brown mountain"
          fill
          sizes="(max-width: 1024px) 0, 50vw"
          priority
          placeholder="blur"
          className="object-cover"
        />
      </div>
      <div className="grid place-items-center relative">
        <div className="absolute top-12 left-12">
          <Link href="/" className="flex items-center">
            <ChevronLeftIcon size={16} className="mr-2" />
            Home
          </Link>
        </div>
        <div className="space-y-6 w-[360px]">
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl">Sign up</h1>
            <p className="text-muted-foreground text-balance">
              Enter your information to create an account
            </p>
          </div>
          <SignUpForm />
          <div className="text-sm text-muted-foreground text-center">
            Already have an account?&nbsp;
            <Link href="/sign-in" className="hover:text-foreground underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
