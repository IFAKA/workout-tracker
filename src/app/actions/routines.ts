"use server";

import { db } from "@/lib/db";
import { dayExercises } from "@/lib/db/schema";
import {
  InsertDayExercises,
  SelectDayExercises,
} from "@/lib/db/schema/day-exercises";
import { routines, SelectRoutines } from "@/lib/db/schema/routines";
import {
  SelectWorkoutDays,
  WorkoutDay,
  workoutDays,
} from "@/lib/db/schema/workout-days";
import { and, eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "./user";
import { getRoutineById } from "./routine";

// Helper functions
export async function getUserId(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user.id;
}

async function unselectAllRoutines(userId: number) {
  await db
    .update(routines)
    .set({ isSelected: false })
    .where(and(eq(routines.userId, userId), eq(routines.isSelected, true)));
}

async function insertRoutine(
  userId: number,
  routineName: string
): Promise<SelectRoutines> {
  const [routine] = await db
    .insert(routines)
    .values({
      userId,
      name: routineName,
      isSelected: true,
    })
    .returning();
  return routine;
}

async function insertWorkoutDays(
  routineId: number,
  selectedDays: WorkoutDay[]
): Promise<SelectWorkoutDays[]> {
  const workoutDaysResult = await db
    .insert(workoutDays)
    .values(
      selectedDays.map((day) => ({
        routineId,
        dayId: day,
      }))
    )
    .returning();

  return workoutDaysResult;
}

export async function getExistingExercises(
  workoutDayList: SelectWorkoutDays[]
): Promise<SelectDayExercises[]> {
  return await db
    .select()
    .from(dayExercises)
    .where(
      inArray(
        dayExercises.workoutDayId,
        workoutDayList.map((day) => day.id)
      )
    );
}

export async function deleteExercises(exercisesToDelete: SelectDayExercises[]) {
  await db.delete(dayExercises).where(
    inArray(
      dayExercises.id,
      exercisesToDelete.map((exercise) => exercise.id)
    )
  );
}

async function updateExercises(exercises: InsertDayExercises[]) {
  const updatePromises = exercises.map((exercise) =>
    db
      .update(dayExercises)
      .set({
        orderIndex: exercise.orderIndex,
        sets: exercise.sets,
        reps: exercise.reps,
        restTime: exercise.restTime,
        name: exercise.name,
      })
      .where(eq(dayExercises.id, exercise.id!))
  );

  await Promise.all(updatePromises);
}

async function insertExercises(exercises: InsertDayExercises[]) {
  await db.insert(dayExercises).values(exercises);
}

async function insertOrUpdateExercises(
  workoutDayList: SelectWorkoutDays[],
  exercisesByDay: Record<WorkoutDay, InsertDayExercises[]>
) {
  const existingExercises = await getExistingExercises(workoutDayList);

  const newExerciseIds = new Set(
    workoutDayList.flatMap(
      (workoutDay) =>
        exercisesByDay[workoutDay.dayId]?.map(
          (exercise) => exercise.exerciseId
        ) || []
    )
  );
  const exercisesToDelete = existingExercises.filter(
    (exercise) => !newExerciseIds.has(exercise.exerciseId)
  );

  if (exercisesToDelete.length > 0) {
    await deleteExercises(exercisesToDelete);
  }

  const allDayExercises = workoutDayList.flatMap((workoutDay) => {
    const dayExercisesForDay = exercisesByDay[workoutDay.dayId];
    return dayExercisesForDay
      ? dayExercisesForDay.map((exercise, index) => ({
          workoutDayId: workoutDay.id,
          exerciseId: exercise.exerciseId,
          orderIndex: index,
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: exercise.restTime,
          name: exercise.name,
        }))
      : [];
  });

  const exercisesToUpdate = allDayExercises.filter((exercise) =>
    existingExercises.some(
      (e) =>
        e.workoutDayId === exercise.workoutDayId &&
        e.exerciseId === exercise.exerciseId
    )
  );

  const exercisesToInsert = allDayExercises.filter(
    (exercise) =>
      !existingExercises.some(
        (e) =>
          e.workoutDayId === exercise.workoutDayId &&
          e.exerciseId === exercise.exerciseId
      )
  );

  if (exercisesToUpdate.length > 0) {
    await updateExercises(exercisesToUpdate);
  }

  if (exercisesToInsert.length > 0) {
    await insertExercises(exercisesToInsert);
  }
}

export async function getWorkoutDays(
  routineId: number
): Promise<SelectWorkoutDays[]> {
  const workoutDaysResult = await db
    .select()
    .from(workoutDays)
    .where(eq(workoutDays.routineId, routineId));

  return workoutDaysResult;
}

export async function deleteWorkoutDaysByRoutineId(routineId: number) {
  await db.delete(workoutDays).where(eq(workoutDays.routineId, routineId));
}

// Main functions
export async function createRoutine({
  routineName,
  exercisesByDay,
}: {
  routineName: string;
  exercisesByDay: Record<WorkoutDay, InsertDayExercises[]>;
}) {
  const selectedDays = Object.keys(exercisesByDay) as WorkoutDay[];
  const userId = await getUserId();
  await unselectAllRoutines(userId);

  const routine = await insertRoutine(userId, routineName);
  const workoutDayList = await insertWorkoutDays(routine.id, selectedDays);
  await insertOrUpdateExercises(workoutDayList, exercisesByDay);

  return routine;
}

export async function updateRoutineExercises({
  routineId,
  exercisesByDay,
}: {
  routineId: number;
  exercisesByDay: Record<WorkoutDay, InsertDayExercises[]>;
}) {
  const routine = await getRoutineById(routineId);

  if (!routine) {
    throw new Error("Routine not found or does not belong to the user");
  }

  const workoutDayList = await getWorkoutDays(routineId);
  await insertOrUpdateExercises(workoutDayList, exercisesByDay);

  return routine;
}

export async function updateRoutine({
  id,
  routineName,
  exercisesByDay,
}: {
  id: number;
  routineName: string;
  exercisesByDay: Record<WorkoutDay, InsertDayExercises[]>;
}) {
  const routine = await getRoutineById(id);

  if (!routine) {
    throw new Error("Routine not found or does not belong to the user");
  }

  await db
    .update(routines)
    .set({ name: routineName })
    .where(eq(routines.id, id));

  const workoutDayList = await getWorkoutDays(id);
  await insertOrUpdateExercises(workoutDayList, exercisesByDay);

  return routine;
}

export async function getRoutineDetails(routineId: number) {
  const routine = await getRoutineById(routineId);
  if (!routine) {
    throw new Error("Routine not found or does not belong to the user");
  }

  const workoutDays = await getWorkoutDays(routineId);
  const exercises = await getExistingExercises(workoutDays);

  const workoutDaysWithExercises = workoutDays.reduce((acc, day) => {
    acc[day.dayId] = exercises.filter(
      (exercise) => exercise.workoutDayId === day.id
    );
    return acc;
  }, {} as Record<WorkoutDay, SelectDayExercises[]>);

  return {
    id: routine.id,
    name: routine.name,
    workoutDays: workoutDaysWithExercises,
  };
}
