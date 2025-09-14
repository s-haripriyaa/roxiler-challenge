import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, address, role } = await req.json();

    // Validation
    if (!name || name.length < 3 || name.length > 60)
      return NextResponse.json({ error: "Name must be 3-60 characters" }, { status: 400 });

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    if (!password || !/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(password))
      return NextResponse.json({ error: "Password must be 8-16 chars, 1 uppercase, 1 special char" }, { status: 400 });

    if (address && address.length > 400)
      return NextResponse.json({ error: "Address max 400 chars" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role && ["ADMIN", "OWNER", "USER"].includes(role) ? role : "USER", // ✅ allow role override
      },
    });

    return NextResponse.json({
      message: "User created",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ error: "Signup failed", details: String(err) }, { status: 500 });
  }
}
