"use client";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
} from "@grapecity/wijmo.grid";
import { FlexGridCellTemplate } from "@grapecity/wijmo.react.grid";
import Card from "../Card/Card";
import Button from "../Button";
import { useEffect, useState } from "react";
import { useAccordion } from "@/context/AccordionContext";

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
  const { setResizeGrid } = useAccordion();
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
        className="flex-grid"
      >
        <FlexGridCellTemplate
          cellType="RowHeader"
          d
          template={(context: ICellTemplateContext) => {
            return `${context.row.index + 1}`;
          }}
        />
      </FlexGrid>
      <div className="flex gap-1">
        <Button className="flex items-center btn-grid-action" onClick={addRow}>
          Alt+(+) 行追加
        </Button>
        <Button
          className="flex items-center btn-grid-action"
          onClick={deleteRow}
        >
          Alt+(-) 行削除
        </Button>
        <Button className="flex items-center btn-grid-action" onClick={copyRow}>
          Alt+C 行コピー
        </Button>
        <Button className="flex items-center btn-grid-action">
          Alt+F フィルター解除
        </Button>
        <Button className="flex items-center btn-grid-action">
          Alt+E Excel
        </Button>
      </div>
    </Card>
  );
}

export default GridForm;
