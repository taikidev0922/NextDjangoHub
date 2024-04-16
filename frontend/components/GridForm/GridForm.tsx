"use client";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
} from "@grapecity/wijmo.grid";
import { FlexGridCellTemplate } from "@grapecity/wijmo.react.grid";
import Card from "../Card/Card";

function GridForm({
  name,
  initGrid,
  addRow,
  deleteRow,
  copyRow,
}: {
  name: string;
  initGrid: (e: FlexGridType) => void;
  addRow: () => void;
  deleteRow: () => void;
  copyRow: () => void;
}) {
  return (
    <Card title={name ?? "一覧"}>
      <FlexGrid initialized={initGrid} style={{ height: 500 }}>
        <FlexGridCellTemplate
          cellType="RowHeader"
          template={(context: ICellTemplateContext) => {
            return `${context.row.index + 1}`;
          }}
        />
      </FlexGrid>
      <div className="flex">
        <button className="flex items-center btn-grid-action" onClick={addRow}>
          Alt+(+) 行追加
        </button>
        <button
          className="flex items-center btn-grid-action"
          onClick={deleteRow}
        >
          Alt+(-) 行削除
        </button>
        <button className="flex items-center btn-grid-action" onClick={copyRow}>
          Alt+C 行コピー
        </button>
        <button className="flex items-center btn-grid-action">
          Alt+F フィルター解除
        </button>
        <button className="flex items-center btn-grid-action">
          Alt+E Excel
        </button>
      </div>
    </Card>
  );
}

export default GridForm;
