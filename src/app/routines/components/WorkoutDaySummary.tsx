"use client";

// components/WorkoutDaySummary.tsx
import { Card } from "@/components/ui/card";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { WorkoutDay } from "@/lib/db/schema/workout-days";
import { capitalizeFirstLetter } from "@/utils/strings";
import React from "react";
import ExerciseItem from "./ExerciseItem";
import Link from "next/link";

type WorkoutDaySummaryProps = {
  day: string | WorkoutDay;
  exercises: InsertDayExercises[]; // Adjust type as necessary
  handleClick?: () => void; // Make setCurrentStep optional
  href?: string; // Add optional href prop
};

const WorkoutDaySummary: React.FC<WorkoutDaySummaryProps> = ({
  day,
  exercises,
  handleClick = () => {}, // Set default value for handleClick
  href,
}) => {
  const content = (
    <Card
      onClick={handleClick}
      className="cursor-pointer hover:bg-slate-50 px-3 py-2.5 grid gap-2"
    >
      <h3 className="px-0 w-fit font-semibold first-letter:uppercase">
        {capitalizeFirstLetter(day)}
      </h3>
      <div>
        {exercises.map((exercise, index) => (
          <ExerciseItem key={index} exercise={exercise} index={index} />
        ))}
      </div>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

export default WorkoutDaySummary;
