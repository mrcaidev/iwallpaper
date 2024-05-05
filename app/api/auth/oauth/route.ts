import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(origin + "/");
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.redirect(origin + "/");
}
