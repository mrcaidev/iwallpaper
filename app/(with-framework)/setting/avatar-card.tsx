"use client";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { buttonVariants } from "components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { useToast } from "components/ui/use-toast";
import { cn } from "components/ui/utils";
import { LoaderIcon, UserCircleIcon } from "lucide-react";
import { useEffect, useState, type ChangeEventHandler } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/browser";

type Props = {
  initialAvatarPath: string | undefined;
};

export function AvatarCard({ initialAvatarPath }: Props) {
  const [avatarPath, setAvatarPath] = useState(initialAvatarPath);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!avatarPath) {
      return;
    }

    const buildAvatarUrl = async () => {
      const supabase = createBrowserSupabaseClient();

      const { data, error } = await supabase.storage
        .from("avatars")
        .download(avatarPath);

      if (error) {
        toast({ variant: "destructive", description: error.message });
        return;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    };

    buildAvatarUrl();
  }, [avatarPath]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setIsPending(true);

    const files = e.currentTarget.files;

    if (!files || !files[0]) {
      setIsPending(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({ variant: "destructive", description: "Please sign in first" });
      setIsPending(false);
      return;
    }

    const file = files[0];
    const fileExtension = file.name.split(".").pop();

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${user.id}-${Math.random()}.${fileExtension}`, file);

    if (uploadError) {
      toast({ variant: "destructive", description: uploadError.message });
      setIsPending(false);
      return;
    }

    const nextAvatarPath = data.path;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_path: nextAvatarPath },
    });

    if (updateError) {
      toast({ variant: "destructive", description: updateError.message });
      setIsPending(false);
      return;
    }

    setAvatarPath(nextAvatarPath);
    setIsPending(false);
  };

  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>Your avatar</CardTitle>
        <CardDescription>Make your profile stand out.</CardDescription>
      </CardHeader>
      <Avatar className="w-48 h-48 mx-auto">
        <AvatarImage src={avatarUrl} alt="Your avatar" />
        <AvatarFallback>
          <div className="bg-muted">
            <UserCircleIcon size={144} className="text-muted-foreground" />
          </div>
        </AvatarFallback>
      </Avatar>
      <CardFooter>
        <label
          htmlFor="avatar"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full mt-6 cursor-pointer",
          )}
        >
          {isPending && <LoaderIcon size={16} className="mr-2" />}
          {isPending ? "Uploading avatar..." : "Change avatar"}
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isPending}
          id="avatar"
          className="hidden"
        />
      </CardFooter>
    </Card>
  );
}
