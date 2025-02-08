import { db } from "@/lib/db";
import { selectableExercises } from "@/lib/db/schema/selectable-exercises";

export async function getSelectableExercises() {
  const exercises = await db.select().from(selectableExercises);
  return exercises;
}
