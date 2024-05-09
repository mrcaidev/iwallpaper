"use server";

import type { Provider, UserIdentity } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";

type LinkIdentityState = {
  identity: UserIdentity | undefined;
  error: string;
};

export async function linkIdentity(
  state: LinkIdentityState,
  provider: Provider,
) {
  const supabase = createSupabaseServerClient();

  if (state.identity) {
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(
      state.identity,
    );

    if (unlinkError) {
      return { ...state, error: unlinkError.message };
    }

    return { identity: undefined, error: "" };
  }

  const redirectTo = new URL("/auth/callback", process.env.ORIGIN);
  redirectTo.searchParams.set("next", "/settings/third-party-services");

  const { data: linkData, error: linkError } = await supabase.auth.linkIdentity(
    {
      provider,
      options: {
        redirectTo: redirectTo.toString(),
      },
    },
  );

  if (linkError) {
    return { ...state, error: linkError.message };
  }

  console.log(linkData.url);
  revalidatePath("/", "layout");
  redirect(linkData.url);
}
