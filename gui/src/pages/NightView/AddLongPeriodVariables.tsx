import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AddLongPeriodVariablesProps = {
  onClose: () => void;
};

function AddLongPeriodVariables({ onClose }: AddLongPeriodVariablesProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="min-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Add long period variables</DialogTitle>
        </DialogHeader>
        <p>
          This is the most basic mode of automatic star selection. It will
          select stars from the star catalog known to have period longer than 10
          days and not belonging to eclipsing binaries, and in addition to that,
          stars with unknown period. See documentation for the complete
          algorithm.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default AddLongPeriodVariables;
