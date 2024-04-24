import {
  OperationType,
  useOperationHeader,
} from "@/context/OperationHeaderContext";
import Button from "./Button";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePopup } from "@/context/PopupContext";

const OperationRadio = ({
  operationType,
  setOperationType,
  value,
  label,
}: {
  operationType: OperationType;
  setOperationType: (operationHeader: OperationType) => void;
  value: OperationType;
  label: string;
}) => {
  return (
    <div className="flex items-center ml-3">
      <input
        type="radio"
        name="operation"
        id={value}
        className="text-blue-600 cursor-pointer"
        checked={operationType === value}
        onChange={() => setOperationType(value)}
      />
      <label htmlFor={value} className="ml-2 cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export const OperationHeader = ({ onUpdate }: { onUpdate: () => void }) => {
  const { operationType, operationTypeList, onChangeOperation } =
    useOperationHeader();
  const { showPopup } = usePopup();
  useKeyboardShortcuts([
    {
      keys: "F3",
      action: () => {
        handleUpdate();
      },
    },
  ]);
  const operationLabels: Record<OperationType, string> = {
    registAndUpdate: "登録・更新",
    regist: "登録",
    delete: "削除",
    view: "参照",
    update: "更新",
  };
  const operationColor = {
    registAndUpdate: "bg-blue-200",
    regist: "bg-blue-200",
    delete: "bg-red-200",
    view: "",
    update: "bg-blue-200",
  };
  const editableOperations = ["registAndUpdate", "update"];
  const handleUpdate = () => {
    showPopup({
      text: "更新しますか？",
      onOk: () => {
        onUpdate();
      },
    });
  };
  return (
    <>
      <div
        className={`flex gap-2 border border-gray-800 py-1 pr-3 ${operationColor[operationType]}`}
      >
        {operationTypeList.map((operation) => (
          <OperationRadio
            key={operation}
            operationType={operationType}
            setOperationType={onChangeOperation}
            value={operation}
            label={operationLabels[operation]}
          />
        ))}
        <div className="flex-grow"></div>
        <Button
          className="btn-success"
          disabled={!editableOperations.includes(operationType)}
          onClick={handleUpdate}
        >
          F3 更新
        </Button>
        <Button className="btn-error" disabled={operationType !== "delete"}>
          F4 削除
        </Button>
      </div>
    </>
  );
};
