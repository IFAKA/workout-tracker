import { Card } from "@/components/ui/card";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { SelectSelectableExercises } from "@/lib/db/schema/selectable-exercises";
import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import EditExerciseForm from "./EditExerciseForm"; // Import the EditExerciseForm component

type ExerciseCardsProps = {
  exercises: InsertDayExercises[];
  selectableExercises: SelectSelectableExercises[];
  loading: boolean;
  onEditExercise: (updatedExercise: InsertDayExercises) => void; // Add onEditExercise prop
  onDeleteExercise: (orderIndex: number) => void; // Add onDeleteExercise prop
};

export const ExerciseCards: React.FC<ExerciseCardsProps> = ({
  exercises,
  selectableExercises,
  loading,
  onEditExercise,
  onDeleteExercise,
}) => {
  const [editingExercise, setEditingExercise] =
    useState<InsertDayExercises | null>(null);

  const handleEditSave = (updatedExercise: InsertDayExercises) => {
    onEditExercise(updatedExercise);
    setEditingExercise(null);
  };

  return (
    <>
      {exercises.map((exercise, index) => (
        <Draggable
          key={`${exercise.name}-${index}`}
          draggableId={`${exercise.name}-${index}`}
          index={index}
        >
          {(provided, snapshot) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`p-2 px-3 flex justify-between items-center text-sm ${
                snapshot.isDragging ? "bg-gray-200" : ""
              }`}
              onClick={() => setEditingExercise(exercise)} // Add onClick handler
            >
              <p className="font-semibold">{exercise.name}</p>
              <div className="flex gap-2">
                <span>
                  {exercise.sets} x {exercise.reps}
                </span>
                <span>{exercise.restTime}s</span>
              </div>
            </Card>
          )}
        </Draggable>
      ))}
      {editingExercise && (
        <EditExerciseForm
          exercise={editingExercise}
          selectableExercises={selectableExercises}
          loading={loading}
          onSave={handleEditSave}
          onCancel={() => {
            setEditingExercise(null);
          }}
          onDelete={() => onDeleteExercise(editingExercise.orderIndex)}
        />
      )}
    </>
  );
};
