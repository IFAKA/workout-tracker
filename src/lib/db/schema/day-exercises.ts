import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";
import exerciseProgress from "./exercise-progress";
import selectableExercises from "./selectable-exercises";
import workoutDays from "./workout-days";

export const dayExercises = pgTable("day_exercises", {
  id: serial("id").primaryKey(),
  workoutDayId: integer("workout_day_id").references(() => workoutDays.id),
  exerciseId: integer("exercise_id").references(() => selectableExercises.id),
  orderIndex: integer("order_index").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  restTime: integer("rest_time").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dayExercisesRelations = relations(
  dayExercises,
  ({ one, many }) => ({
    workoutDay: one(workoutDays, {
      fields: [dayExercises.workoutDayId],
      references: [workoutDays.id],
    }),
    exercise: one(selectableExercises, {
      fields: [dayExercises.exerciseId],
      references: [selectableExercises.id],
    }),
    progress: many(exerciseProgress),
  })
);

export type InsertDayExercises = typeof dayExercises.$inferInsert;
export type SelectDayExercises = typeof dayExercises.$inferSelect;

export default dayExercises;
