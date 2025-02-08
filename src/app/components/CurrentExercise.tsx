// components/CurrentExercise.tsx
import React from "react";

interface CurrentExerciseProps {
  currentExercise: string;
  nextExercise: string | null;
}

const CurrentExercise: React.FC<CurrentExerciseProps> = ({
  currentExercise,
  nextExercise,
}) => {
  return (
    <div className="border p-4 rounded-lg shadow mb-4 w-full max-w-md">
      <h3 className="text-lg mt-2">{currentExercise}</h3>
      {nextExercise && (
        <p className="text-gray-500 mt-2">Next: {nextExercise}</p>
      )}
    </div>
  );
};

export default CurrentExercise;
