import { deleteRoutine } from "@/app/actions/routine";
import { getRoutineDetails } from "@/app/actions/routines";
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "Routine ID is required" },
      { status: 400 }
    );
  }

  try {
    const routineDetails = await getRoutineDetails(Number(id));
    if (!routineDetails) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }
    return NextResponse.json(routineDetails);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch routine" },
      { status: 500 }
    );
  }
}
