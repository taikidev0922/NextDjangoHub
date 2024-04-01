"use client";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import { FlexGrid as WjFlexGridType } from "@grapecity/wijmo.grid";
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
  };
  const extendedColumns = [
    {
      binding: "isSelected",
      header: " ",
      dataType: DataType.Boolean,
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
      />
      {children}
    </form>
  );
}
