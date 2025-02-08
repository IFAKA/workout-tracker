// components/ExerciseList.tsx
import React from "react";

interface ExerciseListProps {
  exercises: string[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <ul>
      {exercises.map((exercise, index) => (
        <li key={index}>{exercise}</li>
      ))}
    </ul>
  );
};

export default ExerciseList;
