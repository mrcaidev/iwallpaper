import { LogOutIcon } from "lucide-react";
import { signOut } from "./actions";

export function SignOutForm() {
  return (
    <form action={signOut}>
      <button type="submit" className="flex items-center">
        <LogOutIcon size={16} className="mr-2" />
        Sign out
      </button>
    </form>
  );
}
