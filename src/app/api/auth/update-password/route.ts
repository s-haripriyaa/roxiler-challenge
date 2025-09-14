
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  try {
    const { userId, oldPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Old password incorrect" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
