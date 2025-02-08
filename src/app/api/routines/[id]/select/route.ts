import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routines } from "@/lib/db/schema/routines";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").slice(-2, -1)[0];

  if (!id) {
    return NextResponse.json(
      { error: "Routine ID is required" },
      { status: 400 }
    );
  }

  try {
    // Unselect all routines
    await db
      .update(routines)
      .set({ isSelected: false })
      .where(eq(routines.isSelected, true));

    // Select the specified routine
    await db
      .update(routines)
      .set({ isSelected: true })
      .where(eq(routines.id, +id));

    return NextResponse.json({ message: "Routine selected successfully" });
  } catch (error) {
    console.error("Failed to select routine:", error);
    return NextResponse.json(
      { error: "Failed to select routine" },
      { status: 500 }
    );
  }
}
