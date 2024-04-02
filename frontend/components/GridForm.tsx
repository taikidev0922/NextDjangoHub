"use client";
import { FlexGrid, FlexGridCellTemplate } from "@grapecity/wijmo.react.grid";
import {
  FlexGrid as WjFlexGridType,
  ICellTemplateContext,
} from "@grapecity/wijmo.grid";
import { DataType } from "@grapecity/wijmo";
import { useState } from "react";
import _cloneDeep from "lodash/cloneDeep";
import _assign from "lodash/assign";
import { AxiosResponse } from "axios";

export default function GridForm({
  itemsSource,
  columns,
  onSubmit,
  children,
}: {
  itemsSource: any;
  columns: any;
  onSubmit: (selectedItems: any[]) => Promise<AxiosResponse<any, any>>;
  children: React.ReactNode;
}) {
  const [grid, setGrid] = useState<WjFlexGridType>();
  const onInit = (grid: WjFlexGridType) => {
    setGrid(grid);
    grid.autoGenerateColumns = false;
    grid.itemsSource = Array.from({ length: 10 }, () => ({
      isSelected: false,
    }));

    grid.cellEditEnding.addHandler((s, e) => {
      grid.beginUpdate();
      grid.collectionView.items[e.row].isSelected = true;
      grid.endUpdate();
    });
    grid.itemsSourceChanged.addHandler((sender, args) => {
      sender.itemsSource.forEach((item) => {
        item.isSelected = false;
      });
    });
  };
  const extendedColumns = [
    {
      binding: "isSelected",
      header: " ",
      dataType: DataType.Boolean,
      cssClass: "wj-header",
      allowSorting: false,
      width: 40,
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
  ];

  const innerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    grid?.collectionView.items.forEach((item, index) => {
      item.cookie = index;
    });
    const result = await onSubmit(
      _cloneDeep(grid?.collectionView.items)
        ?.filter((item) => item.isSelected)
        .map((item) => {
          delete item.isSelected;
          return item;
        }) as any[]
    );
    grid?.beginUpdate();
    result.data.forEach((res) => {
      const target = grid?.collectionView.items.find(
        (item) => item.cookie === res.cookie
      );
      target.isSelected = false;
      _assign(target, res);
    });
    grid?.endUpdate();
  };

  return (
    <form onSubmit={innerSubmit}>
      <FlexGrid
        style={{ height: 500 }}
        itemsSource={itemsSource}
        initialized={onInit}
        columns={extendedColumns}
      >
        <FlexGridCellTemplate
          cellType="RowHeader"
          template={(context: ICellTemplateContext) => {
            return `${context.row.index + 1}`;
          }}
        />
      </FlexGrid>
      {children}
    </form>
  );
}
