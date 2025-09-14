import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Store Owner dashboard ratings
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = Number(params.id);

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const avgRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.score, 0) / store.ratings.length
        : null;

    return NextResponse.json({
      store: { id: store.id, name: store.name, address: store.address },
      ratings: store.ratings,
      avgRating,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch store ratings" }, { status: 500 });
  }
}
