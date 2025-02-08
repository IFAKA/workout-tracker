"use client";

import React from "react";
import DaySelectionGroup from "./DaySelectionGroup";
import RoutineNameInput from "./RoutineNameInput";

type RoutineSetupProps = {
  routineName: string;
  setRoutineName: (name: string) => void;
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
};

const RoutineSetup: React.FC<RoutineSetupProps> = ({
  routineName,
  setRoutineName,
  selectedDays,
  setSelectedDays,
}) => {
  return (
    <>
      <RoutineNameInput routineName={routineName} onChange={setRoutineName} />

      <DaySelectionGroup
        selectedDays={selectedDays}
        onChange={setSelectedDays}
      />
    </>
  );
};

export default RoutineSetup;
