"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SelectRoutineButtonProps {
  routineId: number;
}

const SelectRoutineButton = ({ routineId }: SelectRoutineButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelect = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/routines/${routineId}/select`, {
        method: "PUT",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to select routine:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const FormContent = (
    <>
      <DrawerHeader>
        <DrawerTitle>Select Routine</DrawerTitle>
        <DrawerDescription>
          Are you sure you want to select this routine?
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button onClick={handleSelect} disabled={isLoading}>
          {isLoading ? "Selecting..." : "Select"}
        </Button>
      </DrawerFooter>
    </>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} disabled={isLoading}>
        <Badge variant="secondary">
          {isLoading ? "Selecting..." : "Select"}
        </Badge>
      </button>

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>{FormContent}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="[&>button]:hidden">
            <DialogHeader>
              <DialogTitle>Select Routine</DialogTitle>
              <DialogDescription>
                Are you sure you want to select this routine?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSelect} disabled={isLoading}>
                {isLoading ? "Selecting..." : "Select"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SelectRoutineButton;
