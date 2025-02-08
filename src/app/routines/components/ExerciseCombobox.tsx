// version: 1.0.1
"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSelectableExercises } from "@/lib/db/schema/selectable-exercises";
import { cn } from "@/lib/utils";

type ComboboxProps = {
  items: SelectSelectableExercises[];
  loading: boolean;
  value: string;
  onChangeAction: (value: string) => void; // Callback when an item is selected or custom input is added
};

export const ExerciseCombobox: React.FC<ComboboxProps> = ({
  items,
  loading,
  value,
  onChangeAction,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {loading
            ? "Loading..."
            : value
            ? items.find((item) => item.name === value)?.name || value // Show custom input if not in the list
            : "Select exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput enterKeyHint="done" placeholder="Search exercise..." />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No exercise found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.name}
                      value={item.name}
                      onSelect={(currentValue) => {
                        onChangeAction(currentValue);
                        setOpen(false);
                      }}
                    >
                      {item.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === item.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
