import { createContext, useContext, useState } from "react";

export type OperationType =
  | "regist"
  | "registAndUpdate"
  | "update"
  | "delete"
  | "view";

const editableOperations: OperationType[] = ["registAndUpdate", "update"];
const registableOperations: OperationType[] = ["regist", "registAndUpdate"];

export type OperationHeaderContextType = {
  operationTypeList: OperationType[];
  operationType: OperationType;
  isReadOnly: boolean;
  isRegistable: boolean;
  handleChangeOperationHeader: (operationHeader: OperationType) => void;
  setOperationTypeList: (operations: OperationType[]) => void;
  setOperationType: (operationType: OperationType) => void;
};

const OperationHeaderContext = createContext<OperationHeaderContextType>({
  operationTypeList: ["registAndUpdate", "delete", "view"],
  operationType: "registAndUpdate",
  isReadOnly: false,
  isRegistable: false,
  handleChangeOperationHeader: () => {},
  setOperationTypeList: () => {},
  setOperationType: () => {},
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

  const handleChangeOperationHeader = (operationHeader: OperationType) => {
    setOperationType(operationHeader);
    setIsReadOnly(!editableOperations.includes(operationHeader));
    setIsRegistable(registableOperations.includes(operationHeader));
  };

  return (
    <OperationHeaderContext.Provider
      value={{
        operationType,
        handleChangeOperationHeader,
        operationTypeList,
        setOperationTypeList,
        isReadOnly,
        isRegistable,
        setOperationType,
      }}
    >
      {children}
    </OperationHeaderContext.Provider>
  );
};
