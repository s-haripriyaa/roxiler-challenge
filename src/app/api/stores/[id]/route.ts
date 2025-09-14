import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: fetch single store by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // 👈 pass ?userId=123 in frontend

    const store = await prisma.store.findUnique({
      where: { id: Number(params.id) },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const avgRating = store.ratings.length
      ? store.ratings.reduce((a, b) => a + b.score, 0) / store.ratings.length
      : null;

    let userRating = null;
    if (userId) {
      userRating = await prisma.rating.findUnique({
        where: {
          userId_storeId: {
            userId: Number(userId),
            storeId: store.id,
          },
        },
      });
    }

    return NextResponse.json({
      ...store,
      avgRating,
      userRating, // 👈 now frontend can use this directly
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}
