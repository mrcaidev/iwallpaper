"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { buttonVariants } from "components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { useErrorToast } from "components/ui/use-toast";
import { LoaderIcon, TrashIcon } from "lucide-react";
import { useActionState } from "react";
import { deleteUser } from "./actions";

export function DeleteUserCard() {
  const [{ error }, dispatch, isPending] = useActionState(deleteUser, {
    error: "",
  });

  useErrorToast(error);

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete your account</CardTitle>
        <CardDescription>
          Permanently remove your personal account and all of its contents from
          the iWallpaper platform. This action is not reversible, so please
          continue with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-between py-4 border-t border-destructive">
        <p className="text-sm text-muted-foreground">
          You will be asked to confirm this request.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive" })}
          >
            <TrashIcon size={16} className="mr-2" />
            Request to delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={() => dispatch()}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isPending && <LoaderIcon className="mr-2 animate-spin" />}
                {isPending ? "Deleting..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
