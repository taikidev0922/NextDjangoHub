import ResultsView from "@/components/ResultsView/ResultsView";
import { createContext, useContext, useEffect, useState } from "react";
import { render } from "react-dom";
import Swal, { SweetAlertResult } from "sweetalert2";

export type Dialog = {
  text: string;
  type: "confirm" | "warning" | "error";
};

interface DialogContextType {
  showDialog: (toast: Dialog) => Promise<SweetAlertResult<any>>;
  showResultsDialog: () => Promise<SweetAlertResult<any>>;
}

const DialogContext = createContext<DialogContextType>({
  showDialog: () => Promise.resolve({} as SweetAlertResult<any>),
  showResultsDialog: () => Promise.resolve({} as SweetAlertResult<any>),
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
  const showResultsDialog = (results: any) => {
    const container = document.createElement("div");

    render(<ResultsView itemsSource={results} />, container);

    return Swal.fire({
      title: "エラー",
      html: container,
      confirmButtonColor: "#808080",
      confirmButtonText: "閉じる",
    });
  };
  return (
    <DialogContext.Provider value={{ showDialog, showResultsDialog }}>
      {children}
    </DialogContext.Provider>
  );
};
