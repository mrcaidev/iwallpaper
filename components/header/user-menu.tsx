import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  CircleUserIcon,
  LogInIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const user = null;

  if (!user) {
    return (
      <div className="flex gap-3">
        <Button variant="outline" asChild className="gap-1">
          <Link href="/sign-in">
            <LogInIcon size={16} />
            Sign in
          </Link>
        </Button>
        <Button asChild className="gap-1">
          <Link href="/sign-up">
            <PlusIcon size={16} />
            Sign up
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUserIcon size={20} />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon size={16} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
