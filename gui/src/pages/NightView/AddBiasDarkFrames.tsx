import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AddBiasDarkFramesProps = {
  onClose: () => void;
};

function AddBiasDarkFrames({ onClose }: AddBiasDarkFramesProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="min-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Add bias and dark frames</DialogTitle>
        </DialogHeader>
        <p>
          Bias and dark frames are calibration frames that are taken when the
          telescope receives no light, to measure camera readout offset and
          noise, and dark current.
        </p>
        <p>
          This window allows scheduling taking bias and dark frames. Most
          probably it will be used during maintenance windows, as it is
          necessary to <b>manually cover the lens</b>. Bias and dark frames can
          be taken even when the roof is closed.
        </p>
        <p>
          Note that dark current is dependent on temperature, so dark frames
          calibration must be done in various ambient temperatures. You need to
          schedule maintenance windows appropriately, to ensure that dark
          calibration is performed at different ambient temperatures. At least,
          perform dark calibration every 3-4 months, at the peak of each season.
        </p>
        <p>
          Dark current contribution is proportional to the exposure time. For
          this reason, it is important to take multiple exposures with varying
          times. Default values below are chosen for typical exposures of a DSLR
          camera.
        </p>
        <p>
          Bias frames are frames taken with the shortest possible exposure time.
          In the settings below, this is represented by number 0, but actually
          it will be taken with the shortest possible exposure time supported by
          the camera.
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
            <Input id="exp-time" placeholder="0 10 20 30 60 120 300" />
            <FieldDescription>
              Exposure times in seconds. 0 for bias frames. Values must be
              separated by spaces.
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

export default AddBiasDarkFrames;
