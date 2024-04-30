"use client";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { buttonVariants } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { useErrorToast } from "components/ui/use-toast";
import { cn } from "components/ui/utils";
import { LoaderIcon, UserCircleIcon } from "lucide-react";
import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/browser";

type UploadAvatarState = {
  avatarPath: string;
  error: string;
};

async function uploadAvatar(
  state: UploadAvatarState,
  event: ChangeEvent<HTMLInputElement>,
) {
  event.preventDefault();

  const files = event.currentTarget.files;

  if (!files || !files[0]) {
    return state;
  }

  const supabase = createBrowserSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ...state, error: "Please sign in first" };
  }

  const file = files[0];
  const fileExtension = file.name.split(".").pop();

  const { data, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(`${user.id}-${Math.random()}.${fileExtension}`, file);

  if (uploadError) {
    return { ...state, error: uploadError.message };
  }

  const nextAvatarPath = data.path;

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_path: nextAvatarPath },
  });

  if (updateError) {
    return { ...state, error: updateError.message };
  }

  return { ...state, avatarPath: nextAvatarPath, error: "" };
}

type Props = {
  initialAvatarPath: string;
};

export function AvatarCard({ initialAvatarPath }: Props) {
  const [{ avatarPath, error }, dispatch, isPending] = useActionState(
    uploadAvatar,
    { avatarPath: initialAvatarPath, error: "" },
  );

  useErrorToast(error);

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

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
        return;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    };

    buildAvatarUrl();
  }, [avatarPath]);

  return (
    <Card className="shrink-0 px-6 py-2">
      <CardHeader>
        <CardTitle>Your avatar</CardTitle>
        <CardDescription>Make your profile stand out.</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar className="w-48 h-48 mx-auto">
          <AvatarImage src={avatarUrl} alt="Your avatar" />
          <AvatarFallback>
            <div className="bg-muted">
              <UserCircleIcon size={144} className="text-muted-foreground" />
            </div>
          </AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter>
        <label
          htmlFor="avatar"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full cursor-pointer",
          )}
        >
          {isPending && <LoaderIcon size={16} className="mr-2 animate-spin" />}
          {isPending ? "Uploading avatar..." : "Change avatar"}
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={dispatch}
          disabled={isPending}
          id="avatar"
          className="hidden"
        />
      </CardFooter>
    </Card>
  );
}
