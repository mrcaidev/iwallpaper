"use client";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { cn } from "components/ui/utils";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBrowserSupabaseClient } from "utils/supabase/browser";
import { like } from "./actions";

type Props = {
  wallpaperId: string;
};

export function LikeButton({ wallpaperId }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLikedAt(wallpaperId: string) {
      const supabase = createBrowserSupabaseClient();

      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      const { data, error: selectError } = await supabase
        .from("histories")
        .select("liked_at")
        .eq("user_id", session.user.id)
        .eq("wallpaper_id", wallpaperId)
        .maybeSingle();

      if (selectError || !data) {
        setIsLiked(false);
        return;
      }

      setIsLiked(data.liked_at !== null);
    }

    fetchLikedAt(wallpaperId);
  }, [wallpaperId]);

  if (!isAuthenticated) {
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
    const error = await like.bind(null, wallpaperId, !isLiked)();
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
