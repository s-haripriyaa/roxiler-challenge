import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { score, comment } = body;

    const ratingNumber = Number(score);

    // ✅ Hardcode userId = 1 for testing
    const userId = 1;

    if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
      return NextResponse.json(
        { error: "Invalid input: score must be 1-5" },
        { status: 400 }
      );
    }

    const rating = await prisma.rating.create({
      data: {
        score: ratingNumber,
        comment: comment || "",
        userId, // uses hardcoded ID
        storeId: Number(params.id),
      },
    });

    return NextResponse.json({ message: "Rating submitted", rating });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to submit rating", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { score, comment } = body;

    const ratingNumber = Number(score);
    const userId = 1; // hardcoded

    if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
      return NextResponse.json(
        { error: "Invalid input: score must be 1-5" },
        { status: 400 }
      );
    }

    const rating = await prisma.rating.update({
      where: {
        userId_storeId: {
          userId,
          storeId: Number(params.id),
        },
      },
      data: {
        score: ratingNumber,
        comment: comment || "",
      },
    });

    return NextResponse.json({ message: "Rating updated", rating });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update rating", details: err.message },
      { status: 500 }
    );
  }
}
