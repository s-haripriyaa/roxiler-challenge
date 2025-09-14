import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const address = searchParams.get("address");

  const stores = await prisma.store.findMany({
    where: {
      AND: [
        name ? { name: { contains: name } } : {},
        address ? { address: { contains: address } } : {},
      ],
    },
    include: {
      ratings: true,
    },
  });

  const result = stores.map((store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    avgRating: store.ratings.length
      ? store.ratings.reduce((a, b) => a + b.score, 0) / store.ratings.length
      : null,
  }));

  return NextResponse.json(result);
}
