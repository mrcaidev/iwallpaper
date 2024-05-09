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
import { createSupabaseServerClient } from "utils/supabase/server";
import { SignOutForm } from "./sign-out-form";
import { ThemeToggle } from "./theme-toggle";

export async function UserMenu() {
  const supabase = createSupabaseServerClient();

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
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="space-y-1">
          <p>
            {user.user_metadata.nickname ??
              user.user_metadata.full_name ??
              user.user_metadata.user_name ??
              "My Account"}
          </p>
          <p className="font-normal text-sm text-muted-foreground">
            {user.email ?? "No available email"}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/favorites" className="flex items-center w-full">
            <HeartIcon size={16} className="mr-2" />
            Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="flex items-center w-full">
            <SettingsIcon size={16} className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/support" className="flex items-center w-full">
            <LifeBuoyIcon size={16} className="mr-2" />
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="https://github.com/mrcaidev/iwallpaper"
            className="flex items-center w-full"
          >
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
