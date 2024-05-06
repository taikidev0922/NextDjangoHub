import { GridColumn, useGridForm } from "@/hooks/useGridForm";
import GridForm from "../GridForm";
import { useOperationHeader } from "@/context/OperationHeaderContext";
import { useEffect } from "react";

interface GridFormTestProps {
  columns: GridColumn[];
}

export default function GridFormTest({ columns }: GridFormTestProps) {
  const { onChangeOperation } = useOperationHeader();
  useEffect(() => {
    onChangeOperation("regist");
  }, [onChangeOperation]);
  const { register, setItemsSource, getSelectedItems, applyResults } =
    useGridForm<any>(columns);
  return <GridForm {...register("test")}>GridForm</GridForm>;
}
