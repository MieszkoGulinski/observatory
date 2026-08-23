import type { StarCatalogEntry } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type StarDetailsModalProps = {
  star: StarCatalogEntry;
  onClose: () => void;
};

function StarDetailsModal({ star, onClose }: StarDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Star Details</DialogTitle>
        </DialogHeader>
        <div>
          <p>Name: {star.starName}</p>
          <p>RA: {star.ra.toFixed(4)}</p>
          <p>Dec: {star.dec.toFixed(4)}</p>
          <p>Min VMag: {star.minVMag.toFixed(2)}</p>
          <p>Max VMag: {star.maxVMag.toFixed(2)}</p>
          <p>Period (days): {star.periodDays?.toFixed(2) ?? "N/A"}</p>
          <p>Type: {star.varType}</p>
          <p>Normalized Type: {star.normalizedVarType}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StarDetailsModal;
