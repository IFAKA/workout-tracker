"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import React from "react";

interface RemoveButtonProps {
  routineId: number;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ routineId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/routines/${routineId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to remove routine:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const FormContent = (
    <>
      <DrawerHeader>
        <DrawerTitle>Confirm Delete</DrawerTitle>
        <DrawerDescription>
          Are you sure you want to delete this routine?
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button
          onClick={handleRemove}
          variant="destructive"
          disabled={isLoading}
        >
          {isLoading ? "Removing..." : "Remove"}
        </Button>
      </DrawerFooter>
    </>
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="remove-button"
        variant="destructive"
        disabled={isLoading}
      >
        {isLoading ? "Removing..." : "Remove"}
      </Button>

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>{FormContent}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="[&>button]:hidden">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this routine?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={handleRemove}
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? "Removing..." : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RemoveButton;
