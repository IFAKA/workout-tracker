import { getRoutineById } from "@/app/actions/routine";
import { getExistingExercises, getWorkoutDays } from "@/app/actions/routines";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import RemoveButton from "../components/remove-button";
import SelectRoutineButton from "../components/select-routine-button";
import WorkoutDaySummary from "../components/WorkoutDaySummary";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = +(await params).id;
  const routine = await getRoutineById(id);

  if (!routine) {
    redirect("/routines/new");
  }
  const workoutDays = await getWorkoutDays(routine.id);
  const exercises = await getExistingExercises(workoutDays);

  return (
    <div className="max-w-lg mx-auto h-full flex flex-col space-y-4">
      <Card>
        <CardHeader className="flex flex-row space-y-0 justify-between items-center gap-2 border px-3 py-3">
          <CardTitle className="truncate text-md" title={routine.name}>
            {routine.name}
          </CardTitle>
          {routine.isSelected ? (
            <Badge>Selected</Badge>
          ) : (
            <SelectRoutineButton routineId={routine.id} />
          )}
        </CardHeader>
      </Card>

      {workoutDays.map((day) => (
        <WorkoutDaySummary
          key={day.id}
          day={day.dayId}
          exercises={exercises}
          href={`/routines/${routine.id}/edit`}
        />
      ))}

      <RemoveButton routineId={routine.id} />
    </div>
  );
}

export default WorkoutDetailPage;
