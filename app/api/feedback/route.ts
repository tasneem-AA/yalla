import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { rating, category, message } = await req.json();

  // Create feedback without user (anonymous)
  await prisma.feedback.create({
    data: {
      rating,
      category,
      message,
      // No userId – leave it null
    },
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  // No authentication needed – anyone can view feedback
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      category: true,
      message: true,
      createdAt: true,
    },
  });

  // Format for frontend
  const formatted = feedbacks.map((f) => ({
    id: f.id,
    rating: f.rating,
    category: f.category || "General",
    message: f.message,
    userName: "Anonymous", // Always anonymous
    createdAt: f.createdAt.toISOString(),
  }));

  return NextResponse.json({ feedback: formatted });
}
