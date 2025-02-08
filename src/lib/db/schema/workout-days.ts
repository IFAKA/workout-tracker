import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import dayExercises from "./day-exercises";
import routines from "./routines";

export const daysOfWeekEnum = pgEnum("days_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const workoutDays = pgTable("workout_days", {
  id: serial("id").primaryKey(),
  routineId: integer("routine_id").references(() => routines.id),
  dayId: daysOfWeekEnum("day_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutDaysRelations = relations(workoutDays, ({ one, many }) => ({
  routine: one(routines, {
    fields: [workoutDays.routineId],
    references: [routines.id],
  }),
  dayExercises: many(dayExercises),
}));

export type InsertWorkoutDays = typeof workoutDays.$inferInsert;
export type SelectWorkoutDays = typeof workoutDays.$inferSelect;
export type WorkoutDay = typeof workoutDays.$inferSelect.dayId;

export default workoutDays;
