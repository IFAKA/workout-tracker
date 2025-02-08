import { db } from "@/lib/db";
import { exerciseProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function recordSetProgress(
  exerciseId: number,
  setNumber: number,
  weight: number
) {
  try {
    const [routine] = await db
      .insert(exerciseProgress)
      .values({
        setNumber,
        weightLifted: weight,
        dayExerciseId: exerciseId,
      })
      .returning();
    return routine;
  } catch (error) {
    console.error("Error recording set progress:", error);
  }
}

export async function updateExerciseProgress(
  exerciseId: number,
  nextSet: number
) {
  try {
    await db
      .update(exerciseProgress)
      .set({ setNumber: nextSet })
      .where(eq(exerciseProgress.dayExerciseId, exerciseId));
  } catch (error) {
    console.error("Error updating exercise progress:", error);
  }
}
