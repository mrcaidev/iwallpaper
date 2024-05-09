"use client";

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
import { LoaderIcon, SaveIcon } from "lucide-react";
import { useActionState } from "react";
import { updateNickname } from "./actions";

type Props = {
  initialNickname: string;
};

export function NicknameCard({ initialNickname }: Props) {
  const [{ nickname, error }, dispatch, isPending] = useActionState(
    updateNickname,
    { nickname: initialNickname, error: "" },
  );

  useErrorToast(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nickname</CardTitle>
        <CardDescription>
          This is how your name will be displayed across the iWallpaper
          platform.
        </CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent>
          <Input
            name="nickname"
            defaultValue={nickname}
            required
            minLength={2}
            maxLength={20}
            placeholder="2-20 characters"
            id="nickname"
          />
        </CardContent>
        <CardFooter className="justify-between py-4 border-t">
          <p className="text-sm text-muted-foreground">
            The length of a nickname should be between 2 and 20 characters.
          </p>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderIcon size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon size={16} className="mr-2" />
                Save
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
