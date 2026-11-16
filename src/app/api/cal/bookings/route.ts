import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CAL_URL,
  CAL_BOOKINGS_VERSION,
  calHeaders,
  calEventTypeId,
} from "@/lib/cal";

const schema = z.object({
  start: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  timeZone: z.string().min(1).max(64),
  notes: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid details" }, { status: 400 });
  }

  const { start, name, email, timeZone, notes } = parsed.data;

  try {
    const res = await fetch(`${CAL_URL}/bookings`, {
      method: "POST",
      headers: calHeaders(CAL_BOOKINGS_VERSION),
      body: JSON.stringify({
        start: new Date(start).toISOString(),
        eventTypeId: calEventTypeId(),
        attendee: { name, email, timeZone, language: "en" },
        ...(notes ? { bookingFieldsResponses: { notes } } : {}),
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "This time is no longer available. Please pick another." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      booking: {
        uid: json.data?.uid,
        start: json.data?.start,
        end: json.data?.end,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}