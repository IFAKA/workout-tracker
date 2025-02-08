import { deleteRoutine } from "@/app/actions/routine";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "Routine ID is required" },
      { status: 400 }
    );
  }

  try {
    await deleteRoutine(Number(id));
    return NextResponse.json({ message: "Routine deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete routine" },
      { status: 500 }
    );
  }
}
