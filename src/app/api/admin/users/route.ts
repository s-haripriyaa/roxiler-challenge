import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client"; // ✅ Import Role enum

// ========================
// Create a new user (Admin)
// ========================
export async function POST(req: Request) {
  try {
    const { name, email, password, address, role } = await req.json();

    // 🔹 Validation rules
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (name.length < 20 || name.length > 60) {
      return NextResponse.json({ error: "Name must be 20-60 characters" }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(password)) {
      return NextResponse.json({ error: "Password must be 8-16 chars, include 1 uppercase, 1 special char" }, { status: 400 });
    }
    if (address && address.length > 400) {
      return NextResponse.json({ error: "Address max 400 characters" }, { status: 400 });
    }

    // 🔹 Check if email exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 🔹 Ensure role is valid
    if (!Object.values(Role).includes(role as Role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role as Role, // ✅ cast to Prisma enum
      },
    });

    return NextResponse.json({ message: `${role} created`, user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create user", details: String(err) }, { status: 500 });
  }
}

// ========================
// Get users with filters
// ========================
export async function GET(req: Request) {
  const url = new URL(req.url);

  const name = url.searchParams.get("name") || undefined;
  const email = url.searchParams.get("email") || undefined;
  const roleParam = url.searchParams.get("role"); // string | null

  let role: Role | undefined;
  if (roleParam && Object.values(Role).includes(roleParam.toUpperCase() as Role)) {
    role = roleParam.toUpperCase() as Role;
  }

  const users = await prisma.user.findMany({
    where: {
      name: name ? { contains: name } : undefined,
      email: email ? { contains: email } : undefined,
      role: role, // ✅ Now correctly typed
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}
