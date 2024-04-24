import { createContext, useContext, useState } from "react";

export type OperationType =
  | "regist"
  | "registAndUpdate"
  | "update"
  | "delete"
  | "view";

const editableOperations: OperationType[] = [
  "regist",
  "registAndUpdate",
  "update",
];
const registableOperations: OperationType[] = ["regist", "registAndUpdate"];

export type OperationHeaderContextType = {
  operationTypeList: OperationType[];
  operationType: OperationType;
  isReadOnly: boolean;
  isRegistable: boolean;
  isEditable: boolean;
  onChangeOperation: (operationHeader: OperationType) => void;
  setOperationTypeList: (operations: OperationType[]) => void;
};

const OperationHeaderContext = createContext<OperationHeaderContextType>({
  operationTypeList: ["registAndUpdate", "delete", "view"],
  operationType: "registAndUpdate",
  isReadOnly: false,
  isRegistable: false,
  isEditable: false,
  onChangeOperation: () => {},
  setOperationTypeList: () => {},
});

export const useOperationHeader = () => {
  return useContext(OperationHeaderContext);
};

export const OperationHeaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [operationType, setOperationType] =
    useState<OperationType>("registAndUpdate");
  const [operationTypeList, setOperationTypeList] = useState<OperationType[]>([
    "registAndUpdate",
    "delete",
    "view",
  ]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isRegistable, setIsRegistable] = useState(
    registableOperations.includes(operationType)
  );
  const [isEditable, setIsEditable] = useState(
    editableOperations.includes(operationType)
  );

  const onChangeOperation = (operationHeader: OperationType) => {
    setOperationType(operationHeader);
    setIsReadOnly(!editableOperations.includes(operationHeader));
    setIsRegistable(registableOperations.includes(operationHeader));
    setIsEditable(editableOperations.includes(operationHeader));
    console.log(registableOperations, operationHeader);
  };

  return (
    <OperationHeaderContext.Provider
      value={{
        operationType,
        onChangeOperation,
        operationTypeList,
        setOperationTypeList,
        isReadOnly,
        isRegistable,
        isEditable,
      }}
    >
      {children}
    </OperationHeaderContext.Provider>
  );
};
