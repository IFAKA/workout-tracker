"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectExercises } from "@/lib/db/schema/exercises";
import {
  recordSetProgress,
  updateExerciseProgress,
} from "@/lib/workoutActions";

type ExerciseTrackingProps = {
  exercise: SelectExercises;
};

export function ExerciseTracking({ exercise }: ExerciseTrackingProps) {
  const [currentSet, setCurrentSet] = useState(0);
  const [weight, setWeight] = useState("");
  const [isResting, setIsResting] = useState(false);
  const [remainingRestTime, setRemainingRestTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && remainingRestTime > 0) {
      timer = setInterval(() => {
        setRemainingRestTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingRestTime === 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, remainingRestTime]);

  const handleSetComplete = async () => {
    if (!weight) {
      alert("Please enter weight");
      return;
    }

    await recordSetProgress(exercise.id, currentSet, parseFloat(weight));
    await updateExerciseProgress(exercise.id, currentSet + 1);

    setCurrentSet((prev) => prev + 1);
    setWeight("");
    setIsResting(true);
    setRemainingRestTime(exercise.restTime);
  };

  const isSetComplete = currentSet === exercise.sets;

  return (
    <div className="border p-4 rounded-lg">
      <h2>{exercise.name}</h2>
      <div>
        Sets: {currentSet}/{exercise.sets}
      </div>
      {!isSetComplete && (
        <div className="flex gap-2 mt-2">
          <Input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isResting}
          />
          <Button onClick={handleSetComplete} disabled={isResting || !weight}>
            Complete Set
          </Button>
        </div>
      )}
      {isResting && <div>Rest Time Remaining: {remainingRestTime} seconds</div>}
      {isSetComplete && <div>Exercise Completed!</div>}
    </div>
  );
}
