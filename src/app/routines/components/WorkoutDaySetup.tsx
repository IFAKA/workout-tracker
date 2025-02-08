"use client";

// components/WorkoutDaySetup.tsx
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { SelectSelectableExercises } from "@/lib/db/schema/selectable-exercises";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddExerciseForm from "./AddExerciseForm";
import ExerciseDisplay from "./ExerciseDisplay";

type WorkoutDaySetupProps = {
  exercises: InsertDayExercises[];
  handleAddExercise: (newExercise: InsertDayExercises) => void;
  selectedDay: string;
  setExercisesByDay: Dispatch<
    SetStateAction<{
      [key: string]: InsertDayExercises[];
    }>
  >;
};

const WorkoutDaySetup: React.FC<WorkoutDaySetupProps> = ({
  exercises,
  handleAddExercise,
  selectedDay,
  setExercisesByDay,
}) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectableExercises, setSelectableExercises] = useState<
    SelectSelectableExercises[]
  >([]);

  const handleReorderExercises = (reorderedExercises: InsertDayExercises[]) => {
    setExercisesByDay((prev) => ({
      ...prev,
      [selectedDay]: reorderedExercises,
    }));
  };

  const handleEditExercise = (editedExercise: InsertDayExercises) => {
    setExercisesByDay((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((exercise) =>
        exercise.orderIndex === editedExercise.orderIndex
          ? editedExercise
          : exercise
      ),
    }));
  };

  const handleDeleteExercise = (orderIndex: number) => {
    setExercisesByDay((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter(
        (exercise) => exercise.orderIndex !== orderIndex
      ),
    }));
  };

  useEffect(() => {
    const fetchSelectableExercises = async () => {
      setLoading(true);
      const exercises: SelectSelectableExercises[] = await fetch(
        "/api/selectable-exercises"
      )
        .then((res) => res.json())
        .finally(() => setLoading(false));
      setSelectableExercises(exercises);
    };

    fetchSelectableExercises();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-semibold first-letter:uppercase">{selectedDay}</h3>

        <AddExerciseForm
          exercises={exercises}
          selectableExercises={selectableExercises}
          loading={loading}
          onAddExercise={handleAddExercise}
        />
      </div>

      <ExerciseDisplay
        onEditExercise={handleEditExercise} // Pass onEditExercise prop
        onDeleteExercise={handleDeleteExercise} // Pass onDeleteExercise prop
        selectableExercises={selectableExercises}
        loading={loading}
        exercises={exercises}
        onReorderExercises={handleReorderExercises}
      />
    </>
  );
};

export default WorkoutDaySetup;
