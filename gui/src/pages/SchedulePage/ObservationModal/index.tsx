import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Schedule } from "../types";

type ObservationModalProps = {
  scheduleItem?: Schedule;
  onClose: () => void;
};

function ObservationModal({ scheduleItem, onClose }: ObservationModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {scheduleItem ? "Edit observation" : "Add observation"}
          </DialogTitle>
        </DialogHeader>
        TODO complete
      </DialogContent>
    </Dialog>
  );
}

export default ObservationModal;
