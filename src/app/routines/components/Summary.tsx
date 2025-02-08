// components/Summary.tsx
import { Button } from "@/components/ui/button";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { LoaderCircle } from "lucide-react";
import React from "react";
import SummaryHeader from "./SummaryHeader";
import WorkoutDaySummary from "./WorkoutDaySummary";

type SummaryProps = {
  routineName: string;
  selectedDays: string[];
  exercisesByDay: { [key: string]: InsertDayExercises[] };
  setCurrentStep: (step: number) => void; // Add setCurrentStep prop
  goToRoutineSetup: () => void; // Add goToRoutineSetup prop
  loading: boolean; // Remove loading state
};

const Summary: React.FC<SummaryProps> = ({
  routineName,
  selectedDays,
  exercisesByDay,
  setCurrentStep,
  goToRoutineSetup,
  loading,
}) => {
  return (
    <>
      <SummaryHeader
        routineName={routineName}
        goToRoutineSetup={goToRoutineSetup}
      />

      {selectedDays.map((day, idx) => (
        <WorkoutDaySummary
          key={day}
          day={day}
          exercises={exercisesByDay[day]}
          handleClick={() => setCurrentStep(idx + 1)}
        />
      ))}

      <Button type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin" /> : "Create"}
      </Button>
    </>
  );
};

export default Summary;
