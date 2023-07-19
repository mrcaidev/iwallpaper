import { Button } from "components/button";
import { Input } from "components/input";
import { FormEvent, useState } from "react";
import { LogIn, Mail } from "react-feather";
import { toast } from "react-toastify";
import { supabase } from "utils/supabase";

export function Form() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
