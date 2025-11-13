import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const res = NextResponse.next();

  // Only guard /admin/*
  if (!url.pathname.startsWith("/admin")) return res;

  // Allow public admin routes
  const publicRoutes = [
    "/admin/login",
    "/admin/update-password", // allow reset page
  ];

  if (publicRoutes.some((path) => url.pathname.startsWith(path))) {
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", url.href);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
