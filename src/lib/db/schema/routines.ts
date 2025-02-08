import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import users from "./users";
import workoutDays from "./workout-days";

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  isSelected: boolean("is_selected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const routinesRelations = relations(routines, ({ one, many }) => ({
  user: one(users, {
    fields: [routines.userId],
    references: [users.id],
  }),
  workoutDays: many(workoutDays),
}));

export type InsertRoutines = typeof routines.$inferInsert;
export type SelectRoutines = typeof routines.$inferSelect;

export default routines;
