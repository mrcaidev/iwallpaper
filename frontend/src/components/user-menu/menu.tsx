import { useUser } from "contexts/user";
import { useClickOutside } from "hooks/use-click-outside";
import { useKeyDown } from "hooks/use-key-down";
import { useRef, useState } from "react";
import { Avatar } from "./avatar";
import { UserMenuBody } from "./body";
import { SignInLink } from "./sign-in-link";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  useKeyDown("Escape", () => setIsOpen(false));

  const user = useUser();

  if (!user) {
    return <SignInLink />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="grid place-items-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <Avatar url={user.avatarUrl} />
        <span className="sr-only">
          {isOpen ? "Close user menu" : "Open user menu"}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 -bottom-5 translate-y-full">
          <UserMenuBody user={user} />
        </div>
      )}
    </div>
  );
}
