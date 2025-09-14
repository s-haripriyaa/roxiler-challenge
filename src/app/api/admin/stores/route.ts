// src/app/api/admin/stores/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, address, ownerId } = body;

    if (!name || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: ownerId || null,
      },
    });

    return NextResponse.json({ message: "Store created", store });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
  }
}
