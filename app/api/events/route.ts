import { NextRequest, NextResponse } from "next/server";

type Event = {
  id: number;
  type: string;    
  page?: string;  
  meta?: Record<string, string>; 
  createdAt: string;
};

const eventsStore: Event[] = [];
let nextId = 1;

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const filtered = type
    ? eventsStore.filter((e) => e.type === type)
    : eventsStore;

  const summary = eventsStore.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({ events: filtered, summary, total: eventsStore.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, page, meta } = body;

    if (!type) {
      return NextResponse.json({ error: "Event type required" }, { status: 400 });
    }

    const event: Event = {
      id: nextId++,
      type,
      page: page ?? undefined,
      meta: meta ?? undefined,
      createdAt: new Date().toISOString(),
    };

    eventsStore.push(event);

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}