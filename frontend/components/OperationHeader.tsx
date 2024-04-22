import {
  OperationType,
  useOperationHeader,
} from "@/context/OperationHeaderContext";
import Button from "./Button";

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
  const { operationType, operationTypeList, setOperationType } =
    useOperationHeader();
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
    view: "bg-gray-300",
    update: "bg-blue-200",
  };
  const editableOperations = ["registAndUpdate", "update"];
  return (
    <>
      <div
        className={`flex gap-2 border border-gray-800 py-1 pr-3 ${operationColor[operationType]}`}
      >
        {operationTypeList.map((operation) => (
          <OperationRadio
            key={operation}
            operationType={operationType}
            setOperationType={setOperationType}
            value={operation}
            label={operationLabels[operation]}
          />
        ))}
        <div className="flex-grow"></div>
        <Button
          className="btn-success"
          disabled={!editableOperations.includes(operationType)}
          onClick={onUpdate}
        >
          F2 更新
        </Button>
        <Button className="btn-error" disabled={operationType !== "delete"}>
          F3 削除
        </Button>
      </div>
    </>
  );
};
