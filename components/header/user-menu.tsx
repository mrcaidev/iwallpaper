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
  LifeBuoyIcon,
  LogInIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  UserCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function UserMenu() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <div className="space-x-3">
        <Button variant="outline" asChild>
          <Link href="/sign-in">
            <LogInIcon size={16} className="mr-1" />
            Sign in
          </Link>
        </Button>
        <Button asChild className="hidden md:inline-flex">
          <Link href="/sign-up">
            <PlusIcon size={16} className="mr-1" />
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
          {user.user_metadata.nickname ?? "My Account"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}`}>
            <UserIcon size={16} className="mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/setting">
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
        <DropdownMenuItem asChild>
          <form action={signOut}>
            <button type="submit" className="flex items-center">
              <LogOutIcon size={16} className="mr-2" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function signOut() {
  "use server";

  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
