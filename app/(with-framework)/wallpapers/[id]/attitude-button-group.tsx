"use client";

import { useToast } from "components/ui/use-toast";
import { useState } from "react";
import { react } from "./actions";
import { DislikeButton } from "./dislike-button";
import { LikeButton } from "./like-button";

type Attitude = null | "liked" | "disliked";

type Props = {
  wallpaperId: string;
  initialAttitude: Attitude;
};

export function AttitudeButtonGroup({ wallpaperId, initialAttitude }: Props) {
  const [attitude, setAttitude] = useState(initialAttitude);
  const { toast } = useToast();

  const action = async (nextAttitude: Attitude) => {
    const error = await react(wallpaperId, {
      type: "attitude",
      payload: nextAttitude,
    });

    if (error) {
      toast({ variant: "destructive", description: error });
      return;
    }

    setAttitude(nextAttitude);
  };

  return (
    <form className="grid grid-cols-2 gap-2">
      <LikeButton
        isLiked={attitude === "liked"}
        action={action.bind(null, attitude === "liked" ? null : "liked")}
      />
      <DislikeButton
        isDisliked={attitude === "disliked"}
        action={action.bind(null, attitude === "disliked" ? null : "disliked")}
      />
    </form>
  );
}
