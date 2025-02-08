"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { InsertDayExercises } from "@/lib/db/schema/day-exercises";
import { SelectSelectableExercises } from "@/lib/db/schema/selectable-exercises";
import { useState } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import DeleteConfirmationDrawer from "./DeleteConfirmationDrawer"; // Import DeleteConfirmationDrawer
import { ExerciseCombobox } from "./ExerciseCombobox";

type EditExerciseFormProps = {
  exercise: InsertDayExercises;
  selectableExercises: SelectSelectableExercises[];
  loading: boolean;
  onSave: (exercise: InsertDayExercises) => void;
  onCancel: () => void;
  onDelete: (orderIndex: number) => void; // Add onDeleteExercise prop
};

const EditExerciseForm: React.FC<EditExerciseFormProps> = ({
  exercise,
  selectableExercises,
  loading,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [exerciseName, setExerciseName] = useState<string>(exercise.name);
  const [sets, setSets] = useState<number>(exercise.sets);
  const [reps, setReps] = useState<number>(exercise.reps);
  const [restTime, setRestTime] = useState<number>(exercise.restTime);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isMobile = useIsMobile();

  const handleSave = () => {
    const updatedExercise: InsertDayExercises = {
      ...exercise,
      name: exerciseName,
      sets,
      reps,
      restTime,
    };

    onSave(updatedExercise);
  };

  const canSaveChanges = exerciseName && sets && reps && restTime;

  const closeEditExerciseForm = () => {
    setExerciseName("");
    setSets(0);
    setReps(0);
    setRestTime(0);

    onCancel();

    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    onDelete(exercise.orderIndex);
    closeDeleteDialog();
    onCancel();
  };

  const FormContent = (
    <>
      <div className="gap-2 grid px-4">
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
        <div className="flex gap-2">
          <FormItem className="space-y-1">
            <FormLabel>Sets</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
              />
            </FormControl>
          </FormItem>
          <FormItem className="space-y-1">
            <FormLabel>Reps</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
              />
            </FormControl>
          </FormItem>
          <FormItem className="space-y-1">
            <FormLabel>Rest (s)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={restTime}
                onChange={(e) => setRestTime(Number(e.target.value))}
              />
            </FormControl>
          </FormItem>
        </div>
      </div>
      <DialogFooter className="flex gap-2 mt-3 px-4 pb-4">
        <Button variant="destructive" onClick={openDeleteDialog}>
          Delete
        </Button>
        <DialogClose asChild>
          <Button onClick={handleSave} disabled={!canSaveChanges}>
            Save Changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );

  return isMobile ? (
    <>
      <Drawer open={!!exercise} onOpenChange={closeEditExerciseForm}>
        <DrawerContent className="gap-4">
          <DrawerHeader className="pb-2 pt-0">
            <DrawerTitle>Edit Exercise</DrawerTitle>
          </DrawerHeader>
          {FormContent}
        </DrawerContent>
      </Drawer>

      <DeleteConfirmationDrawer
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  ) : (
    <>
      <Dialog open={!!exercise} onOpenChange={closeEditExerciseForm}>
        <DialogContent className="[&>button]:hidden gap-4">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          {FormContent}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default EditExerciseForm;
