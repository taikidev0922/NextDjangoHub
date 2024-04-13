import { useEffect, useState } from "react";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
  CellType,
  KeyAction,
} from "@grapecity/wijmo.grid";
import { DataType } from "@grapecity/wijmo";
import _assign from "lodash/assign";
import { useMessage } from "@/context/MessageContext";
import { useOperationType } from "@/context/OperationTypeContext";

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
  const { addMessage } = useMessage();
  const { isReadOnly, operationType, isRegistable } = useOperationType();

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
        cssClass: "wj-header",
        allowSorting: false,
        isReadOnly: true,
        width: 40,
        cellTemplate(context: ICellTemplateContext, cell: HTMLElement) {
          cell.style.textAlign = "center";
          if (context.item.operation === "DELETE") {
            cell.style.backgroundColor = "#FF0000";
            return `<span class="text-white leading-none font-mono" style="font-size: 1.25rem;">D</span>`;
          }
          if (!context.item.isSelected) {
            cell.style.backgroundColor = "";
            return;
          }
          if (context.item.id) {
            cell.style.backgroundColor = "#32CD32";
            return `<span class="text-white font-mono" style="font-size: 1.25rem;">U</span>`;
          }
          if (!context.item.id) {
            cell.style.backgroundColor = "#4169E1";
            return `<span class="text-white font-mono" style="font-size: 1.25rem;">I</span>`;
          }
        },
      },
    ] as GridColumn[];
    if (!e) return;
    const itemsSource = Array.from({ length: isRegistable ? 10 : 0 }, () => ({
      isSelected: false,
    }));
    e.initialize({
      itemsSource,
      autoGenerateColumns: false,
      keyActionEnter: KeyAction.CycleEditable,
      keyActionTab: KeyAction.CycleEditable,
      columns: [
        ...rowHeader,
        ...columns.map((column) => ({
          ...column,
          isReadOnly,
          cssClass: isReadOnly ? "" : "bg-editable",
        })),
      ].map((column) => ({
        ...column,
        dataType: dataType[column.dataType],
      })),
    });
  };

  const initGrid = (e: FlexGridType) => {
    setGrid(e);
    resetGrid(e);
    e.itemFormatter = (panel, r, c, cell) => {
      if (panel.cellType === CellType.ColumnHeader) {
        cell.style.textAlign = "left";
      }
    };
    e.itemsSourceChanged.addHandler(() => {
      e.beginUpdate();
      e.collectionView?.items.forEach((item) => {
        item.isSelected = false;
      });
      e.endUpdate();
    });
    e.cellEditEnding.addHandler((_, args) => {
      e.beginUpdate();
      e.collectionView.items[args.row].isSelected = true;
      e.endUpdate();
    });
  };

  const addRow = () => {
    grid?.collectionView.sourceCollection.splice(
      grid.selection.row + 1,
      0,
      {} as GridItem<T>
    );
    grid?.collectionView.refresh();
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

  const register = (name: string) => {
    return {
      name,
      initGrid,
      addRow,
      deleteRow,
      copyRow,
    };
  };

  const setItemsSource = (itemsSource: any[]) => {
    grid!.itemsSource = itemsSource;
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
