import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import dayExercises from "./day-exercises";
import exerciseProgress from "./exercise-progress";

export const selectableExercises = pgTable("selectable_exercises", {
  id: serial("id").primaryKey(),
  exerciseCode: varchar("exercise_code", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const selectableExercisesRelations = relations(
  selectableExercises,
  ({ many }) => ({
    dayExercises: many(dayExercises),
    exerciseProgress: many(exerciseProgress),
  })
);

export type InsertSelectableExercises = typeof selectableExercises.$inferInsert;
export type SelectSelectableExercises = typeof selectableExercises.$inferSelect;

export default selectableExercises;
