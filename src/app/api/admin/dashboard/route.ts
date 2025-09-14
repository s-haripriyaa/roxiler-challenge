import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    return NextResponse.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch dashboard stats", details: err }, { status: 500 });
  }
}
