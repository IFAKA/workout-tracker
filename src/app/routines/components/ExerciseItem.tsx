// components/ExerciseItem.tsx
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import React from "react";

type ExerciseItemProps = {
  exercise: InsertDayExercises;
  index: number;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  return (
    <div className="flex justify-between items-center gap-2 border-primary/10 last:border-0 py-1 border-b text-xs">
      <span>{exercise.name}</span>

      <span className="flex gap-2">
        <span>
          {exercise.sets} x {exercise.reps}
        </span>
        <span>{exercise.restTime}s</span>
      </span>
    </div>
  );
};

export default ExerciseItem;
