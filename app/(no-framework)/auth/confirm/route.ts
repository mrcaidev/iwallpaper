import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (!tokenHash || !type) {
    const message = encodeURIComponent("Invalid token hash or type.");
    return NextResponse.redirect(`${origin}/auth/error?message=${message}`);
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    const message = encodeURIComponent(error.message);
    return NextResponse.redirect(`${origin}/auth/error?message=${message}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
