import { SelectExercises } from "@/lib/db/schema/exercises";

type ExerciseItemProps = {
  exercise: SelectExercises;
};

export function ExerciseItem({ exercise }: ExerciseItemProps) {
  return (
    <div className="flex justify-between gap-2 items-center border-b last:border-0 border-primary/10 border rounded-lg">
      <h3 className="font-semibold">{exercise.name}</h3>
      <div className="flex gap-2">
        <span>
          {exercise.sets} sets x {exercise.reps} reps
        </span>
        <span>{exercise.restTime}s</span>
      </div>
    </div>
  );
}
