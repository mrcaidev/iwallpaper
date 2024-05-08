import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();

  if (!code) {
    redirectTo.pathname = "/auth/error";
    redirectTo.searchParams.set("error", "Invalid authorization code");
    return NextResponse.redirect(redirectTo);
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirectTo.pathname = "/auth/error";
    redirectTo.searchParams.set("error", error.message);
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = next;
  return NextResponse.redirect(redirectTo);
}
