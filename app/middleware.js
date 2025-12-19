import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const { pathname } = req.nextUrl;

    // Protection for JobSeeker routes
    if (pathname.startsWith("/JobSeeker") && payload.role !== "candidate") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protection for Recruiter routes
    if (pathname.startsWith("/recruiter") && payload.role !== "recruiter") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/recruiter/:path*", "/JobSeeker/:path*"],
};