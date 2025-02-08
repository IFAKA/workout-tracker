import EmptyState from "@/app/components/EmptyState";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { SelectSelectableExercises } from "@/lib/db/schema/selectable-exercises";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React from "react";
import { ExerciseCards } from "./ExerciseCards";

type ExerciseDisplayProps = {
  selectableExercises: SelectSelectableExercises[];
  loading: boolean;
  exercises: InsertDayExercises[];
  onReorderExercises: (reorderedExercises: InsertDayExercises[]) => void;
  onEditExercise: (exercise: InsertDayExercises) => void; // Add onEditExercise prop
  onDeleteExercise: (orderIndex: number) => void; // Add onDeleteExercise prop
};

const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({
  selectableExercises,
  loading,
  exercises,
  onReorderExercises,
  onEditExercise, // Add onEditExercise prop
  onDeleteExercise, // Add onDeleteExercise prop
}) => {
  const onDragEnd = (result: {
    destination: { index: number } | null;
    source: { index: number };
  }) => {
    if (!result.destination) return;

    const reorderedExercises = Array.from(exercises);
    const [reorderedItem] = reorderedExercises.splice(result.source.index, 1);
    reorderedExercises.splice(result.destination.index, 0, reorderedItem);

    // Update orderIndex for each exercise
    const updatedExercises = reorderedExercises.map((exercise, index) => ({
      ...exercise,
      orderIndex: index,
    }));

    onReorderExercises(updatedExercises);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      {exercises.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2 h-full"
              >
                <ExerciseCards
                  onDeleteExercise={onDeleteExercise} // Pass onDeleteExercise prop
                  onEditExercise={onEditExercise} // Pass onEditExercise prop
                  exercises={exercises}
                  selectableExercises={selectableExercises}
                  loading={loading}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="flex justify-center items-center border-primary/10 border rounded-lg">
          <EmptyState icon="Dumbbell" title="No Exercises" size="small" />
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay;
