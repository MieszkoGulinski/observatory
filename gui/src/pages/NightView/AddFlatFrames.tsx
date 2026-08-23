import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AddFlatFramesProps = {
  onClose: () => void;
};

function AddFlatFrames({ onClose }: AddFlatFramesProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="min-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Add flat frames</DialogTitle>
        </DialogHeader>
        <p>
          Flat frames are used to correct for vignetting, dust spots and other
          causes of non-uniform sensitivity of pixels in the imaging system.
        </p>
        <p>
          Flat frames should be taken by pointing the telescope at a uniformly
          illuminated surface. This is achieved by pointing the telescope at
          twilight sky at zenith - both in the morning and in the evening.
          Default start and end times below are calculated for the currently
          selected day and location of the observatory, and correspond to the
          period when the sun is between 6 and 12 degrees below the horizon.
        </p>
        <div className="flex flex-row gap-4">
          <Field>
            <FieldLabel htmlFor="start-time">Start</FieldLabel>
            <Input id="start-time" type="time" />
          </Field>
          <Field>
            <FieldLabel htmlFor="end-time">End</FieldLabel>
            <Input id="end-time" type="time" />
          </Field>
        </div>
        <div className="flex flex-row gap-4">
          <Field>
            <FieldLabel htmlFor="exp-time">Exposure times</FieldLabel>
            <Input id="exp-time" placeholder="5" />
            <FieldDescription>
              Exposure time(s) in seconds. When using multiple exposure times,
              values must be separated by spaces.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="iso-value">ISO</FieldLabel>
            <Input id="iso-value" placeholder="400" />
            <FieldDescription>
              ISO sensitivity. Changing value will require complete
              re-calibration. Do not change if not needed.
            </FieldDescription>
          </Field>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddFlatFrames;
