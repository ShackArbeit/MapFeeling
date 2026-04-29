import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const STORAGE_MODE = process.env.STORAGE_MODE ?? "local";

const patchSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (STORAGE_MODE !== "firestore") {
    return NextResponse.json(
      { error: "Date request API only available in firestore mode." },
      { status: 501 }
    );
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { getAdminFirestore } = await import("@/lib/firestore.server");
  const db = getAdminFirestore();
  const ref = db.collection("date_requests").doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updatedAt = new Date().toISOString();
  await ref.update({ status: parsed.data.status, updatedAt });
  return NextResponse.json({ ...snap.data(), status: parsed.data.status, updatedAt });
}