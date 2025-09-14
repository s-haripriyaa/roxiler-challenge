import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: fetch single user by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: { id: true, name: true, email: true, role: true, address: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT: update user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, email, password, role, address } = body;

    let updateData: any = { name, email, role, address };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json({ message: "User updated", user });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE: remove user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
