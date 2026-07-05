import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("GET /api/feedback error:", err);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, category, message, userName, userEmail } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Message too short" }, { status: 400 });
    }

    const created = await prisma.feedback.create({
      data: {
        rating: Number(rating),
        category: category || "Other",
        message: message.trim(),
        userName: userName ?? null,
        userEmail: userEmail ?? null,
      },
    });

    return NextResponse.json({ success: true, feedback: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/feedback error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.feedback.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/feedback error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}