import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  NextResponse,
  type MiddlewareConfig,
  type NextMiddleware,
  type NextRequest,
} from "next/server";
import type { Database } from "utils/supabase/types";

function mustAuthenticate(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/favorites") {
    return true;
  }

  if (pathname === "/settings") {
    return true;
  }

  return false;
}

function mustNotAuthenticate(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/sign-in") {
    return true;
  }

  if (pathname === "/sign-up") {
    return true;
  }

  if (pathname === "/forgot-password") {
    return true;
  }

  return false;
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTo = request.nextUrl.clone();

  if (mustAuthenticate(request) && !user) {
    redirectTo.pathname = "/sign-in";
    return NextResponse.redirect(redirectTo);
  }

  if (mustNotAuthenticate(request) && user) {
    redirectTo.pathname = "/";
    return NextResponse.redirect(redirectTo);
  }

  return response;
};

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
