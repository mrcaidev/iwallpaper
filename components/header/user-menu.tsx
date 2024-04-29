import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
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
  GithubIcon,
  HeartIcon,
  LifeBuoyIcon,
  LogInIcon,
  PlusIcon,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "utils/supabase/server";
import { SignOutForm } from "./sign-out-form";
import { ThemeToggle } from "./theme-toggle";

export async function UserMenu() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex gap-3">
        <div>
          <Button variant="outline" asChild>
            <Link href="/sign-in">
              <LogInIcon size={16} className="mr-2" />
              Sign in
            </Link>
          </Button>
        </div>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/sign-up">
              <PlusIcon size={16} className="mr-2" />
              Sign up
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt="Your avatar"
            />
            <AvatarFallback>
              <UserCircleIcon size={20} />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user.user_metadata.nickname ?? user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/favorites">
            <HeartIcon size={16} className="mr-2" />
            Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <SettingsIcon size={16} className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/support">
            <LifeBuoyIcon size={16} className="mr-2" />
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="https://github.com/mrcaidev/iwallpaper">
            <GithubIcon size={16} className="mr-2" />
            Source code
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutForm />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
