import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/unauthorised", req.url));

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 🛡️ Only allow ADMIN to access /admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorised", req.url));
    }

    req.headers.set("x-user-id", payload.userId.toString());
    req.headers.set("x-user-role", payload.role);
    req.headers.set("x-store-id", payload.storeId?.toString() || "");
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/unauthorised", req.url));
  }
}


export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/account/:path*",
    "/stores/:path*",
  ],
  runtime: "nodejs", // 👈 force Node.js runtime
};

