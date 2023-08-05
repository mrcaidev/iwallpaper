"use client";

import { Button } from "components/button";
import { Input } from "components/input";
import icon from "icon.svg";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { LogIn, RotateCw } from "react-feather";
import { toast } from "react-toastify";
import { supabaseClient } from "supabase/client";
import google from "./google.svg";

export function Form() {
  const { isSubmitting, countdown, handleSubmit, handleGoogleSignIn } =
    useForm();
  const isCoolingDown = countdown > 0;

  return (
    <div className="w-full max-w-xs">
      <Image
        src={icon}
        alt="Logo."
        width={80}
        height={80}
        className="mx-auto"
      />
      <h1 className="mt-3 mb-8 font-bold text-4xl text-center">Sign In</h1>
      <Button variant="outline" onClick={handleGoogleSignIn}>
        <Image src={google} alt="Google logo." width={20} height={20} />
        Continue with Google
      </Button>
      <p className="mt-4 mb-3 text-sm text-center text-slate-600 dark:text-slate-400">
        OR
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          required
          disabled={isSubmitting || isCoolingDown}
          placeholder="you@example.com"
          id="email"
        />
        {isCoolingDown ? (
          <div className="flex justify-center items-center gap-3 px-4 py-3 border border-slate-400 dark:border-slate-600 rounded-md font-600 text-slate-600 dark:text-slate-400">
            <RotateCw size={20} />
            Try again in {countdown} seconds
          </div>
        ) : (
          <Button icon={LogIn} isLoading={isSubmitting} type="submit">
            Sign in
          </Button>
        )}
      </form>
    </div>
  );
}

function useForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { email } = Object.fromEntries(formData);

    if (!email) {
      setIsSubmitting(false);
      toast.error("Please enter your email address.");
      return;
    }

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: email.toString(),
    });

    if (error) {
      setIsSubmitting(false);
      toast.error(error.message);
      return;
    }

    setIsSubmitting(false);
    toast.success("Check your email for the magic link.");

    let countDown = 60;
    setCountdown(countDown);
    const interval = setInterval(() => {
      countDown--;
      setCountdown(countDown);
      if (countDown === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleGoogleSignIn = () => toast.info("Not available.");

  return { isSubmitting, countdown, handleSubmit, handleGoogleSignIn };
}
