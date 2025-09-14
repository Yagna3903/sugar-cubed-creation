import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow login page & auth endpoints
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/auth")
  ) return NextResponse.next();

  // Protect everything else under /admin
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (token as any)?.role;
    if (!token || role !== "admin") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
// Protect /admin and its sub-paths