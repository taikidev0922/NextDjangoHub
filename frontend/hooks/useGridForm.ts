import { useEffect, useState } from "react";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
  ICellTemplateFunction,
  CellType,
  KeyAction,
} from "@grapecity/wijmo.grid";
import { DataType } from "@grapecity/wijmo";
import { CellMaker } from "@grapecity/wijmo.grid.cellmaker";
import { FlexGridFilter } from "@grapecity/wijmo.grid.filter";
import _assign from "lodash/assign";
import { useOperationHeader } from "@/context/OperationHeaderContext";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { FlexGridXlsxConverter } from "@grapecity/wijmo.grid.xlsx";
import { getIcon } from "@/utils/getIcon";
import { useDialog } from "@/context/DialogContext";
import { useFocus } from "./useFocus";
import { useToast } from "@/context/ToastContext";

export type GridColumn = {
  binding: string;
  header: string;
  dataType: "string" | "number" | "boolean";
  width?: number;
  cssClass?: string;
  allowSorting?: boolean;
  allowResizing?: boolean;
  allowDragging?: boolean;
  cellTemplate?: ICellTemplateFunction;
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
  const { showResultsDialog } = useDialog();
  const { focusedStyle, setFocusedIvent } = useFocus();
  const { showToast } = useToast();
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
    {
      keys: "Alt+g",
      action: () => {
        resetGrid();
      },
    },
  ]);

  useEffect(() => {
    resetGrid(grid);
  }, [operationType]);

  const resetGrid = (e?: FlexGridType) => {
    const resettingGrid = e || grid;
    if (!resettingGrid) return;
    const rowHeader: GridColumn[] = [
      {
        binding: "isSelected",
        header: " ",
        dataType: "boolean",
        width: 40,
        cssClass: "wj-header",
        allowSorting: false,
        allowResizing: false,
        allowDragging: false,
      },
      {
        binding: "operation",
        header: " ",
        dataType: "string",
        allowSorting: false,
        allowResizing: false,
        allowDragging: false,
        width: 40,
        cellTemplate(context: ICellTemplateContext, cell: HTMLElement) {
          cell.style.textAlign = "center";
          if (operationType === "delete" && context.item.isSelected) {
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
      {
        binding: "results",
        header: " ",
        dataType: "string",
        cssClass: "wj-header flex items-center",
        allowSorting: false,
        allowResizing: false,
        allowDragging: false,
        width: 40,
        cellTemplate(context: ICellTemplateContext, cell: HTMLElement) {
          return CellMaker.makeButton({
            text: getIcon(
              context.item.results?.some((result) => result.type === "error")
                ? "error"
                : context.item.results?.some(
                      (result) => result.type === "warning"
                    )
                  ? "warning"
                  : undefined
            ),
            click: (e: MouseEvent, ctx: ICellTemplateContext) => {
              showResultsDialog(ctx.item.results);
            },
            attributes: {
              class: "text-orange-500",
            },
          })(context, cell);
        },
      },
    ] as GridColumn[];
    const itemsSource = Array.from({ length: isRegistable ? 10 : 0 }, () => ({
      isSelected: false,
    }));
    resettingGrid.initialize({
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
    // 保存したレイアウトの反映
    const columnLayout = localStorage.getItem("myLayout");
    if (columnLayout) {
      const layoutColumns = JSON.parse(columnLayout)?.columns;
      const columnOrder = layoutColumns.map((column: any) => column.binding);
      resettingGrid.columns.forEach((column) => {
        const layoutColumn = layoutColumns.find(
          (lc: any) => lc.binding === column.binding
        );
        if (layoutColumn) {
          column.width = layoutColumn.width;
          const index = columnOrder.indexOf(column.binding);
          (column as any).displayIndex =
            index >= 0 ? index : resettingGrid.columns.length;
        }
      });
      resettingGrid.columns.sort((a, b) => a.displayIndex - b.displayIndex);
    }
  };

  const initGrid = (flexGrid: FlexGridType) => {
    setGrid(flexGrid);
    setFilter(
      new FlexGridFilter(flexGrid, {
        filterColumns: columns.map((column) => column.binding),
      })
    );
    resetGrid(flexGrid);
    setFocusedIvent(flexGrid);
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
        flexGrid.select(args.row, 3);
      }
    });
    flexGrid.hostElement.addEventListener("keydown", (e) => {
      if (
        e.shiftKey &&
        (e.key === "Enter" || e.key === "Tab") &&
        flexGrid.selection.col === 1
      ) {
        flexGrid.select(flexGrid.selection.row - 1, columns.length + 2);
      }
      if (e.key === "ArrowLeft" && flexGrid.selection.col === 2) {
        flexGrid.select(flexGrid.selection.row, 3);
      }
    });
    flexGrid.hostElement.addEventListener("click", (e) => {
      const hit = flexGrid.hitTest(e);
      if (hit.col === 0 || hit.col === 1 || hit.col === 2) {
        flexGrid.select(hit.row, 3);
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

  const saveLayout = () => {
    if (!grid) return;
    localStorage.setItem("myLayout", grid.columnLayout);
    showToast({
      text: "レイアウトを保存しました",
      type: "success",
    });
  };

  const loadLayout = () => {
    const layout = localStorage.getItem("myLayout");
    if (!layout || !grid) return;
    grid.columnLayout = layout;
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
      saveLayout,
      loadLayout,
      resetGrid,
      focusedStyle,
    };
  };

  const setItemsSource = (itemsSource: any[]) => {
    if (!grid) return;
    grid.itemsSource = itemsSource;
  };

  const getSelectedItems = () => {
    grid?.collectionView.items.forEach((item, index) => {
      item.cookie = index;
      item.operation = operationType === "delete" ? "delete" : "save";
    });
    const selectedItems = grid?.collectionView.items.filter(
      (item) => item.isSelected
    );
    return selectedItems ?? [];
  };

  const applyResults = (response: any[]) => {
    console.log("applyResults", response);
    if (response.length === 0) return;
    grid?.beginUpdate();
    grid?.collectionView.items.forEach((item) => {
      item.results = undefined;
    });
    if (!response.some((res) => res.results && res.results.length > 0)) {
      response?.forEach((res) => {
        const target = grid?.collectionView.items.find(
          (item) => item.cookie === res.cookie
        );
        if (!target) return;
        if (res.deleted_at) {
          const index = grid?.collectionView.sourceCollection.findIndex(
            (item) => item.cookie === res.cookie
          );
          grid?.collectionView.sourceCollection.splice(index, 1);
        } else {
          target.isSelected = false;
          _assign(target, res);
        }
      });
    } else {
      response?.forEach((res) => {
        const target = grid?.collectionView.items.find(
          (item) => item.cookie === res.cookie
        );
        if (!target) return;
        if (res.results && res.results.length > 0) {
          target.results = res.results;
          return;
        }
      });
    }
    grid?.endUpdate();
    grid?.collectionView.refresh();
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
