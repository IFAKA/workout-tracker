import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type DeleteConfirmationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmationDrawer: React.FC<DeleteConfirmationDrawerProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Confirm Deletion</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-2">
          Are you sure you want to delete this exercise?
        </div>
        <DrawerFooter className="flex gap-2 px-4 pb-4">
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteConfirmationDrawer;
