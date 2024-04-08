"use client";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { cn } from "components/ui/utils";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBrowserSupabaseClient } from "utils/supabase/browser";
import { react } from "./actions";

type Props = {
  userId: string | null;
  wallpaperId: string;
};

export function LikeButton({ userId, wallpaperId }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLikedAt(wallpaperId: string) {
      if (!userId) {
        return;
      }

      const supabase = createBrowserSupabaseClient();

      const { data, error } = await supabase
        .from("histories")
        .select("liked_at")
        .eq("user_id", userId)
        .eq("wallpaper_id", wallpaperId)
        .maybeSingle();

      if (error || !data) {
        return;
      }

      setIsLiked(data.liked_at !== null);
    }

    fetchLikedAt(wallpaperId);
  }, [userId, wallpaperId]);

  if (!userId) {
    return (
      <Button variant="outline" asChild>
        <Link href="/sign-in">
          <HeartIcon size={16} className="mr-2" />
          Like
        </Link>
      </Button>
    );
  }

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
