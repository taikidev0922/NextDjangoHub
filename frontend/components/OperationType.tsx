import { Operation } from "@/context/OperationTypeContext";
import Card from "./Card/Card";

const OperationRadio = ({
  operationType,
  setOperationType,
  value,
  label,
}: {
  operationType: Operation;
  setOperationType: (operationType: Operation) => void;
  value: Operation;
  label: string;
}) => {
  return (
    <div className="flex items-center ml-3">
      <input
        type="radio"
        name="operation"
        id={value}
        className="text-blue-600"
        checked={operationType === value}
        onChange={() => setOperationType(value)}
      />
      <label htmlFor={value} className="ml-2">
        {label}
      </label>
    </div>
  );
};

export const OperationType = ({
  operationType,
  setOperationType,
  operations,
}: {
  operationType: Operation;
  setOperationType: (operationType: Operation) => void;
  operations: Operation[];
  setOperations: (operations: Operation[]) => void;
}) => {
  const operationLabels: Record<Operation, string> = {
    registAndUpdate: "登録・更新",
    regist: "登録",
    delete: "削除",
    view: "参照",
    update: "更新",
  };
  return (
    <>
      <Card title="操作">
        <div className="flex">
          {operations.map((operation) => (
            <OperationRadio
              key={operation}
              operationType={operationType}
              setOperationType={setOperationType}
              value={operation}
              label={operationLabels[operation]}
            />
          ))}
        </div>
      </Card>
    </>
  );
};
