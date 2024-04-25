import { getIcon } from "@/utils/getIcon";
import { FlexGrid } from "@grapecity/wijmo.react.grid";
import { ICellTemplateContext, HeadersVisibility } from "@grapecity/wijmo.grid";
type Props = {
  itemsSource: any[];
};
export default function ResultsView({ itemsSource }: Props) {
  const columns = [
    {
      binding: "type",
      header: " ",
      width: 40,
      cssClass: "wj-header flex items-center",
      cellTemplate: (context: ICellTemplateContext) =>
        getIcon(context.item.type),
    },
    {
      binding: "message",
      header: "メッセージ",
      width: "*",
    },
  ];
  return (
    <>
      <FlexGrid
        itemsSource={itemsSource}
        columns={columns}
        autoGenerateColumns={false}
        headersVisibility={HeadersVisibility.Column}
      />
    </>
  );
}
