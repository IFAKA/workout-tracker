import { Button } from "@/components/ui/button";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React from "react";

type StepNavigationButtonsProps = {
  goToRoutineSetup: () => void;
  prevStep: () => void;
  nextStep: () => void;
  goToLatestAvailableStep: () => void;
  exercisesLength: number;
  disabledRoutineSetup: boolean;
  currentStep: number;
  totalSteps: number;
};

const StepNavigationButtons: React.FC<StepNavigationButtonsProps> = ({
  goToRoutineSetup,
  prevStep,
  nextStep,
  goToLatestAvailableStep,
  exercisesLength,
  disabledRoutineSetup,
  currentStep,
  totalSteps,
}) => {
  const isRoutineSetup = currentStep === 0;
  const isSummaryStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between gap-2 mt-4 items-center mb-4">
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={goToRoutineSetup}
          variant={isRoutineSetup ? "outline" : "default"}
          className={isRoutineSetup ? "border-none" : ""}
          disabled={isRoutineSetup}
        >
          <ChevronFirstIcon />
        </Button>

        <Button
          type="button"
          onClick={prevStep}
          variant={isRoutineSetup ? "outline" : "default"}
          className={isRoutineSetup ? "border-none" : ""}
          disabled={isRoutineSetup}
        >
          <ChevronLeftIcon />
        </Button>
      </div>

      <div>
        {currentStep + 1}/{totalSteps + 1}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={nextStep}
          variant={isSummaryStep ? "outline" : "default"}
          className={isSummaryStep ? "border-none" : ""}
          disabled={
            (!isRoutineSetup && exercisesLength === 0) ||
            (isRoutineSetup && disabledRoutineSetup)
          }
        >
          <ChevronRightIcon />
        </Button>

        <Button
          type="button"
          onClick={goToLatestAvailableStep}
          variant={isSummaryStep ? "outline" : "default"}
          className={isSummaryStep ? "border-none" : ""}
          disabled={
            (!isRoutineSetup && exercisesLength === 0) ||
            (isRoutineSetup && disabledRoutineSetup)
          }
        >
          <ChevronLastIcon />
        </Button>
      </div>
    </div>
  );
};

export default StepNavigationButtons;
