import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CAL_URL,
  CAL_SLOTS_VERSION,
  calHeaders,
  calEventTypeId,
} from "@/lib/cal";

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const schema = z.object({
  start: day,
  end: day,
  timeZone: z.string().min(1).max(64),
});

export async function GET(req: NextRequest) {
  const parsed = schema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const url = new URL(`${CAL_URL}/slots`);
    url.searchParams.set("eventTypeId", String(calEventTypeId()));
    url.searchParams.set("start", parsed.data.start);
    url.searchParams.set("end", parsed.data.end);
    url.searchParams.set("timeZone", parsed.data.timeZone);

    const res = await fetch(url, {
      headers: calHeaders(CAL_SLOTS_VERSION),
      cache: "no-store",
    });
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not load available times" },
        { status: res.status }
      );
    }

    return NextResponse.json({ slots: json.data ?? {} });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}