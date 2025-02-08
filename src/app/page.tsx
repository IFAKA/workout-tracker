import { redirect } from "next/navigation";
import { getCurrentRoutine } from "./actions/routine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const today = new Date().getDay();

export default async function Home() {
  const routine = await getCurrentRoutine();

  if (!routine) {
    redirect("/routines/new");
  }

  return (
    <div className="max-w-lg mx-auto px-3 pb-3 h-full flex flex-col space-y-4">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
          <CardTitle className="text-xl">Routine: {routine.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            Today&apos;s Routine: {today}
          </h2>
          <div className="space-y-2">
            <h3 className="text-md font-medium">Details:</h3>
            <p className="text-sm">ID: {routine.id}</p>
            <p className="text-sm">User ID: {routine.userId}</p>
            <p className="text-sm">
              Selected: {routine.isSelected ? "Yes" : "No"}
            </p>
            <p className="text-sm">
              Created At:{" "}
              {routine.createdAt
                ? new Date(routine.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-sm">
              Updated At:{" "}
              {routine.updatedAt
                ? new Date(routine.updatedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          {/* <ExerciseTracking key={currentExercise.id} exercise={currentExercise} />
          <h3>Upcoming Exercises:</h3>
          <div>
            {remainingExercises.map((exercise) => ( 
              <ExerciseItem key={exercise.id} exercise={exercise} />
            ))}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
