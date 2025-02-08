import { db } from "@/lib/db";
import { dayExercises, routines, workoutDays } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import {
  deleteExercises,
  deleteWorkoutDaysByRoutineId,
  getExistingExercises,
  getWorkoutDays,
} from "./routines";
import { getCurrentUser } from "./user";

export async function getRoutineById(routineId: number) {
  const [routine] = await db
    .select()
    .from(routines)
    .where(eq(routines.id, routineId));

  return routine || null;
}

export async function getCurrentRoutine() {
  const user = await getCurrentUser();

  if (!user) return null;

  const [routine] = await db
    .select()
    .from(routines)
    .where(and(eq(routines.userId, user.id), eq(routines.isSelected, true)));

  return routine || null;
}

export async function getCurrentUserRoutines() {
  const user = await getCurrentUser();

  if (!user) return [];

  return db
    .select()
    .from(routines)
    .where(eq(routines.userId, user.id))
    .orderBy(desc(routines.createdAt));
}

export async function deleteRoutine(routineId: number) {
  const routine = await getRoutineById(routineId);
  const workoutDayList = await getWorkoutDays(routineId);
  const existingExercises = await getExistingExercises(workoutDayList);

  await deleteExercises(existingExercises);
  await deleteWorkoutDaysByRoutineId(routineId);
  await db.delete(routines).where(eq(routines.id, routineId));

  if (routine?.isSelected) {
    const user = await getCurrentUser();
    if (user) {
      const [nextRoutine] = await db
        .select()
        .from(routines)
        .where(eq(routines.userId, user.id))
        .orderBy(routines.id)
        .limit(1);

      if (nextRoutine) {
        await db
          .update(routines)
          .set({ isSelected: true })
          .where(eq(routines.id, nextRoutine.id));
      }
    }
  }
}
