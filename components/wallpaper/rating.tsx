"use client";

import { Rating as LibraryRating, Star } from "@smastrom/react-rating";
import { useErrorToast } from "components/ui/use-toast";
import { useActionState } from "react";
import type { Database } from "utils/supabase/types";
import { upsertRating } from "./actions";

type Props = {
  wallpaperId: string;
  initialRating: Database["public"]["Tables"]["histories"]["Row"]["rating"];
};

export function Rating({ wallpaperId, initialRating }: Props) {
  const [{ rating, error }, dispatch, isPending] = useActionState(
    upsertRating.bind(null, wallpaperId),
    { rating: initialRating ?? 0, error: "" },
  );

  useErrorToast(error);

  return (
    <LibraryRating
      value={rating}
      onChange={dispatch}
      readOnly={isPending}
      transition="zoom"
      itemStyles={{
        itemShapes: Star,
        itemStrokeWidth: 2,
        activeFillColor: "#f8fafc",
        activeStrokeColor: "#f8fafc",
        inactiveFillColor: "transparent",
        inactiveStrokeColor: "#f8fafc",
      }}
      className="max-w-36"
    />
  );
}
