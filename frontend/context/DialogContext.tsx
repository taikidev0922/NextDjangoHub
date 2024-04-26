import { createContext, useContext, useEffect, useState } from "react";
import Swal, { SweetAlertResult } from "sweetalert2";

export type Dialog = {
  text: string;
  type: "confirm" | "warning" | "error";
};

interface DialogContextType {
  showDialog: (toast: Dialog) => Promise<SweetAlertResult<any>>;
}

const DialogContext = createContext<DialogContextType>({
  showDialog: () => Promise.resolve({} as SweetAlertResult<any>),
});

export function useDialog() {
  return useContext(DialogContext);
}

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const showDialog = (_dialog: Dialog) => {
    return Swal.fire({
      title: "確認",
      text: _dialog.text,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "はい",
      cancelButtonText: "いいえ",
    });
  };
  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
    </DialogContext.Provider>
  );
};
