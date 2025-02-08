import { getSelectableExercises } from "@/app/actions/exercises";
import { NextResponse } from "next/server";

export async function GET() {
  const selectableExercises = await getSelectableExercises();
  return NextResponse.json(selectableExercises);
}
