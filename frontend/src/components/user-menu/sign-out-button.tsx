import { LogOut } from "react-feather";
import { toast } from "react-toastify";
import { supabase } from "utils/supabase";

export function SignOutButton() {
  const handleClick = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully signed out");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      role="menuitem"
      className="flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-slate-300 dark:hover:bg-slate-700 text-sm"
    >
      <LogOut size={14} />
      Sign out
    </button>
  );
}
