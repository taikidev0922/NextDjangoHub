"use client";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
} from "@grapecity/wijmo.grid";
import { GridColumn } from "@/hooks/useGridForm";
import { FlexGridCellTemplate } from "@grapecity/wijmo.react.grid";

function GridForm({
  name,
  initGrid,
  columns,
}: {
  name: string;
  initGrid: (e: FlexGridType) => void;
  columns: GridColumn[];
}) {
  return (
    <div>
      <FlexGrid
        initialized={initGrid}
        columns={columns}
        style={{ height: 500 }}
        className="border border-gray-500"
      >
        <FlexGridCellTemplate
          cellType="RowHeader"
          template={(context: ICellTemplateContext) => {
            return `${context.row.index + 1}`;
          }}
        />
      </FlexGrid>
    </div>
  );
}

export default GridForm;
