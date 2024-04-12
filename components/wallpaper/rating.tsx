"use client";

import { Rating as LibraryRating } from "@smastrom/react-rating";
import { useToast } from "components/ui/use-toast";
import { useState } from "react";
import type { Database } from "utils/supabase/types";
import { updateRating } from "./actions";

type Props = {
  wallpaperId: string;
  initialRating: Database["public"]["Tables"]["histories"]["Row"]["rating"];
};

export function Rating({ wallpaperId, initialRating }: Props) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const rate = async (nextRating: number) => {
    setIsPending(true);

    const error = await updateRating(wallpaperId, nextRating);

    if (error) {
      toast({ variant: "destructive", description: error });
      setIsPending(false);
      return;
    }

    setRating(nextRating);
    setIsPending(false);
  };

  return (
    <LibraryRating
      value={rating}
      onChange={rate}
      readOnly={isPending}
      className="max-w-48 mx-auto"
    />
  );
}
