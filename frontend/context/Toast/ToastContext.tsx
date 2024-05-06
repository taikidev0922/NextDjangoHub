import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export type Toast = {
  text: string;
  type: "success" | "error";
};

interface ToastContextType {
  showToast: (toast: Toast) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = (_toast: Toast) => {
    if (_toast.type === "success") {
      toast.success(_toast.text);
    } else {
      toast.error(_toast.text);
    }
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toaster />
      {children}
    </ToastContext.Provider>
  );
};
