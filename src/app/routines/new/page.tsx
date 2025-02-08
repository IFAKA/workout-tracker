// NewRoutine.tsx
"use client";

import { createRoutine } from "@/app/actions/routines";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { useRouter } from "next/navigation"; // Import Next.js router
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import RoutineSetup from "../components/RoutineSetup";
import StepNavigationButtons from "../components/StepNavigationButtons";
import Summary from "../components/Summary";
import WorkoutDaySetup from "../components/WorkoutDaySetup";
import { weekdays } from "../constants/weekdays";
import { WorkoutDay } from "@/lib/db/schema/workout-days";

const NewRoutine = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [routineName, setRoutineName] = useState<string>("");
  const [exercisesByDay, setExercisesByDay] = useState<
    Record<string, InsertDayExercises[]>
  >({});

  const selectedDays = Object.keys(exercisesByDay) as WorkoutDay[];
  const totalSteps = selectedDays.length + 1; // Routine setup + doesn't count as step 1 (number of selected days + summary page)
  const selectedDay = selectedDays[currentStep - 1];
  const isRoutineSetupFormValid =
    routineName.trim() !== "" && selectedDays.length > 0;
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      selectedDays: [],
      routineName: "",
    },
  });

  const sortSelectedDays = (selectedDays: string[]) => {
    return selectedDays.sort(
      (a, b) => weekdays.indexOf(a) - weekdays.indexOf(b)
    );
  };

  const handleSetSelectedDay = (days: string[]) => {
    const sortedDays = sortSelectedDays(days);
    setExercisesByDay((prev) =>
      sortedDays.reduce((acc, day) => {
        acc[day] = prev[day] || [];
        return acc;
      }, {} as Record<string, InsertDayExercises[]>)
    );
  };

  const handleAddExercise = (newExercise: InsertDayExercises) => {
    const currentDay = selectedDays[currentStep - 1]; // Get the name of the current day
    setExercisesByDay((prev) => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), newExercise], // Add exercise to the current day's list
    }));
  };

  // related to the StepNavigationButtons component

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const goToRoutineSetup = () => {
    setCurrentStep(0);
  };

  const goToLatestAvailableStep = () => {
    const latestAvailableStep = selectedDays.findIndex(
      (day) => !exercisesByDay[day] || exercisesByDay[day].length === 0
    );

    if (latestAvailableStep === -1) {
      setCurrentStep(totalSteps);
    } else {
      setCurrentStep(latestAvailableStep + 1);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true);
      const routine = await createRoutine({
        routineName,
        exercisesByDay,
      });

      if (routine) {
        router.push("/routines"); // Redirect to the routines page
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        disabledRoutineSetup={!isRoutineSetupFormValid}
        exercisesLength={exercisesByDay[selectedDay]?.length || 0}
        goToLatestAvailableStep={goToLatestAvailableStep}
        goToRoutineSetup={goToRoutineSetup}
        prevStep={prevStep}
        nextStep={nextStep}
      />

      <FormProvider {...form}>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* Step for entering routine name and selecting workout days */}
          {currentStep === 0 && (
            <RoutineSetup
              routineName={routineName}
              setRoutineName={setRoutineName}
              selectedDays={selectedDays}
              setSelectedDays={handleSetSelectedDay}
            />
          )}

          {/* Steps for each workout day */}
          {currentStep > 0 && currentStep < totalSteps && (
            <WorkoutDaySetup
              exercises={exercisesByDay[selectedDay]} // Get exercises for the current day or empty array
              handleAddExercise={handleAddExercise}
              selectedDay={selectedDay} // Pass the name of the current day
              setExercisesByDay={setExercisesByDay}
            />
          )}

          {/* Final Summary Step */}
          {currentStep === totalSteps && (
            <Summary
              routineName={routineName}
              selectedDays={selectedDays}
              exercisesByDay={exercisesByDay}
              goToRoutineSetup={goToRoutineSetup}
              setCurrentStep={setCurrentStep} // Pass setCurrentStep to Summary
              loading={loading}
            />
          )}
        </form>
      </FormProvider>
    </>
  );
};

export default NewRoutine;
