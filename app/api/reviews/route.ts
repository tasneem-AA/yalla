import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");

    const reviews = await prisma.review.findMany({
      where: type ? { type: type } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, city, rating, review, type } = body;

    if (!name || !review || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.review.create({
       data: {
        name,
        city: city || "Lebanon",
        rating: Math.min(5, Math.max(1, Number(rating))),
        type: type || "rider",
        review,
      } as any,
    });

    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}