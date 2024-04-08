"use client";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { cn } from "components/ui/utils";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { react } from "./actions";

type Props = {
  wallpaperId: string;
  initialIsLiked: boolean;
};

export function LikeButton({ wallpaperId, initialIsLiked }: Props) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const action = async () => {
    const error = await react(wallpaperId, {
      type: isLiked ? "normal" : "like",
    });

    if (error) {
      toast({ variant: "destructive", description: error });
      return;
    }

    setIsLiked((isLiked) => !isLiked);
  };

  return (
    <Button variant="outline" formAction={action} disabled={pending}>
      <HeartIcon
        size={16}
        className={cn("mr-2", isLiked && "stroke-red-500 fill-red-500")}
      />
      {isLiked ? "Liked" : "Like"}
    </Button>
  );
}
