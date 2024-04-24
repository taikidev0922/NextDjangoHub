import { useEffect, useState } from "react";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
  CellType,
  KeyAction,
  SelectionMode,
} from "@grapecity/wijmo.grid";
import { DataType } from "@grapecity/wijmo";
import { FlexGridFilter } from "@grapecity/wijmo.grid.filter";
import _assign from "lodash/assign";
import { useOperationHeader } from "@/context/OperationHeaderContext";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { FlexGridXlsxConverter } from "@grapecity/wijmo.grid.xlsx";

export type GridColumn = {
  binding: string;
  header: string;
  dataType: "string" | "number" | "boolean";
  width?: number;
  cssClass?: string;
  allowSorting?: boolean;
};

type GridItem<T> = T & {
  isSelected: boolean;
  cookie: number;
  operation: string;
  id: number | null;
};

const dataType = {
  string: DataType.String,
  number: DataType.Number,
  boolean: DataType.Boolean,
};

export function useGridForm<T>(columns: GridColumn[]) {
  const [grid, setGrid] = useState<FlexGridType<GridItem<T>>>();
  const [filter, setFilter] = useState<FlexGridFilter>();
  const { isReadOnly, operationType, isRegistable } = useOperationHeader();
  useKeyboardShortcuts([
    {
      keys: "Alt+;",
      action: () => {
        addRow();
      },
    },
    {
      keys: "Alt+-",
      action: () => {
        deleteRow();
      },
    },
    {
      keys: "Alt+c",
      action: () => {
        copyRow();
      },
    },
    {
      keys: "Alt+f",
      action: () => {
        clearFilter();
      },
    },
    {
      keys: "Alt+q",
      action: () => {
        exportExcel();
      },
    },
  ]);

  useEffect(() => {
    resetGrid(grid);
  }, [operationType]);

  const resetGrid = (e: FlexGridType | undefined) => {
    const rowHeader: GridColumn[] = [
      {
        binding: "isSelected",
        header: " ",
        dataType: "boolean",
        width: 40,
        cssClass: "wj-header",
        allowSorting: false,
      },
      {
        binding: "operation",
        header: " ",
        dataType: "string",
        allowSorting: false,
        width: 40,
        cellTemplate(context: ICellTemplateContext, cell: HTMLElement) {
          cell.style.textAlign = "center";
          if (context.item.operation === "DELETE") {
            cell.style.backgroundColor = "#e8383d";
            return `<span class="text-white leading-none font-mono" style="font-size: 1.25rem;">D</span>`;
          }
          if (!context.item.isSelected) {
            cell.style.backgroundColor = "#eee";
            return;
          }
          if (context.item.id) {
            cell.style.backgroundColor = "#00a960";
            return `<span class="text-white font-mono" style="font-size: 1.25rem;">U</span>`;
          }
          if (!context.item.id) {
            cell.style.backgroundColor = "#00a1e9";
            return `<span class="text-white font-mono" style="font-size: 1.25rem;">I</span>`;
          }
        },
      },
    ] as GridColumn[];
    if (!e) return;
    const itemsSource = Array.from({ length: isRegistable ? 10 : 0 }, () => ({
      isSelected: false,
    }));
    console.log(isRegistable);
    e.initialize({
      itemsSource,
      autoGenerateColumns: false,
      keyActionEnter: KeyAction.CycleEditable,
      keyActionTab: KeyAction.CycleEditable,
      // selectionMode: SelectionMode.Row,
      columns: [
        ...rowHeader,
        ...columns.map((column) => ({
          ...column,
          isReadOnly,
          cssClass: isReadOnly ? "" : "bg-editable",
          isRequired: false,
        })),
      ].map((column) => ({
        ...column,
        dataType: dataType[column.dataType],
      })),
    });
  };

  const initGrid = (flexGrid: FlexGridType) => {
    setGrid(flexGrid);
    setFilter(
      new FlexGridFilter(flexGrid, {
        filterColumns: columns.map((column) => column.binding),
      })
    );
    resetGrid(flexGrid);
    flexGrid.itemFormatter = (panel, r, c, cell) => {
      if (panel.cellType === CellType.ColumnHeader) {
        cell.style.textAlign = "left";
      }
    };
    flexGrid.itemsSourceChanged.addHandler(() => {
      flexGrid.beginUpdate();
      flexGrid.collectionView?.items.forEach((item) => {
        item.isSelected = false;
      });
      flexGrid.endUpdate();
    });
    flexGrid.cellEditEnding.addHandler((_, args) => {
      flexGrid.beginUpdate();
      flexGrid.collectionView.items[args.row].isSelected = true;
      flexGrid.endUpdate();
    });
    flexGrid.selectionChanged.addHandler((_, args) => {
      if (args.col === 0) {
        flexGrid.select(args.row, 2);
      }
    });
    flexGrid.hostElement.addEventListener("keydown", (e) => {
      if (
        e.shiftKey &&
        (e.key === "Enter" || e.key === "Tab") &&
        flexGrid.selection.col === 1
      ) {
        flexGrid.select(flexGrid.selection.row - 1, columns.length + 1);
      }
      if (e.key === "ArrowLeft" && flexGrid.selection.col === 1) {
        flexGrid.select(flexGrid.selection.row, 2);
      }
    });
    flexGrid.hostElement.addEventListener("click", (e) => {
      const hit = flexGrid.hitTest(e);
      if (hit.col === 0 || hit.col === 1) {
        flexGrid.select(hit.row, 2);
      }
    });
  };

  const addRow = () => {
    grid?.collectionView.sourceCollection.splice(
      grid.selection.row + 1,
      0,
      {} as GridItem<T>
    );
    grid?.collectionView.refresh();
    grid?.focus();
    grid?.select(grid.selection.row + 1, grid.selection.col);
  };

  const deleteRow = () => {
    if (grid?.collectionView.currentItem.id) {
      grid.beginUpdate();
      grid.collectionView.currentItem.isSelected = true;
      grid.collectionView.currentItem.operation = "DELETE";
      grid.endUpdate();
      return;
    }
    grid?.collectionView.sourceCollection.splice(grid.selection.row, 1);
    grid?.collectionView.refresh();
  };

  const copyRow = () => {
    if (!grid) return;
    addRow();
    grid?.beginUpdate();
    _assign(
      grid?.collectionView.currentItem,
      grid?.collectionView.items[grid.selection.row - 1]
    );
    grid.collectionView.currentItem.id = null;
    grid.collectionView.currentItem.isSelected = true;
    grid?.endUpdate();
  };

  const clearFilter = () => {
    filter?.clear();
  };

  const exportExcel = () => {
    FlexGridXlsxConverter.saveAsync(
      grid as FlexGridType,
      {
        includeColumnHeaders: true,
        includeStyles: false,
        includeRowHeaders: false,
        includeColumns: function (column) {
          return !["isSelected", "operation"].includes(column.binding ?? "");
        },
      },
      "FlexGrid.xlsx"
    );
  };

  const register = (name: string) => {
    return {
      name,
      initGrid,
      addRow,
      deleteRow,
      copyRow,
      clearFilter,
      exportExcel,
    };
  };

  const setItemsSource = (itemsSource: any[]) => {
    if (!grid) return;
    grid.itemsSource = itemsSource;
  };

  const getSelectedItems = () => {
    grid?.collectionView.items.forEach((item, index) => {
      item.cookie = index;
    });
    const selectedItems = grid?.collectionView.items.filter(
      (item) => item.isSelected
    );
    return selectedItems ?? [];
  };

  const applyResults = (results: any[]) => {
    grid?.beginUpdate();
    results?.forEach((res) => {
      const target = grid?.collectionView.items.find(
        (item) => item.cookie === res.cookie
      );
      if (!target) return;
      target.isSelected = false;
      _assign(target, res);
    });
    grid?.endUpdate();
  };

  return {
    grid,
    register,
    setItemsSource,
    getSelectedItems,
    applyResults,
    addRow,
    copyRow,
  };
}
