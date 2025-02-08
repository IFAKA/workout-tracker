// components/SummaryHeader.tsx
import { Card } from "@/components/ui/card";
import React from "react";

type SummaryHeaderProps = {
  routineName: string;
  goToRoutineSetup?: () => void;
};

const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  routineName,
  goToRoutineSetup,
}) => {
  return (
    <>
      <h3 className="pb-1.5 font-bold">Summary</h3>

      <Card
        className="flex justify-between items-center gap-2 cursor-pointer hover:bg-slate-50 border p-3 py-2"
        onClick={goToRoutineSetup ? goToRoutineSetup : undefined}
      >
        <span className="font-semibold">Name:</span>
        <span>{routineName}</span>
      </Card>
    </>
  );
};

export default SummaryHeader;
