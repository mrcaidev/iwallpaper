import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();

  if (!tokenHash || !type) {
    redirectTo.pathname = "/auth/error";
    redirectTo.searchParams.set("error", "Invalid token_hash or type");
    return NextResponse.redirect(redirectTo);
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    redirectTo.pathname = "/auth/error";
    redirectTo.searchParams.set("error", error.message);
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = next;
  return NextResponse.redirect(redirectTo);
}
