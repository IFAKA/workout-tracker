"use client";

import { FormLabel } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/utils/strings";
import React from "react";
import { weekdays } from "../constants/weekdays";

type DaySelectionGroupProps = {
  selectedDays: string[];
  onChange: (days: string[]) => void;
};

const DaySelectionGroup: React.FC<DaySelectionGroupProps> = ({
  selectedDays,
  onChange,
}) => {
  return (
    <div className="gap-2 grid">
      <FormLabel>Select Days</FormLabel>
      <ToggleGroup
        type="multiple"
        className="flex flex-wrap gap-2"
        value={selectedDays}
        onValueChange={onChange}
      >
        {weekdays.map((day) => (
          <ToggleGroupItem
            key={day}
            value={day}
            className="data-[state=on]:bg-primary data-[state=on]:opacity-70 p-2 border rounded-md w-full data-[state=on]:text-primary-foreground first-letter:uppercase cursor-pointer"
          >
            {capitalizeFirstLetter(day)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default DaySelectionGroup;
