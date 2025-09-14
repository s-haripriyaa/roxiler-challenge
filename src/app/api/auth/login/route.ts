// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔎 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: { stores: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔎 2. Validate password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔎 3. Generate JWT
    console.log("Signing JWT with secret:", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        storeId: user.stores?.[0]?.id || null,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 🔎 4. Create response with cookie
    const res = NextResponse.json({
      message: "Logged in successfully",
      user: { id: user.id, role: user.role },
    });

    res.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, // 🔑 must be false in dev
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
  sameSite: "lax",
});


    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Login failed", details: String(err) },
      { status: 500 }
    );
  }
}
