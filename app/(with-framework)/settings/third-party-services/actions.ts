"use server";

import type { Provider, UserIdentity } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";

type LinkIdentitiesState = {
  identities: UserIdentity[];
  error: string;
};

export async function linkIdentities(
  state: LinkIdentitiesState,
  provider: Provider,
) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUserIdentities();

  console.log(JSON.stringify(data));

  if (error) {
    return { ...state, error: error.message };
  }

  const targetIdentity = data.identities.find(
    (identity) => identity.provider === provider,
  );

  if (targetIdentity) {
    const { error: unlinkError } =
      await supabase.auth.unlinkIdentity(targetIdentity);

    if (unlinkError) {
      return { ...state, error: unlinkError.message };
    }

    const nextIdentities = data.identities.filter(
      (identity) => identity.provider !== provider,
    );
    return { identities: nextIdentities, error: "" };
  }

  const { data: linkData, error: linkError } = await supabase.auth.linkIdentity(
    {
      provider,
      options: {
        redirectTo: process.env.ORIGIN + "/auth/callback",
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
