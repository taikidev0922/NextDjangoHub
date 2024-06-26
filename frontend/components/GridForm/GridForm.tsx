"use client";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
} from "@grapecity/wijmo.grid";
import { FlexGridCellTemplate } from "@grapecity/wijmo.react.grid";
import Card from "../Card/Card";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { useAccordion } from "@/context/AccordionContext";
import { useOperationHeader } from "@/context/OperationHeaderContext";

function GridForm({
  name,
  initGrid,
  addRow,
  deleteRow,
  copyRow,
  clearFilter,
  exportExcel,
  saveLayout,
  resetGrid,
  focusedStyle,
}: {
  name: string;
  initGrid: (e: FlexGridType) => void;
  addRow: () => void;
  deleteRow: () => void;
  copyRow: () => void;
  clearFilter: () => void;
  exportExcel: () => void;
  saveLayout: () => void;
  resetGrid: (e?: FlexGridType) => void;
  focusedStyle: string;
}) {
  const { setResizeGrid } = useAccordion();
  const { isEditable } = useOperationHeader();
  const [gridHeight, setGridHeight] = useState(window.innerHeight - 300);
  const resizeGrid = () => {
    const top = document.querySelector(".flex-grid")?.getClientRects()[0].top;
    const updateGridHeight = () => {
      setGridHeight(window.innerHeight - (top ?? 0) - 50);
    };
    window.addEventListener("resize", updateGridHeight);
    updateGridHeight();
  };
  useEffect(() => {
    setResizeGrid(() => {
      return () => {
        setTimeout(() => {
          resizeGrid();
        });
      };
    });
    resizeGrid();
  }, []);
  return (
    <Card title={name ?? "一覧"}>
      <FlexGrid
        initialized={initGrid}
        style={{ height: gridHeight }}
        className={`flex-grid${focusedStyle}`}
      >
        <FlexGridCellTemplate
          cellType="RowHeader"
          template={(context: ICellTemplateContext) => {
            return `${context.row.index + 1}`;
          }}
        />
      </FlexGrid>
      <div className="flex gap-1">
        <Button
          className="flex items-center btn-grid-action"
          onClick={addRow}
          disabled={!isEditable}
        >
          Alt+(+) 行追加
        </Button>
        <Button
          className="flex items-center btn-grid-action"
          onClick={deleteRow}
          disabled={!isEditable}
        >
          Alt+(-) 行削除
        </Button>
        <Button
          className="flex items-center btn-grid-action"
          onClick={copyRow}
          disabled={!isEditable}
        >
          Alt+C 行コピー
        </Button>
        <Button
          className="flex items-center btn-grid-action"
          onClick={clearFilter}
        >
          Alt+F フィルター解除
        </Button>
        <Button
          className="flex items-center btn-grid-action"
          onClick={exportExcel}
        >
          Alt+Q Excel
        </Button>
        <Button
          className="flex items-center btn-grid-action"
          onClick={saveLayout}
        >
          Alt+L レイアウト保存
        </Button>
        <Button
          className="btn-outline ml-auto"
          onClick={() => {
            resetGrid();
          }}
        >
          Alt+G 一覧リセット
        </Button>
      </div>
    </Card>
  );
}

export default GridForm;
