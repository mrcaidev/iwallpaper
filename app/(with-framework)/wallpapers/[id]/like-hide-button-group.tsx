"use client";

import { useToast } from "components/ui/use-toast";
import { useState } from "react";
import { react } from "./actions";
import { HideButton } from "./hide-button";
import { LikeButton } from "./like-button";

type Status = "normal" | "like" | "hide";

type Props = {
  wallpaperId: string;
  initialStatus: Status;
};

export function LikeHideButtonGroup({ wallpaperId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const { toast } = useToast();

  const action = async (nextStatus: Status) => {
    const error = await react(wallpaperId, { type: nextStatus });

    if (error) {
      toast({ variant: "destructive", description: error });
      return;
    }

    setStatus(nextStatus);
  };

  return (
    <form className="grid grid-cols-2 gap-2">
      <LikeButton
        isLiked={status === "like"}
        action={action.bind(null, status === "like" ? "normal" : "like")}
      />
      <HideButton
        isHidden={status === "hide"}
        action={action.bind(null, status === "hide" ? "normal" : "hide")}
      />
    </form>
  );
}
