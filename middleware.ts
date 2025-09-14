import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the public login route
  if (pathname.startsWith(`${ADMIN_PREFIX}/login`)) return NextResponse.next();

  if (pathname.startsWith(ADMIN_PREFIX)) {
    const token = await getToken({ req });
    if (!token || (token as any).role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = `${ADMIN_PREFIX}/login`;
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
