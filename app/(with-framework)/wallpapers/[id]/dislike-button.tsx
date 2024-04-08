import { Button } from "components/ui/button";
import { cn } from "components/ui/utils";
import { ThumbsDownIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  isDisliked: boolean;
  action: () => void;
};

export function DislikeButton({ isDisliked, action }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" formAction={action} disabled={pending}>
      <ThumbsDownIcon
        size={16}
        className={cn("mr-2", isDisliked && "fill-current")}
      />
      {isDisliked ? "Disliked" : "Dislike"}
    </Button>
  );
}
