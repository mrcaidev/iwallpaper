"use client";

import { Rating as LibraryRating } from "@smastrom/react-rating";
import { useToast } from "components/ui/use-toast";
import { useState } from "react";
import { react } from "./actions";

type Props = {
  wallpaperId: string;
  initialRating: number | null;
};

export function Rating({ wallpaperId, initialRating }: Props) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [isReadonly, setIsReadonly] = useState(false);
  const { toast } = useToast();

  const action = async (nextRating: number) => {
    const previousRating = rating;

    setRating(nextRating);
    setIsReadonly(true);

    const error = await react(wallpaperId, {
      type: "rating",
      payload: nextRating,
    });

    if (error) {
      toast({ variant: "destructive", description: error });
      setRating(previousRating);
    }

    setIsReadonly(false);
  };

  return (
    <LibraryRating
      value={rating}
      onChange={action}
      readOnly={isReadonly}
      className="max-w-48 mx-auto"
    />
  );
}
