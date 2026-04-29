import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// In local mode (STORAGE_MODE=local), date requests are stored in browser localStorage
// and this route is not used. These routes support Firestore mode.

const STORAGE_MODE = process.env.STORAGE_MODE ?? "local";

const createSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  foodType: z.string(),
  proposedArea: z.string(),
  proposedPlaceName: z.string(),
  proposedTime: z.string(),
  message: z.string(),
  aiReason: z.string(),
});

export async function POST(request: NextRequest) {
  if (STORAGE_MODE !== "firestore") {
    return NextResponse.json(
      { error: "Date request API only available in firestore mode. Use browser localStorage in local mode." },
      { status: 501 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { getAdminFirestore } = await import("@/lib/firestore.server");
  const db = getAdminFirestore();
  const now = new Date().toISOString();
  const ref = db.collection("date_requests").doc();
  const data = {
    ...parsed.data,
    id: ref.id,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(data);
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: NextRequest) {
  if (STORAGE_MODE !== "firestore") {
    return NextResponse.json(
      { error: "Date request API only available in firestore mode." },
      { status: 501 }
    );
  }

  const receiverId = request.nextUrl.searchParams.get("receiverId");
  if (!receiverId) {
    return NextResponse.json({ error: "receiverId is required" }, { status: 400 });
  }

  const { getAdminFirestore } = await import("@/lib/firestore.server");
  const db = getAdminFirestore();
  const snap = await db
    .collection("date_requests")
    .where("receiverId", "==", receiverId)
    .orderBy("createdAt", "desc")
    .get();

  const items = snap.docs.map((d) => d.data());
  return NextResponse.json({ items });
}