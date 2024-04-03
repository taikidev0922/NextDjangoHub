import { useState } from "react";
import {
  FlexGrid as FlexGridType,
  ICellTemplateContext,
} from "@grapecity/wijmo.grid";
import { Column } from "@grapecity/wijmo.grid";
import { DataType } from "@grapecity/wijmo";
import _assign from "lodash/assign";
import { useMessage } from "@/context/MessageContext";

export type GridColumn = Partial<Column>;

export function useGridForm(columns: GridColumn[]) {
  const [grid, setGrid] = useState<FlexGridType>();
  const { addMessage } = useMessage();

  const initGrid = (e: FlexGridType) => {
    setGrid(e);
    e.autoGenerateColumns = false;
    e.itemsSource = Array.from({ length: 10 }, () => ({
      isSelected: false,
    }));
    e.itemsSourceChanged.addHandler(() => {
      e.beginUpdate();
      e.collectionView.items.forEach((item) => {
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

  const register = (name: string) => {
    return {
      name,
      initGrid,
      columns: [
        {
          binding: "isSelected",
          header: " ",
          dataType: DataType.Boolean,
          width: 40,
          cssClass: "wj-header",
          allowSorting: false,
        },
        {
          binding: "operation",
          header: " ",
          dataType: DataType.String,
          cssClass: "wj-header",
          allowSorting: false,
          width: 40,
          cellTemplate(context: ICellTemplateContext, cell: HTMLElement) {
            cell.style.textAlign = "center";
            if (!context.item.isSelected) {
              cell.style.backgroundColor = "";
              return;
            }
            if (context.item.id) {
              cell.style.backgroundColor = "#32CD32";
              return `<span class="text-white text-xl font-mono">U</span>`;
            }
            if (!context.item.id) {
              cell.style.backgroundColor = "#4169E1";
              return `<span class="text-white text-xl font-mono">I</span>`;
            }
          },
        },
        ...columns,
      ] as GridColumn[],
    };
  };

  const setItemsSource = (itemsSource: any[]) => {
    grid!.itemsSource = itemsSource;
  };

  const getSelectedItems = ({
    raiseException,
  }: {
    raiseException?: boolean;
  }) => {
    grid?.collectionView.items.forEach((item, index) => {
      item.cookie = index;
    });
    const selectedItems = grid?.collectionView.items.filter(
      (item) => item.isSelected
    );
    if (raiseException && selectedItems?.length === 0) {
      addMessage({
        text: "明細を選択してください",
        type: "error",
      });
      throw new Error("明細を選択してください");
    }
    return selectedItems;
  };

  const applyResults = (results: any[]) => {
    grid?.beginUpdate();
    results?.forEach((res) => {
      const target = grid?.collectionView.items.find(
        (item) => item.cookie === res.cookie
      );
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
  };
}
