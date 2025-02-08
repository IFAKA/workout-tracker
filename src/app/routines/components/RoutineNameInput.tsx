// components/RoutineNameInput.tsx
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type RoutineNameInputProps = {
  routineName: string;
  onChange: (value: string) => void;
};

const RoutineNameInput: React.FC<RoutineNameInputProps> = ({
  routineName,
  onChange,
}) => {
  return (
    <FormField
      name="routine-name"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoFocus={routineName.trim() === ""}
              placeholder="Enter a name for your routine"
              value={routineName}
              onChange={(e) => onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoutineNameInput;
