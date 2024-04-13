import { OperationType } from "@/components/OperationType";
import { createContext, useContext, useState } from "react";

export type Operation =
  | "regist"
  | "registAndUpdate"
  | "update"
  | "delete"
  | "view";

const editableOperations: Operation[] = ["registAndUpdate", "update"];
const registableOperations: Operation[] = ["regist", "registAndUpdate"];

export type OperationTypeContextType = {
  operations: string[];
  operationType: Operation;
  isReadOnly: boolean;
  isRegistable: boolean;
  handleChangeOperationType: (operationType: Operation) => void;
  setOperations: (operations: Operation[]) => void;
};

const OperationTypeContext = createContext<OperationTypeContextType>({
  operations: ["registAndUpdate", "delete", "view"],
  operationType: "registAndUpdate",
  isReadOnly: false,
  isRegistable: false,
  handleChangeOperationType: () => {},
  setOperations: () => {},
});

export const useOperationType = () => {
  return useContext(OperationTypeContext);
};

export const OperationTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [operationType, setOperationType] =
    useState<Operation>("registAndUpdate");
  const [operations, setOperations] = useState<Operation[]>([
    "registAndUpdate",
    "delete",
    "view",
  ]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isRegistable, setIsRegistable] = useState(
    registableOperations.includes(operationType)
  );

  const handleChangeOperationType = (operationType: Operation) => {
    setOperationType(operationType);
    setIsReadOnly(!editableOperations.includes(operationType));
    setIsRegistable(registableOperations.includes(operationType));
  };

  return (
    <OperationTypeContext.Provider
      value={{
        operationType,
        handleChangeOperationType,
        operations,
        setOperations,
        isReadOnly,
        isRegistable,
      }}
    >
      <OperationType
        operations={operations}
        setOperations={setOperations}
        setOperationType={handleChangeOperationType}
        operationType={operationType}
      />
      {children}
    </OperationTypeContext.Provider>
  );
};
