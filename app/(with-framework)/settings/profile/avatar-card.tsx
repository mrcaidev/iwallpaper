"use client";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
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
import { LoaderIcon, UploadIcon, UserCircleIcon } from "lucide-react";
import { useActionState, type ChangeEvent } from "react";
import { createSupabaseBrowserClient } from "utils/supabase/browser";

type UploadAvatarState = {
  avatarUrl: string;
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

  const supabase = createSupabaseBrowserClient();

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

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(data.path);

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (updateError) {
    return { ...state, error: updateError.message };
  }

  return { ...state, avatarUrl: publicUrl, error: "" };
}

type Props = {
  initialAvatarUrl: string;
};

export function AvatarCard({ initialAvatarUrl }: Props) {
  const [{ avatarUrl, error }, dispatch, isPending] = useActionState(
    uploadAvatar,
    { avatarUrl: initialAvatarUrl, error: "" },
  );

  useErrorToast(error);

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          An avatar is optional but strongly recommended.
        </CardDescription>
      </CardHeader>
      <CardContent className="absolute right-0 top-5">
        <Avatar className="w-16 h-16 mx-auto">
          <AvatarImage src={avatarUrl} alt="Your avatar" />
          <AvatarFallback>
            <UserCircleIcon size={48} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter className="justify-between py-4 border-t">
        <p className="text-sm text-muted-foreground">
          An avatar image should not exceed 1MB.
        </p>
        <Button className="cursor-pointer" asChild>
          <label htmlFor="avatar">
            {isPending ? (
              <>
                <LoaderIcon size={16} className="mr-2 animate-spin" />
                Uploading avatar...
              </>
            ) : (
              <>
                <UploadIcon size={16} className="mr-2" />
                Change avatar
              </>
            )}
          </label>
        </Button>
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
