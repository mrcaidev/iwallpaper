import { Button } from "components/button";
import { Input } from "components/input";
import { FormEvent, useState } from "react";
import { LogIn, Mail } from "react-feather";
import { toast } from "react-toastify";
import { supabase } from "utils/supabase";

export function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const { email } = Object.fromEntries(formData);

    if (!email) {
      toast.error("Please enter your email address.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toString(),
      options: {
        data: {
          nick_name: null,
          avatar_url: null,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your inbox for the magic link!");
      setIsSent(true);
      setTimeout(() => setIsSent(false), 60 * 1000);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        name="email"
        required
        disabled={isSubmitting || isSent}
        placeholder="you@example.com"
      />
      {isSent ? (
        <Button variant="outline" icon={Mail} type="button" disabled>
          Check your inbox
        </Button>
      ) : (
        <Button icon={LogIn} isLoading={isSubmitting} type="submit">
          Sign in
        </Button>
      )}
    </form>
  );
}
