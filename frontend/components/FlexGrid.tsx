"use client";
import { FlexGrid as WjFlexGrid } from "@grapecity/wijmo.react.grid";

export default function FlexGrid({ itemsSource }: { itemsSource: any }) {
  return (
    <div>
      <WjFlexGrid itemsSource={itemsSource} />
    </div>
  );
}
