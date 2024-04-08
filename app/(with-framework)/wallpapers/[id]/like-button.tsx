import { Button } from "components/ui/button";
import { cn } from "components/ui/utils";
import { HeartIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  isLiked: boolean;
  action: () => void;
};

export function LikeButton({ isLiked, action }: Props) {
  const { pending } = useFormStatus();

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
