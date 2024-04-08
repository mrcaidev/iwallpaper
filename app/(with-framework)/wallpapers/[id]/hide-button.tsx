import { Button } from "components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  isHidden: boolean;
  action: () => void;
};

export function HideButton({ isHidden, action }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" formAction={action} disabled={pending}>
      {isHidden ? (
        <>
          <EyeIcon size={16} className="mr-2" />
          Hidden
        </>
      ) : (
        <>
          <EyeOffIcon size={16} className="mr-2" />
          Hide
        </>
      )}
    </Button>
  );
}
