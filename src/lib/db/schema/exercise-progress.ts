import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import dayExercises from "./day-exercises";

export const exerciseProgress = pgTable("exercise_progress", {
  id: serial("id").primaryKey(),
  dayExerciseId: integer("day_exercise_id").references(() => dayExercises.id),
  setNumber: integer("set_number").notNull(),
  weightLifted: integer("weight_lifted").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exerciseProgressRelations = relations(
  exerciseProgress,
  ({ one }) => ({
    exercise: one(dayExercises, {
      fields: [exerciseProgress.dayExerciseId],
      references: [dayExercises.id],
    }),
  })
);

export type InsertExerciseProgress = typeof exerciseProgress.$inferInsert;
export type SelectExerciseProgress = typeof exerciseProgress.$inferSelect;

export default exerciseProgress;
