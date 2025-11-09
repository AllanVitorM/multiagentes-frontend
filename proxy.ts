import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectRoutes = ["/orquestrador"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (!protectRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    const secret = new TextEncoder().encode(process.env.jwt_secret);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("Jwt inválido", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/orquestrador/:path*"],
};
