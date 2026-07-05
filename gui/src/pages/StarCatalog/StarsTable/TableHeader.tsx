import { ChevronDown, ChevronUp } from "lucide-react";
import type { StarCatalogEntry } from "../types";

type TableHeaderProps = {
  onChangeOrder: (column: keyof StarCatalogEntry) => void;
  orderBy: keyof StarCatalogEntry;
  orderDesc: boolean;
};

type TableHeaderCellProps = {
  name: string;
  tooltip?: string;
  column: keyof StarCatalogEntry;
  onChangeOrder?: (column: keyof StarCatalogEntry) => void;
  orderBy: keyof StarCatalogEntry;
  orderDesc: boolean;
};

function TableHeaderCell({
  name,
  column,
  onChangeOrder,
  orderBy,
  orderDesc,
  tooltip,
}: TableHeaderCellProps) {
  return (
    <th
      title={tooltip}
      onClick={() => onChangeOrder?.(column)}
      className={onChangeOrder ? "hover:bg-gray-100 cursor-pointer" : undefined}
    >
      <div className="flex items-center gap-2 min-h-[22px]">
        {name}
        {orderBy === column && orderDesc ? <ChevronDown /> : null}
        {orderBy === column && !orderDesc ? <ChevronUp /> : null}
      </div>
    </th>
  );
}

function TableHeader({ onChangeOrder, orderBy, orderDesc }: TableHeaderProps) {
  return (
    <thead className="text-left">
      <tr>
        <TableHeaderCell
          name="Name"
          column="starName"
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="RA"
          column="ra"
          tooltip="Right ascension"
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="Dec"
          column="dec"
          tooltip="Declination"
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="Min VMag"
          column="minVMag"
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="Max VMag"
          column="maxVMag"
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="Period (days)"
          column="periodDays"
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="Type"
          column="varType"
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <TableHeaderCell
          name="Normalized Type"
          column="normalizedVarType"
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
      </tr>
    </thead>
  );
}

export default TableHeader;
