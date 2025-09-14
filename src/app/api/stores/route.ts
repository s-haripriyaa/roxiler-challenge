import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List all stores
export async function GET() {
  const stores = await prisma.store.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true } },
      ratings: true,
    },
  });

  const result = stores.map((store) => ({
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    owner: store.owner,
    avgRating: store.ratings.length
      ? store.ratings.reduce((a, b) => a + b.score, 0) / store.ratings.length
      : null,
  }));

  return NextResponse.json(result);
}

// POST: Create a new store
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
    return NextResponse.json({ error: "Failed to create store", details: err }, { status: 500 });
  }
}
