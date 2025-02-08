"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { SelectSelectableExercises } from "@/lib/db/schema/selectable-exercises";
import { useState } from "react";
import { ExerciseCombobox } from "./ExerciseCombobox";

type AddExerciseFormProps = {
  exercises: InsertDayExercises[];
  selectableExercises: SelectSelectableExercises[];
  loading: boolean;
  onAddExercise: (exercise: InsertDayExercises) => void;
};

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({
  exercises,
  selectableExercises,
  loading,
  onAddExercise,
}) => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [restTime, setRestTime] = useState<number>(60);

  const isMobile = useIsMobile();

  const closeEditExerciseForm = () => {
    setExerciseName("");
    setSets(3);
    setReps(10);
    setRestTime(60);
  };

  const handleAdd = () => {
    const newExercise: InsertDayExercises = {
      name: exerciseName,
      sets,
      reps,
      restTime,
      orderIndex: exercises.length,
    };

    // Add the exercise
    onAddExercise(newExercise);

    // Reset form after adding
    setExerciseName("");
    setSets(sets);
    setReps(reps);
    setRestTime(restTime);
  };

  const handleNumberInputChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        // Remove leading zeros
        value = value.replace(/^0+/, "");
        setter(+value);
      }
    };

  const FormContent = (
    <>
      <div className="gap-2 grid p-4">
        <FormItem>
          <FormLabel>Select your exercise</FormLabel>
          <FormControl>
            <ExerciseCombobox
              items={selectableExercises}
              loading={loading}
              value={exerciseName}
              onChangeAction={setExerciseName}
            />
          </FormControl>
        </FormItem>
        <div className="gap-4 grid">
          <div className="flex gap-2">
            <FormItem className="space-y-1">
              <FormLabel>Sets</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={sets}
                  onChange={handleNumberInputChange(setSets)}
                />
              </FormControl>
            </FormItem>
            <FormItem className="space-y-1">
              <FormLabel>Reps</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={reps}
                  onChange={handleNumberInputChange(setReps)}
                />
              </FormControl>
            </FormItem>
            <FormItem className="space-y-1">
              <FormLabel>Rest (s)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={restTime}
                  onChange={handleNumberInputChange(setRestTime)}
                />
              </FormControl>
            </FormItem>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button
            onClick={handleAdd}
            disabled={!exerciseName || !sets || !reps || !restTime}
          >
            Add Exercise
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );

  return isMobile ? (
    <Drawer onOpenChange={closeEditExerciseForm}>
      <DrawerTrigger asChild>
        <Button className="w-fit">Add</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle>New Exercise</DrawerTitle>
        </DrawerHeader>
        {FormContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog onOpenChange={closeEditExerciseForm}>
      <DialogTrigger asChild>
        <Button className="w-fit">Add</Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>New Exercise</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseForm;
