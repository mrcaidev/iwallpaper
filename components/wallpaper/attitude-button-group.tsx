"use client";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { cn } from "components/ui/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import type { Database } from "utils/supabase/types";
import { updateAttitude } from "./actions";

type Props = {
  wallpaperId: string;
  initialAttitude: Database["public"]["Tables"]["histories"]["Row"]["attitude"];
};

function useAttitude(
  initialAttitude: Database["public"]["Tables"]["histories"]["Row"]["attitude"],
) {
  const [attitude, setAttitude] = useState(initialAttitude);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const update =
    (
      nextAttitude: Database["public"]["Tables"]["histories"]["Row"]["attitude"],
    ) =>
    async (wallpaperId: string) => {
      setIsPending(true);

      const error = await updateAttitude(wallpaperId, nextAttitude);

      if (error) {
        toast({ variant: "destructive", description: error });
        setIsPending(false);
        return;
      }

      setAttitude(nextAttitude);
      setIsPending(false);
    };

  const like = update(attitude === "liked" ? null : "liked");
  const dislike = update(attitude === "disliked" ? null : "disliked");

  return { attitude, isPending, like, dislike };
}

export function DetailAttitudeButtonGroup({
  wallpaperId,
  initialAttitude,
}: Props) {
  const { attitude, isPending, like, dislike } = useAttitude(initialAttitude);

  return (
    <div className="shrink-0 grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        onClick={() => like(wallpaperId)}
        disabled={isPending}
      >
        <ThumbsUpIcon
          size={16}
          className={cn("mr-2", attitude === "liked" && "fill-current")}
        />
        {attitude === "liked" ? "Liked" : "Like"}
      </Button>
      <Button
        variant="outline"
        onClick={() => dislike(wallpaperId)}
        disabled={isPending}
      >
        <ThumbsDownIcon
          size={16}
          className={cn("mr-2", attitude === "disliked" && "fill-current")}
        />
        {attitude === "disliked" ? "Disliked" : "Dislike"}
      </Button>
    </div>
  );
}

export function ThumbnailAttitudeButtonGroup({
  wallpaperId,
  initialAttitude,
}: Props) {
  const { attitude, isPending, like, dislike } = useAttitude(initialAttitude);

  return (
    <div className="flex gap-1">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => like(wallpaperId)}
        disabled={isPending}
      >
        <ThumbsUpIcon
          size={16}
          className={attitude === "liked" ? "fill-current" : ""}
        />
        <span className="sr-only">
          {attitude === "liked" ? "Liked" : "Like"}
        </span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => dislike(wallpaperId)}
        disabled={isPending}
      >
        <ThumbsDownIcon
          size={16}
          className={attitude === "disliked" ? "fill-current" : ""}
        />
        <span className="sr-only">
          {attitude === "disliked" ? "Disliked" : "Dislike"}
        </span>
      </Button>
    </div>
  );
}
