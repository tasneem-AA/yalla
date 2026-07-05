import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const downloads = await prisma.download.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ downloads });
  } catch (err) {
    console.error("GET /api/downloads error:", err);
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 });
  }
}

// POST /api/downloads — track a download click
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, userId } = body;

    if (!platform || !["ios", "android"].includes(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const created = await prisma.download.create({
      data: {
        platform,
        userId: userId ?? null,
      },
    });

    return NextResponse.json({ success: true, download: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/downloads error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}