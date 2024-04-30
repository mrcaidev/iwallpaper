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
import { LoaderIcon } from "lucide-react";
import { useActionState } from "react";
import { updateNickname } from "./actions";

type Props = {
  initialNickname: string;
};

export function NicknameCard({ initialNickname }: Props) {
  const [{ nickname, error }, action, isPending] = useActionState(
    updateNickname,
    {
      nickname: initialNickname,
      error: "",
    },
  );

  useErrorToast(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nickname</CardTitle>
        <CardDescription>Give yourself a cool name!</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <Input
            name="nickname"
            defaultValue={nickname}
            placeholder="2-20 characters"
            disabled={isPending}
            id="nickname"
          />
        </CardContent>
        <CardFooter className="py-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <LoaderIcon size={16} className="mr-2 animate-spin" />
            )}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
