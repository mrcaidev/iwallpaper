import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput(props: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="group relative">
      <Input {...props} type={isVisible ? "text" : "password"} />
      <div className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(true)}
          className={cn(isVisible && "hidden")}
        >
          <EyeIcon size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className={cn(isVisible || "hidden")}
        >
          <EyeOffIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
